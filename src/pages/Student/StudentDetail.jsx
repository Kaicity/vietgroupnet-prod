import React, { useEffect, useState } from 'react';
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material';
import Header from '../../components/Header';
import theme from '../../utils/theme';
import genderOptions from '../../constants/genderOptions.js';
import { format } from 'date-fns';
import InfoItem from '../Dashboard/ProfileCard/InforItem';
import {
  CakeOutlined,
  CreditCardOutlined,
  Edit,
  Male,
  ShowChart,
  TrendingDown,
  AttachMoneyOutlined,
  LabelOutlined,
  SettingsAccessibilityOutlined,
  FlipToFrontOutlined,
  LocationOnOutlined,
  Call,
  ThumbUpOffAltOutlined,
  MoodOutlined,
  CreditScoreOutlined,
  NoteOutlined,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentByCode } from '../../api/student.js';
import CustomTextField from '../../components/CustomTextField.jsx';
import { formattedAmountByNumeric } from '../../helper/moneyConvert.js';
import {
  diligenceConfig,
  studentStatusConfig,
} from '../../constants/enums/student-enum.js';
import CustomTextQuill from '../../components/CustomTextQuill.jsx';

const StudentDetail = () => {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const handleGetDatabyId = async () => {
      if (id) {
        try {
          const response = await getStudentByCode(id);
          if (response.status === 'success') {
            setStudent(response.data);
          }
        } catch (error) {
          console.error('Error fetching collaborator data:', error);
          navigate('/student');
        }
      }
    };
    handleGetDatabyId();
  }, [id, navigate]);

  const thumbNailChartIcon = {
    USER: {
      src: '../src/assets/icons/box.svg',
    },
    CHART: {
      src: '../src/assets/icons/chart.svg',
    },
    BOX: {
      src: '../src/assets/icons/box.svg',
    },
    TIME: {
      src: '../src/assets/icons/time.svg',
    },
  };
  const statBoxData = [
    {
      title: '12,361',
      subtitle: 'Số Học Viên',
      progress: '0.75',
      increase: '+14%',
      icon: thumbNailChartIcon.USER.src,
      stock: <ShowChart />,
    },
    {
      title: '41,225',
      subtitle: 'Tổng Đơn',
      progress: '0.50',
      increase: '+21%',
      icon: thumbNailChartIcon.BOX.src,
      stock: <ShowChart />,
    },
    {
      title: '32,441',
      subtitle: 'Số Tiền',
      progress: '0.30',
      increase: '+5%',
      icon: thumbNailChartIcon.CHART.src,
      stock: <TrendingDown />,
    },
    {
      title: '32,441',
      subtitle: 'Số Tiền',
      progress: '0.30',
      increase: '+5%',
      icon: thumbNailChartIcon.CHART.src,
      stock: <TrendingDown />,
    },
  ];

  const getGenderLabel = (gender) => {
    const genderOption = genderOptions.find(
      (option) => option.value === gender,
    );
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p="15px 10px"
      >
        <Box>
          <Header title="Thông Tin Học Viên" />
        </Box>

        <IconButton
          sx={{
            color: theme.primary[100],
          }}
          onClick={async () => {
            if (student?.studentCode) {
              navigate(`/edit-student/${student.studentCode}`);
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
              <Box pb="10px">
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  {student ? student.name : 'Chưa có'}
                </Typography>
              </Box>

              <Box p="10px 0px">
                <InfoItem
                  icon={LabelOutlined}
                  label="Mã học viên: "
                  value={student?.studentCode || 'Chưa có'}
                />
                <InfoItem
                  icon={SettingsAccessibilityOutlined}
                  label="Người giới thiệu: "
                  value={student?.collaborator?.name || 'Chưa có'}
                />
                <InfoItem
                  icon={FlipToFrontOutlined}
                  label="Tình trạng học viên: "
                  value={
                    studentStatusConfig[student?.studentStatus.toUpperCase()]
                      ?.label || 'Chưa có'
                  }
                />
                <InfoItem
                  icon={AttachMoneyOutlined}
                  label="Số tiền đã đóng: "
                  value={
                    formattedAmountByNumeric(student?.amountPaid) + ' đ' ||
                    'Chưa có'
                  }
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
                  backgroundColor: theme.primary[100],
                  color: '#fff',
                  marginBottom: '30px',
                  padding: '5px 15px',
                  borderRadius: '6px',
                  width: '100%',
                  margin: '0 auto 30px',
                }}
              >
                Thông tin chung
              </Typography>
              <InfoItem
                icon={CakeOutlined}
                label="Ngày Sinh: "
                value={
                  student?.dayOfBirth
                    ? format(new Date(student?.dayOfBirth), 'dd-MM-yyyy')
                    : ''
                }
              />
              <InfoItem
                icon={Male}
                label="Giới tính: "
                value={getGenderLabel(student?.gender)}
              />
              <InfoItem
                icon={CreditCardOutlined}
                label="CCCD/CMND: "
                value={student?.identityNumber || 'Chưa có'}
              />
              <InfoItem
                icon={LocationOnOutlined}
                label="Địa chỉ: "
                value={student?.address || 'Chưa có'}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  backgroundColor: theme.green[300],
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
                icon={Call}
                label="Số điện thoại học viên: "
                value={student?.studentPhoneNumber || 'Chưa có'}
              />
              <InfoItem
                icon={Call}
                label="Số điện thoại cha mẹ:"
                value={student?.parentPhoneNumber || 'Chưa có'}
              />
            </Box>
          </Grid>

          {/* COT THU 3 */}
          <Grid
            container
            item={true}
            xs={24}
            sm={24}
            md={16}
            lg={4}
            direction={{ xs: 'column', lg: 'column', sm: 'row' }}
          >
            <Box p="20px" width="100%">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  backgroundColor: theme.orange[300],
                  color: '#fff',
                  marginBottom: '30px',
                  padding: '5px 15px',
                  borderRadius: '6px',
                  width: '100%',
                  margin: '0 auto 30px',
                }}
              >
                Đánh giá học viên
              </Typography>

              <InfoItem
                icon={ThumbUpOffAltOutlined}
                label="Chuyên cần: "
                value={
                  diligenceConfig[student?.diligence.toUpperCase()]?.label ||
                  'Chưa có'
                }
              />
              <InfoItem
                icon={MoodOutlined}
                label="Thái độ: "
                value={student?.attitude || 'NA'}
              />
              <Box mb={2}>
                <InfoItem
                  icon={CreditScoreOutlined}
                  label="Tình hình học tập: "
                />
                {/* <CustomTextField
                  name="address"
                  multiline
                  rows={3}
                  value={student?.learningSituation || 'Chưa có'}
                  disable={true}
                /> */}
                <CustomTextQuill
                  readOnly={true}
                  toolbarVisible={false}
                  value={student?.learningSituation || 'Chưa có'}
                />
              </Box>
              <Box>
                <InfoItem icon={NoteOutlined} label="Ghi chú: " />
                <CustomTextQuill
                  readOnly={true}
                  toolbarVisible={false}
                  value={student?.note || 'Chưa có'}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StudentDetail;
