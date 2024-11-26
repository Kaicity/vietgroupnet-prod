const OrderInitialValues = {
  // Thông tin đơn hàng
  orderCode: '',
  orderName: '',
  quantity: '',
  interviewDate: null,

  // Thông tin nghiệp đoàn
  unionName: '',
  companyName: '',
  companyAddress: '',

  // Thông tin ngành nghề
  male: '',
  female:'', // mấy nam mấy nữ
  minAge: '',
  maxAge:'', // độ tuổi làm việc từ 18....
  salary: '', // lương của ngành nghề này
  interviewStatus: '', // hình thức phỏng vấn
  eduRequirements: '', // yêu cầu của ngành nghề
  departureDate: null,
  jobDescription: '', // chi tiết công việc

  // Thông tin khác
  experience: '',
  physicalStrength: '', // Thể lực
  dominantHand: '', // Thuận tay
  insurance: '', // Bảo hiểm
  vision: '', // Thị lực
  maritalStatus: '', // Tình trạng hôn nhân
  notes: '', // Ghi chú
  visaTypes:'',
  interviewFormat:'',  
};

export default OrderInitialValues;
