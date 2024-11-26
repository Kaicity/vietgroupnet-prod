import dayjs from 'dayjs';
import * as yup from 'yup';

const phoneRegex =
  /^\+?(\d{1,4})?[-.\s]?(\d{2,4})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})$/;

export const collaboratorSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Họ Và Tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ Và Tên không được vượt quá 50 ký tự')
    .required('Họ Và Tên là bắt buộc'),

  email: yup.string().email('Email không hợp lệ'),

  phone: yup
    .string()
    .matches(phoneRegex, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),

  identityNumber: yup
    .string()
    .matches(/^\d{12}$/, 'Căn Cước Công Dân phải có 12 số')
    .required('Căn Cước Công Dân là bắt buộc'),

  bankCode: yup.string(),

  bankAccountNumber: yup
    .string()
    .matches(/^\d+$/, 'Số tài khoản chỉ được chứa số'),

  provinceCode: yup.string().required('Tỉnh là bắt buộc'),

  gender: yup.string(),

  address: yup
    .string()
    .min(5, 'Địa Chỉ phải có ít nhất 5 ký tự')
    .max(100, 'Địa Chỉ không được vượt quá 100 ký tự'),

  roleCode: yup.string().required('Chức Vụ là bắt buộc'),

  dayOfBith: yup
    .string()
    .required('Ngày Sinh là bắt buộc')
    .test('is-valid-date', 'Ngày Sinh không hợp lệ', (value) => {
      const date = dayjs(value, 'YYYY-MM-DD', true);
      return date.isValid() && date.year() >= 1940 && date.year() <= 2024;
    }),

  password: yup
    .string()
    .min(8, 'Mật Khẩu phải có ít nhất 8 ký tự')
    .matches(/[a-z]/, 'Mật Khẩu phải có ít nhất một ký tự thường')
    .matches(/[A-Z]/, 'Mật Khẩu phải có ít nhất một ký tự hoa')
    .matches(/\d/, 'Mật Khẩu phải có ít nhất một chữ số')
    .matches(/[^a-zA-Z\d]/, 'Mật Khẩu phải có ít nhất một ký tự đặc biệt')
    .required('Mật Khẩu là bắt buộc'),
});

// =============================================================

export const collaboratorSchemaEditing = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Họ Và Tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ Và Tên không được vượt quá 50 ký tự')
    .required('Họ Và Tên là bắt buộc'),

  email: yup.string().email('Email không hợp lệ'),

  phone: yup
    .string()
    .matches(phoneRegex, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),

  identityNumber: yup
    .string()
    .matches(/^\d{12}$/, 'Căn Cước Công Dân phải có 12 số')
    .required('Căn Cước Công Dân là bắt buộc'),

  bankCode: yup.string(),

  bankAccountNumber: yup
    .string()
    .matches(/^\d+$/, 'Số tài khoản chỉ được chứa số'),

  provinceCode: yup.string().required('Tỉnh là bắt buộc'),

  gender: yup.string(),

  address: yup
    .string()
    .min(5, 'Địa Chỉ phải có ít nhất 5 ký tự')
    .max(100, 'Địa Chỉ không được vượt quá 100 ký tự'),

  roleCode: yup.string().required('Chức Vụ là bắt buộc'),

  dayOfBith: yup
    .string()
    .required('Ngày Sinh là bắt buộc')
    .test('is-valid-date', 'Ngày Sinh không hợp lệ', (value) => {
      const date = dayjs(value, 'YYYY-MM-DD', true);
      return date.isValid() && date.year() >= 1940 && date.year() <= 2024;
    }),

  password: yup
    .string()
    .min(8, 'Mật Khẩu phải có ít nhất 8 ký tự')
    .matches(/[a-z]/, 'Mật Khẩu phải có ít nhất một ký tự thường')
    .matches(/[A-Z]/, 'Mật Khẩu phải có ít nhất một ký tự hoa')
    .matches(/\d/, 'Mật Khẩu phải có ít nhất một chữ số')
    .matches(/[^a-zA-Z\d]/, 'Mật Khẩu phải có ít nhất một ký tự đặc biệt'),
});

//============================================================================
