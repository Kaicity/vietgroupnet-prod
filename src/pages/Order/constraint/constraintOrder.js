import * as yup from 'yup';

// Regex cho số điện thoại
const phoneRegex = /^\+?(\d{1,4})?[-.\s]?(\d{2,4})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})$/;

export const OrderSchema = yup.object().shape({
  unionName: yup.string().required('Tên Nghiệp Đoàn là bắt buộc').max(50, 'Tên không được vượt quá 50 ký tự'),
  companyName: yup.string().required('Tên Công Ty là bắt buộc').max(50, 'Tên không được vượt quá 50 ký tự'),
  companyAddress: yup.string().required('Địa Chỉ là bắt buộc').max(50, 'Địa chỉ không được vượt quá 50 ký tự'),
  orderName: yup.string().required('Tên Đơn Hàng là bắt buộc').max(50, 'Tên không được vượt quá 50 ký tự'),
  interviewStatus: yup.string().required('Trạng thái là bắt buộc'),
  interviewFormat: yup.string().required('Hình thức là bắt buộc'),
  eduRequirements: yup.string().required('Yêu cầu giáo dục là bắt buộc'),
  dominantHand: yup.string().required('Tay thuận là bắt buộc'),
  maritalStatus: yup.string().required('Tình trạng hôn nhân là bắt buộc'),
  interviewDate: yup
    .string()
    .required('Ngày phỏng vấn là bắt buộc')
    .test('is-future-date', 'Ngày phỏng vấn phải lớn hơn hôm nay', (value) => {
      if (!value) return false;
      const today = new Date();
      const inputDate = new Date(value);
      return inputDate > today;
    }),
  departureDate: yup
    .string()
    .required('Ngày xuất cảnh là bắt buộc')
    .test('is-future-date', 'Ngày xuất cảnh phải lớn hơn hôm nay', (value) => {
      if (!value) return false;
      const today = new Date();
      const inputDate = new Date(value);
      return inputDate > today;
    }),
  male: yup
    .string()
    .required('Số lượng Nam là bắt buộc')
    .matches(/^\d+$/, 'Số lượng phải là số nguyên')
    .test('is-greater-than-1', 'Số lượng phải lớn hơn 1', (value) => Number(value) > 1),
  female: yup
    .string()
    .required('Số lượng Nữ là bắt buộc')
    .matches(/^\d+$/, 'Số lượng phải là số nguyên')
    .test('is-greater-than-1', 'Số lượng phải lớn hơn 1', (value) => Number(value) > 1),
  minAge: yup
    .number()
    .required('Tuổi tối thiểu là bắt buộc')
    .min(18, 'Tuổi tối thiểu phải lớn hơn hoặc bằng 18')
    .test('is-less-than-max', 'Tuổi tối thiểu phải nhỏ hơn tuổi tối đa', function (value) {
      const { maxAge } = this.parent;
      return value < maxAge;
    }),
  maxAge: yup
    .number()
    .required('Tuổi tối đa là bắt buộc')
    .max(99, 'Tuổi tối đa phải nhỏ hơn hoặc bằng 99')
    .test('is-greater-than-min', 'Tuổi tối đa phải lớn hơn tuổi tối thiểu', function (value) {
      const { minAge } = this.parent;
      return value > minAge;
    }),
  jobDescription: yup.string().required('Mô Tả Công Việc là bắt buộc'),
  phoneNumber: yup.string().matches(phoneRegex, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
});

