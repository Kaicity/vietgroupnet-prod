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
import { Formik } from 'formik';
import theme from '../../utils/theme';
import ImageUpload from '../../components/ImageUpload.jsx';
import CustomTextField from '../../components/CustomTextField.jsx';
import Header from '../../components/Header';
import BasicDatePicker from '../../components/CanlenderDate.jsx';
import CustomPasswordField from '../../components/CustomPasswordField ';
import CollaboratorInitialValues from '../../models/collaborator.js';
import genderOptions from '../../constants/genderOptions.js';
import { useEffect, useRef, useState } from 'react';
import { getallProvinces } from '../../constants/provinceCodeOptions.js';
import { getAllBankOption } from '../../constants/bankOptions.js';
import { collaboratorSchemaEditing, collaboratorSchema } from './constraint/constraintCollaborator.js';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createCollaborator, getCollaboratorByCode, updateCollaborator } from '../../api/collaborator';
import Message from '../../components/Message';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { format } from 'date-fns';
import { Col, Modal, Row, Tag } from 'antd';
import { TYPE_ADMINISTRATOR, TYPE_MANAGER, TYPE_SYSADMIN } from '../../constants/roleDecentralization.js';
import BoxCard from '../../components/Card.jsx';
import { getAllCollaboratorOptions } from '../../constants/collaboratorOptions.js';
import typography from '../../utils/typography.js';
import { SaveOutlined } from '@mui/icons-material';
import { roleConfig } from '../../constants/enums/collaborator-enum.js';

const CollaboratorForm = () => {
  const [roleOptions, setRoleOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const isFetching = useRef(false);
  const [collaborators, setCollaborators] = useState([]);
  const allCollaborator = useRef([]);
  const [isDisableEnter, setIsDisableEnter] = useState(false);
  const [isVisibleRefferer, setIsVisibleRefferer] = useState(false);
  const [valueRefferrer, setValueRefferer] = useState(null);
  const [errorSelectRefferer, setErrorSelectRefferer] = useState('');

  const location = useLocation();
  const isEdit = location.pathname.includes('edit-collaborator');

  const [collaborator, setCollaborator] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');

    const fetchProvinces = async () => {
      const provinces = await getallProvinces();
      setProvinceOptions(provinces);
    };

    const fetchRoles = async () => {
      //Chức vụ đối với admin sẽ được fetch API ngược lại cấp dưới nó thì sẽ custom role
      switch (userRole) {
        case TYPE_SYSADMIN.role:
          const roleDataIsSysAdmin = [
            {
              label: 'SysAdmin',
              roleCode: '99',
              value: 'Sysadmin',
            },
            {
              label: 'Giám đốc chi nhánh',
              roleCode: '10',
              value: 'Administrator',
            },
            {
              label: 'Văn phòng đại diện',
              roleCode: '12',
              value: 'Manager',
            },
            {
              label: 'Cộng tác viên',
              roleCode: '11',
              value: 'Collaborator',
            },
          ];
          setRoleOptions(roleDataIsSysAdmin);
          break;
        case TYPE_ADMINISTRATOR.role:
          const roleDataIsAdmin = [
            {
              label: 'Văn phòng đại diện',
              roleCode: '12',
              value: 'Manager',
            },
            {
              label: 'Cộng tác viên',
              roleCode: '11',
              value: 'Collaborator',
            },
          ];
          setRoleOptions(roleDataIsAdmin);
          break;
        case TYPE_MANAGER.role:
          const roleDataIsManager = [
            {
              label: 'Cộng tác viên',
              roleCode: '11',
              value: 'Collaborator',
            },
          ];
          setRoleOptions(roleDataIsManager);
          break;

        default:
          break;
      }
    };

    const fetchBank = async () => {
      const banks = await getAllBankOption({ page: 1, limit: 48 });
      setBankOptions(banks);
    };

    const updateCollaboratorParamId = async () => {
      if (id) {
        try {
          const response = await getCollaboratorByCode(id);
          if (response.status === 'success') {
            setCollaborator(response.data);
          }
        } catch (error) {
          Modal.info({
            title: 'Cộng tác viên không tồn tại',
            okText: 'Đồng ý',
            okType: 'danger',
            onOk() {
              navigate('/collaborator');
            },
          });
        }
      }
    };

    updateCollaboratorParamId();
    fetchRoles();
    fetchProvinces();
    fetchBank();
    handleSetVisibleRefferer();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);

    if (isEdit) {
      try {
        if (TYPE_SYSADMIN.role === sessionStorage.getItem('role')) {
          // Set Người giới thiệu của levelrole
          if (valueRefferrer) {
            values.referrerCode = valueRefferrer.collaboratorCode;
          }
        }

        console.log(values);

        const response = await updateCollaborator(values.collaboratorCode, values);

        if (response.status === 'success') {
          setSeverity('success');
          setIsShowMessage(true);
          setContent('Cập nhật dữ liệu thành công');

          setTimeout(() => {
            resetForm();
            navigate('/collaborator');
          }, 1000);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật cộng tác viên:', error);
        setIsShowMessage(true);
        setSeverity('error');
        setContent(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        // Kiểm tra nếu có file ảnh cần tải lên
        if (values.imgUrl instanceof File) {
          // Tải ảnh lên Firebase
          const storageRef = ref(storage, `images/${values.imgUrl.name}`);
          const uploadTask = uploadBytesResumable(storageRef, values.imgUrl);

          // Đợi ảnh được tải lên
          const downloadURL = await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              null,
              (error) => reject(error),
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(resolve);
              },
            );
          });

          // Thêm URL ảnh filebase vào values
          values.imgUrl = downloadURL;
        }

        if (TYPE_SYSADMIN.role === sessionStorage.getItem('role')) {
          // Set Người giới thiệu của levelrole
          if (valueRefferrer) {
            values.referrerCode = valueRefferrer.collaboratorCode;
          }
        }

        const response = await createCollaborator(values);

        if (response.status === 'success') {
          setSeverity('success');
          setIsShowMessage(true);
          setContent('Thêm dữ liệu thành công');
          setTimeout(() => {
            resetForm();
            navigate('/collaborator');
          }, 1000);
        }
      } catch (error) {
        console.error('Lỗi khi thêm cộng tác viên:', error);
        setIsShowMessage(true);
        setSeverity('error');
        setContent(error);
        setLoading(false);
      }
    }
  };

  const fetchCollaborator = async (page) => {
    try {
      if (isFetching.current) return;
      isFetching.current = true;

      const response = await getAllCollaboratorOptions(page);
      // Tránh dữ liệu trùng lặp vào danh sách sử dụng phương pháp lọc trước khi đưa vào danh sách
      const uniqueCollaborators = response.filter(
        (newItem) => !allCollaborator.current.some((existingItem) => existingItem.id === newItem.id),
      );

      allCollaborator.current = [...allCollaborator.current, ...uniqueCollaborators];

      setCollaborators([...allCollaborator.current]);
      isFetching.current = false;
    } catch (error) {
      console.error('Error fetching collaborators');
    }
  };

  const handleScroll = (event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;

    if (bottom && !isFetching.current) {
      const nextPage = page + 1;
      setPage(nextPage); // Chỉ cập nhật số trang
      fetchCollaborator(nextPage); // Tải dữ liệu tiếp theo
    }
  };

  const handleSetVisibleRefferer = () => {
    if (TYPE_SYSADMIN.role === sessionStorage.getItem('role')) {
      setIsVisibleRefferer(true);
    } else {
      setIsVisibleRefferer(false);
    }
  };

  return (
    <Box m="20px">
      <Message
        isShowMessage={isShowMessage}
        severity={severity}
        content={content}
        handleCloseSnackbar={() => setIsShowMessage(false)}
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={CollaboratorInitialValues}
        validationSchema={isEdit ? collaboratorSchemaEditing : collaboratorSchema}
      >
        {({ values, setValues, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, resetForm }) => {
          useEffect(() => {
            if (collaborator) {
              //Format ngày tháng năm từ db
              const formattedDateOfBirth = collaborator.dayOfBith
                ? format(new Date(collaborator.dayOfBith), 'yyyy-MM-dd')
                : '';

              // Map collaborator khi được tham chiếu từ danh sách
              setValues({
                name: collaborator.name || '',
                gender: collaborator.gender || '',
                identityNumber: collaborator.identityNumber || '',
                bankCode: collaborator.bank ? collaborator.bank.bankCode : '',
                bankAccountNumber: collaborator.bankAccountNumber || '',
                phone: collaborator.phone || '',
                provinceCode: collaborator.province ? collaborator.province.provinceCode : '',
                email: collaborator.email || '',
                address: collaborator.address || '',
                roleCode: collaborator.role ? collaborator.role.roleCode : '',
                dayOfBith: formattedDateOfBirth || '',
                collaboratorCode: collaborator.collaboratorCode || '',
                imgUrl: collaborator.imgUrl || '',
              });
            } else {
              if (TYPE_SYSADMIN.role === sessionStorage.getItem('role')) return;
              else {
                const data = JSON.parse(sessionStorage.getItem('user'));
                setFieldValue('referrerCode', data.collaboratorCode);
              }
            }
          }, [collaborator, setValues]);

          return (
            <Box>
              <form onSubmit={handleSubmit}>
                <Row gutter={16} style={{ display: 'flex', alignItems: 'stretch' }}>
                  <Col xs={24} md={24} lg={10}>
                    <BoxCard>
                      <Box mb="20px">
                        <Header title={'Thông tin cán bộ nhân viên'} />
                      </Box>

                      <Box display="flex" flexDirection="column" alignItems="center" marginTop="20px">
                        <ImageUpload
                          onImageSelect={(file) => setFieldValue('imgUrl', file)}
                          defaultImage={values.imgUrl}
                          isEdit={isEdit}
                        />
                      </Box>

                      <Box
                        sx={{
                          width: '100%',
                          margin: 'auto',
                        }}
                      >
                        <Grid container spacing={3} columns={16}>
                          <Grid item xs={16} sm={16}>
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

                          <Grid item xs={16} sm={16} md={8}>
                            <CustomTextField
                              label="Số điện thoại"
                              name="phone"
                              placeholder="Ví dụ: 070333845812"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.phone && errors.phone}
                              helperText={touched.phone && errors.phone}
                              onInput={(e) => {
                                if (e.target.value > 10) {
                                  e.target.value = e.target.value.slice(0, 10);
                                }
                              }}
                            />
                          </Grid>

                          <Grid item xs={16} sm={16} md={8}>
                            <FormLabel component="legend">Giới Tính</FormLabel>
                            <RadioGroup
                              row
                              name="gender"
                              value={values.gender}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
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

                          <Grid item xs={16} sm={8} md={8}>
                            <BasicDatePicker
                              onChange={(newValue) => {
                                setFieldValue('dayOfBith', newValue);
                              }}
                              value={values.dayOfBith}
                              error={touched.dayOfBith && Boolean(errors.dayOfBith)}
                              helperText={touched.dayOfBith && errors.dayOfBith}
                            />
                          </Grid>

                          <Grid item xs={16} sm={8} md={8}>
                            <CustomPasswordField
                              label={isEdit ? 'Đổi mật khẩu' : 'Mật khẩu'}
                              name="password"
                              placeholder="Ví dụ: Nguyenvana221190@"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.password && errors.password}
                              helperText={touched.password && errors.password}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </BoxCard>
                  </Col>

                  <Col xs={24} md={24} lg={14}>
                    <BoxCard>
                      <Box mb="20px">
                        <Header title={'Chức vụ điều hành'} />
                      </Box>

                      <Box
                        sx={{
                          width: '100%',
                        }}
                      >
                        <Grid container spacing={3} columns={16}>
                          <Grid item xs={16} sm={16} md={8}>
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

                          <Grid item xs={16} sm={16} md={8}>
                            <CustomTextField
                              label="Email"
                              name="email"
                              placeholder="Ví dụ: nguyenvana@gmail.com"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.email && errors.email}
                              helperText={touched.email && errors.email}
                            />
                          </Grid>

                          <Grid item xs={16} sm={16} md={8}>
                            <Autocomplete
                              options={bankOptions || null}
                              getOptionLabel={(option) => option.label || ''}
                              value={
                                values.bankCode
                                  ? bankOptions.find((option) => option.value === values.bankCode) || null
                                  : null
                              }
                              onChange={(event, newValue) => {
                                setFieldValue('bankCode', newValue ? newValue.value : '');
                              }}
                              renderInput={(params) => (
                                <CustomTextField
                                  {...params}
                                  label="Ngân Hàng"
                                  name="bankCode"
                                  error={touched.bankCode && Boolean(errors.bankCode)}
                                  helperText={touched.bankCode && errors.bankCode}
                                  sx={{ marginRight: 0 }}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={16} sm={16} md={8}>
                            <CustomTextField
                              label="Số Tài Khoản"
                              name="bankAccountNumber"
                              placeholder="Ví dụ: 0032836289378"
                              value={values.bankAccountNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.bankAccountNumber && errors.bankAccountNumber}
                              helperText={touched.bankAccountNumber && errors.bankAccountNumber}
                              sx={{ marginLeft: 0 }}
                            />
                          </Grid>

                          <Grid item xs={16} sm={16} md={8}>
                            <Autocomplete
                              options={roleOptions}
                              getOptionLabel={(option) => option?.label || ''}
                              value={roleOptions.find((option) => option.roleCode === values.roleCode) || null}
                              disabled={isEdit} // Khóa cập nhật chức vụ, chỉ được phép cập nhật nâng quyền đối với sysadmin
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  setFieldValue('roleCode', newValue.roleCode);
                                  if (
                                    newValue.value.toUpperCase() === TYPE_ADMINISTRATOR.role &&
                                    sessionStorage.getItem('role') === TYPE_SYSADMIN.role
                                  ) {
                                    setIsDisableEnter(true);
                                  } else {
                                    setIsDisableEnter(false);
                                  }
                                  //Filter theo role mà người giới thiệu được lọc theo
                                  fetchCollaborator();
                                } else {
                                  setFieldValue('roleCode', '');
                                  setIsDisableEnter(false);
                                }
                              }}
                              renderInput={(params) => (
                                <CustomTextField
                                  {...params}
                                  label="Chức Vụ"
                                  name="roleCode"
                                  error={touched.roleCode && errors.roleCode}
                                  helperText={touched.roleCode && errors.roleCode}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={16} sm={16} md={8}>
                            <Autocomplete
                              options={provinceOptions}
                              getOptionLabel={(option) => option.label || ''}
                              value={provinceOptions.find((option) => option.value === values.provinceCode) || null}
                              onChange={(event, newValue) => {
                                setFieldValue('provinceCode', newValue ? newValue.value : '');
                              }}
                              renderInput={(params) => (
                                <CustomTextField
                                  {...params}
                                  label="Tỉnh"
                                  name="provinceCode"
                                  error={touched.provinceCode && Boolean(errors.provinceCode)}
                                  helperText={touched.provinceCode && errors.provinceCode}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={16}>
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
                          <Grid item xs={16}>
                            <div style={{ height: '42px' }}></div>
                          </Grid>
                        </Grid>
                      </Box>
                    </BoxCard>
                  </Col>

                  {isVisibleRefferer && (
                    <Col xs={24} md={24} lg={10}>
                      <BoxCard>
                        <Grid item xs={16} sm={16} md={8}>
                          <Autocomplete
                            disabled={isDisableEnter || isEdit}
                            options={collaborators} // Chỉ render danh sách trong state
                            getOptionLabel={(option) => option.name || ''}
                            value={isDisableEnter ? null : valueRefferrer}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                if (values.roleCode !== newValue.roleCode) {
                                  setValueRefferer(newValue);
                                  setErrorSelectRefferer('');
                                } else {
                                  setValueRefferer(null);
                                  setErrorSelectRefferer('Người giới thiệu không thể cùng cấp với chức vụ hiện tại');
                                }
                              } else {
                                setErrorSelectRefferer('Chọn người giới thiệu');
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Chọn người giới thiệu"
                                variant="outlined"
                                error={!!errorSelectRefferer}
                                helperText={errorSelectRefferer}
                              />
                            )}
                            renderOption={(props, option) => (
                              <li {...props} key={option.collaboratorCode}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      flex: 1,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {option.name}
                                  </Typography>

                                  <Tag color={roleConfig[option.roleName?.toUpperCase()]?.color}>
                                    {roleConfig[option.roleName?.toUpperCase()]?.label}
                                  </Tag>
                                </Box>
                              </li>
                            )}
                            ListboxProps={{
                              onScroll: handleScroll, // Gắn sự kiện cuộn
                            }}
                          />
                        </Grid>
                      </BoxCard>
                    </Col>
                  )}

                  <Col xs={24} md={24} lg={14}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        startIcon={<SaveOutlined />}
                        type="submit"
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
                    </Box>
                  </Col>
                </Row>
              </form>
            </Box>
          );
        }}
      </Formik>
    </Box>
  );
};

export default CollaboratorForm;
