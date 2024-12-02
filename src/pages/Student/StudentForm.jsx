import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudentByCode, updateStudent } from '../../api/student';
import Message from '../../components/Message';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { Formik } from 'formik';
import StudentInitialValues from '../../models/student';
import { studentSchema } from './constraint/constraintStudent';
import Header from '../../components/Header';
import CustomTextField from '../../components/CustomTextField';
import BasicDatePicker from '../../components/CanlenderDate';
import theme from '../../utils/theme';
import { format } from 'date-fns';
import statusStudentOption from '../../constants/statusStudentOption.js';
import genderOptions from '../../constants/genderOptions.js';
import diligenceOption from '../../constants/diligenceOption.js';
import CustomTextFieldMoneyNumber from '../../components/CustomTextFieldMoneyNumber.jsx';
import { transformMoneyToNumeric } from '../../helper';
import { formattedAmountByNumeric } from '../../helper/moneyConvert.js';
import CustomTextQuill from '../../components/CustomTextQuill.jsx';
import BoxCard from '../../components/Card.jsx';
import typography from '../../utils/typography.js';
import { SaveOutlined } from '@mui/icons-material';

const { Dragger } = Upload;

const StudentForm = () => {
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isEdit = location.pathname.includes('edit-student');

  const [student, setStudent] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const updateStudentParamId = async () => {
      if (id) {
        try {
          const response = await getStudentByCode(id);
          if (response.status === 'success') {
            setStudent(response.data);
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

    updateStudentParamId();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);

    if (values.amountPaid) {
      const getAmmount = values.amountPaid;
      const transferAmmount = transformMoneyToNumeric(getAmmount);
      values.amountPaid = transferAmmount;
    }

    if (isEdit) {
      try {
        const response = await updateStudent(values.studentCode, values);

        if (response.status === 'success') {
          setSeverity('success');
          setIsShowMessage(true);
          setContent('Cập nhật dữ liệu thành công');

          setTimeout(() => {
            resetForm();
            navigate('/student');
          }, 1000);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật học viên:', error);
        setIsShowMessage(true);
        setSeverity('error');
        setContent(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await createStudent(values);

        if (response.status === 'success') {
          setSeverity('success');
          setIsShowMessage(true);
          setContent('Thêm dữ liệu thành công');
          setTimeout(() => {
            resetForm();
            navigate('/student');
          }, 1000);
        }
      } catch (error) {
        console.error('Lỗi khi thêm học viên:', error);
        setIsShowMessage(true);
        setSeverity('error');
        setContent(error);
        setLoading(false);

        //Trả về định dạng số tiền nếu lỗi giao dịch
        if (values.amountPaid) {
          const getAmmount = values.amountPaid;
          values.amountPaid = formattedAmountByNumeric(getAmmount);
        }
      }
    }
  };

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Box m="20px">
      <Message
        isShowMessage={isShowMessage}
        severity={severity}
        content={content}
        handleCloseSnackbar={() => setIsShowMessage(false)}
      />
      <Formik onSubmit={handleFormSubmit} initialValues={StudentInitialValues} validationSchema={studentSchema}>
        {({ values, setValues, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, resetForm }) => {
          useEffect(() => {
            if (student) {
              //Format ngày tháng năm từ db
              const formattedDateOfBirth = student.dayOfBirth ? format(new Date(student.dayOfBirth), 'yyyy-MM-dd') : '';

              // Map collaborator khi được tham chiếu từ danh sách
              setValues({
                name: student.name || '',
                gender: student.gender || '',
                identityNumber: student.identityNumber || '',
                studentStatus: student.studentStatus || '',
                amountPaid: formattedAmountByNumeric(student.amountPaid) || '',
                diligence: student.diligence || '',
                attitude: student.attitude || '',
                address: student.address || '',
                learningSituation: student.learningSituation || '',
                dayOfBirth: formattedDateOfBirth || '',
                collaboratorCode: student?.collaborator?.collaboratorCode,
                note: student.note || '',
                studentPhoneNumber: student.studentPhoneNumber || '',
                parentPhoneNumber: student.parentPhoneNumber || '',
              });
              setFieldValue('studentCode', student.studentCode);
            } else {
              const data = JSON.parse(sessionStorage.getItem('user'));
              setFieldValue('collaboratorCode', data.collaboratorCode);
            }
          }, [student, setValues]);

          return (
            <form onSubmit={handleSubmit}>
              <BoxCard>
                <Box mb="20px">
                  <Header title={isEdit ? 'Cập nhật thông tin' : 'Thêm học viên'} />
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    margin: 'auto',
                  }}
                >                 
                  <Grid container spacing={3} columns={16}>
                    {/* <Grid item xs={16}>
                      <Box width="100%" height="auto">
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                          <p className="ant-upload-hint">
                            Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty hoặc các tệp bị
                            cấm khác.
                          </p>
                        </Dragger>
                      </Box>
                    </Grid> */}

                    <Grid item xs={16} sm={16} md={7}>
                      <CustomTextField
                        label="Họ Và Tên"
                        name="name"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={5}>
                      <CustomTextField
                        label="Căn Cước Công Dân"
                        name="identityNumber"
                        placeholder="Ví dụ: 079300090123"
                        value={values.identityNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.identityNumber && errors.identityNumber}
                        helperText={touched.identityNumber && errors.identityNumber}
                        onInput={(e) => {
                          if (e.target.value > 12) {
                            e.target.value = e.target.value.slice(0, 12);
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={4}>
                      <FormLabel component="legend">Giới Tính</FormLabel>
                      <RadioGroup row name="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur}>
                        {genderOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                      {touched.gender && errors.gender && (
                        <Typography color="error" variant="caption">
                          {errors.gender}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={16} sm={16} md={7}>
                      <Autocomplete
                        options={statusStudentOption}
                        getOptionLabel={(option) => option.label}
                        value={statusStudentOption.find((option) => option.value === values.studentStatus) || null}
                        onChange={(event, newValue) => {
                          setFieldValue('studentStatus', newValue ? newValue.value : '');
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Tình trạng học viên" variant="outlined" />
                        )}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={5}>
                      <BasicDatePicker
                        onChange={(newValue) => {
                          setFieldValue('dayOfBirth', newValue);
                        }}
                        value={values.dayOfBirth}
                        error={touched.dayOfBirth && Boolean(errors.dayOfBirth)}
                        helperText={touched.dayOfBirth && errors.dayOfBirth}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={4}>
                      <Autocomplete
                        options={diligenceOption}
                        getOptionLabel={(option) => option.label}
                        value={diligenceOption.find((option) => option.value === values.diligence) || null}
                        onChange={(event, newValue) => {
                          setFieldValue('diligence', newValue ? newValue.value : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Chuyên cần" variant="outlined" />}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={7}>
                      <CustomTextField
                        label="Đánh giá thái độ"
                        name="attitude"
                        multiline
                        value={values.attitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.attitude && errors.attitude}
                        helperText={touched.attitude && errors.attitude}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={9}>
                      <CustomTextField
                        label="Ghi chú"
                        name="note"
                        multiline
                        value={values.note}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.note && errors.note}
                        helperText={touched.note && errors.note}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={7}>
                      <Grid container spacing={2}>
                        <Grid item xs={16} sm={6}>
                          <CustomTextField
                            label="Số điện thoại học viên"
                            placeholder="Ví dụ: 070333845812"
                            name="studentPhoneNumber"
                            multiline
                            value={values.studentPhoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onInput={(e) => {
                              if (e.target.value > 10) {
                                e.target.value = e.target.value.slice(0, 10);
                              }
                            }}
                            error={touched.studentPhoneNumber && errors.studentPhoneNumber}
                            helperText={touched.studentPhoneNumber && errors.studentPhoneNumber}
                          />
                        </Grid>

                        <Grid item xs={16} sm={6}>
                          <CustomTextField
                            label="Số điện thoại cha mẹ (người thân)"
                            placeholder="Ví dụ: 070333845812"
                            name="parentPhoneNumber"
                            multiline
                            value={values.parentPhoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onInput={(e) => {
                              if (e.target.value > 10) {
                                e.target.value = e.target.value.slice(0, 10);
                              }
                            }}
                            error={touched.parentPhoneNumber && errors.parentPhoneNumber}
                            helperText={touched.parentPhoneNumber && errors.parentPhoneNumber}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={16} sm={16} md={9}>
                      <CustomTextFieldMoneyNumber
                        label="Số tiền đã đóng"
                        endAdornmentTitle={'.00 VNĐ'}
                        name="amountPaid"
                        multiline
                        value={values.amountPaid}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.amountPaid && errors.amountPaid}
                        helperText={touched.amountPaid && errors.amountPaid}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={16}>
                      <CustomTextQuill
                        readOnly={false}
                        toolbarVisible={true}
                        label={'Tình trạng học tập'}
                        value={values.learningSituation}
                        onChange={(content) => setFieldValue('learningSituation', content)}
                        height="200px"
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={16}>
                      <CustomTextField
                        label="Địa Chỉ"
                        name="address"
                        multiline
                        rows={4}
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && errors.address}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </BoxCard>
              <Grid item xs={16} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  startIcon = {<SaveOutlined />}
                  sx={{
                    backgroundColor: theme.primary[500],
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : isEdit ? (
                    <Typography fontSize={typography.fontSize.sizeM} sx={{ textTransform: 'none' }}>
                      Cập nhật
                    </Typography>
                  ) : (
                    <Typography fontSize={typography.fontSize.sizeM} sx={{ textTransform: 'none' }}>
                      Lưu
                    </Typography>
                  )}
                </Button>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default StudentForm;
