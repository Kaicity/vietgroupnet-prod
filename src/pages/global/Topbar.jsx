import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem, Typography, Badge, Divider } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useContext, useEffect, useState } from 'react';
import theme from '../../utils/theme.js';
import {
  AppsOutlined,
  InfoOutlined,
  MenuOpen,
  NotificationsNoneRounded,
  KeyboardTabOutlined,
} from '@mui/icons-material';
import { AppContext } from '../../context/AppProvider.jsx';
import { roleConfig } from '../../constants/enums/collaborator-enum.js';
import { Avatar } from 'antd';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningSettingOutlinedIcon = styled(SettingsOutlinedIcon)`
  animation: ${spin} 3s linear infinite;
`;

const Topbar = () => {
  // State to control the menu open state
  const [anchorElSetting, setAnchorElSetting] = useState(null);
  const openSetting = Boolean(anchorElSetting);

  const [anchorElLanguage, setAnchorElLanguage] = useState(null);

  const { collapsed, setCollapsed } = useContext(AppContext);

  const [username, setUsername] = useState('');
  const [userCode, setUserCode] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser) {
      const { name, role, imgUrl, collaboratorCode } = currentUser;

      setUsername(name);
      setUserCode(collaboratorCode);
      setRole(roleConfig[role.roleName?.toUpperCase()]?.label);
      setImageUrl(imgUrl);
    }
  }, []);

  const enterFullScreen = () => {
    const doc = document.documentElement;

    if (doc.requestFullscreen) {
      doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) {
      // Firefox
      doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) {
      // IE/Edge
      doc.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  };

  const handleClickFullScreen = () => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullScreen();
    }
  };

  const navigate = useNavigate();

  // Handle menu opening
  const handleClickSetting = (event) => {
    setAnchorElSetting(event.currentTarget);
  };

  const handleClickLanguage = (event) => {
    setAnchorElLanguage(event.currentTarget);
  };

  // Handle menu closing
  const handleCloseSetting = () => {
    setAnchorElSetting(null);
  };

  const handleToUserInfo = () => {
    navigate(`/collaborator-information/${userCode}`);
    setAnchorElSetting(null);
  };

  const handleCloseLanguage = () => {
    setAnchorElLanguage(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={1}
      sx={{
        backgroundColor: theme.white[100],
        borderBottom: `1px solid ${theme.gray[100]}`,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={handleCollapsed}>{collapsed ? <KeyboardTabOutlined /> : <MenuOpen />}</IconButton>

        {/* <Box display={{ xs: 'none', sm: 'flex' }}>
          <SearchBar
            width="100%"
            color={theme.black[50]}
            placeholder={'Tìm kiếm'}
          />
        </Box> */}
      </Box>

      {/* Nav menu icons */}
      <Box display="flex" alignItems="center" gap={1}>
        <Tippy content="Thông báo">
          <Box>
            <IconButton>
              <Badge badgeContent={6} color="error">
                <NotificationsNoneRounded color="primary" />
              </Badge>
            </IconButton>
          </Box>
        </Tippy>

        <Tippy content="Ứng dụng">
          <IconButton>
            <AppsOutlined />
          </IconButton>
        </Tippy>

        <Tippy content="Người dùng">
          <Box display="flex" alignItems="center">
            <Box>
              <IconButton
                size="small"
                aria-controls={openSetting ? 'menu' : undefined}
                aria-haspopup="true"
                onClick={handleClickSetting}
              >
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    border: `1px solid ${theme.gray[100]}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Avatar size={35} src={imageUrl}>
                    {!imageUrl && username?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
              </IconButton>

              <Menu
                id="menu"
                anchorEl={anchorElSetting}
                open={openSetting}
                onClose={handleCloseSetting}
                PaperProps={{
                  style: {
                    height: 200,
                    width: '22ch',
                    marginTop: '10px',
                  },
                }}
              >
                <MenuItem sx={{ fontSize: 13 }} onClick={handleCloseSetting}>
                  <Box display="flex" gap={1} alignItems="center">
                    <Box>
                      <Avatar size={40} src={imageUrl}>
                        {!imageUrl && username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Typography fontWeight="bold" sx={{ fontSize: 13 }} color={theme.gray[800]}>
                        {username || 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: 13 }} color={theme.gray[500]}>
                        {role || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>

                <Divider />

                <MenuItem sx={{ fontSize: 13 }} onClick={handleToUserInfo}>
                  <InfoOutlined sx={{ marginRight: 2 }} color="primary" />
                  Thông tin
                </MenuItem>

                <MenuItem sx={{ fontSize: 13 }} onClick={handleClickFullScreen}>
                  <FullScreenIcon sx={{ marginRight: 2 }} color="primary" />
                  Toàn màn hình
                </MenuItem>

                <MenuItem sx={{ fontSize: 13 }} onClick={handleLogout}>
                  <LogoutIcon sx={{ marginRight: 2 }} color="primary" />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Tippy>
      </Box>
    </Box>
  );
};

export default Topbar;
