import { getRoles } from '../api/roles';

export let RoleOptions = [];

const roleLabelMapping = {
  Administrator: 'Giám đốc chi nhánh',
  Collaborator: 'Cộng tác Viên',
  Manager: 'Văn phòng đại diện',
};

export const getallRoles = async () => {
  try {
    const response = await getRoles();

    RoleOptions = response.data.roles.map((role) => ({
      value: role.roleName,
      label: roleLabelMapping[role.roleName] || role.roleName,
      roleCode: role.roleCode,
      id: role.id,
    }));

    return RoleOptions;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};
