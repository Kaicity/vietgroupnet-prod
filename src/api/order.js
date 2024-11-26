import { instance } from '.';
const BASE_URL = 'orders';
export const getOrders = ({ page = 1, limit = 20, filters = {} }) => {
  return instance.get(`${BASE_URL}/`, {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const deleteOrder = (orderCode) => {
  return instance.delete(`${BASE_URL}/${orderCode}`);
};

export const createOrder = (orderCode) => {
  return instance.post(`${BASE_URL}/`, orderCode);
};

export const getOrderByCode = (code) => {
  return instance.get(`${BASE_URL}/i/`, {
    params: {
      code,
    },
  });
};

export const getOrderTotal = () => {
  return instance.get(`${BASE_URL}/qty`);
};

export const updateOrder = (id, order) => {
  return instance.put(`${BASE_URL}/${id}`, order);
};

export const createStudentOrder = (orderCode, studentCode) => {
  return instance.post(`${BASE_URL}/student`, {
    orderCode,
    studentCode,
  });
};

export const deleteStudentOrder = (orderCode, studentCode) => {
  console.log(orderCode, studentCode);
  return instance.delete(`${BASE_URL}/student`, {
    data: {
      orderCode,
      studentCode,
    },
  });
};
