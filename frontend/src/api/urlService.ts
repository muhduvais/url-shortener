import axios from '../api/apiClient';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

export interface UrlResponse {
  statusCode: number;
  message: string;
  data: string;
}

interface UrlItem {
  originalUrl: string;
  shortUrl: string;
  createdDate: string;
}

export interface FetchUrlResponse {
  statusCode: number;
  message: string;
  data: UrlItem[];
}

export const UrlService = {
  createUrl: async (url: string): Promise<UrlResponse> => {
    const response = await axios.post(`${VITE_SERVER_URL}/urls`, { url });
    return response.data;
  },

  fetchUrls: async (userId: string): Promise<FetchUrlResponse> => {
    const response = await axios.get(`${VITE_SERVER_URL}/urls/${userId}`);
    return response.data;
  },
};
