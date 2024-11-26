import { Box, Button, IconButton, Typography } from '@mui/material';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import BoxCard from '../../components/Card';
import DataTable from '../../components/DataTable';
import { useContext } from 'react';
import { AppContext } from '../../context/AppProvider';
import { deletepayHistory, getpayHistoryIsAdmin } from '../../api/payHistory';
import theme from '../../utils/theme';
import { format } from 'date-fns';
import { formattedAmountByNumeric } from '../../helper/moneyConvert';
import { payCollaboratorStatus } from '../../constants/enums/payCollaborator-enum';
import { Dropdown, Input, message, Modal, Space, Tag } from 'antd';
import { blinkBackgroundAnimation } from '../../animation/shake';
import { AddCircleOutlineOutlined, DeleteOutline, EditOutlined, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import typography from '../../utils/typography';
import Message from '../../components/Message';

const { Search } = Input;

const PayCollaborator = () => {
  const navigate = useNavigate();

  const { collapsed } = useContext(AppContext);

  //================MESSAGE ALERT========================
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [content, setContent] = useState('');

  const [payCollaborators, setPayCollaborators] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPayCollaborator, setTotalPayCollaborator] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isVisibleDelete, setIsVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  //===============SEARCH_FILTER==========================
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getDataPayCollaborator();
  }, [page, limit, searchText]);

  const getDataPayCollaborator = async (currentPage, currentLimit) => {
    setLoading(true);

    const filters = { ...(searchText && { search: searchText }) };

    let response;

    if (searchText) {
      response = await getpayHistoryIsAdmin({
        page: 1,
        limit: 20,
        filters,
      });
    } else {
      response = await getpayHistoryIsAdmin({
        page: 1,
        limit: 20,
        filters,
      });
    }

    if (response.data && Array.isArray(response.data.payHistories)) {
      if (response.status === 'success') {
        setPayCollaborators(response.data.payHistories);
        setTotalPayCollaborator(response.data.pagination.total);
        setLoading(false);
      }
    } else {
      setPayCollaborators([]);
      setTotalPayCollaborator(0);
    }
  };

  const handlePageChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
    getDataPayCollaborator(newPage, newLimit);
  };

  const handleMenuClick = async (e, payHistoryCode) => {
    switch (e.key) {
      case 'ACTION-SEE':
        message.info(`Cập nhật Hoa hồng có mã:  ${payHistoryCode}`);
        if (payHistoryCode) {
          navigate(`/edit-pay-collaborator/${payHistoryCode}`);
        }
        break;
      default:
        message.info('Unknown action');
    }
  };

  const menuProps = (payHistoryCode) => ({
    items,
    onClick: (e) => handleMenuClick(e, payHistoryCode),
  });

  const items = [
    {
      label: 'Xem',
      key: 'ACTION-SEE',
      icon: <EditOutlined />,
    },
  ];

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

  const confirmDelete = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn là xóa hoa hồng ?',
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
            {selectedRows.map((payCollaborator) => (
              <div key={payCollaborator.payHistoryCode}>
                <br />
                <Typography fontSize={typography.fontSize.sizeM}>
                  Nội dung hoa hồng: <strong>{payCollaborator.payHistoryName}</strong> <br />
                </Typography>
                <Typography fontSize={typography.fontSize.sizeM}>
                  Có mã: <strong>{payCollaborator.payHistoryCode}</strong>
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
      const promises = selectedRows.map((payCollaborator) => {
        return deletepayHistory(payCollaborator.payHistoryCode); // request api delete
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
      getDataPayCollaborator();
    } catch (error) {
      setIsShowMessage(true);
      setContent(error.message || 'Có lỗi xảy ra');
      setSeverity('error');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: 'Mã hoa hồng'.toUpperCase(),
      dataIndex: 'payHistoryCode',
      key: 'payHistoryCode',
      width: collapsed ? 180 : 160,
      render: (text) => <span style={{ fontWeight: 500, color: theme.gray[400] }}>{text}</span>,
    },
    {
      title: 'Mã cán bộ nhân viên'.toUpperCase(),
      dataIndex: 'collaboratorCode',
      key: 'collaboratorCode',
      width: collapsed ? 240 : 260,
      render: (text) => <span style={{ fontWeight: 500, color: theme.gray[400] }}>{text}</span>,
    },
    {
      title: 'Thụ hưởng (%)'.toUpperCase(),
      dataIndex: 'percent',
      key: 'percent',
      width: collapsed ? 260 : 220,
      render: (percent) => <i>{percent ? percent + '%' : 'Không có'}</i>,
    },
    {
      title: 'Hoa hồng'.toUpperCase(),
      dataIndex: 'commission',
      key: 'commission',
      width: collapsed ? 240 : 200,
      render: (commission) => <span>{formattedAmountByNumeric(commission) + ' đ'}</span>,
    },
    {
      title: 'Trạng thái'.toUpperCase(),
      dataIndex: 'status',
      key: 'status',
      width: collapsed ? 230 : 200,
      render: (status) => {
        const config = payCollaboratorStatus[status?.toUpperCase()];
        if (config) {
          return (
            <Tag key={status} color={config.color} style={{ padding: '2px 10px 4px 10px' }}>
              {config ? config?.label : 'Chưa xác định'}
            </Tag>
          );
        }
      },
    },
    {
      title: 'Nội dung trả tiền'.toUpperCase(),
      dataIndex: 'payHistoryName',
      key: 'payHistoryName',
      width: collapsed ? 300 : 280,
      render: (payHistoryName) => <span>{payHistoryName}</span>,
    },
    {
      title: 'Ngày tạo'.toUpperCase(),
      dataIndex: 'createDate',
      key: 'createDate',
      width: collapsed ? 180 : 160,
      render: (createDate) => <span>{createDate ? format(new Date(createDate), 'dd-MM-yyyy') : 'Chưa xác định'}</span>,
    },
    {
      title: 'Ngày cập nhật'.toUpperCase(),
      dataIndex: 'updateDate',
      key: 'updateDate',
      width: collapsed ? 180 : 160,
      render: (updateDate) => <span>{updateDate ? format(new Date(updateDate), 'dd-MM-yyyy') : 'Chưa xác định'}</span>,
    },
    // {
    //   title: 'Hành Động'.toUpperCase(),
    //   key: 'action',
    //   width: 120,
    //   render: (_, action) => (
    //     <div
    //       style={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}
    //     >
    //       <Space size="middle">
    //         <Dropdown menu={menuProps(action.payHistoryCode)}>
    //           <a onClick={(e) => e.preventDefault()}>
    //             <MoreVert sx={{ color: theme.gray[500] }} />
    //           </a>
    //         </Dropdown>
    //       </Space>
    //     </div>
    //   ),
    // },
  ];

  return (
    <Box m="20px">
      <Box p="0px 0px 20px 0px">
        <Header title="Hoa Hồng" />
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
                startIcon={<AddCircleOutlineOutlined />}
                onClick={() => navigate('/add-pay-collaborator')}
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
          isScroll={true}
          pagination={true}
          rowSelection={rowSelection}
          columns={columns}
          rows={payCollaborators}
          page={page}
          limit={limit}
          total={totalPayCollaborator}
          onPageChange={(newPage, newPageSize) => handlePageChange(newPage, newPageSize)}
          loading={loading}
          showExpand={false}
        />
      </BoxCard>
    </Box>
  );
};

export default PayCollaborator;
