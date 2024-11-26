import { instance } from ".";

const BASE_URL = "provinces";
export const getProvinces = ({ page = 1, limit = 63 }) => {
  return instance.get(`${BASE_URL}/`, {
    params: {
      page,
      limit,
    },
  });
};
