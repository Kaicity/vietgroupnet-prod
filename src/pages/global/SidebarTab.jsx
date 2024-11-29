import { useContext, useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Divider, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import theme from '../../utils/theme.js';
import { AssessmentOutlined, LocalAtmOutlined, PersonOutlineRounded } from '@mui/icons-material';
import typography from '../../utils/typography';
import { SchoolOutlined } from '@mui/icons-material';
import { AppContext } from '../../context/AppProvider.jsx';
import {
  TYPE_ADMINISTRATOR,
  TYPE_COLLABORATOR,
  TYPE_MANAGER,
  TYPE_SYSADMIN,
} from '../../constants/roleDecentralization.js';
import vgLogo from '../../assets/logoVGN.jpg';

const Item = ({ title, to, icon, selected, setSelected, isCollapsedMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: selected === title ? theme.green[200] : isHovered ? theme.green[200] : '#333',
        backgroundColor: selected === title ? theme.green[100] : isHovered ? theme.green[100] : 'transparent', // Set màu item khi hover ở sidebar
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
        marginBottom: '5px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelected(title);
        isCollapsedMobile(false);
      }}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography fontSize={typography.fontSize.sizeM}>{title}</Typography>
    </MenuItem>
  );
};

const SidebarTab = () => {
  const { collapsed } = useContext(AppContext);
  const [selected, setSelected] = useState('Dashboard'); // Set mặc định Item đầu tiên là Dashboard

  const navigate = useNavigate();

  // State để kiểm soát trạng thái collapse
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

  // useEffect để theo dõi sự thay đổi kích thước màn hình
  useEffect(() => {
    setIsCollapsed(collapsed);

    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  const handleBackHome = () => {
    navigate('/');
    setSelected('Dashboard');
  };

  const userType = sessionStorage.getItem('role');
  const menuItems = [];

  switch (userType) {
    case TYPE_SYSADMIN.role:
      menuItems.push(
        { title: 'Dashboard', to: '/', icon: <HomeOutlinedIcon sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Cán Bộ Nhân Viên',
          to: '/collaborator',
          icon: <PersonOutlineRounded sx={{ color: theme.primary[500] }} />,
        },
        { title: 'Học Viên', to: '/student', icon: <SchoolOutlined sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Đơn Hàng',
          to: '/order',
          icon: <AssessmentOutlined sx={{ color: theme.primary[500] }} />,
        },
        {
          title: 'Hoa hồng - Lịch sử',
          to: '/pay-collaborator',
          icon: <LocalAtmOutlined sx={{ color: theme.primary[500] }} />,
        },
      );
      break;
    case TYPE_ADMINISTRATOR.role:
      menuItems.push(
        { title: 'Dashboard', to: '/', icon: <HomeOutlinedIcon sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Cán Bộ Nhân Viên',
          to: '/collaborator',
          icon: <PersonOutlineRounded sx={{ color: theme.primary[500] }} />,
        },
        { title: 'Học Viên', to: '/student', icon: <SchoolOutlined sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Đơn Hàng',
          to: '/order',
          icon: <AssessmentOutlined sx={{ color: theme.primary[500] }} />,
        },
      );
      break;
    case TYPE_MANAGER.role:
      menuItems.push(
        { title: 'Dashboard', to: '/', icon: <HomeOutlinedIcon sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Cán Bộ Nhân Viên',
          to: '/collaborator',
          icon: <PersonOutlineRounded sx={{ color: theme.primary[500] }} />,
        },
        { title: 'Học Viên', to: '/student', icon: <SchoolOutlined sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Đơn Hàng',
          to: '/order',
          icon: <AssessmentOutlined sx={{ color: theme.primary[500] }} />,
        },
      );
      break;
    case TYPE_COLLABORATOR.role:
      menuItems.push(
        { title: 'Dashboard', to: '/', icon: <HomeOutlinedIcon sx={{ color: theme.primary[500] }} /> },
        { title: 'Học Viên', to: '/student', icon: <SchoolOutlined sx={{ color: theme.primary[500] }} /> },
        {
          title: 'Đơn Hàng',
          to: '/order',
          icon: <AssessmentOutlined sx={{ color: theme.primary[500] }} />,
        },
      );
      break;
    default:
      menuItems.push({
        title: 'Dashboard',
        to: '/',
        icon: <HomeOutlinedIcon />,
      });
      break;
  }

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
      <Sidebar
        collapsed={isCollapsed}
        collapsedWidth={window.innerWidth <= 768 ? "0px" : "80px"}
        transitionDuration={1000}
        backgroundColor="#fff"
        style={{ border: 'none', borderRight: `1px solid ${theme.gray[100]}` }}
        width={window.innerWidth <= 768 ? '100px' : '280px'}
      >
        <Menu>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ m: '0px auto', padding: '4px' }}>
              <img
                onClick={handleBackHome}
                alt="logo"
                src={vgLogo}
                style={{
                  width: '80px',
                  height: 'auto',
                  cursor: 'pointer',
                }}
              />
            </Box>
          </Box>

          <Divider />

          <Box padding={isCollapsed ? undefined : '10%'}>
            {menuItems.map((item, index) => (
              <Item
                key={index}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                isCollapsedMobile={
                  window.innerWidth <= 768 && !isCollapsed
                    ? () => setIsCollapsed(!isCollapsed)
                    : () => setIsCollapsed(isCollapsed)
                }
              />
            ))}
          </Box>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarTab;
