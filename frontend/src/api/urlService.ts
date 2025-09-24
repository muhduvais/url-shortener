import axios from "../api/apiClient";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

export interface UrlResponse {
  statusCode: number;
  message: string;
  data: string;
}

interface UrlData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdDate: Date;
}

export interface FetchUrlResponse {
  statusCode: number;
  message: string;
  data: {
    urls: UrlData[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export const UrlService = {
  createUrl: async (url: string): Promise<UrlResponse> => {
    const response = await axios.post(`${VITE_SERVER_URL}/urls`, { url });
    return response.data;
  },

  fetchUrls: async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string
  ): Promise<FetchUrlResponse> => {
    const response = await axios.get(`${VITE_SERVER_URL}/urls/user/${userId}`, {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  },

  deleteUrl: async (shortCode: string): Promise<UrlResponse> => {
    const response = await axios.delete(`${VITE_SERVER_URL}/urls/${shortCode}`);
    return response.data;
  }
};
