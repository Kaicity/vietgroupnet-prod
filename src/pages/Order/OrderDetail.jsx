import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { getOrderByCode } from '../../api/order'; // Ensure the correct import
import OrderDTO from './OrderDTO'; // Your DTO class file
import { useParams } from 'react-router-dom';
import image from '../../assets/vietgroupNobackgroud.png'; // Adjust path as needed
import {
  EducationLevelConfig,
  experienceConfig,
  interviewConfig,
  maritalStatusConfig,
  physicalStrengthConfig,
} from '../../constants/enums/order-enum';
import { format } from 'date-fns';
import { Button } from 'antd';
import { formattedAmountByNumeric } from '../../helper/moneyConvert';
const OrderDetail = () => {
  const [orders, setOrders] = useState([]);
  const { id } = useParams();
  const [isPrint, setisPrint] = useState(false);
  useEffect(() => {
    fetchOrderData();
  }, [id]);

  const fetchOrderData = async () => {
    try {
      const response = await getOrderByCode(id);
      const orderData = response.data.order;

      // Wrap orderData in an array if it's not already one
      const orderArray = Array.isArray(orderData) ? orderData : [orderData];

      // Map the data to OrderDTO objects
      const mappedOrders = orderArray.map(
        (item) =>
          new OrderDTO(
            item.companyAddress,
            item.companyName,
            item.departureDate,
            item.dominantHand,
            item.eduRequirements,
            item.experience,
            item.interviewDate,
            item.interviewStatus,
            item.jobDescription,
            item.gender,
            item.age,
            item.maxAge,
            item.minAge,
            item.female,
            item.male,
            item.notes,
            item.orderCode,
            item.orderName,
            item.quality,
            item.salary,
            item.unionName,
            item.vision,
            item.maritalStatus,
            item.visaTypes,
            item.physicalStrength,
            item.interviewFormat,
            item.insurance,
          ),
      );

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  const handlePrint = async () => {
    const printWindow = window.open('', '_blank'); // Mở cửa sổ mới
    await setisPrint(true);

    // Lấy nội dung bảng cần in
    const tableHTML = document.querySelector('table').outerHTML;

    // Tạo phần HTML cho hình ảnh và nội dung in
    const printContent = `
      <html>
        <head>
          <title>Print Table</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                font-family: Arial, sans-serif;
                font-size: 20px;
                color: #000;
                justify-content: center;
                align-items: center;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 15px;
                margin: auto;
                color: #000;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 2px;
                text-align: center;
                color: #000;
              }
              th {
                background-color: #99c464;
                color: #000;
              }
              .header {
                width: 100%;
                margin-left: 3vw;
                margin-bottom: 10px;
                text-align: center;
              }
              .header img {
                width: 70px;
                height: 70px;
                margin-bottom: 10px;
              }
              .header h1 {
                margin: 0;
                font-size: 18px;
                color: #000; /* Màu chữ tiêu đề header */
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img id="printImage" src="${image}" alt="Placeholder Image" />
            <h1>Mã Hàng ${orders.length > 0 ? orders[0].orderCode : ''}</h1>
            <h1>Tên Hàng ${orders.length > 0 ? orders[0].orderName : ''}</h1>
          </div>
          <br>
          ${tableHTML}
        </body>
      </html>
    `;

    // Ghi nội dung vào cửa sổ mới
    printWindow.document.write(printContent);
    printWindow.document.close(); // Đảm bảo nội dung đã được ghi đầy đủ

    // Xử lý in sau khi ảnh đã tải
    const printImage = printWindow.document.getElementById('printImage');
    printImage.onload = () => {
      printWindow.print();
    };

    // Xử lý fallback nếu ảnh không tải được
    printImage.onerror = () => {
      console.error('Image failed to load');
      printWindow.print();
    };

    // Đặt sự kiện khi đóng cửa sổ in
    printWindow.onafterprint = () => {
      printWindow.close();
      setisPrint(false);
    };
  };

  return (
    <TableContainer
      component={Paper}
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        margin: '20px',
        width: '97%',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <img
          src={image}
          alt="Placeholder Image"
          style={{
            width: '50px',
            height: '50px',
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handlePrint}
          sx={{
            backgroundColor: 'orange', // Set background color to orange
            borderRadius: '8px',
            padding: '10px 20px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'darkorange', // Hover effect with darker shade of orange
            },
          }}
        >
          In / Xuất PDF
        </Button>
      </div>

      <Typography
        variant="h4"
        gutterBottom
        style={{
          color: '#3f51b5',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Mã Đơn Hàng: {orders.length > 0 ? orders[0].orderCode : ''}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                fontWeight: 'bold',
                color: isPrint ? '#000' : '#fff',
                backgroundColor: '#99c464',
                textAlign: 'center',
                fontSize: '16px',
                border: '1px solid #ccc',
              }}
            >
              STT
            </TableCell>
            <TableCell
              style={{
                fontWeight: 'bold',
                color: isPrint ? '#000' : '#fff',
                backgroundColor: '#99c464',
                textAlign: 'center',
                fontSize: '16px',
                border: '1px solid #ccc',
              }}
            >
              Hạng Mục
            </TableCell>
            <TableCell
              style={{
                fontWeight: 'bold',
                color: isPrint ? '#000' : '#fff',
                backgroundColor: '#99c464',
                textAlign: 'center',
                fontSize: '16px',
                border: '1px solid #ccc',
              }}
            >
              Nội Dung Chi Tiết
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ textAlign: 'center' }}>
          {orders.map((order, index) => (
            <React.Fragment key={order.orderCode}>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Xí nghiệp Nhật tiếp nhận
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.companyName}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 2}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Địa điểm làm việc
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.companyAddress}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 3}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Loại Visa
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.visaTypes ? order.visaTypes : 'chưa có thông tin'}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 4}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Nội dung công việc
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.jobDescription}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 5}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Số lượng tuyển/Giới tính
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.setGender()}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 6}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Độ tuổi
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.setAge()}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 7}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Yêu cầu trình độ
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {`Bằng cấp: ${EducationLevelConfig[order.eduRequirements]?.label}`}
                  <br />

                  {`Kinh nghiệm: ${experienceConfig[order.experience]?.label}, `}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 8}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Yêu cầu khác
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {`Thể lực: ${physicalStrengthConfig[order.physicalStrength]?.label}, `}

                  {`Thị lực: ${order.vision}, `}

                  {`Tình trạng hôn nhân: ${maritalStatusConfig[order.maritalStatus]?.label}, `}
                  {`Tay thuận: ${order.dominantHand}`}
                  <br />
                  {`Có tinh thần trách nhiệm trong công việc, ham học hỏi...`}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 9}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Hình thức phỏng vấn
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.interviewFormat ? interviewConfig[order.interviewFormat]?.label : 'Chưa có thông tin'}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 10}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Lương cơ bản và các phụ cấp phương tiện
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {formattedAmountByNumeric(order.salary)} đ                  <br></br>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: order.notes,
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 11}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Ngày dự kiến phỏng vấn
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.interviewDate ? format(new Date(order.interviewDate), 'dd-MM-yyyy') : 'Chưa có thông tin'}
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 12}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Ngày dự kiến xuất cảnh
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.departureDate
                    ? format(new Date(order.departureDate), 'dd-MM-yyyy')
                    : 'Dựa vào kết quả visa thực tế khoảng tầm 6 tháng.'}
                </TableCell>
              </TableRow>

              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 13}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Bảo hiểm chế độ
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {order.insurance || 'Bảo hiểm, khám sức khỏe theo luật pháp Nhật quy định. '}
                </TableCell>
              </TableRow>

              <TableRow
                style={{
                  backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b2ebf2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#ffffff')}
              >
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  {index + 14}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  Đơn vị phái cử và đào tạo
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px solid #ccc',
                  }}
                >
                  VietGroup Edu
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDetail;
