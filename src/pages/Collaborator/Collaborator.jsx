import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import {
  AddCircleOutlineOutlined,
  ArticleOutlined,
  Circle,
  DeleteOutline,
  EditOutlined,
  FileDownloadOutlined,
  MoreVert,
  RestoreOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { Divider, Dropdown, Input, message, Modal, Space, Tag, Radio, Avatar } from 'antd';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';

import theme from '../../utils/theme.js';
import DataTable from '../../components/DataTable.jsx';
import Header from '../../components/Header.jsx';
import { deleteCollaborator, getCollaboratorsByRoles, updateRoleCollaboratorBySysAdmin } from '../../api/collaborator.js';
import Message from '../../components/Message.jsx';
import { genderConfig, roleConfig, statusConfig } from '../../constants/enums/collaborator-enum.js';
import { AppContext } from '../../context/AppProvider.jsx';
import { blinkBackgroundAnimation } from '../../animation/shake.js';
import typography from '../../utils/typography.js';
import { formatDate } from '../../helper';
import { format } from 'date-fns';
import BoxCard from '../../components/Card.jsx';
import { TYPE_ADMINISTRATOR, TYPE_MANAGER, TYPE_SYSADMIN } from '../../constants/roleDecentralization.js';
import SelectionOption from '../../components/SelectionOption.jsx';

const { Search } = Input;

const Collaborator = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [content, setContent] = useState('');

  const [searchText, setSearchText] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCollaborators, setTotalCollaborators] = useState(0);

  const [levelFilter, setLevelFilter] = useState(null);
  const [genderFilter, setGenderFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isVisibleDelete, setIsVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
  const { setCollaborator } = useContext(AppContext);
  const { collapsed } = useContext(AppContext);

  useEffect(() => {
    getRoles();
    getDataCollaborators();
  }, [page, limit, searchText, levelFilter, genderFilter, statusFilter]);

  const getRoles = () => {
    const userRole = sessionStorage.getItem('role');
    let ROLES_ACCESS_API = [];

    //Set role được filter với mỗi vai trò
    switch (userRole) {
      case TYPE_SYSADMIN.role:
        ROLES_ACCESS_API.push(
          { roleCode: 99, label: 'SysAdmin' },
          { roleCode: 10, label: 'Giám đốc chi nhánh' },
          { roleCode: 12, label: 'Văn Phòng Đại Diện' },
          { roleCode: 11, label: 'Cộng Tác Viên' },
        );
        break;
      case TYPE_ADMINISTRATOR.role:
        ROLES_ACCESS_API.push({ roleCode: 12, label: 'Văn Phòng Đại Diện' }, { roleCode: 11, label: 'Cộng Tác Viên' });
        break;
      case TYPE_MANAGER.role:
        ROLES_ACCESS_API.push({ label: 'Cộng Tác Viên' });
        break;

      default:
        ROLES_ACCESS_API = [];
        break;
    }
    setRoles(ROLES_ACCESS_API);
  };

  const getDataCollaborators = async (currentPage, currentLimit) => {
    setLoading(true);

    const filters = {
      // ...(levelFilter && { role: levelFilter }),
      ...(genderFilter && { gender: genderFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(searchText && { search: searchText }),
    };

    let response;

    const userRole = sessionStorage.getItem('role');

    if (searchText) {
      response = await getCollaboratorsByRoles(
        {
          page: currentPage,
          limit: currentLimit,
          filters,
        },
        userRole,
        levelFilter,
      );
    } else {
      response = await getCollaboratorsByRoles(
        {
          page: currentPage,
          limit: currentLimit,
          filters,
        },
        userRole,
        levelFilter,
      );
    }

    if (response.data && Array.isArray(response.data.collaborators)) {
      if (response.status === 'success') {
        setCollaborators(response.data.collaborators);
        setTotalCollaborators(response.data.pagination.total);
        setLoading(false);
      }
    } else {
      setCollaborators([]);
      setTotalCollaborators(0);
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn là xóa cán bộ nhân viên ?',
      content: (
        <div style={{ maxHeight: '300px', minHeight: '80px', overflowY: 'auto' }}>
          <Typography fontSize={typography.fontSize.sizeM}>
            Số lượng: <strong>{selectedRowKeys.length}</strong>
          </Typography>

          <div>
            {selectedRows.map((collaborator, index) => (
              <div key={collaborator.id || index}>
                <br />
                <Typography fontSize={typography.fontSize.sizeM}>
                  Tên cộng tác viên: <strong>{collaborator.name}</strong> <br />
                </Typography>
                <Typography fontSize={typography.fontSize.sizeM}>
                  Có mã: <strong>{collaborator.collaboratorCode}</strong>
                </Typography>
              </div>
            ))}
          </div>
        </div>
      ),
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        handleDeleteMultiple();
      },
      onCancel() {},
    });
  };

  const handleDeleteMultiple = async () => {
    try {
      const promises = selectedRows.map((collaborator) => {
        return deleteCollaborator(collaborator.collaboratorCode);
      });

      // Chờ khi tất cả api trên được hoàn tất
      const response = await Promise.all(promises);

      const allSuccess = response.every((res) => res.status === 'success');

      if (allSuccess) {
        setContent('Đã xóa thành công!');
        setSeverity('success');
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setIsVisibleDelete(false);
      } else {
        setContent('Xóa thất bại!');
        setSeverity('error');
      }
      setIsShowMessage(true);
      getDataCollaborators();
    } catch (error) {
      setIsShowMessage(true);
      setContent(error);
      setSeverity('error');
    }
  };

  const handlePageChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
    getDataCollaborators(newPage, newLimit);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // setPage(1);
  };

  const handleLevelChange = (value) => {
    setLevelFilter(value);
  };

  const handleGenderChange = (value) => {
    setGenderFilter(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleResetFilters = () => {
    setLevelFilter(null);
    setGenderFilter(null);
    setStatusFilter(null);
    setSearchText('');
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Danh Sách Cán Bộ Nhân Viên');

    const columns = [
      { header: 'Mã CTV', key: 'collaboratorCode', width: 15 },
      { header: 'Họ và Tên', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Số Điện Thoại', key: 'phone', width: 15 },
      { header: 'Giới Tính', key: 'gender', width: 10 },
      { header: 'Trạng Thái', key: 'status', width: 15 },
      { header: 'Cấp Bậc', key: 'role', width: 15 },
      { header: 'Ngày bắt đầu', key: 'createDate', width: 15 },
    ];

    sheet.columns = columns;

    // Định dạng cho header
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C4F09B' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Đặt chiều cao của hàng header lớn hơn
    sheet.getRow(1).height = 50;

    if (Array.isArray(collaborators) && collaborators.length) {
      const transformedData = collaborators.map((collaborator) => ({
        collaboratorCode: collaborator.collaboratorCode,
        name: collaborator.name,
        email: collaborator.email || 'N/A',
        phone: collaborator.phone || 'N/A',
        gender: genderConfig[collaborator.gender?.toUpperCase()]?.label || 'N/A',
        status: statusConfig[collaborator.status?.toUpperCase()]?.label || 'N/A',
        role: roleConfig[collaborator.role?.roleName?.toUpperCase()]?.label || 'N/A',
        createDate: format(new Date(collaborator.createDate), 'dd-MM-yyyy') || 'N/A',
      }));

      // Thêm dữ liệu vào sheet
      transformedData.forEach((data) => {
        const row = sheet.addRow(data);
        row.height = 40; // Đặt chiều cao của các hàng dữ liệu lớn hơn
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      });

      // Tải xuống file Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Danh_Sach_Can_Bo_Nhan_Vien.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    } else {
      message.error('Không có dữ liệu để xuất.');
    }
  };

  const handleExcelConfirm = () => {
    Modal.confirm({
      title: 'Bạn muốn xuất danh sách cán bộ nhân viên',
      okText: 'Đồng ý',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk() {
        handleExportToExcel();
      },
      onCancel() {},
    });
  };

  const handleMenuClick = async (e, collaboratorCode) => {
    switch (e.key) {
      case 'ACTION-EXPORT':
        message.info(`Xuất thông tin cán bộ nhân viên có mã: ${collaboratorCode}`);
        // Handle exporting logic here
        break;
      case 'ACTION-EDIT':
        message.info(`Cập nhật cán bộ nhân viên có mã:  ${collaboratorCode}`);
        if (collaboratorCode) {
          navigate(`/edit-collaborator/${collaboratorCode}`);
        }
        break;
      case 'ACTION-LEVELUP':
        message.info(`Cập nhật quyền cán bộ nhân viên có mã: ${collaboratorCode}`);
        handleLevelUp(collaboratorCode);
        break;
      case 'ACTION-VIEW':
        message.info(`Xem thông tin cán bộ nhân viên có mã: ${collaboratorCode}`);
        // Add your logic to handle the view action here
        if (collaboratorCode) {
          navigate(`/collaborator-information/${collaboratorCode}`);
        }
        break;
      default:
        message.info('Unknown action');
    }
  };

  const menuProps = (collaboratorCode) => ({
    items,
    onClick: (e) => handleMenuClick(e, collaboratorCode),
  });

  const handleAddCollaborator = () => {
    setCollaborator(null);
    navigate('/add-collaborator');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRowData) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRows(selectedRowData);

      if (selectedRowData.length !== 0) {
        setIsVisibleDelete(true);
      } else {
        setIsVisibleDelete(false);
      }
    },
  };

  const items = [
    {
      label: 'Xuất Thông tin',
      key: 'ACTION-EXPORT',
      icon: <FileDownloadOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Cập nhật',
      key: 'ACTION-EDIT',
      icon: <EditOutlined />,
    },
  ];

  //Sysadmin có quyền cập nhật role user
  if (sessionStorage.getItem('role') === TYPE_SYSADMIN.role) {
    items.push({
      label: 'Cấp quyền',
      key: 'ACTION-LEVELUP',
      icon: <ArticleOutlined />,
      danger: true,
    });
  }

  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "index",
    //   key: "index",
    //   width: 70,
    //   render: (text, record, index) => <span key={index}>{index + 1}</span>,
    // },
    {
      title: 'Mã số'.toUpperCase(),
      dataIndex: 'collaboratorCode',
      key: 'collaboratorCode',
      width: collapsed ? 150 : 130,
      sorter: (a, b) => a.collaboratorCode.localeCompare(b.collaboratorCode),
      render: (text) => <span style={{ fontWeight: 500, color: theme.gray[400] }}>{text}</span>,
    },
    {
      title: 'Cán bộ nhân viên'.toUpperCase(),
      key: 'collaboratorInfo',
      width: collapsed ? 340 : 320,
      render: (record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Avatar size={40} src={record.imgUrl} alt="">
            {!record.imgUrl && record.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontWeight: 500 }}>{record.name}</span>
            <span style={{ color: theme.gray[500] }}>{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Số Điện Thoại'.toUpperCase(),
      dataIndex: 'phone',
      key: 'phone',
      width: collapsed ? 180 : 150,
      render: (phone) => <i>{phone ? phone : 'Không có'}</i>,
    },
    {
      title: 'Người quản lý'.toUpperCase(),
      dataIndex: 'referrer',
      key: 'referrer',
      width: collapsed ? 260 : 220,
      sorter: (a, b) => a.referrer.collaboratorCode.localeCompare(b.referrer.collaboratorCode),
      render: (referrer) => {
        const referrerName = referrer ? referrer.name : 'Không có';
        return <span style={{ color: theme.gray[500], fontWeight: 500 }}>{referrerName}</span>;
      },
    },
    {
      title: 'Trạng Thái'.toUpperCase(),
      dataIndex: 'status',
      key: 'status',
      width: collapsed ? 210 : 170,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        const config = statusConfig[status.toUpperCase()];

        return (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Circle sx={{ fontSize: '10px', color: config.color }} />
            <span style={{ color: theme.gray[400], fontWeight: 500 }}>{config.label}</span>
          </div>
        );
      },
    },
    {
      title: 'Cấp Bậc'.toUpperCase(),
      dataIndex: 'role',
      key: 'role',
      width: collapsed ? 230 : 200,
      sorter: (a, b) => a.role.roleCode.localeCompare(b.role.roleCode),
      render: (role) => {
        const roleName = role?.roleName.toUpperCase();
        const roleCode = role?.roleCode;

        const config = roleConfig[roleName];

        if (config) {
          return (
            <Tag key={roleCode} color={config.color}>
              {config.label.toUpperCase()}
            </Tag>
          );
        }

        return <Tag>{roleName?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ngày bắt đầu'.toUpperCase(),
      dataIndex: 'createDate',
      key: 'createDate',
      width: collapsed ? 180 : 160,
      sorter: (a, b) => a.createDate.localeCompare(b.createDate),
      render: (date) => <span>{date ? formatDate(date) : 'Chưa xác định'}</span>,
    },
    {
      title: 'Hành động'.toUpperCase(),
      key: 'action',
      render: (_, action) => (
        <Space size="middle">
          <IconButton onClick={() => handleMenuClick({ key: 'ACTION-VIEW' }, action.collaboratorCode)}>
            <VisibilityOutlined />
          </IconButton>
          <Dropdown menu={menuProps(action.collaboratorCode)}>
            <a onClick={(e) => e.preventDefault()}>
              <MoreVert sx={{ color: theme.gray[500] }} />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleLevelUp = (collaboratorCode) => {
    let selectedRole = null;

    const setLevelValueChange = (e) => {
      selectedRole = e.target.value;
    };

    Modal.confirm({
      title: 'Bạn muốn cập nhật chức vụ ?',
      content: (
        <>
          <Radio.Group onChange={setLevelValueChange}>
            <Space direction="vertical">
              {roles.map((role) => (
                <Radio key={role.roleCode} value={role.roleCode}>
                  {role.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </>
      ),
      async onOk() {
        try {
          if (collaboratorCode && selectedRole) {
            const roleData = {
              roleCode: selectedRole,
            };

            const response = await updateRoleCollaboratorBySysAdmin(collaboratorCode, roleData);

            if (response.status === 'success') {
              setSeverity('success');
              setIsShowMessage(true);
              setContent('Cập nhật chức vụ thành công');
              getDataCollaborators();
            }
          }
        } catch (error) {}
      },
      onCancel() {
        return;
      },
    });
  };

  return (
    <Box m="20px">
      <Box p="0px 0px 20px 0px">
        <Header title="Cán bộ nhân viên" />
      </Box>
      <Message isShowMessage={isShowMessage} severity={severity} content={content} handleCloseSnackbar={() => setIsShowMessage(false)} />
      <BoxCard>
        <Box display="flex" alignItems={{ xs: 'flex-end', sm: 'center' }} gap={3} flexDirection={{ sm: 'column', xs: 'column', md: 'row' }}>
          <SelectionOption
            value={levelFilter || 'Chọn cấp bậc'}
            onChange={handleLevelChange}
            options={roles.map((role) => ({
              value: role.roleCode,
              label: role.label,
            }))}
          />

          <SelectionOption
            value={genderFilter || 'Chọn giới tính'}
            onChange={handleGenderChange}
            options={[
              { value: null, label: 'Mặc định' },
              { value: 'female', label: 'Nữ' },
              { value: 'male', label: 'Nam' },
              { value: 'other', label: 'khác' },
            ]}
          />

          <SelectionOption
            value={statusFilter || 'Chọn trạng thái'}
            onChange={handleStatusChange}
            options={[
              { value: null, label: 'Mặc định' },
              { value: 'active', label: 'Đang hoạt động' },
              { value: 'banned', label: 'Đã cấm' },
            ]}
          />

          <Button variant="text" onClick={handleResetFilters}>
            <Typography sx={{ textTransform: 'none' }} px="4px" color={theme.gray[500]}>
              Clear
            </Typography>
            <RestoreOutlined sx={{ color: theme.gray[500] }} />
          </Button>
        </Box>

        <Divider />

        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={{ sm: 'column', xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end' }}
          mb="10px"
        >
          <Box display="flex" alignItems={{ xs: 'flex-end', sm: 'center' }} width={{ xs: '100%', md: '250px' }} mb={{ xs: 2, sm: 2, md: 0 }}>
            <Search
              placeholder={`Tìm kiếm`}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%', maxWidth: '300px' }}
              size="large"
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {isVisibleDelete && (
              <IconButton
                onClick={confirmDelete}
                sx={{
                  mr: '20px',
                  animation: `${blinkBackgroundAnimation} 1s ease infinite`,
                  color: theme.redAccent[500],
                }}
              >
                <DeleteOutline sx={{ color: theme.redAccent[500] }} />
              </IconButton>
            )}

            <Button
              variant="contained"
              startIcon={<FileDownloadOutlined />}
              onClick={handleExcelConfirm}
              sx={{
                backgroundColor: theme.greenAccent[100],
                fontSize: { xs: 14, md: 'inherit' },
                fontWeight: 'bold',
                textTransform: 'none',
              }}
              size="medium"
            >
              Xuất File
            </Button>

            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlined />}
              onClick={handleAddCollaborator}
              sx={{
                backgroundColor: theme.primary[500],
                fontSize: { xs: 14, md: 'inherit' },
                fontWeight: 'bold',
                textTransform: 'none',
              }}
              size="medium"
            >
              Tạo mới
            </Button>
          </Box>
        </Box>

        <DataTable
          pagination={true}
          isScroll={true}
          rowSelection={rowSelection}
          rows={collaborators}
          columns={columns}
          page={page}
          limit={limit}
          total={totalCollaborators}
          onPageChange={(newPage, newPageSize) => handlePageChange(newPage, newPageSize)}
          loading={loading}
          showExpand={false}
        />
      </BoxCard>
    </Box>
  );
};

export default Collaborator;
