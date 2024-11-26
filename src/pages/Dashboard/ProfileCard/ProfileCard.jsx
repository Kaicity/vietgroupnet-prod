import { Card, Row, Col, Divider, Avatar } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import InfoItem from './InforItem';
import {
  AccountBalanceOutlined,
  CalendarMonthOutlined,
  EmailOutlined,
  ManageAccountsOutlined,
  PermIdentityOutlined,
  PhoneAndroidOutlined,
  RollerShadesClosedOutlined,
  Business,
  BadgeOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import theme from '../../../utils/theme';
import typography from '../../../utils/typography';
import { roleConfig } from '../../../constants/enums/collaborator-enum';

const ProfileCard = React.memo(() => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('user');

    setTimeout(() => {
      if (data) {
        setUserData(JSON.parse(data));
      }
      setLoading(false);
    }, 1000);
  }, []);

  // Ghi nhớ các giá trị dựa trên userData
  const collaboratorInfo = useMemo(
    () => ({
      collaboratorCode: userData.collaboratorCode,
      name: userData.name,
      role: roleConfig[userData.role?.roleName?.toUpperCase()]?.label,
      referrerName: userData.referrer ? userData.referrer.name : 'Không có',
      provinceName: userData.province?.provinceName,
      bankCode: userData.bank?.bankCode || 'Không có',
      identityNumber: userData.identityNumber,
      email: userData.email,
      phone: userData.phone || 'Không có',
      dayOfBirth: userData.dayOfBith ? new Date(userData.dayOfBith).toISOString().split('T')[0] : 'Không có',
      address: userData.address || 'Không có',
    }),
    [userData],
  );

  return (
    <div>
      <Row gutter={16} style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Hộp bên trái */}
        <Col xs={24} md={24} lg={12} style={{ marginBottom: '10px' }}>
          <Card
            style={{
              width: '100%',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              height: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '10px',
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  marginBottom: '20px',
                  width: '200px',
                  height: '200px',
                  overflow: 'hidden',
                  background: theme.gradient.blueGreen,
                  padding: '5px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    padding: '5px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}
                >
                  <Avatar size={180} src={userData.imgUrl}>
                    <span style={{ fontSize: '50px' }}>
                      {!userData.imgUrl && collaboratorInfo?.name?.charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                </div>
              </div>

              <Typography
                fontSize={{
                  xs: typography.fontSize.sizeM,
                  md: typography.fontSize.sizeXL,
                }}
                fontWeight="bold"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  textAlign: 'center',
                }}
              >
                {collaboratorInfo.collaboratorCode} - {collaboratorInfo.name}
              </Typography>
              <Divider />

              <InfoItem icon={BadgeOutlined} label="Mã số: " value={collaboratorInfo.collaboratorCode} />
              <InfoItem icon={RollerShadesClosedOutlined} label="Chức vụ: " value={collaboratorInfo.role} />
            </Box>
          </Card>
        </Col>

        <Col xs={24} md={24} lg={12}>
          <Card
            style={{
              width: '100%',
              borderRadius: '20px',
              padding: '5px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              height: 'auto',
            }}
          >
            <Box
              sx={{
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                marginTop: '0px',
                marginLeft: { xs: '1px', sm: '50px' },
              }}
            >
              <br />
              <Card.Meta
                title={
                  <Typography fontSize={typography.fontSize.sizeXL} fontWeight="bold">
                    Thông tin cán bộ công nhân viên
                  </Typography>
                }
              />
              <Divider />

              <InfoItem icon={ManageAccountsOutlined} label="Người quản lý: " value={collaboratorInfo.referrerName} />
              <InfoItem icon={Business} label="Chi nhánh: " value={collaboratorInfo.provinceName} />
              <InfoItem icon={AccountBalanceOutlined} label="Tài khoản Ngân Hàng: " value={collaboratorInfo.bankCode} />
              <InfoItem icon={PermIdentityOutlined} label="CMTND/CCCD/HC: " value={collaboratorInfo.identityNumber} />
              <InfoItem icon={EmailOutlined} label="Email: " value={collaboratorInfo.email} />
              <InfoItem icon={PhoneAndroidOutlined} label="Điện thoại: " value={collaboratorInfo.phone} />
              <InfoItem icon={CalendarMonthOutlined} label="Ngày Sinh" value={collaboratorInfo.dayOfBirth} />
              <InfoItem icon={LocationOnOutlined} label="Địa Chỉ" value={collaboratorInfo.address} />
            </Box>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default ProfileCard;
