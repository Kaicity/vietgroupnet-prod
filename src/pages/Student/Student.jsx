import { useContext, useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ExcelJS from 'exceljs';

import {
  AddCircleOutlineOutlined,
  DeleteOutline,
  Edit,
  EditOutlined,
  FileDownloadOutlined,
  MoreVert,
  RestoreOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

import {
  Col,
  Divider,
  Drawer,
  Dropdown,
  Input,
  message,
  Modal,
  Row,
  Space,
  Tag,
} from 'antd';

import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import theme from '../../utils/theme.js';
import DataTable from '../../components/DataTable.jsx';
import Header from '../../components/Header.jsx';
import {
  deleteStudent,
  getStudentByCode,
  getStudents,
} from '../../api/student.js';

import Message from '../../components/Message.jsx';

import {
  diligenceConfig,
  studentStatusConfig,
} from '../../constants/enums/student-enum.js';
import { genderConfig } from '../../constants/enums/student-enum.js';
import { AppContext } from '../../context/AppProvider.jsx';
import { blinkBackgroundAnimation } from '../../animation/shake.js';
import typography from '../../utils/typography.js';
import { formattedAmountByNumeric } from '../../helper/moneyConvert.js';
import BoxCard from '../../components/Card.jsx';
import DescriptionItem from '../../components/DescriptionItem.jsx';
import { format } from 'date-fns';
import CustomTextQuill from '../../components/CustomTextQuill.jsx';
import SelectionOption from '../../components/SelectionOption.jsx';

const { Search } = Input;

const Label = styled.span`
  font-weight: 500;
  font-size: 20px;
`;

const Student = () => {
  //================MESSAGE ALERT========================
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [content, setContent] = useState('');

  //================DATA STUDENT========================
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalStudents, setTotalStudents] = useState(0);

  //================FILTER VALUE========================
  const [searchText, setSearchText] = useState('');
  const [diligenceFilter, setDiligenceFilter] = useState(null);
  const [genderFilter, setGenderFilter] = useState(null);
  const [studentStatusFilter, setStudentStatusFilter] = useState(null);
  const [amountFilter, setAmmountFilter] = useState(null);

  //================ACTION CLICK========================
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isVisibleDelete, setIsVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  //================STUDEN DETAIL========================
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentDetail, setStudentDetail] = useState(null);

  const navigate = useNavigate();
  const { collapsed } = useContext(AppContext);

  useEffect(() => {
    getDataStudents();
  }, [
    page,
    limit,
    searchText,
    diligenceFilter,
    genderFilter,
    studentStatusFilter,
    amountFilter,
  ]);

  const getDataStudents = async (currentPage, currentLimit) => {
    setLoading(true);

    const filters = {
      ...(diligenceFilter && { diligence: diligenceFilter }),
      ...(genderFilter && { gender: genderFilter }),
      ...(studentStatusFilter && { studentStatus: studentStatusFilter }),
      ...(searchText && { search: searchText }),
    };

    // Xử lý amount filter dựa trên giá trị được chọn
    switch (amountFilter) {
      case '10000000':
        filters.amountMax = 10000000;
        break;
      case '10000000-50000000':
        filters.amountMin = 10000000;
        filters.amountMax = 50000000;
        break;
      case '50000000-100000000':
        filters.amountMin = 50000000;
        filters.amountMax = 100000000;
        break;
      case '100000000':
        filters.amountMin = 100000000;
        break;

      default:
        break;
    }

    let response;

    if (searchText) {
      response = await getStudents({
        page: currentPage,
        limit: currentLimit,
        filters,
      });
    } else {
      response = await getStudents({
        page: currentPage,
        limit: currentLimit,
        filters,
      });
    }

    if (response.data && Array.isArray(response.data.students)) {
      if (response.status === 'success') {
        setStudents(response.data.students);
        setTotalStudents(response.data.pagination.total);
        setLoading(false);
      }
    } else {
      setStudents([]);
      setTotalStudents(0);
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn là xóa cộng tác viên?',
      content: (
        <div
          style={{
            maxHeight: '300px',
            minHeight: '80px',
            overflowY: 'auto',
          }}
        >
          <Typography fontSize={typography.fontSize.sizeM}>
            Số lượng: <strong>{selectedRowKeys.length}</strong>
          </Typography>

          <div>
            {selectedRows.map((student) => (
              <div key={student.studentCode}>
                <br />
                <Typography fontSize={typography.fontSize.sizeM}>
                  Tên cộng tác viên: <strong>{student.name}</strong> <br />
                </Typography>
                <Typography fontSize={typography.fontSize.sizeM}>
                  Có mã: <strong>{student.studentCode}</strong>
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
      const promises = selectedRows.map((student) => {
        return deleteStudent(student.studentCode); // request api delete
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
      getDataStudents();
    } catch (error) {
      setIsShowMessage(true);
      setContent(error);
      setSeverity('error');
    }
  };

  const handlePageChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
    getDataStudents(newPage, newLimit);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleGenderChange = (value) => {
    setGenderFilter(value);
  };

  const handleDiligenceChange = (value) => {
    setDiligenceFilter(value);
  };

  const handleStudentStatusChange = (value) => {
    setStudentStatusFilter(value);
  };

  const handleAmountChange = (value) => {
    setAmmountFilter(value);
  };

  const handleResetFilters = () => {
    setDiligenceFilter(null);
    setGenderFilter(null);
    setStudentStatusFilter(null);
    setAmmountFilter(null);
    setSearchText('');
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Danh Sách Học viên');
    const columns = [
      { header: 'Mã học viên', key: 'studentCode', width: 15 },
      { header: 'Họ và Tên', key: 'name', width: 20 },
      { header: 'Địa chỉ', key: 'address', width: 25 },
      { header: 'Số Điện Thoại', key: 'studentPhoneNumber', width: 15 },
      { header: 'Giới Tính', key: 'gender', width: 10 },
      { header: 'Tình trạng học viên', key: 'studentStatus', width: 20 },
      { header: 'Chuyên cần', key: 'diligence', width: 15 },
      { header: 'Thái độ', key: 'attitude', width: 15 },
      { header: 'Số tiền đã đóng (vnđ)', key: 'amountPaid', width: 20 },
      { header: 'Người giới thiệu', key: 'collaborator', width: 20 },
    ];

    sheet.columns = columns;

    // Style headers
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

    sheet.getRow(1).height = 50;

    if (Array.isArray(students) && students.length) {
      const transformedData = students.map((student) => ({
        studentCode: student.studentCode,
        name: student.name,
        studentPhoneNumber: student.studentPhoneNumber || 'N/A',
        address: student.address || 'N/A',
        gender: genderConfig[student.gender?.toUpperCase()]?.label || 'N/A',
        studentStatus:
          studentStatusConfig[student?.studentStatus]?.label || 'N/A',
        diligence:
          diligenceConfig[student?.diligence.toUpperCase()]?.label || 'N/A',
        attitude: student.attitude || 'N/A',
        amountPaid: formattedAmountByNumeric(student?.amountPaid) || 'N/A',
        collaborator: student?.collaborator?.name || 'N/A',
      }));

      transformedData.forEach((data) => {
        const row = sheet.addRow(data);
        row.height = 40;
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

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Danh_Sach_Hoc_Vien.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    } else {
      message.error('Không có dữ liệu để xuất.');
    }
  };

  const handleExcelConfirm = () => {
    Modal.confirm({
      title: 'Bạn muốn xuất danh sách học viên',
      okText: 'Đồng ý',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk() {
        handleExportToExcel();
      },
      onCancel() {},
    });
  };

  const handleMenuClick = async (e, studentCode) => {
    switch (e.key) {
      case 'ACTION-EXPORT':
        message.info(`Xuất thông tin Học viên có mã: ${studentCode}`);
        break;
      case 'ACTION-EDIT':
        message.info(`Cập nhật Học viên có mã:  ${studentCode}`);
        if (studentCode) {
          navigate(`/edit-student/${studentCode}`);
        }
        break;
      case 'ACTION-VIEW':
        message.info(`Xem thông tin học viên có mã: ${studentCode}`);
        if (studentCode) {
          try {
            const response = await getStudentByCode(studentCode);
            if (response.status === 'success') {
              setStudentDetail(response.data);
              showDrawer();
            }
          } catch (error) {
            console.error('Error fetching collaborator data:', error);
          }
        }
        break;
      default:
        message.info('Unknown action');
    }
  };

  const menuProps = (studentCode) => ({
    items,
    onClick: (e) => handleMenuClick(e, studentCode),
  });

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

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
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

  const columns = [
    {
      title: 'Mã học viên'.toUpperCase(),
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: collapsed ? 170 : 140,
      sorter: (a, b) => a.studentCode.localeCompare(b.studentCode),
      render: (text) => (
        <span style={{ fontWeight: 500, color: theme.gray[400] }}>{text}</span>
      ),
    },
    {
      title: 'Họ và Tên'.toUpperCase(),
      dataIndex: 'name',
      key: 'name',
      width: collapsed ? 230 : 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Số Điện Thoại'.toUpperCase(),
      dataIndex: 'studentPhoneNumber',
      key: 'studentPhoneNumber',
      width: collapsed ? 180 : 150,
      render: (studentPhoneNumber) => (
        <i>{studentPhoneNumber ? studentPhoneNumber : 'Không có'}</i>
      ),
    },
    {
      title: 'Giới Tính'.toUpperCase(),
      dataIndex: 'gender',
      key: 'gender',
      width: 120,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (gender) => {
        const config = genderConfig[gender?.toUpperCase()];
        return <span>{config ? config.label : 'Chưa xác định'}</span>;
      },
    },
    {
      title: 'Chuyên Cần'.toUpperCase(),
      dataIndex: 'diligence',
      key: 'diligence',
      width: collapsed ? 190 : 160,
      sorter: (a, b) => a.diligence.localeCompare(b.diligence),
      render: (diligence) => {
        const config = diligenceConfig[diligence?.toUpperCase()];
        return (
          <span
            style={{
              fontWeight: config ? '500' : 'normal',
              color: `${config ? config.color : ''}`,
            }}
          >
            {config ? config.label : 'Chưa xác định'}
          </span>
        );
      },
    },
    {
      title: 'Tình Trạng'.toUpperCase(),
      dataIndex: 'studentStatus',
      key: 'studentStatus',
      width: collapsed ? 210 : 180,
      sorter: (a, b) => a.studentStatus.localeCompare(b.studentStatus),
      render: (studentStatus) => {
        const config = studentStatusConfig[studentStatus?.toUpperCase()];
        if (config) {
          return (
            <Tag
              key={studentStatus}
              color={config.color}
              style={{ padding: '2px 10px 4px 10px' }}
            >
              <span>{config ? config.label : 'Chưa xác định'}</span>
            </Tag>
          );
        }
      },
    },
    {
      title: 'Số Tiền Đã Đóng'.toUpperCase(),
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      width: collapsed ? 230 : 200,
      sorter: (a, b) => parseFloat(a.amountPaid) - parseFloat(b.amountPaid),
      render: (amountPaid) => {
        const formattedAmount = formattedAmountByNumeric(amountPaid);
        return (
          <span>
            {formattedAmount == 0 ? 'Chưa đóng' : formattedAmount + ' đ'}
          </span>
        );
      },
    },
    {
      title: 'Người giới thiệu'.toUpperCase(),
      dataIndex: 'collaborator',
      key: 'collaborator',
      width: collapsed ? 230 : 200,
      sorter: (a, b) => a.collaborator.localeCompare(b.collaborator),
      render(collaborator) {
        return (
          <span style={{ color: theme.gray[500], fontWeight: 500 }}>
            {collaborator?.name}
          </span>
        );
      },
    },
    {
      title: 'Hành Động'.toUpperCase(),
      key: 'action',
      render: (_, action) => (
        <Space size="middle">
          <IconButton
            onClick={() =>
              handleMenuClick({ key: 'ACTION-VIEW' }, action.studentCode)
            }
          >
            <VisibilityOutlined />
          </IconButton>
          <Dropdown menu={menuProps(action.studentCode)}>
            <a onClick={(e) => e.preventDefault()}>
              <MoreVert sx={{ color: theme.gray[500] }} />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box p="0px 0px 20px 0px">
        <Header title="Học viên" />
      </Box>
      <Message
        isShowMessage={isShowMessage}
        severity={severity}
        content={content}
        handleCloseSnackbar={() => setIsShowMessage(false)}
      />
      <BoxCard>
        <Box
          display="flex"
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          gap={3}
          flexDirection={{ sm: 'column', xs: 'column', md: 'row' }}
        >
          <SelectionOption
            value={diligenceFilter || 'Chọn chuyên cần'}
            onChange={handleDiligenceChange}
            options={[
              { value: null, label: 'Mặc định' },
              {
                value: 'poor',
                label: 'Kém',
              },
              {
                value: 'average',
                label: 'Trung bình',
              },
              {
                value: 'good',
                label: 'Khá',
              },
              {
                value: 'excellent',
                label: 'Xuất sắc',
              },
            ]}
          />

          <SelectionOption
            value={genderFilter || 'Chọn giới tính'}
            onChange={handleGenderChange}
            options={[
              { value: null, label: 'Mặc định' },
              { value: 'female', label: 'Nữ' },
              { value: 'male', label: 'Nam' },
              { value: 'other', label: 'Khác' },
            ]}
          />

          <SelectionOption
            value={studentStatusFilter || 'Chọn tình trạng'}
            onChange={handleStudentStatusChange}
            options={[
              { value: null, label: 'Mặc định' },
              {
                value: 'BI',
                label: 'Trước phỏng vấn',
              },
              {
                value: 'AI',
                label: 'Sau phỏng vấn',
              },
              {
                value: 'HRB',
                label: 'Có giấy phép lưu trú',
              },
              {
                value: 'FA',
                label: 'Đã bay',
              },
            ]}
          />

          <SelectionOption
            value={amountFilter || 'Khoảng tiền'}
            onChange={handleAmountChange}
            options={[
              { value: null, label: 'Mặc định' },
              {
                value: '10000000',
                label: 'Dưới 10,000,000/đ',
              },
              {
                value: '10000000-50000000',
                label: 'Từ 10,000,000 đến 50,000,000/đ',
              },
              {
                value: '50000000-100000000',
                label: 'Từ 50,000,000 đến 100,000,000/đ',
              },
              {
                value: '100000000',
                label: 'Trên 100,000,000/đ',
              },
            ]}
          />

          <Button variant="text" onClick={handleResetFilters}>
            <Typography
              px="4px"
              sx={{ textTransform: 'none' }}
              color={theme.gray[500]}
            >
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
          <Box
            display="flex"
            alignItems={{ xs: 'flex-end', sm: 'center' }}
            width={{ xs: '100%', md: '250px' }}
            mb={{ xs: 2, sm: 2, md: 0 }}
          >
            <Search
              placeholder={`Tìm kiếm`}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '100%' }}
              size="large"
            />
          </Box>

          <Box
            display="flex"
            flexDirection={{
              sm: 'column',
              xs: 'column',
              md: 'row',
            }}
            gap={{ xs: 0, sm: 2 }}
          >
            <Box display="flex" alignItems="center">
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

                  marginTop: { xs: '8px', sm: 0 },
                }}
                size="medium"
              >
                Xuất File
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineOutlined />}
                onClick={() => navigate('/add-student')}
                sx={{
                  backgroundColor: theme.primary[500],
                  fontSize: { xs: 14, md: 'inherit' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  marginLeft: { xs: 1, sm: '16px' },
                  marginTop: { xs: '8px', sm: 0 },
                }}
                size="medium"
              >
                Tạo mới
              </Button>
            </Box>
          </Box>
        </Box>

        <DataTable
          pagination={true}
          isScroll={true}
          rows={students}
          columns={columns}
          rowSelection={rowSelection}
          page={page}
          limit={limit}
          total={totalStudents}
          onPageChange={(newPage, newPageSize) =>
            handlePageChange(newPage, newPageSize)
          }
          loading={loading}
          showExpand={false}
        />
      </BoxCard>

      <div>
        <Drawer
          width={640}
          placement="right"
          onClose={closeDrawer}
          open={isDrawerOpen}
        >
          <Row>
            <Col span={22}>
              <Label>Thông tin chi tiết học viên</Label>
            </Col>
            <Col span={1}>
              <IconButton
                sx={{
                  color: theme.primary[300],
                }}
                onClick={async () => {
                  if (studentDetail?.studentCode) {
                    navigate(`/edit-student/${studentDetail.studentCode}`);
                  }
                }}
              >
                <Edit />
              </IconButton>
            </Col>
          </Row>
          <div style={{ marginBottom: '20px' }}></div>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '22px', md: '20px' },
              backgroundColor: theme.primary[500],
              color: '#fff',
              padding: '5px 15px',
              borderRadius: '6px',
              width: '100%',
              marginBottom: '20px',
            }}
          >
            Cá nhân
          </Typography>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Mã học viên"
                content={studentDetail?.studentCode}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Tên học viên"
                content={studentDetail?.name}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Giới tính"
                content={
                  genderConfig[studentDetail?.gender.toUpperCase()]?.label
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Ngày sinh"
                content={
                  studentDetail?.dayOfBirth
                    ? format(new Date(studentDetail?.dayOfBirth), 'dd-MM-yyyy')
                    : ''
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="CCCD/CMND"
                content={studentDetail?.identityNumber || 'Chưa có'}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Ghi chú"
                content={studentDetail?.note || 'Không có'}
              />
            </Col>
          </Row>
          <Divider />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '22px', md: '20px' },
              backgroundColor: theme.orange[100],
              color: '#fff',
              padding: '5px 15px',
              borderRadius: '6px',
              width: '100%',
              marginBottom: '20px',
            }}
          >
            Đánh giá học tập
          </Typography>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Tình trạng học viên"
                content={
                  studentStatusConfig[
                    studentDetail?.studentStatus.toUpperCase()
                  ]?.label || 'Chưa có'
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Số tiền đã đóng"
                content={
                  formattedAmountByNumeric(studentDetail?.amountPaid) + ' đ' ||
                  'Chưa có'
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Chuyên cần"
                content={
                  diligenceConfig[studentDetail?.diligence.toUpperCase()]
                    ?.label || 'Chưa có'
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Thái độ"
                content={studentDetail?.attitude || 'NA'}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Tình hình học tập"
                content={
                  <>
                    <CustomTextQuill
                      readOnly={true}
                      toolbarVisible={false}
                      value={studentDetail?.learningSituation || 'Chưa có'}
                    />
                  </>
                }
              />
            </Col>
          </Row>
          <Divider />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '22px', md: '20px' },
              backgroundColor: theme.green[200],
              color: theme.white[100],
              padding: '5px 15px',
              borderRadius: '6px',
              width: '100%',
              marginBottom: '20px',
            }}
          >
            Thông Tin Liên Lạc
          </Typography>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Mã người giới thiệu"
                content={
                  studentDetail?.collaborator?.collaboratorCode || 'Chưa có'
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Tên người giới thiệu"
                content={studentDetail?.collaborator?.name || 'Chưa có'}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Số điện thoại học viên"
                content={studentDetail?.studentPhoneNumber || 'Chưa có'}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Số điện thoại cha mẹ"
                content={studentDetail?.parentPhoneNumber || 'Chưa có'}
              />
            </Col>
          </Row>
        </Drawer>
      </div>
    </Box>
  );
};
export default Student;
