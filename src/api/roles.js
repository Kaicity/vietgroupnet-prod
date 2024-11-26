import { instance } from '.';

const BASE_URL = 'roles';
export const getRoles = () => {
  return instance.get(`${BASE_URL}/`);
};
