import { Box, Grid } from '@mui/material';
import ProfileCard from './ProfileCard/ProfileCard';
import Header from '../../components/Header';
import StatBox from '../../components/StatBox';
import theme from '../../utils/theme';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BoxCard from '../../components/Card';
import DataTable from '../../components/DataTable';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppProvider';
import { getpayHistoryIsUser } from '../../api/payHistory';
import { formattedAmountByNumeric } from '../../helper/moneyConvert';
import { format } from 'date-fns';
import CountUp from 'react-countup';
import { getStudentTotal } from '../../api/student';
import { getOrderTotal } from '../../api/order';
import { roleConfig } from '../../constants/enums/collaborator-enum';
import payCollaboratorStatusOPtions from '../../constants/payCollaboratorStatusOptions';

import userIcon from '../../assets/icons/team.png';
import chartIcon from '../../assets/icons/box.png';
import boxIcon from '../../assets/icons/coins.png';
import timeIcon from '../../assets/icons/time.png';

const Dashboard = () => {
  const { collapsed } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [payCollaborators, setPayCollaborator] = useState([]);

  // STAT CARD REPORT
  const [studentQty, setStudentQty] = useState(0);
  const [orderQty, setOrderQty] = useState(0);

  const [userData, setUserData] = useState({});
  const [payment, setPayment] = useState([]);
  const [total, setTotal] = useState(0);
  const [countUnpaid, setCountUnpaid] = useState(0);
  const [notpayment, setNotPayment] = useState([]);

  useEffect(() => {
    loadTotalPayment();
    countNotPayment();
    const data = sessionStorage.getItem('user');

    setTimeout(() => {
      if (data) {
        setUserData(JSON.parse(data));
      }
      setLoading(false);
    }, 1000);
  }, [payCollaborators]);

  // Ghi nhớ các giá trị dựa trên userData
  const collaboratorInfo = useMemo(
    () => ({
      collaboratorCode: userData.collaboratorCode,
      name: userData.name,
      role: roleConfig[userData.role?.roleName?.toUpperCase()]?.label,
      referrerName: userData.referrer ? userData.referrer.name : 'Không có',
      provinceName: userData.province?.provinceName,
      bankCode: userData.bank?.bankCode || 'Không có',
      identityNumber: userData.identityNumber,
      salary: userData.salary,
      email: userData.email,
      phone: userData.phone || 'Không có',
      dayOfBirth: userData.dayOfBith ? new Date(userData.dayOfBith).toISOString().split('T')[0] : 'Không có',
      address: userData.address || 'Không có',
    }),
    [userData],
  );
  useEffect(() => {
    getDataStudent();
    getDataOrder();
    getDataPayCollaborator();
  }, []);

  const getDataStudent = async () => {
    const response = await getStudentTotal();
    setStudentQty(response.data.total);
  };

  const getDataOrder = async () => {
    const response = await getOrderTotal();
    setOrderQty(response.data.total);
  };

  const getDataTurnover = async () => {
    const response = await getCollaboratorTotal();
    setColla(response.data);
  };

  const getDataPending = async () => {
    const response = await getCollaboratorTotal();
    setPayment(response.data);
  };

  const getDataPayCollaborator = async () => {
    setLoading(true);

    const userCurrent = JSON.parse(sessionStorage.getItem('user'));
    const response = await getpayHistoryIsUser({
      page: 1,
      limit: 20,
      collaboratorCode: userCurrent.collaboratorCode,
    });

    if (response.data && Array.isArray(response.data.payHistories)) {
      if (response.status === 'success') {
        let temp = []; // Khởi tạo mảng trống để chứa các phần tử có status = 'paid'
        let notPaid = []; // Mảng tạm thời lưu các phần tử có status != 'paid'
        response.data.payHistories.forEach((history) => {
          if (history.status === 'paid') {
            temp.push(history); // Thêm phần tử vào mảng temp nếu status = 'paid'
          } else {
            notPaid.push(history); // Thêm phần tử vào mảng notPaid nếu status != 'paid'
          }
        });

        setPayCollaborator(temp); // Cập nhật lại payCollaborator
        setNotPayment(notPaid); // Cập nhật lại notpayment
        setLoading(false);
      }
    } else {
      setPayCollaborator([]); // Nếu không có dữ liệu, gán mảng rỗng
      setNotPayment([]); // Gán mảng notpayment rỗng nếu không có dữ liệu
    }
  };

  const countNotPayment = () => {
    let Count = 0;
    notpayment.forEach((payment) => {
      Count++; // Tăng giá trị Count lên 1 cho mỗi phần tử trong mảng notpayment
    });
    return setCountUnpaid(Count);
  };

  const loadTotalPayment = () => {
    const totalPayment = payCollaborators.reduce((sum, item) => {
      const statusOption = payCollaboratorStatusOPtions.find((opt) => opt.value === item.status);
      if (statusOption && statusOption.value === 'paid') {
        return sum + (item.commission || 0);
      }

      return sum;
    }, 0);

    setTotal(totalPayment);
  };

  const thumbNailChartIcon = {
    USER: {
      src: userIcon,
    },
    CHART: {
      src: chartIcon,
    },
    BOX: {
      src: boxIcon,
    },
    TIME: {
      src: timeIcon,
    },
  };

  const statBoxData = [
    {
      title: studentQty,
      subtitle: 'Số Lượng Học Viên',
      progress: '0.75',
      increase: '+14%',
      icon: thumbNailChartIcon.USER.src,
      stock: <ShowChartIcon />,
    },
    {
      title: orderQty,
      subtitle: 'Tổng Đơn Hàng',
      progress: '0.50',
      increase: '+21%',
      icon: thumbNailChartIcon.CHART.src,
      stock: <ShowChartIcon />,
    },
    {
      title: total || 'Không có',
      subtitle: 'Doanh Thu',
      progress: '0.30',
      increase: '+5%',
      icon: thumbNailChartIcon.BOX.src,
      stock: <TrendingDownIcon />,
    },
    {
      title: countUnpaid || 'Không có',
      subtitle: 'Chờ Xử Lý',
      progress: '0.80',
      increase: '+43%',
      icon: thumbNailChartIcon.TIME.src,
      stock: <ShowChartIcon />,
    },
  ];

  const columns = [
    {
      title: 'Mã hoa hồng'.toUpperCase(),
      dataIndex: 'payHistoryCode',
      key: 'payHistoryCode',
      width: collapsed ? 260 : 220,
      render: (text) => <span style={{ fontWeight: 500, color: theme.gray[400] }}>{text}</span>,
    },
    {
      title: 'Thụ hưởng ( % )'.toUpperCase(),
      dataIndex: 'percent',
      key: 'percent',
      width: collapsed ? 260 : 220,
      render: (percent) => <i>{percent ? percent + '%' : 'Không có'}</i>,
    },
    {
      title: 'Nội Dung'.toUpperCase(),
      dataIndex: 'payHistoryName',
      key: 'payHistoryName',
      width: collapsed ? 260 : 220,
      render: (payHistoryName) => {
        // Tìm trạng thái trong payCollaboratorStatusOPtions
        // Hiển thị giá trị tìm được hoặc 'Không có'
        return <i>{payHistoryName ? payHistoryName : 'Không có'}</i>;
      },
    },
    {
      title: 'Hoa hồng'.toUpperCase(),
      dataIndex: 'commission',
      key: 'commission',
      width: collapsed ? 260 : 220,
      render: (commission) => <span>{formattedAmountByNumeric(commission) + ' đ'}</span>,
    },
    {
      title: 'Ngày tạo'.toUpperCase(),
      dataIndex: 'createDate',
      key: 'createDate',
      width: collapsed ? 260 : 220,
      render: (createDate) => <span>{createDate ? format(new Date(createDate), 'dd-MM-yyyy') : 'Chưa xác định'}</span>,
    },
    {
      title: 'Ngày cập nhật'.toUpperCase(),
      dataIndex: 'updateDate',
      key: 'updateDate',
      width: collapsed ? 260 : 220,
      render: (updateDate) => <span>{updateDate ? format(new Date(updateDate), 'dd-MM-yyyy') : 'Chưa xác định'}</span>,
    },
  ];

  return (
    <Box m="20px">
      <Box p="0px 0px 20px 0px">
        <Header title="Trang Chủ" />
      </Box>
      <BoxCard>
        <Grid container spacing={3}>
          {/* Stat Boxes */}
          {statBoxData.map((stat, index) => (
            <Grid item={true} xs={12} sm={6} md={6} lg={3} key={index}>
              <Box
                backgroundColor="#f5f7fa"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="20px"
                height="140px"
              >
                <StatBox
                  title={<CountUp start={0} end={stat.title} duration={2} separator="," />}
                  subtitle={stat.subtitle}
                  progress={stat.progress}
                  increase={stat.increase}
                  src={stat.icon}
                  stock={stat.stock}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </BoxCard>

      <BoxCard>
        <ProfileCard />
      </BoxCard>

      <BoxCard>
        <Box p="0px 0px 20px 0px">
          <Header title="Hoa hồng" />
        </Box>
        <DataTable
          pagination={false}
          isScroll={false}
          columns={columns}
          rows={payCollaborators}
          loading={loading}
          showExpand={false}
        />
      </BoxCard>
    </Box>
  );
};

export default Dashboard;
