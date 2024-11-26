import { instance } from '.';
import { TYPE_SYSADMIN, TYPE_ADMINISTRATOR, TYPE_MANAGER } from '../constants/roleDecentralization.js';

const BASE_URL = 'collaborators';

export const createCollaborator = (collaborator) => {
  return instance.post(`${BASE_URL}/`, collaborator);
};

export const getCollaboratorsBySysAdmin = ({ page = 1, limit = 20, filters = {} }) => {
  return instance.get(`${BASE_URL}/`, {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const getCollaboratorsByRoles = ({ page = 1, limit = 20, filters = {} }, roleCurrent, roleCode) => {
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  const { collaboratorCode } = currentUser;

  switch (roleCurrent) {
    case TYPE_SYSADMIN.role:
      if (!roleCode) {
        roleCode = 99;
      }
      return instance.get(`${BASE_URL}/?role=${roleCode}`, {
        params: {
          page,
          limit,
          ...filters,
        },
      });

    case TYPE_ADMINISTRATOR.role:
      //Trạng thái ban đầu khi chưa filter theo roleCode
      if (!roleCode) {
        roleCode = 12;
      }
      return instance.get(`${BASE_URL}/?role=${roleCode}&referrerCode=${collaboratorCode}`, {
        params: {
          page,
          limit,
          ...filters,
        },
      });

    case TYPE_MANAGER.role:
      //Trạng thái ban đầu khi chưa filter theo roleCode
      if (!roleCode) {
        roleCode = 11;
      }
      return instance.get(`${BASE_URL}/?role=${roleCode}&referrerCode=${collaboratorCode}`, {
        params: {
          page,
          limit,
          ...filters,
        },
      });

    default:
      break;
  }
};

export const updateCollaborator = (id, collaborator) => {
  return instance.put(`${BASE_URL}/${id}`, collaborator);
};

export const updateRoleCollaboratorBySysAdmin = (id, role) => {
  return instance.put(`${BASE_URL}/u-r/${id}`, role);
};

export const deleteCollaborator = (id) => {
  return instance.delete(`${BASE_URL}/${id}`);
};

export const getCollaboratorById = (identityNumber) => {
  return instance.get(`${BASE_URL}/${identityNumber}`);
};

export const getCollaboratorTotal = () => {
  return instance.get(`${BASE_URL}/qty/`);
};

export const getCollaboratorByCode = (code) => {
  return instance.get(`${BASE_URL}/i/`, {
    params: {
      code,
    },
  });
};

export const loginCollaborator = ({ collaboratorCode, password }) => {
  const body = { collaboratorCode, password };
  return instance.post(`${BASE_URL}/login`, body);
};
