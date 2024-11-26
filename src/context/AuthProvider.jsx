import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthContext } from '../api';
import { Modal } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('accessToken'),
  );
  const [network, setNetwork] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    const isCurrentToken = sessionStorage.getItem('accessToken');
    const isCurrentUser = sessionStorage.getItem('user');

    // Trường hợp token cũ hoặc hết hạn đang tồn tại trong session
    if (isCurrentToken && isCurrentUser) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');

      setIsAuthenticated(false);
      Modal.info({
        title: 'Hệ Thống',
        content:
          'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại...',
        okText: 'Đồng ý',
        okType: 'primary',
        onOk() {
          navigate('/login');
        },
      });
    } else {
      setIsAuthenticated(false);
      return;
    }
  };

  const notConnectedNetwork = () => {
    //Trường hợp mất kết nối đến server
    if (!network) {
      Modal.info({
        title: 'Hệ Thống',
        content: (
          <div>
            <span>Lỗi không thể kết nối đến Server</span>{' '}
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              404 Bad request
            </span>
          </div>
        ),
        okText: 'Đợi phản hồi',
        okType: 'primary',
        onOk() {},
      });
    }
  };

  const networkStatus = (value) => {
    setNetwork(value);
  };

  useEffect(() => {
    setAuthContext({ logout, notConnectedNetwork, networkStatus });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, logout, network, setNetwork }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
