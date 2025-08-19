import customAxios from './apiClient';

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export const loginApi = async (data: LoginDto) => {
  const res = await customAxios.post('/auth/login', data);
  return res.data;
};

export const registerApi = async (data: RegisterDto) => {
  const res = await customAxios.post('/auth/register', data);
  return res.data;
};