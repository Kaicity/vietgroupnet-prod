import { instance } from ".";

const BASE_URL = "banks";
export const getAllBanks = ({ page = 1, limit = 20 }) => {
  return instance.get(`${BASE_URL}/`, {
    params: {
      page,
      limit,
    },
  });
};
