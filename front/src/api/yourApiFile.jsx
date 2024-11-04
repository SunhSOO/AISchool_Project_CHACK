// src/api/yourApiFile.js
const apiUrl = 'http://192.168.21.16:8000'; // FastAPI 서버의 IP 주소

export const fetchData = async () => {
  const response = await fetch(`${apiUrl}/your-endpoint`);
  const data = await response.json();
  return data;
};
