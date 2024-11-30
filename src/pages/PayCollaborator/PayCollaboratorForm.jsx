import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createpayHistory, getPayHistoryByCode, updatepayHistory } from '../../api/payHistory';
import Message from '../../components/Message';
import { Formik } from 'formik';
import PayHistoryInitialValues from '../../models/payHistory';
import BoxCard from '../../components/Card';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Header from '../../components/Header';
import { payCollaboratorSchema } from './constraint/constrainPayCollaborator';
import CustomTextField from '../../components/CustomTextField';
import CustomTextFieldMoneyNumber from '../../components/CustomTextFieldMoneyNumber';
import theme from '../../utils/theme';
import payCollaboratorStatusOptions from '../../constants/payCollaboratorStatusOptions';
import { transformMoneyToNumeric } from '../../helper';
import { formattedAmountByNumeric } from '../../helper/moneyConvert';
import { getAllCollaboratorOptions } from '../../constants/collaboratorOptions';
import { roleConfig } from '../../constants/enums/collaborator-enum';
import { getCollaboratorByCode } from '../../api/collaborator';
import { CheckCircleOutline, RestoreOutlined, SaveOutlined } from '@mui/icons-material';
import { Modal, Tag } from 'antd';
import typography from '../../utils/typography';

const PayCollaboratorForm = () => {
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [severity, setSeverity] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isEdit = location.pathname.includes('edit-pay-collaborator');

  const [payCollaborator, setPayCollaborator] = useState(null);

  const [page, setPage] = useState(1);
  const isFetching = useRef(false);
  const [collaborators, setCollaborators] = useState([]);
  const allCollaborator = useRef([]);
  const [valueRefferrer, setValueRefferer] = useState(null);
  const [isDisableBlockForm, setIsDisableBlockForm] = useState(false);

  const [isDisableEnter, setIsDisableEnter] = useState(false);
  const [loadingIsManager, setLoadingIsManager] = useState(false);
  const [visibleFormIsManager, setVisibleFormIsManager] = useState(false);
  const [reffererIsManager, setReffererIsManager] = useState({
    collaboratorCode: '',
    payHistoryName: '',
    percent: '',
    commission: '',
    status: '',
  });

  const [loadingIsAdmin, setLoadingIsAdmin] = useState(false);
  const [visibleFormIsAdmin, setVisibleFormIsAdmin] = useState(false);
  const [reffererIsAdmin, setReffererIsAdmin] = useState({
    collaboratorCode: '',
    payHistoryName: '',
    percent: '',
    commission: '',
    status: '',
  });

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    updatePayCollaboratorFormParamId();
    fetchCollaborator();
  }, []);

  const updatePayCollaboratorFormParamId = async () => {
    if (id) {
      try {
        const response = await getPayHistoryByCode(id);
        if (response.status === 'success') {
          setPayCollaborator(response.data);
        }
      } catch (error) {
        Modal.info({
          title: 'Hoa hồng không tồn tại',
          okText: 'Đồng ý',
          okType: 'danger',
          onOk() {
            navigate('/pay-collaborator');
          },
        });
      }
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);

    if (values.commission) {
      const getAmmount = values.commission;
      const transferAmmount = transformMoneyToNumeric(getAmmount);
      values.commission = transferAmmount;
    }

    const promises = [];

    try {
      // Request 1
      promises.push(createpayHistory(values));

      // Request 2 (nếu có)
      if (reffererIsManager?.collaboratorCode) {
        const amountFormat = transformMoneyToNumeric(reffererIsManager?.commission);

        const updatedManager = {
          ...reffererIsManager,
          commission: amountFormat,
          status:
            values.status === 'paid' ? payCollaboratorStatusOptions[0]?.value : payCollaboratorStatusOptions[1]?.value,
        };
        promises.push(createpayHistory(updatedManager));
      }

      // Request 3 (nếu có)
      if (reffererIsAdmin?.collaboratorCode) {
        const amountFormat = transformMoneyToNumeric(reffererIsAdmin?.commission);

        const updatedAdmin = {
          ...reffererIsAdmin,
          commission: amountFormat,
          status:
            values.status === 'paid' ? payCollaboratorStatusOptions[0]?.value : payCollaboratorStatusOptions[1]?.value,
        };
        promises.push(createpayHistory(updatedAdmin));
      }

      // Thực hiện tất cả request song song
      const responses = await Promise.all(promises);

      const isSuccess = responses.every((res) => res.status === 'success');

      if (isSuccess) {
        setSeverity('success');
        setIsShowMessage(true);
        setContent('Thêm dữ liệu thành công');
        setTimeout(() => {
          resetForm();
          navigate('/pay-collaborator');
        }, 1000);
      }
    } catch (error) {
      console.error('Lỗi khi thêm hoa hồng:', error);
      setIsShowMessage(true);
      setSeverity('error');
      setContent(error);
      setLoading(false);

      //Trả về định dạng số tiền nếu lỗi giao dịch
      if (values.commission) {
        const getAmmount = values.commission;
        values.commission = formattedAmountByNumeric(getAmmount);
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

  const handleSearchRefferer = async (collaboratorCode) => {
    //Tìm đến refferer đầu tiên
    if (collaboratorCode) {
      const response = await getCollaboratorByCode(collaboratorCode);
      const referrerData = response.data;
      setReffererIsManager({
        ...reffererIsManager,
        collaboratorCode: referrerData.referrer?.collaboratorCode,
        name: referrerData.referrer?.name,
        payHistoryName: `Nhận tiền hoa hồng từ ${referrerData.name}`,
      });

      //Tìm đến refferer cuối cùng
      if (referrerData.referrer) {
        const referrerResponse = await getCollaboratorByCode(referrerData.referrer?.collaboratorCode);
        const referrerDataNext = referrerResponse.data;
        setReffererIsAdmin({
          ...reffererIsAdmin,
          collaboratorCode: referrerDataNext.referrer.collaboratorCode,
          name: referrerDataNext.referrer?.name,
          payHistoryName: `Nhận tiền hoa hồng từ ${referrerDataNext.name}`,
        });
      }
    }
  };

  const percentAmountPay = (commission, percentValue) => {
    // Tính toán số tiền từ phần trăm hoa hồng
    if (commission) {
      const ammountNumber = transformMoneyToNumeric(commission);
      const calcuAmount = (percentValue / 100) * ammountNumber;
      return formattedAmountByNumeric(calcuAmount);
    }
    return 0;
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
        initialValues={PayHistoryInitialValues}
        validationSchema={payCollaboratorSchema}
      >
        {({ values, setValues, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, resetForm }) => {
          useEffect(() => {
            if (payCollaborator) {
              // Map collaborator khi được tham chiếu từ danh sách
              setValues({
                name: payCollaborator.name || '',
                amountPaid: formattedAmountByNumeric(payCollaborator.amountPaid) || '',
                diligence: payCollaborator.diligence || '',
                attitude: payCollaborator.attitude || '',
              });
              setFieldValue('payHistoryId', payCollaborator.payHistoryId);
            }
            setFieldValue('percent', 100);
          }, [payCollaborator, setValues]);

          return (
            <form onSubmit={handleSubmit}>
              <BoxCard>
                <Box mb="20px">
                  <Header title={isEdit ? 'Cập nhật thông tin' : 'Thêm hoa hồng'} />
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    margin: 'auto',
                  }}
                >
                  <Grid container spacing={3} columns={16}>
                    <Grid item xs={16} sm={16} md={5}>
                      <Autocomplete
                        disabled={isDisableEnter}
                        options={collaborators} // Chỉ render danh sách trong state
                        getOptionLabel={(option) => option.name || ''}
                        value={valueRefferrer}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValueRefferer(newValue);
                            setFieldValue('collaboratorCode', newValue.collaboratorCode);
                            handleSearchRefferer(newValue.collaboratorCode);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Chọn cán bộ nhân viên" variant="outlined" />
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
                        readOnly={isDisableBlockForm}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={3}>
                      <CustomTextFieldMoneyNumber
                        label="Phần trăm hoa hồng ( % )"
                        name="percent"
                        endAdornmentTitle={'%'}
                        multiline
                        value={values.percent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.percent && errors.percent}
                        helperText={touched.percent && errors.percent}
                        onInput={(e) => {
                          if (e.target.value > 3) {
                            e.target.value = e.target.value.slice(0, 3);
                          }
                        }}
                        disabled={true}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={5}>
                      <CustomTextFieldMoneyNumber
                        label="Số tiền"
                        name="commission"
                        endAdornmentTitle={'.00 VNĐ'}
                        multiline
                        value={values.commission}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.commission && errors.commission}
                        helperText={touched.commission && errors.commission}
                        disabled={isDisableBlockForm}
                      />
                    </Grid>

                    <Grid item xs={16} sm={16} md={3}>
                      <FormLabel component="legend">Trạng thái</FormLabel>
                      <RadioGroup row name="status" value={values.status} onChange={handleChange} onBlur={handleBlur}>
                        {payCollaboratorStatusOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                            disabled={isDisableBlockForm}
                          />
                        ))}
                      </RadioGroup>
                      {touched.status && errors.status && (
                        <Typography color="error" variant="caption">
                          {errors.status}
                        </Typography>
                      )}
                    </Grid>

                    {/* ========================TAB NGUOI GIOI THIEU 1================================== */}

                    {visibleFormIsManager && values.commission && reffererIsManager.collaboratorCode && (
                      <>
                        <Grid item xs={16}>
                          {' '}
                          <Divider />
                        </Grid>

                        <Grid item xs={16} sm={16} md={3}>
                          <CustomTextField
                            label="Mã người giới thiệu"
                            disabled={true}
                            value={reffererIsManager.collaboratorCode || ''}
                            onChange={(e) =>
                              setReffererIsManager((prevState) => ({
                                ...prevState,
                                collaboratorCode: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={16} sm={16} md={5}>
                          <CustomTextField
                            label="Tên người giới thiệu"
                            disabled={true}
                            value={reffererIsManager.name}
                            onChange={(e) =>
                              setReffererIsManager((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={16} sm={16} md={3}>
                          <CustomTextFieldMoneyNumber
                            label="Phần trăm hoa hồng ( % )"
                            endAdornmentTitle={'%'}
                            value={reffererIsManager.percent || 0}
                            onChange={(e) => {
                              const percentValue = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));

                              setReffererIsManager((prevState) => ({
                                ...prevState,
                                percent: percentValue,
                              }));

                              // Tính toán số tiền từ phần trăm hoa hồng
                              setReffererIsManager((prevState) => ({
                                ...prevState,
                                commission: percentAmountPay(values.commission, percentValue) || null,
                              }));
                            }}
                            onBlur={handleBlur}
                            onInput={(e) => {
                              if (e.target.value.length > 3) {
                                e.target.value = e.target.value.slice(0, 3);
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={16} sm={16} md={5}>
                          <CustomTextFieldMoneyNumber
                            label="Số tiền"
                            disabled={true}
                            endAdornmentTitle={'.00 VNĐ'}
                            multiline
                            value={reffererIsManager?.commission || 0}
                            onChange={(e) => setReffererIsManager({ commission: e.target.value })}
                          />
                        </Grid>
                      </>
                    )}

                    {/* ========================TAB NGUOI GIOI THIEU 2================================== */}

                    {visibleFormIsAdmin && values.commission && reffererIsAdmin.collaboratorCode && (
                      <>
                        <Grid item xs={16}>
                          {' '}
                          <Divider />
                        </Grid>

                        <Grid item xs={16} sm={16} md={3}>
                          <CustomTextField
                            label="Mã người giới thiệu"
                            disabled={true}
                            value={reffererIsAdmin.collaboratorCode || ''}
                            onChange={(e) =>
                              setReffererIsAdmin((prevState) => ({
                                ...prevState,
                                collaboratorCode: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={16} sm={16} md={5}>
                          <CustomTextField
                            label="Tên người giới thiệu"
                            disabled={true}
                            value={reffererIsAdmin.name || ''}
                            onChange={(e) =>
                              setReffererIsAdmin((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={16} sm={16} md={3}>
                          <CustomTextFieldMoneyNumber
                            label="Phần trăm hoa hồng ( % )"
                            endAdornmentTitle={'%'}
                            value={reffererIsAdmin.percent || 0}
                            onChange={(e) => {
                              const percentValue = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));

                              setReffererIsAdmin((prevState) => ({
                                ...prevState,
                                percent: percentValue,
                              }));

                              // Tính toán số tiền từ phần trăm hoa hồng
                              setReffererIsAdmin((prevState) => ({
                                ...prevState,
                                commission: percentAmountPay(values.commission, percentValue) || null,
                              }));
                            }}
                            onBlur={handleBlur}
                            onInput={(e) => {
                              if (e.target.value.length > 3) {
                                e.target.value = e.target.value.slice(0, 3);
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={16} sm={16} md={5}>
                          <CustomTextFieldMoneyNumber
                            label="Số tiền"
                            disabled={true}
                            endAdornmentTitle={'.00 VNĐ'}
                            multiline
                            value={reffererIsAdmin?.commission || 0}
                            onChange={(e) => setReffererIsAdmin({ commission: e.target.value })}
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={16}>
                      <CustomTextField
                        label="Nội dung trả tiền"
                        name="payHistoryName"
                        placeholder="Nội dung..."
                        value={values.payHistoryName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.payHistoryName && errors.payHistoryName}
                        helperText={touched.payHistoryName && errors.payHistoryName}
                      />
                    </Grid>

                    <Grid item xs={16} display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        startIcon={!loadingIsManager && <CheckCircleOutline />}
                        sx={{
                          backgroundColor: theme.primary[500],
                        }}
                        disabled={loadingIsManager || visibleFormIsAdmin || visibleFormIsManager}
                        onClick={() => {
                          setLoadingIsManager(true);
                          setTimeout(() => {
                            if (valueRefferrer && values.percent && values.commission) {
                              //Manager
                              setIsDisableBlockForm(true);
                              setVisibleFormIsManager(true);

                              //Admin
                              setVisibleFormIsAdmin(true);
                            } else {
                              Modal.error({
                                title: 'Thông báo',
                                content: <span>Vui lòng xác nhận đây đủ thông tin</span>,
                                onOk() {},
                              });
                              setVisibleFormIsManager(false);
                              setVisibleFormIsAdmin(false);
                              setIsDisableBlockForm(false);
                            }
                            setLoadingIsManager(false);
                          }, 1500);
                        }}
                      >
                        {loadingIsManager ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          <>
                            <Typography
                              fontSize={typography.fontSize.sizeM}
                              sx={{ textTransform: 'none', fontSize: { xs: 14, md: 'inherit' } }}
                            >
                              Xác nhận
                            </Typography>
                          </>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </BoxCard>

              <Grid item xs={16} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<RestoreOutlined />}
                  disabled={loading || !isDisableBlockForm}
                  onClick={() => {
                    //reset
                    setValueRefferer(null);
                    values = {};
                    setReffererIsManager({}); // Manager value
                    setReffererIsAdmin({}); // Admin value

                    setIsDisableBlockForm(false);
                    setVisibleFormIsManager(false);
                    setVisibleFormIsAdmin(false);
                  }}
                >
                  <Typography fontSize={typography.fontSize.sizeM} sx={{ textTransform: 'none' }}>
                    Hoàn tác
                  </Typography>
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  type="submit"
                  sx={{
                    backgroundColor: theme.primary[500],
                  }}
                  disabled={loading || !isDisableBlockForm}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : isEdit ? (
                    <Typography fontSize={typography.fontSize.sizeM} sx={{ textTransform: 'none' }}>
                      'Cập nhật'
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

export default PayCollaboratorForm;
