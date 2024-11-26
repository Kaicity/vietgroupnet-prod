import * as yup from 'yup';
export const OrderSchema = yup.object().shape({
  unionName: yup.string().required('Tên Nghiệp Đoàn là bắt buộc'),
  companyName: yup.string().required('Tên Công Ty Tiếp Nhận là bắt buộc'),
  companyAddress: yup.string().required('Địa Chỉ là bắt buộc'),

  interviewStatus: yup.string().required('trạng thái là bắt buộc'),
  interviewFormat:yup.string().required('trạng thái là bắt buộc'),
  eduRequirements:yup.string().required('trạng thái là bắt buộc'),
  male: yup
    .number()
    .required('Số Lượng Nam là bắt buộc')
    .positive('Số Lượng Nam phải là số dương')
    .integer('Số Lượng Nam phải là số nguyên'),
  female: yup
    .number()
    .required('Số Lượng Nữ là bắt buộc')
    .positive('Số Lượng Nữ phải là số dương')
    .integer('Số Lượng Nữ phải là số nguyên'),
  minAge: yup
    .number()
    .required('Tuổi tối thiểu là bắt buộc')
    .positive('Tuổi tối thiểu phải là số dương')
    .integer('Tuổi tối thiểu phải là số nguyên'),
  maxAge: yup
    .number()
    .required('Tuổi tối đa là bắt buộc')
    .positive('Tuổi tối đa phải là số dương')
    .integer('Tuổi tối đa phải là số nguyên'),
  jobDescription: yup.string()
    .required('Mô Tả Công Việc là bắt buộc'),
});
