// config/collaboratorConfig.js
export const roleConfig = {
  SYSADMIN: {
    roleCode: 99,
    label: 'SysAdmin',
    color: 'gray',
  },
  ADMINISTRATOR: {
    roleCode: 10,
    label: 'Giám đốc chi nhánh',
    color: 'pink',
  },
  MANAGER: {
    roleCode: 12,
    label: 'Văn phòng đại diện',
    color: 'orange',
  },
  COLLABORATOR: {
    roleCode: 11,
    label: 'Cộng tác viên',
    color: 'geekblue',
  },
};

export const genderConfig = {
  MALE: { label: 'Nam' },
  FEMALE: { label: 'Nữ' },
  OTHER: { label: 'Khác' },
};

export const statusConfig = {
  ACTIVE: { color: '#52c41a', label: 'Đang hoạt động' },
  UNACTIVE: { color: 'gray', label: 'Ngưng hoạt động' },
  BANNED: { color: 'red', label: 'Cấm hoạt động' },
};
