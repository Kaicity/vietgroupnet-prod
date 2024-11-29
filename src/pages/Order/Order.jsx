import { useContext, useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ExcelJS from 'exceljs';
import {
  AddCircleOutlineOutlined,
  DeleteOutline,
  EditOutlined,
  FileDownloadOutlined,
  MoreVert,
  RestoreOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

import { Divider, Dropdown, Input, message, Modal, Select, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import theme from '../../utils/theme.js';
import DataTable from '../../components/DataTable.jsx';
import Header from '../../components/Header.jsx';
import Message from '../../components/Message.jsx';
import { blinkBackgroundAnimation } from '../../animation/shake.js';
import typography from '../../utils/typography.js';
import { deleteOrder, getOrders } from '../../api/order.js';
import { format } from 'date-fns';
import BoxCard from '../../components/Card.jsx';
import interviewOptions from '../../constants/interviewOptions.js';
import { formattedAmountByNumeric } from '../../helper/moneyConvert.js';
import StarEndCalender from '../../components/StarEndCalender.jsx';
import { educationaConfig } from '../../constants/educationaConfig.js';
import {
  experienceConfig,
  maritalStatusConfig,
  orderStatusConfig,
  physicalStrengthConfig,
} from '../../constants/enums/order-enum.js';
import SelectionOption from '../../components/SelectionOption.jsx';
import { AppContext } from '../../context/AppProvider.jsx';
const { Search } = Input;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [content, setContent] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [amountFilter, setAmmountFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isVisibleDelete, setIsVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewStatusFilter, setInterviewStatusFilter] = useState(null);

  const [dateFilter, setdateFilter] = useState(null);
  const [departureStartDate, setDepartureStartDate] = useState(null);
  const [departureEndDate, setDepartureEndDate] = useState(null);

  const navigate = useNavigate();
  const { collapsed } = useContext(AppContext);

  useEffect(() => {
    getDataOrders();
  }, [page, limit, searchText, interviewStatusFilter, amountFilter, dateFilter, departureStartDate, departureEndDate]);

  const getDataOrders = async (currentPage, currentLimit) => {
    setLoading(true);
    //search for text
    const filters = {
      ...(interviewStatusFilter && { interviewStatus: interviewStatusFilter }),
      ...(searchText && { search: searchText }),
      ...(departureStartDate && { departureStartDate }),
      ...(departureEndDate && { departureEndDate }),
    };
    // search for salary
    if (amountFilter === '10000000') {
      filters.amountMax = 10000000;
    } else if (amountFilter === '10000000-50000000') {
      filters.amountMin = 10000000;
      filters.amountMax = 50000000;
    } else if (amountFilter === '50000000') {
      filters.amountMin = 50000000;
    }
    // search start _end date
    if (dateFilter) {
      const formattedStartDate = dateFilter[0] ? dateFilter[0].format('YYYY-MM-DD') : null;
      const formattedEndDate = dateFilter[1] ? dateFilter[1].format('YYYY-MM-DD') : null;

      filters.departureStartDate = formattedStartDate;
      filters.departureEndDate = formattedEndDate;
    }

    try {
      const response = await getOrders({
        page: currentPage,
        limit: currentLimit,
        filters,
      });

      if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.pagination.total);
      } else {
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };
  //  delete button order
  const confirmDelete = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn là xóa Đơn Hàng này?',
      content: (
        <div style={{ maxHeight: '300px', minHeight: '80px', overflowY: 'auto' }}>
          <Typography fontSize={typography.fontSize.sizeM}>
            Số lượng: <strong>{selectedRowKeys.length}</strong>
          </Typography>

          <div>
            {selectedRows.map((orders) => (
              <div key={orders.orderCode}>
                <br />
                <Typography fontSize={typography.fontSize.sizeM}>
                  Tên Đơn Hàng: <strong>{orders.name}</strong> <br />
                </Typography>
                <Typography fontSize={typography.fontSize.sizeM}>
                  Có mã: <strong>{orders.orderCode}</strong>
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
  // delete many
  const handleDeleteMultiple = async () => {
    try {
      const promises = selectedRows.map((orders) => {
        return deleteOrder(orders.orderCode);
      });
      const response = await Promise.all(promises);

      const allSuccess = response.every((res) => res.status === 'success');

      if (allSuccess) {
        setContent('Đã xóa thành công!');
        setSeverity('success');
      } else {
        setContent('Xóa thất bại!');
        setSeverity('error');
      }
      setIsShowMessage(true);
      getDataOrders();
    } catch (error) {
      setIsShowMessage(true);
      setContent(error);
      setSeverity('error');
    }
  };
  // page
  const handlePageChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
    getDataOrders(newPage, newLimit);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleLangChange = (value) => {
    setInterviewStatusFilter(value);
  };

  const handleAmountChange = (value) => {
    setAmmountFilter(value);
  };

  const handleClear = () => {
    setInterviewStatusFilter(null);
    setAmmountFilter(null);
    setdateFilter(null);
    departureStartDate(null);
    departureStartDate(null);
  };

  const handleDateChange = (value) => {
    setdateFilter(value);
  };
  // execel
  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Danh Sách Đơn Hàng');

    const columns = [
      { header: 'Mã Đơn Hàng', key: 'orderCode', width: 15 },
      { header: 'Họ Tên Đơn Hàng', key: 'orderName', width: 25 },
      { header: 'Tên Doanh Nghiệp', key: 'unionName', width: 25 },
      { header: 'Địa Chỉ Công Ty', key: 'companyAddress', width: 25 },
      { header: 'Lương', key: 'salary', width: 15 },
      { header: 'Độ Tuổi Tối Thiểu', key: 'minAge', width: 20 },
      { header: 'Độ Tuổi Tối Đa', key: 'maxAge', width: 20 },
      { header: 'Ngày Phỏng Vấn', key: 'interviewDate', width: 15 },
      { header: 'Tình Trạng Phỏng Vấn', key: 'interviewStatus', width: 20 },
      { header: 'Yêu Cầu Giáo Dục', key: 'eduRequirements', width: 20 },
      { header: 'Ngày Xuất Cảnh', key: 'departureDate', width: 15 },
      { header: 'Mô Tả Công Việc', key: 'jobDescription', width: 30 },
      { header: 'Kinh Nghiệm', key: 'experience', width: 20 },
      { header: 'Thể Lực', key: 'physicalStrength', width: 20 },
      { header: 'Thuận Tay', key: 'dominantHand', width: 15 },
      { header: 'Bảo Hiểm', key: 'insurance', width: 15 },
      { header: 'Thị Lực', key: 'vision', width: 15 },
      { header: 'Tình Trạng Hôn Nhân', key: 'maritalStatus', width: 20 },
      { header: 'Ghi Chú', key: 'notes', width: 25 },
    ];

    sheet.columns = columns;

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '99C464' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    sheet.getRow(1).height = 30;

    if (Array.isArray(orders) && orders.length) {
      const transformedData = orders.map((order) => ({
        orderCode: order.orderCode || 'N/A',
        orderName: order.orderName || 'N/A',
        unionName: order.unionName || 'N/A',
        companyAddress: order.companyAddress || 'N/A',
        salary: formattedAmountByNumeric(order?.salary) || 'N/A',
        minAge: order.minAge || 'N/A',
        maxAge: order.maxAge || 'N/A',
        interviewDate: order.interviewDate ? format(new Date(order.interviewDate), 'dd-MM-yyyy') : 'N/A',
        interviewStatus: orderStatusConfig[order.interviewStatus]?.label || 'N/A',
        eduRequirements: order.eduRequirements || 'N/A',
        departureDate: order.departureDate ? format(new Date(order.departureDate), 'dd-MM-yyyy') : 'N/A',
        jobDescription: order.jobDescription || 'N/A',
        experience: experienceConfig[order.experience]?.label || 'N/A',
        physicalStrength: physicalStrengthConfig[order.physicalStrength]?.label || 'N/A',
        dominantHand: order.dominantHand || 'N/A',
        insurance: order.insurance || 'N/A',
        vision: order.vision || 'N/A',
        maritalStatus: maritalStatusConfig[order.maritalStatus]?.label || 'N/A',
        notes: order.notes || 'N/A',
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
      anchor.download = 'ds_donhang_2024.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    } else {
      message.error('Không có dữ liệu để xuất.');
    }
  };
  const handleExcelConfirm = () => {
    Modal.confirm({
      title: 'Bạn muốn xuất danh sách Đơn Hàng',
      okText: 'Đồng ý',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk() {
        handleExportToExcel();
      },
      onCancel() {},
    });
  };

  const handleMenuClick = async (e, orderCode) => {
    switch (e.key) {
      case 'ACTION-EXPORT':
        message.info(`Xuất thông tin Đơn Hàng có mã: ${orderCode}`);
        break;
      case 'ACTION-EDIT':
        message.info(`Cập nhật Đơn Hàng có mã:  ${orderCode}`);
        if (orderCode) {
          navigate(`/edit-order/${orderCode}`);
        }
        break;
      case 'ACTION-VIEW':
        message.info(`Thông Tin Đơn Hàng có mã:  ${orderCode}`);
        if (orderCode) {
          navigate(`/information-order/${orderCode}`);
        }
        break;
      default:
        message.info('Unknown hello');
    }
  };

  const menuProps = (orderCode) => ({
    items,
    onClick: (e) => handleMenuClick(e, orderCode),
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
  // item action
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
  // columns table
  const columns = [
    {
      title: 'Đơn Hàng'.toUpperCase(),
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: collapsed ? 260 : 220,
      sorter: (a, b) => a.orderCode.localeCompare(b.orderCode),
      render: (text) => <span style={{ fontWeight: 500, color: theme.gray[400] }}>{text}</span>,
    },
    {
      title: 'Tên Đơn Hàng'.toUpperCase(),
      dataIndex: 'orderName',
      key: 'orderName',
      width: collapsed ? 300 : 280,
      sorter: (a, b) => a.orderName.localeCompare(b.orderName),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Tên Công Ty'.toUpperCase(),
      dataIndex: 'companyName',
      key: 'companyName',
      width: collapsed ? 220 : 200,
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },

    {
      title: 'Tên Nghiệp Đoàn'.toUpperCase(),
      dataIndex: 'unionName',
      key: 'unionName',
      width: collapsed ? 220 : 200,
      sorter: (a, b) => a.unionName.localeCompare(b.unionName),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Ngày Phỏng Vấn'.toUpperCase(),
      dataIndex: 'interviewDate',
      key: 'interviewDate',
      width: collapsed ? 200 : 180,
      sorter: (a, b) => a.interviewDate.localeCompare(b.interviewDate),
      render: (text) => <span>{format(new Date(text), 'dd-MM-yyyy')}</span>,
    },
    {
      title: 'Ngày Xuất Cảnh'.toUpperCase(),
      dataIndex: 'departureDate',
      key: 'departureDate',
      width: collapsed ? 200 : 180,
      sorter: (a, b) => a.departureDate.localeCompare(b.departureDate),
      render: (text) => <span>{format(new Date(text), 'dd-MM-yyyy')}</span>,
    },
    {
      title: 'Hình thức'.toUpperCase(),
      dataIndex: 'interviewStatus',
      key: 'interviewStatus',
      width: collapsed ? 220 : 200,
      sorter: (a, b) => a.interviewStatus.localeCompare(b.interviewStatus),
      render: (interviewStatus) => {
        const config = interviewOptions[interviewStatus];
        return (
          <Tag key={interviewStatus} color={config?.color} style={{ padding: '2px 10px 4px 10px' }}>
            <span>{config ? config.value : 'Chưa xác định'}</span>
          </Tag>
        );
      },
    },
    {
      title: 'Nữ'.toUpperCase(),
      dataIndex: 'female',
      key: 'male',
      width: collapsed ? 100 : 80,
      sorter: (a, b) => a.studentCount - b.studentCount,
      render: (male) => <span>{male ? male : 'Không có'}</span>,
    },
    {
      title: 'Nam'.toUpperCase(),
      dataIndex: 'male',
      key: 'male',
      width: collapsed ? 100 : 80,
      sorter: (a, b) => a.male - b.male,
      render: (male) => <span>{male ? male : 'Không có'}</span>,
    },

    {
      title: 'Lương'.toUpperCase(),
      dataIndex: 'salary',
      key: 'salary',
      width: collapsed ? 220 : 200,
      sorter: (a, b) => a.address.localeCompare(b.address),
      render: (amountPaid) => {
        const formattedAmount = formattedAmountByNumeric(amountPaid);
        return <span>{formattedAmount == 0 ? 'Chưa đóng' : formattedAmount + ' đ'}</span>;
      },
    },
    {
      title: 'Trình Độ'.toUpperCase(),
      dataIndex: 'eduRequirements',
      key: 'eduRequirements',
      width: collapsed ? 260 : 220,
      sorter: (a, b) => a.eduRequirements.localeCompare(b.eduRequirements),
      render: (eduRequirements) => {
        const config = educationaConfig[eduRequirements];
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
      title: 'Công Việc'.toUpperCase(),
      dataIndex: 'jobDescription',
      key: 'jobDescription',
      width: collapsed ? 260 : 220,
      sorter: (a, b) => a.jobDescription.localeCompare(b.jobDescription),
      render: (jobDescription) => <i>{jobDescription ? jobDescription : 'Tốt'}</i>,
    },

    {
      title: 'Hành động'.toUpperCase(),
      key: 'action',
      width: 120,
      render: (_, action) => (
        <Space size="middle">
          <IconButton onClick={() => handleMenuClick({ key: 'ACTION-VIEW' }, action.orderCode)}>
            {' '}
            <VisibilityOutlined />
          </IconButton>
          <Dropdown menu={menuProps(action.orderCode)}>
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
        <Header title="Đơn Hàng" />
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
          <Select
            size="large"
            value={interviewStatusFilter || 'Chọn tình trạng'}
            onChange={handleLangChange}
            style={{
              top: '1px',
              width: '100%',
            }}
            options={[
              { value: null, label: 'Mặc định' },
              {
                value: 'complete',
                label: 'Hoàn Thành',
              },
              {
                value: 'uncomplete',
                label: ' Chưa Hoàn Thành',
              },
            ]}
          ></Select>

          <SelectionOption
            value={amountFilter || 'Khoảng tiền'}
            onChange={handleAmountChange}
            style={{
              top: '1px',
              width: '100%',
            }}
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
                value: '50000000',
                label: 'Trên 50,000,000/đ',
              },
            ]}
          />

          <StarEndCalender
            label="Departure Date"
            value={dateFilter || 'không có'}
            onChange={handleDateChange}
            startDate={departureStartDate}
            endDate={departureEndDate}
            onStartDateChange={(date) => {
              setDepartureStartDate(date);
              getDataOrders(page, limit);
            }}
            onEndDateChange={(date) => {
              setDepartureEndDate(date);
              getDataOrders(page, limit);
            }}
            style={{ width: '450px' }}
          />

          <Button variant="text" onClick={handleClear}>
            <Typography px="4px" sx={{ textTransform: 'none' }} color={theme.gray[500]}>
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
              placeholder={`Tìm kiếm `}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%', maxWidth: '300px' }}
              size="large"
            />
          </Box>

          <Box display="flex" flexDirection={{ sm: 'column', xs: 'column', md: 'row' }} gap={{ xs: 0, sm: 2 }}>
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
                onClick={() => navigate('/add-order')}
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
          rows={orders}
          columns={columns}
          rowSelection={rowSelection}
          page={page}
          limit={limit}
          total={totalOrders}
          onPageChange={(newPage, newPageSize) => handlePageChange(newPage, newPageSize)}
          loading={loading}
          showExpand={false}
        />
      </BoxCard>
    </Box>
  );
};
export default Order;
