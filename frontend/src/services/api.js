import axios from "axios";

const API_URL = "https://credit-sea-backend-om6f.onrender.com/api";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("xmlFile", file); 

  return axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getReports = async () => {
  return axios.get(`${API_URL}/reports`);
};

