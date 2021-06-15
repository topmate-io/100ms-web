import axios from 'axios';
export default async function getToken(
  tokenEndpoint,
  env,
  userId,
  role,
  roomId
) {
  const response = await fetch(`${tokenEndpoint}api/token`, {
    method: "POST",
    //TODO remove env
    body: JSON.stringify({
      env,
      role,
      room_id: roomId,
      user_id: userId,
    }),
  });

  const { token } = await response.json();

  return token;
}



export async function getUserToken(name) {

  const extractUrlCode = () => {
    const path = window.location.pathname;
    let roomCode = null;
    if (path.startsWith("/preview/") || path.startsWith("/meeting/")) {
      roomCode = "";
      for (let i = 9; i < path.length; i++) {
        if (path[i] === "/") break;
        roomCode += path[i]
      }
      if (roomCode.trim() === "") roomCode = null;
    }
    return roomCode;
  }

  const code = extractUrlCode();
  axios.create({ baseURL: process.env.REACT_APP_BACKEND_API, timeout: 2000 });

  const url = backendEndPoint + "get-token";

  const headers = {
    "Content-Type": "application/json",
    "subdomain": process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
  };

  let formData = new FormData();
  formData.append('code', code);
  formData.append('user_id', name);

  const res = await axios.post(url, formData, { headers: headers })
  return res.data.token;
}

function getBackendEndpoint() {
  switch (window.location.hostname) {
    case "qa2.100ms.live":
      return process.env.REACT_APP_QA_BACKEND_API;
    case "prod2.100ms.live":
      return process.env.REACT_APP_PROD_BACKEND_API;
    default:
      return process.env.REACT_APP_BACKEND_API
  }
}

export const backendEndPoint = getBackendEndpoint();
