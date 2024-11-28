import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Grid, Link, Paper, Typography } from '@mui/material';
import bgLogin from '../../../assets/bgLogin.jpg';
import vgLogo from '../../../assets/vietgroupNobackgroud.png';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { getCollaboratorByCode, loginCollaborator } from '../../../api/collaborator.js';
import Account from '../../../models/account.js';
import { AccountSchema } from './constrains/constrainAccount.js';
import CustomTextField from '../../../components/CustomTextField.jsx';
import CustomPasswordField from '../../../components/CustomPasswordField .jsx';
import theme from '../../../utils/theme.js';
import {
  TYPE_ADMINISTRATOR,
  TYPE_COLLABORATOR,
  TYPE_MANAGER,
  TYPE_SYSADMIN,
} from '../../../constants/roleDecentralization.js';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'by © '}
      <Link color="inherit" href="/">
        Viet Group Net
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await loginCollaborator({
        collaboratorCode: values.collaboratorCode,
        password: values.password,
      });

      if (response.status === 'success') {
        sessionStorage.setItem('accessToken', response.data.accessToken);

        const userResponse = await getCollaboratorByCode(values.collaboratorCode);
        sessionStorage.setItem('user', JSON.stringify(userResponse.data));

        //Set case role
        const user = JSON.parse(sessionStorage.getItem('user'));
        switch (user?.role?.roleName.toUpperCase()) {
          case TYPE_SYSADMIN.role:
            sessionStorage.setItem('role', TYPE_SYSADMIN.role);
            break;
          case TYPE_ADMINISTRATOR.role:
            sessionStorage.setItem('role', TYPE_ADMINISTRATOR.role);
            break;
          case TYPE_COLLABORATOR.role:
            sessionStorage.setItem('role', TYPE_COLLABORATOR.role);
            break;
          case TYPE_MANAGER.role:
            sessionStorage.setItem('role', TYPE_MANAGER.role);
            break;
          default:
            navigate('/login');
            break;
        }

        setAlertMessage('Đăng nhập thành công!');
        setAlertSeverity('success');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setAlertMessage(response.message);
        setAlertSeverity('error');
      }
    } catch (error) {
      setTimeout(() => {
        setAlertMessage(error);
        setAlertSeverity('error');
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <Grid container component="main" style={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={false}
        md={6}
        style={{
          backgroundImage: `url(${bgLogin})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{
          backgroundColor: theme.white[100],
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '30px 32px',
          }}
        >
          <img src={vgLogo} alt="" width="80px" style={{ objectFit: 'cover' }} />
        </Box>

        <Box
          sx={{
            margin: '0 auto',
            width: { xs: '90%', sm: '60%' },
            height: 'auto',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: 3,
            backgroundColor: '#F6FCFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              Đăng Nhập
            </Typography>

            {/* Alert for messages */}
            {alertMessage && (
              <Alert severity={alertSeverity} sx={{ m: '20px', width: '90%' }}>
                {alertMessage}
              </Alert>
            )}

            <Formik initialValues={Account} validationSchema={AccountSchema} onSubmit={handleSubmit}>
              {({ values, errors, touched, handleBlur, handleChange }) => (
                <Form style={{ width: '90%', marginTop: '8px' }} noValidate>
                  <Box sx={{ marginBottom: '30px' }}>
                    <CustomTextField
                      label="Tài khoản"
                      name="collaboratorCode"
                      value={values.collaboratorCode}
                      autoFocus
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.collaboratorCode && errors.collaboratorCode}
                      helperText={touched.collaboratorCode && errors.collaboratorCode}
                    />
                  </Box>

                  <Box>
                    <CustomPasswordField
                      label="Mật Khẩu"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password}
                      helperText={touched.password && errors.password}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Link href="#" variant="body2">
                      Quên mật khẩu?
                    </Link>
                  </Box>

                  {/* <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Ghi nhớ đăng nhập"
                  /> */}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{
                      fontWeight: 'bold',
                      margin: '24px 0 16px',
                      position: 'relative',
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Đăng Nhập'}
                  </Button>
                  <Box mt={5}>
                    <Copyright />
                  </Box>
                </Form>
              )}
            </Formik>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
