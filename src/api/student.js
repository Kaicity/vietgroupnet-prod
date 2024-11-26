import { instance } from '.';
import { TYPE_SYSADMIN } from '../constants/roleDecentralization';

const BASE_URL = 'students';

export const getStudents = ({ page = 1, limit = 20, filters = {} }) => {
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  const roleCurrent = sessionStorage.getItem('role');

  const { collaboratorCode } = currentUser;

  if (TYPE_SYSADMIN.role === roleCurrent) {
    return instance.get(`${BASE_URL}/`, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
  } else {
    if (collaboratorCode) {
      return instance.get(`${BASE_URL}/?collaboratorCode=${collaboratorCode}`, {
        params: {
          page,
          limit,
          ...filters,
        },
      });
    }
  }
};


export const getStudentsWhenOrder = ({ page = 1, limit = 20 }) => {
  return instance.get(`${BASE_URL}/`, {
    params: {
      page,
      limit,
    },
  });
};

export const getStudentByCode = (code) => {
  return instance.get(`${BASE_URL}/i/`, {
    params: {
      code,
    },
  });
};

export const getStudentTotal = () => {
  return instance.get(`${BASE_URL}/qty`);
};

export const deleteStudent = (studentCode) => {
  return instance.delete(`${BASE_URL}/${studentCode}`);
};

export const createStudent = (student) => {
  return instance.post(`${BASE_URL}/`, student);
};

export const updateStudent = (id, student) => {
  return instance.put(`${BASE_URL}/${id}`, student);
};
