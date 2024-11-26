import React, { useEffect, useState } from 'react';
import { Box, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import Header from '../../components/Header';
import theme from '../../utils/theme';
import userDefault from '../../assets/userDefault.png';
import genderOptions from '../../constants/genderOptions.js';
import { format } from 'date-fns';
import InfoItem from '../Dashboard/ProfileCard/InforItem';
import {
  AccountBox,
  CakeOutlined,
  CheckCircleOutline,
  CreditCardOutlined,
  Edit,
  EmailOutlined,
  ErrorOutline,
  HourglassEmpty,
  Info,
  LocationOn,
  Male,
  ManageAccounts,
  Map,
  MonetizationOnOutlined,
  PhoneAndroidOutlined,
  RollerShadesOutlined,
  ShowChart,
} from '@mui/icons-material';
import StatBox from '../../components/StatBox';
import { useNavigate, useParams } from 'react-router-dom';
import { getCollaboratorByCode } from '../../api/collaborator';
import { Avatar } from 'antd';
import { getpayHistoryIsUser } from '../../api/payHistory.js';
import { formattedAmountByNumeric, transformMoneyToNumeric } from '../../helper/moneyConvert.js';
import { statusConfig } from '../../constants/enums/collaborator-enum.js';

const CollaboratorDetail = () => {
  const [collaborator, setCollaborator] = useState(null);
  const [payCollaborators, setPayCollaborator] = useState([]);
  const [studentQty, setStudentQty] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const handleGetDatabyId = async () => {
      if (id) {
        try {
          const response = await getCollaboratorByCode(id);
          if (response.status === 'success') {
            setCollaborator(response.data);
          }
        } catch (error) {
          console.error('Error fetching collaborator data:', error.message);
          navigate('/collaborator');
        }
      }
    };

    handleGetDatabyId();
    getDataPayCollaborator();
  }, [id, navigate]);

  const getDataPayCollaborator = async () => {
    const response = await getpayHistoryIsUser({
      page: 1,
      limit: 20,
      collaboratorCode: id,
    });

    if (response.data && Array.isArray(response.data.payHistories)) {
      if (response.status === 'success') {
        setPayCollaborator(response.data.payHistories);
      }
    } else {
      setPayCollaborator([]);
    }
  };

  const calculateCommissionTotal = (payCollaborators) => {
    if (!payCollaborators || payCollaborators.length === 0) {
      return 0;
    }
    return payCollaborators.reduce((sum, payCollaborator) => {
      return sum + (payCollaborator.commission || 0);
    }, 0);
  };

  const thumbNailChartIcon = {
    USER: {
      src: '../src/assets/icons/team.png',
    },
    CHART: {
      src: '../src/assets/icons/coins.png',
    },
    BOX: {
      src: '../src/assets/icons/box.svg',
    },
    TIME: {
      src: '../src/assets/icons/time.svg',
    },
  };

  let commissionTotal = calculateCommissionTotal(payCollaborators);

  const statBoxData = [
    {
      title: '10',
      subtitle: 'Số Học Viên',
      progress: '0.75',
      increase: '+10%',
      icon: thumbNailChartIcon.USER.src,
      stock: <ShowChart />,
    },
    {
      title: formattedAmountByNumeric(commissionTotal) + ' đ',
      subtitle: 'Tổng hoa hồng',
      progress: '0.30',
      increase: '+5%',
      icon: thumbNailChartIcon.CHART.src,
      stock: <ShowChart />,
    },
  ];

  const getGenderLabel = (gender) => {
    const genderOption = genderOptions.find((option) => option.value === gender);
    return genderOption ? genderOption.label : 'Chưa có';
  };

  return (
    <Box
      m="20px"
      sx={{
        backgroundColor: theme.white[100],
        borderRadius: '15px',
        height: 'auto',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" p="15px 10px">
        <Box>
          <Header title="Thông Tin Công Tác Viên" />
        </Box>

        <IconButton
          sx={{
            color: theme.primary[500],
          }}
          onClick={async () => {
            if (collaborator?.collaboratorCode) {
              navigate(`/edit-collaborator/${collaborator.collaboratorCode}`);
            }
          }}
        >
          <Edit />
        </IconButton>
      </Box>

      <Divider />

      <Box p="10px" sx={{ flexGrow: 1 }}>
        <Grid
          item={true}
          container
          spacing={2}
          columns={24}
          sx={{ flexDirection: { xs: 'column', sm: 'colunm', md: 'row' } }}
        >
          {/* COT THU 1 */}
          <Grid item={true} xs={24} sm={24} lg={7}>
            <Box p="20px 20px">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  width: { xs: '150px', sm: '200px' },
                  height: { xs: '150px', sm: '200px' },
                  margin: '0 auto',
                  overflow: 'hidden',
                  background: theme.gradient.blueGreen,
                  padding: '5px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    display: 'flex',
                    padding: '5px',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Avatar size={180} src={collaborator?.imgUrl}>
                    <span style={{ fontSize: '50px' }}>
                      {!collaborator?.imgUrl && collaborator?.name?.charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                </Box>
              </Box>

              <Box pb="10px">
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    m: '20px 10px',
                    textAlign: 'center',
                  }}
                >
                  {collaborator ? collaborator.name : 'Chưa có'}
                </Typography>
              </Box>

              <Box margin="10px 0px">
                <InfoItem
                  icon={AccountBox}
                  label="Mã CTV: "
                  value={collaborator ? collaborator.collaboratorCode : 'Chưa có'}
                />
                <InfoItem
                  icon={ManageAccounts}
                  label="Quản Lý: "
                  value={collaborator ? collaborator.referrer?.name : 'Chưa có'}
                />
                <InfoItem
                  icon={RollerShadesOutlined}
                  label="Cấp bậc: "
                  value={collaborator ? collaborator.role?.roleName : 'Chưa có'}
                />
                <InfoItem
                  icon={
                    collaborator
                      ? collaborator.status === 'active'
                        ? CheckCircleOutline
                        : collaborator.status === 'inactive'
                          ? ErrorOutline
                          : HourglassEmpty
                      : Info
                  }
                  label="Trạng Thái: "
                  value={collaborator ? statusConfig[collaborator?.status.toUpperCase()]?.label : 'Chưa có'}
                />
              </Box>
            </Box>
          </Grid>

          {/* COT THU 2 */}
          <Grid item={true} xs={24} sm={24} lg={9}>
            <Box p="20px">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  backgroundColor: theme.primary[500],
                  color: '#fff',
                  marginBottom: '30px',
                  padding: '5px 15px',
                  borderRadius: '6px',
                  width: '100%',
                  margin: '0 auto 30px',
                }}
              >
                Thông tin
              </Typography>
              <InfoItem
                icon={CakeOutlined}
                label="Ngày Sinh: "
                value={collaborator?.dayOfBith ? format(new Date(collaborator.dayOfBith), 'dd-MM-yyyy') : ''}
              />
              <InfoItem
                icon={CreditCardOutlined}
                label="CCCD/CMND: "
                value={collaborator ? collaborator.identityNumber : 'Chưa có'}
              />
              <InfoItem
                icon={MonetizationOnOutlined}
                label="Ngân Hàng: "
                value={collaborator ? collaborator.bankAccountNumber : 'Chưa có'}
              />
              <InfoItem icon={Male} label="Giới tính: " value={getGenderLabel(collaborator && collaborator.gender)} />

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  backgroundColor: theme.green[200],
                  color: '#fff',
                  marginBottom: '30px',
                  padding: '5px 15px',
                  borderRadius: '6px',
                  width: '100%',
                  margin: '0 auto 30px',
                }}
              >
                Thông Tin Liên Lạc
              </Typography>
              <InfoItem
                icon={PhoneAndroidOutlined}
                label="Điện Thoại: "
                value={collaborator ? collaborator.phone : 'Chưa có'}
              />
              <InfoItem icon={EmailOutlined} label="Email: " value={collaborator ? collaborator.email : 'Chưa có'} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  backgroundColor: theme.orange[100],
                  color: '#fff',
                  marginBottom: '30px',
                  padding: '5px 15px',
                  borderRadius: '6px',
                  width: '100%',
                  margin: '0 auto 30px',
                }}
              >
                Địa chỉ
              </Typography>

              <InfoItem icon={LocationOn} label="Địa chỉ: " value={collaborator ? collaborator.address : 'Chưa có'} />
              <InfoItem icon={Map} label="Tỉnh Thành: " value={collaborator?.province?.provinceName || 'NA'} />
            </Box>
          </Grid>

          {/* COT THU 3 */}
          <Grid container item={true} xs={24} sm={24} md={6} lg={4} direction={{ xs: 'row', lg: 'column', sm: 'row' }}>
            {statBoxData.map((stat, index) => (
              <Grid item={true} p="10px" xs={12} lg={2} key={index}>
                <Box
                  backgroundColor={theme.black[50]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="20px"
                  height="140px"
                >
                  <StatBox
                    title={stat.title}
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
        </Grid>
      </Box>
    </Box>
  );
};

export default CollaboratorDetail;
