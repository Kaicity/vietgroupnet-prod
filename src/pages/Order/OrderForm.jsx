import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import theme from '../../utils/theme';
import CustomTextField from '../../components/CustomTextField.jsx';
import BasicDatePicker from '../../components/CanlenderDate.jsx';
import OrderInitialValues from '../../models/order.js';
import { Delete } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { OrderSchema } from './constraint/constraintOrder.js';
import { getAllStudentOption } from '../../constants/studentCodeOption.js';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, createStudentOrder, deleteStudentOrder, getOrderByCode, updateOrder } from '../../api/order.js';
import Message from '../../components/Message.jsx';
import { Modal } from 'antd';
import { format } from 'date-fns';
import maritalStatusOptions from '../../constants/maritalStatusOptions.js';
import physicalStrengthOptions from '../../constants/physicalStrengthOptions.js';
import dominantHandOptions from '../../constants/dominantHandOptions.js';
import experienceOptions from '../../constants/experienceOptions.js';
import educationLevels from '../../constants/educationLevels.js';
import interviewFormatOptions from '../../constants/interviewFormatOptions.js';
import interviewStatusOptions from '../../constants/interviewStatusOptions.js';
import typography from '../../utils/typography.js';
import CustomTextQuill from '../../components/CustomTextQuill.jsx';

const OrderForm = () => {
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('');
  const [content, setContent] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderDetail, setorderDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadStudent, setloadStudent] = useState([]);
  const isEdit = location.pathname.includes('edit-order/');
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentCodes, setStudentCodes] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteStudent, setdeleteStudent] = useState([]);
  const isFetching = useRef(false); // Để tránh tải dữ liệu lặp khi cuộn nhanh
  const allStudents = useRef([]);

  const handleAddToStudent = async () => {
    if (selectedItem) {
      const studentExistsInStudentCodes = studentCodes.some((code) => code === selectedItem.studentCode);
      const studentExistsInLoadStudent = loadStudent.some(
        (student) => student.studentCode === selectedItem.studentCode,
      );

      if (!studentExistsInLoadStudent) {
        setStudentCodes((prevCodes) => [selectedItem.studentCode, ...prevCodes]);
        const updatedLoadStudent = [...loadStudent, selectedItem];
        setloadStudent(updatedLoadStudent);
      } else if (studentExistsInStudentCodes) {
        setIsShowMessage(true);
        setSeverity('error');
        setContent('Mã sinh viên đã tồn tại trong :');
      } else if (studentExistsInLoadStudent) {
        setIsShowMessage(true);
        setSeverity('error');
        setContent('Mã sinh viên đã tồn tại trong :');
      }
    } else {
      console.error('Chưa chọn sinh viên');
    }
  };

  const handleRemoveFromStudent = async (itemToRemove) => {
    const studentCode = itemToRemove.studentCode;
    setdeleteStudent((prevCodes) => [itemToRemove.studentCode, ...prevCodes]);
    try {
      const updatedLoadStudent = loadStudent.filter((item) => item.studentCode !== studentCode);
      setloadStudent(updatedLoadStudent);
    } catch (error) {
      console.error('Error occurred while removing item:', error);
    }
  };

  const fetchStudents = async (page) => {
    try {
      if (isFetching.current) return;
      isFetching.current = true;

      const response = await getAllStudentOption(page);
      allStudents.current = [...allStudents.current, ...response];

      setStudents([...allStudents.current]);
      isFetching.current = false;
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleScroll = (event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;

    if (bottom && !isFetching.current) {
      const nextPage = page + 1;
      setPage(nextPage); // Chỉ cập nhật số trang
      fetchStudents(nextPage); // Tải dữ liệu tiếp theo
    }
  };

  useEffect(() => {
    const updateOrderParamId = async () => {
      if (id) {
        try {
          const response = await getOrderByCode(id);
          const students = response.data.students;
          setloadStudent(students);
          if (response.status === 'success') {
            setorderDetail(response.data);
          }
        } catch (error) {
          Modal.info({
            title: 'Cộng tác viên không tồn tại',
            okText: 'Đồng ý',
            okType: 'danger',
            onOk() {
              navigate('/student');
            },
          });
        }
      }
    };

    updateOrderParamId();
    fetchStudents();
  }, []);
  // hanhle submid
  const handleFormSubmit = async (values, { resetForm }) => {
    console.log('Submitted values:', values); // Kiểm tra giá trị
    try {
      let response;

      if (isEdit) {
        response = await updateOrder(values.orderCode, values);
      } else {
        response = await createOrder(values);
      }
      if (studentCodes && studentCodes.length > 0) {
        try {
          const createStudentReponse = await Promise.all(
            studentCodes.map((code) => createStudentOrder(orderDetail.order.orderCode, code)),
          );
        } catch (error) {
          console.error('Error creating orders:', error);
        }
      }

      if (deleteStudent) {
        const deleteStudentReponse = await Promise.all(
          deleteStudent.map((code) => deleteStudentOrder(orderDetail.order.orderCode, code)),
        );
      }

      if (response.status === 'success') {
        setSeverity('success');
        setIsShowMessage(true);
        setContent(isEdit ? 'Cập nhật dữ liệu thành công' : 'Thêm dữ liệu thành công');

        setTimeout(() => {
          resetForm();
          navigate('/order');
        }, 1000);
      }
    } catch (error) {
      console.error(isEdit ? 'Lỗi khi cập nhật:' : 'Lỗi khi thêm:', error);
      setIsShowMessage(true);
      setSeverity('error');
      setContent(error.message || error.toString());
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m={{ xs: '10px', sm: '5px', md: '10px', lg: '15px', xl: '16px' }}>
      <Message
        isShowMessage={isShowMessage}
        severity={severity}
        content={content}
        handleCloseSnackbar={() => setIsShowMessage(false)}
      />
      <Formik onSubmit={handleFormSubmit} initialValues={OrderInitialValues} validationSchema={OrderSchema}>
        {({ values, errors, touched, setValues, handleBlur, handleChange, handleSubmit, setFieldValue, isValid }) => {
          useEffect(() => {
            if (orderDetail?.order) {
              // Kiểm tra nếu `orderDetail` và `orderDetail.order` không null/undefined
              // Format ngày tháng năm từ db
              const formattedDate = orderDetail.order?.departureDate
                ? format(new Date(orderDetail.order.departureDate), 'yyyy-MM-dd')
                : '';

              const formattedInterDate = orderDetail.order?.interviewDate
                ? format(new Date(orderDetail.order.interviewDate), 'yyyy-MM-dd')
                : '';

              setValues({
                orderName: orderDetail.order?.orderName || '',
                quanlity: orderDetail.order?.quanlity || '',
                interviewDate: formattedInterDate || '',
                unionName: orderDetail.order?.unionName || '',
                companyName: orderDetail.order?.companyName || '',
                companyAddress: orderDetail.order?.companyAddress || '',
                male: orderDetail.order?.male || '',
                female: orderDetail.order?.female || '',
                minAge: orderDetail.order?.minAge || '',
                maxAge: orderDetail.order?.maxAge || '',
                salary: orderDetail.order?.salary || '',
                interviewStatus: orderDetail.order?.interviewStatus || '',
                eduRequirements: orderDetail.order?.eduRequirements || '',
                departureDate: formattedDate || '',
                jobDescription: orderDetail.order?.jobDescription || '',
                experience: orderDetail.order?.experience || '',
                physicalStrength: orderDetail.order?.physicalStrength || '',
                dominantHand: orderDetail.order?.dominantHand || '',
                insurance: orderDetail.order?.insurance || '',
                vision: orderDetail.order?.vision || '',
                maritalStatus: orderDetail.order?.maritalStatus || '',
                notes: orderDetail.order?.notes || '',
                visaTypes: orderDetail.order?.visaTypes || '',
                interviewFormat: orderDetail.order?.interviewFormat || '',
              });

              setFieldValue('orderCode', orderDetail.order?.orderCode || '');
            }
          }, [orderDetail, setFieldValue]);

          return (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 2, sm: 2.5, md: 3 }} mx="0px">
                <Grid
                  container
                  sx={{
                    backgroundColor: theme.white[100],
                    borderRadius: { xs: '10px', sm: '12px', md: '15px' },
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: {
                      xs: '8px',
                      sm: '15px',
                      md: '20px',
                      lg: '25px',
                      xl: '22px',
                    },
                    width: {
                      xs: '100%',
                      md: '90%',
                      lg: '92%',
                      xl: '65%',
                    },
                    height: 'auto',
                    marginRight: '30px',
                    minHeight: '90vh',
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      color={theme.black[600]}
                      sx={{
                        fontSize: typography.fontSize.sizeL,
                        fontWeight: 700,
                        mb: { xs: 2, sm: 3 },
                      }}
                    >
                      Thêm Đơn Hàng
                    </Typography>
                  </Grid>

                  <Box
                    sx={{
                      width: '100%',
                      backgroundColor: theme.white[100],
                      borderRadius: { xs: '8px', sm: '10px' },
                      overflow: 'hidden',
                    }}
                  >
                    <Grid
                      container
                      sx={{
                        padding: {
                          xs: '5px',
                          sm: '5px',
                          md: '5px',
                          lg: '5px',
                        },
                        marginBottom: { xs: '15px', sm: '20px', lg: '40px' },
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                          mb: { xs: 2, md: 0 },
                          pr: { md: 2, lg: 3, xl: 4 },
                        }}
                      >
                        {/* information order*/}
                        <Typography
                          color={theme.primary[400]}
                          sx={{
                            fontSize: typography.fontSize.sizeL,
                            mb: { xs: 1, sm: 1.5, md: 2 },
                          }}
                        >
                          Thông Tin Đơn Hàng
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            fontSize: typography.fontSize.sizeL,
                            mb: { xs: 2, sm: 2.5 },
                          }}
                        >
                          Vui lòng nhập các thông tin chi tiết về đơn hàng. Đảm bảo rằng tất cả các trường đều được điền
                          đầy đủ để chúng tôi có thể xử lý đơn hàng của bạn một cách nhanh chóng để mang lại trải nghiệm
                          tốt hơn. VietGroupEdu xin chân thành cảm ơn!
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ p: { xs: '5px', sm: '10px' } }}>
                          <Grid item xs={12} sm={6} md={12}>
                            <CustomTextField
                              label="Tên đơn hàng"
                              name="orderName"
                              placeholder="Ví dụ: Konichiwa"
                              value={values.orderName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => {
                                if (e.target.value.length > 50) {
                                  e.target.value = e.target.value.slice(0, 50); // Cắt chuỗi nếu quá 50 ký tự
                                }
                              }}
                              fullWidth
                              error={touched.orderName && Boolean(errors.orderName)}
                              helperText={touched.orderName && errors.orderName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={12}>
                            <CustomTextField
                              label="Loại Visa"
                              name="visaTypes"
                              placeholder="Ví dụ:  thực tập sinh"
                              value={values.visaTypes}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => {
                                if (e.target.value.length > 50) {
                                  e.target.value = e.target.value.slice(0, 50); // Cắt chuỗi nếu quá 50 ký tự
                                }
                              }}
                              fullWidth
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: {
                                    xs: '10px',
                                    sm: '12px',
                                    md: '14px',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <BasicDatePicker
                              label="Ngày Phỏng Vấn"
                              name="interviewDate"
                              onChange={(newValue) => {
                                setFieldValue('interviewDate', newValue);
                              }}
                              value={values.interviewDate}
                              error={touched.interviewDate && Boolean(errors.interviewDate)}
                              helperText={touched.interviewDate && errors.interviewDate}
                              fullWidth
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: {
                                    xs: '10px',
                                    sm: '12px',
                                    md: '14px',
                                  },
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider
                      sx={{
                        width: '100%',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '1px',
                      }}
                    />{' '}
                    {/* Union Information Section */}
                    <Grid
                      container
                      sx={{
                        padding: {
                          xs: '5px',
                          sm: '5px',
                          md: '5px',
                          lg: '5px',
                        },
                        mt: '30px',
                      }}
                    >
                      <Grid item xs={12} md={6} marginTop={'10px'}>
                        <Typography
                          color={theme.primary[400]}
                          sx={{
                            fontSize: typography.fontSize.sizeL,
                            mb: { xs: 2, sm: 3 },
                            mr: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                          }}
                        >
                          Nghiệp Đoàn Yêu Cầu Ứng tuyển
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: typography.fontSize.sizeL,
                            mb: { xs: 2, sm: 2.5 },
                            mr: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                          }}
                        >
                          Vui lòng cho biết Những Thông Tin của Nghiệp Đoàn Nước ngoài ứng viên để chúng tôi có thể phân
                          loại và xử lý thông tin đơn hàng một cách chính xác hơn.
                        </Typography>
                      </Grid>
                      <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <CustomTextField
                                label="Nghiệp Đoàn"
                                name="unionName"
                                placeholder="Kumia"
                                value={values.unionName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onInput={(e) => {
                                  if (e.target.value.length > 50) {
                                    e.target.value = e.target.value.slice(0, 50); // Cắt chuỗi nếu quá 50 ký tự
                                  }
                                }}
                                error={touched.unionName && Boolean(errors.unionName)}
                                helperText={touched.unionName && errors.unionName}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <CustomTextField
                                label="Tên Công Ty"
                                name="companyName"
                                placeholder="Kumia"
                                value={values.companyName}
                                onChange={handleChange}
                                onInput={(e) => {
                                  if (e.target.value.length > 50) {
                                    e.target.value = e.target.value.slice(0, 50); // Cắt chuỗi nếu quá 50 ký tự
                                  }
                                }}
                                onBlur={handleBlur}
                                error={touched.companyName && errors.companyName}
                                helperText={touched.companyName && errors.companyName}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={12} mb={'50px'}>
                          <CustomTextField
                            label="Địa Chỉ Nghiệp Đoàn"
                            name="companyAddress"
                            placeholder="33 bùi quang là"
                            value={values.companyAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onInput={(e) => {
                              if (e.target.value.length > 150) {
                                e.target.value = e.target.value.slice(0, 150); // Cắt chuỗi nếu quá 50 ký tự
                              }
                            }}
                            error={touched.companyAddress && errors.companyAddress}
                            helperText={touched.companyAddress && errors.companyAddress}
                            fullWidth
                            multiline
                            rows={3}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider
                      sx={{
                        width: '100%',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '1px',
                      }}
                    />{' '}
                    {/* Job Information Section */}
                    <Grid
                      container
                      sx={{
                        padding: {
                          xs: '5px',
                          sm: '5px',
                          md: '5px',
                          lg: '5px',
                        },
                      }}
                    >
                      <Grid item xs={12} md={6} mt={'30px'}>
                        <Typography
                          fontWeight={'0.9rem'}
                          color={theme.primary[400]}
                          sx={{
                            fontSize: typography.fontSize.sizeL,

                            mb: { xs: 1, sm: 1.5, md: 2 },
                          }}
                        >
                          {' '}
                          Thông Tin Nghành Nghề
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          marginBottom={5}
                          sx={{
                            fontSize: typography.fontSize.sizeL,
                            mb: { xs: 2, sm: 2.5 },
                            mr: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                          }}
                        >
                          Vui lòng cho biết Những yêu cầu của ứng viên để chúng tôi có thể phân loại và xử lý thông tin
                          đơn hàng một cách chính xác hơn.
                        </Typography>
                      </Grid>
                      <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <CustomTextField
                                label="Số lượng nam"
                                name="male"
                                type="number"
                                placeholder="Ví dụ: 3"
                                value={values.male}
                                onChange={handleChange}
                                onInput={(e) => {
                                  if (e.target.value > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                  }
                                }}
                                onBlur={handleBlur}
                                error={touched.male && Boolean(errors.male)}
                                helperText={touched.male && errors.male}
                                fullWidth
                                multiline
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <CustomTextField
                                label="Số lượng nữ"
                                name="female"
                                placeholder="2"
                                type="number"
                                value={values.female}
                                onChange={handleChange}
                                onInput={(e) => {
                                  if (e.target.value > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                  }
                                }}
                                onBlur={handleBlur}
                                error={touched.female && Boolean(errors.female)}
                                helperText={touched.female && errors.female}
                                fullWidth
                                multiline
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <CustomTextField
                                label="Trên 18"
                                name="minAge"
                                placeholder="Ví dụ: 18"
                                type="number" // Add this to restrict input to numbers
                                value={values.minAge}
                                onChange={handleChange}
                                onInput={(e) => {
                                  if (e.target.value.length > 2) {
                                    e.target.value = e.target.value.slice(0, 2); // Limit input to 2 digits
                                  }
                                }}
                                onBlur={handleBlur}
                                fullWidth
                                error={touched.minAge && Boolean(errors.minAge)}
                                helperText={touched.minAge && errors.minAge}
                                multiline={false} // Set to false because numbers usually don't require multiline
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <CustomTextField
                                label="Đến"
                                name="maxAge"
                                placeholder="25"
                                type="number"
                                value={values.maxAge}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onInput={(e) => {
                                  if (e.target.value > 2) {
                                    e.target.value = e.target.value.slice(0, 2);
                                  }
                                }}
                                fullWidth
                                error={touched.maxAge && Boolean(errors.maxAge)}
                                helperText={touched.maxAge && errors.maxAge}
                              />
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <CustomTextField
                                label="Mức Lương"
                                name="salary"
                                type="number"
                                placeholder="Ví dụ: 5 triệu"
                                value={values.salary}
                                onInput={(e) => {
                                  if (e.target.value > 12) {
                                    e.target.value = e.target.value.slice(0, 12);
                                  }
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.salary && Boolean(errors.salary)}
                                helperText={touched.salary && errors.salary}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                options={interviewStatusOptions || null}
                                getOptionLabel={(option) => option.label || ''}
                                value={
                                  values.interviewStatus
                                    ? interviewStatusOptions.find(
                                        (option) => option.value === values.interviewStatus,
                                      ) || null
                                    : null
                                }
                                onChange={(event, newValue) => {
                                  setFieldValue('interviewStatus', newValue ? newValue.value : '');
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    label="Tình Trạng"
                                    name="interviewStatus"
                                    sx={{ marginRight: 0 }}
                                    error={touched.interviewStatus && Boolean(errors.interviewStatus)}
                                    helperText={touched.interviewStatus && errors.interviewStatus}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                options={interviewFormatOptions || null}
                                getOptionLabel={(option) => option.label || ''}
                                value={
                                  values.interviewFormat
                                    ? interviewFormatOptions.find(
                                        (option) => option.value === values.interviewFormat,
                                      ) || null
                                    : null
                                }
                                onChange={(event, newValue) => {
                                  setFieldValue('interviewFormat', newValue ? newValue.value : '');
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    label="Hình Thức Phỏng Vấn"
                                    name="interviewFormat"
                                    sx={{ marginRight: 0 }}
                                    error={touched.interviewFormat && Boolean(errors.interviewFormat)}
                                    helperText={touched.interviewFormat && errors.interviewFormat}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Autocomplete
                                options={educationLevels || null}
                                getOptionLabel={(option) => option.label || ''}
                                value={
                                  values.eduRequirements
                                    ? educationLevels.find((option) => option.value === values.eduRequirements) || null
                                    : null
                                }
                                onChange={(event, newValue) => {
                                  setFieldValue('eduRequirements', newValue ? newValue.value : '');
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    label="Trình Độ"
                                    name="eduRequirements"
                                    sx={{ marginRight: 0 }}
                                    error={touched.eduRequirements && Boolean(errors.eduRequirements)}
                                    helperText={touched.eduRequirements && errors.eduRequirements}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <BasicDatePicker
                                label="Ngày Bay"
                                onChange={(newValue) => {
                                  setFieldValue('departureDate', newValue);
                                }}
                                value={values.departureDate}
                                error={touched.departureDate && Boolean(errors.departureDate)}
                                helperText={touched.departureDate && errors.departureDate}
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-input': {
                                    padding: {
                                      xs: '10px',
                                      sm: '12px',
                                      md: '14px',
                                    },
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} marginBottom={'50px'}>
                          <CustomTextField
                            label="Công Việc"
                            name="jobDescription"
                            placeholder="Ví dụ: React, Node.js"
                            value={values.jobDescription}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            onInput={(e) => {
                              if (e.target.value > 300) {
                                e.target.value = e.target.value.slice(0, 300);
                              }
                            }}
                            error={touched.jobDescription && Boolean(errors.jobDescription)}
                            helperText={touched.jobDescription && errors.jobDescription}
                            multiline
                            rows={3}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        sx={{
                          padding: {
                            xs: '5px',
                            sm: '5px',
                            md: '5px',
                            lg: '5px',
                          },
                        }}
                      >
                        <Divider
                          sx={{
                            width: '100%',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            borderWidth: '1px',
                          }}
                        />{' '}
                        <Grid item xs={12} md={6} mt="50px">
                          <Typography
                            color={theme.primary[400]}
                            sx={{
                              fontSize: typography.fontSize.sizeL,
                              mb: { xs: 2, sm: 3 },
                              mr: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                            }}
                          >
                            Thông Tin Khác
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: typography.fontSize.sizeL,
                              mb: { xs: 2, sm: 2.5 },
                              mr: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                            }}
                          >
                            Vui lòng cho biết Những Thông Tin cần thiết khác của học viên cần đáp ứng của Đơn Hàng để
                            chúng tôi có thể phân loại và xử lý thông tin đơn hàng một cách chính xác hơn
                          </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                          {/* Left Column */}
                          <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <CustomTextField
                                  label=" Yêu Cầu Thị Lực"
                                  name="vision"
                                  placeholder="Ví dụ:10/10"
                                  value={values.vision}
                                  onChange={handleChange}
                                  onInput={(e) => {
                                    // Lấy giá trị hiện tại từ input
                                    let value = e.target.value;

                                    // Nếu giá trị trống, không thay đổi gì
                                    if (value === '') {
                                      return;
                                    }

                                    // Nếu giá trị chỉ chứa một chữ số, tự động thêm "/10"
                                    if (/^\d$/.test(value)) {
                                      value += '/10';
                                    }

                                    // Nếu giá trị có nhiều ký tự, chỉ giữ lại chữ số đầu tiên và thêm "/10"
                                    else if (value.length > 2) {
                                      value = value.slice(0, 1) + '/10'; // Giới hạn chỉ cho phép 1 chữ số và "/10"
                                    }

                                    // Cập nhật giá trị của input
                                    e.target.value = value;
                                  }}
                                  onBlur={handleBlur}
                                  error={touched.vision && Boolean(errors.vision)}
                                  helperText={touched.vision && errors.vision}
                                  fullWidth
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Autocomplete
                                  options={physicalStrengthOptions || null}
                                  getOptionLabel={(option) => option.label || ''}
                                  value={
                                    values.physicalStrength
                                      ? physicalStrengthOptions.find(
                                          (option) => option.value === values.physicalStrength,
                                        ) || null
                                      : null
                                  }
                                  onChange={(event, newValue) => {
                                    setFieldValue('physicalStrength', newValue ? newValue.value : '');
                                  }}
                                  renderInput={(params) => (
                                    <CustomTextField
                                      {...params}
                                      label="Thể Lực"
                                      name="physicalStrength"
                                      sx={{ marginRight: 0 }}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Autocomplete
                                  options={dominantHandOptions || null}
                                  getOptionLabel={(option) => option.label || ''}
                                  value={
                                    values.dominantHand
                                      ? dominantHandOptions.find((option) => option.value === values.dominantHand) ||
                                        null
                                      : null
                                  }
                                  onChange={(event, newValue) => {
                                    setFieldValue('dominantHand', newValue ? newValue.value : '');
                                  }}
                                  renderInput={(params) => (
                                    <CustomTextField
                                      {...params}
                                      label="Tay Thuận"
                                      name="dominantHand"
                                      sx={{ marginRight: 0 }}
                                      error={touched.dominantHand && Boolean(errors.dominantHand)}
                                      helperText={touched.dominantHand && errors.dominantHand}
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          {/* Right Column */}
                          <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <CustomTextField
                                  label="Bảo Hiểm Xã Hội"
                                  name="insurance"
                                  placeholder=" bảo hiểm gì"
                                  value={values.insurance}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  fullWidth
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Autocomplete
                                  options={experienceOptions || null}
                                  getOptionLabel={(option) => option.label || ''}
                                  value={
                                    values.experience
                                      ? experienceOptions.find((option) => option.value === values.experience) || null
                                      : null
                                  }
                                  onChange={(event, newValue) => {
                                    setFieldValue('experience', newValue ? newValue.value : '');
                                  }}
                                  renderInput={(params) => (
                                    <CustomTextField
                                      {...params}
                                      label="Đã có kinh nghiệm hay chưa"
                                      name="experience"
                                      sx={{ marginRight: 0 }}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Autocomplete
                                  options={maritalStatusOptions || null}
                                  getOptionLabel={(option) => option.label || ''}
                                  value={
                                    values.maritalStatus
                                      ? maritalStatusOptions.find((option) => option.value === values.maritalStatus) ||
                                        null
                                      : null
                                  }
                                  onChange={(event, newValue) => {
                                    setFieldValue('maritalStatus', newValue ? newValue.value : '');
                                  }}
                                  renderInput={(params) => (
                                    <CustomTextField
                                      {...params}
                                      label="Hình Thức"
                                      name="maritalStatus"
                                      sx={{ marginRight: 0 }}
                                      error={touched.maritalStatus && Boolean(errors.maritalStatus)}
                                      helperText={touched.maritalStatus && errors.maritalStatus}
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={12} mb={'50px'}>
                            <CustomTextQuill
                              readOnly={false}
                              toolbarVisible={true}
                              label={'Các phụ cấp và phương tiện'}
                              value={values.notes}
                              onChange={(content) => setFieldValue('notes', content)}
                              charLimit={1500} // Giới hạn ký tự
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Box
                  sx={{
                    width: {
                      xs: '96%',
                      md: '25vw',
                      lg: '22vw',
                      xl: '22vw',
                    },
                    marginTop: { xs: '20px', md: '10' },
                    margin: { xs: '12px', sm: '17px' },
                    position: { md: 'sticky' },
                    top: { md: '20px' },
                  }}
                >
                  {/*Student options*/}

                  <Grid
                    container
                    spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                    sx={{
                      backgroundColor: theme.white[100],
                      position: 'relative',
                      top: '5px',
                      borderRadius: { xs: '8px', sm: '10px' },
                      padding: {
                        xs: '12px',
                        sm: '15px',
                        md: '18px',
                        lg: '20px',
                      },
                    }}
                  >
                    {/* Item Selection */}
                    <Grid item xs={12}>
                      <Autocomplete
                        options={students}
                        getOptionLabel={(option) => option.name || ''}
                        onChange={(event, newValue) => {
                          setSelectedItem(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Chọn Học Viên" variant="outlined" />}
                        renderOption={(props, option) => (
                          <li {...props} key={option.studentCode}>
                            {option.name}
                          </li>
                        )}
                        ListboxProps={{
                          onScroll: handleScroll,
                        }}
                      />
                    </Grid>

                    {/* Add to students Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={handleAddToStudent}
                        disabled={!selectedItem}
                        sx={{
                          height: {
                            xs: '36px',
                            sm: '38px',
                            md: '40px',
                            lg: '44px',
                          },
                          fontSize: {
                            xs: typography.fontSize.sizeL,
                            sm: typography.fontSize.sizeXL,
                            md: typography.fontSize.sizeM,
                          },
                          borderRadius: {
                            xs: '8px',
                            sm: '10px',
                          },
                          textTransform: 'none',
                        }}
                      >
                        Thêm học viên
                      </Button>
                    </Grid>

                    {/* student  Display */}
                    <Grid item xs={12} mt={'40px'}>
                      <Typography variant="h6">Học Viên</Typography>
                      <List>
                        {loadStudent.map((item, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography>{item.name}</Typography>

                            <IconButton onClick={() => handleRemoveFromStudent(item)} color="secondary">
                              <Delete />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                  {/*button*/}
                  <Grid
                    container
                    spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                    sx={{
                      backgroundColor: '#FFF',
                      padding: {
                        xs: '12px',
                        sm: '15px',
                        md: '18px',
                        lg: '20px',
                      },
                    }}
                  >
                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: { xs: '8px', sm: '10px' },

                          fontSize: {
                            xs: typography.fontSize.sizeL,
                            sm: typography.fontSize.sizeS,
                            md: typography.fontSize.sizeM,
                          },
                          height: {
                            xs: '36px',
                            sm: '38px',
                            md: '40px',
                            lg: '44px',
                          },
                          textTransform: 'none',

                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : isEdit ? (
                          'Cập nhật thông tin'
                        ) : (
                          'Lưu thông tin'
                        )}
                      </Button>
                    </Grid>

                    {/* Cancel Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{
                          height: {
                            xs: '36px',
                            sm: '38px',
                            md: '40px',
                            lg: '44px',
                          },
                          fontSize: {
                            xs: typography.fontSize.sizeL,
                            sm: typography.fontSize.sizeS,
                            md: typography.fontSize.sizeM,
                          },
                          borderRadius: {
                            xs: '8px',
                            sm: '10px',
                          },
                          textTransform: 'none',

                        }}
                        onClick={() => {
                          navigate('/order');
                        }}
                      >
                        Hủy
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default OrderForm;
