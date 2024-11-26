import Topbar from './pages/global/Topbar';
import SidebarTab from './pages/global/SidebarTab';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login/Login.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppProvider from './context/AppProvider.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Layout from './pages/global/Layout.jsx';
import Collaborator from './pages/Collaborator/Collaborator.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import Student from './pages/Student/Student.jsx';
import StudentForm from './pages/Student/StudentForm.jsx';
import StudentDetail from './pages/Student/StudentDetail.jsx';
import Order from './pages/Order/Order.jsx';
import CollaboratorForm from './pages/Collaborator/CollaboratorForm.jsx';
import CollaboratorDetail from './pages/Collaborator/CollaboratorDetail.jsx';
import Footer from './components/Footer.jsx';
import OrderForm from './pages/Order/OrderForm.jsx';
import PayCollaborator from './pages/PayCollaborator/PayCollaborator.jsx';

import { Analytics } from '@vercel/analytics/react';

import {
  TYPE_ADMINISTRATOR,
  TYPE_COLLABORATOR,
  TYPE_MANAGER,
  TYPE_SYSADMIN,
} from './constants/roleDecentralization.js';
import Blog from './pages/Blog/Blog.jsx';
import PayCollaboratorForm from './pages/PayCollaborator/PayCollaboratorForm.jsx';
import OrderDetail from './pages/Order/OrderDetail.jsx';

const theme = createTheme({
  typography: {
    fontFamily: 'Nunito Sans, Arial, sans-serif', // Font mặc định
  },
});

const PrivateRoute = ({ children, allowRoles }) => {
  const token = sessionStorage.getItem('accessToken');
  const userRole = sessionStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  //Check cac role khong duoc truy cap den trang
  if (allowRoles && !allowRoles.includes(userRole)) {
    return <Navigate to="unauthorized" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="*"
                element={
                  <>
                    <SidebarTab />
                    <main className="content">
                      <Topbar />
                      <Layout>
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <PrivateRoute
                                allowRoles={[
                                  TYPE_SYSADMIN.role,
                                  TYPE_ADMINISTRATOR.role,
                                  TYPE_COLLABORATOR.role,
                                  TYPE_MANAGER.role,
                                ]}
                              >
                                <Dashboard />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/collaborator"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <Collaborator />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/add-collaborator"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <CollaboratorForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/edit-collaborator/:id"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <CollaboratorForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/collaborator-information/:id"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <CollaboratorDetail />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/student"
                            element={
                              <PrivateRoute
                                allowRoles={[
                                  TYPE_SYSADMIN.role,
                                  TYPE_ADMINISTRATOR.role,
                                  TYPE_COLLABORATOR.role,
                                  TYPE_MANAGER.role,
                                ]}
                              >
                                <Student />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/add-student"
                            element={
                              <PrivateRoute
                                allowRoles={[
                                  TYPE_SYSADMIN.role,
                                  TYPE_ADMINISTRATOR.role,
                                  TYPE_COLLABORATOR.role,
                                  TYPE_MANAGER.role,
                                ]}
                              >
                                <StudentForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/edit-student/:id"
                            element={
                              <PrivateRoute
                                allowRoles={[
                                  TYPE_SYSADMIN.role,
                                  TYPE_ADMINISTRATOR.role,
                                  TYPE_COLLABORATOR.role,
                                  TYPE_MANAGER.role,
                                ]}
                              >
                                <StudentForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/student-information/:id"
                            element={
                              <PrivateRoute
                                allowRoles={[
                                  TYPE_SYSADMIN.role,
                                  TYPE_ADMINISTRATOR.role,
                                  TYPE_COLLABORATOR.role,
                                  TYPE_MANAGER.role,
                                ]}
                              >
                                <StudentDetail />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/order"
                            element={
                              <PrivateRoute
                                allowRoles={[
                                  TYPE_SYSADMIN.role,
                                  TYPE_ADMINISTRATOR.role,
                                  TYPE_MANAGER.role,
                                  TYPE_COLLABORATOR.role,
                                ]}
                              >
                                <Order />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/add-order"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <OrderForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/information-order/:id"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <OrderDetail />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/edit-order/:id"
                            element={
                              <PrivateRoute
                                allowRoles={[TYPE_SYSADMIN.role, TYPE_ADMINISTRATOR.role, TYPE_MANAGER.role]}
                              >
                                <OrderForm />
                              </PrivateRoute>
                            }
                          />

                          <Route
                            path="/pay-collaborator"
                            element={
                              <PrivateRoute allowRoles={[TYPE_SYSADMIN.role]}>
                                <PayCollaborator />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/add-pay-collaborator"
                            element={
                              <PrivateRoute allowRoles={[TYPE_SYSADMIN.role]}>
                                <PayCollaboratorForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/edit-pay-collaborator/:id"
                            element={
                              <PrivateRoute allowRoles={[TYPE_SYSADMIN.role]}>
                                <PayCollaboratorForm />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/blog"
                            element={
                              <PrivateRoute>
                                <Blog />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/unauthorized"
                            element={
                              <PrivateRoute>
                                <UnauthorizedPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="*"
                            element={
                              <PrivateRoute>
                                <UnauthorizedPage />
                              </PrivateRoute>
                            }
                          />
                        </Routes>
                        <Footer />
                      </Layout>
                    </main>
                  </>
                }
              />
            </Routes>
            <Analytics mode="production" />;
          </div>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
