import { instance } from '.';

const BASE_URL = 'pay-history';

export const getpayHistoryIsUser = ({
  page = 1,
  limit = 20,
  collaboratorCode,
}) => {
  return instance.get(`${BASE_URL}/user/`, {
    params: {
      page,
      limit,
      collaboratorCode,
    },
  });
};

export const getpayHistoryIsAdmin = ({
  page = 1,
  limit = 20,
  filters = {},
}) => {
  return instance.get(`${BASE_URL}/`, {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const getPayHistoryByCode = (payHistoryCode) => {
  return instance.get(`${BASE_URL}/${payHistoryCode}`);
};

export const deletepayHistory = (payHistoryCode) => {
  return instance.delete(`${BASE_URL}/${payHistoryCode}`);
};

export const createpayHistory = (payHistory) => {
  return instance.post(`${BASE_URL}/`, payHistory);
};

export const updatepayHistory = (id, payHistory) => {
  return instance.put(`${BASE_URL}/${id}`, payHistory);
};
