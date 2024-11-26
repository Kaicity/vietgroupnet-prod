import * as yup from 'yup';
import dayjs from 'dayjs';

const phoneRegex =
  /^\+?(\d{1,4})?[-.\s]?(\d{2,4})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})$/;

export const studentSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Họ Và Tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ Và Tên không được vượt quá 50 ký tự')
    .required('Họ Và Tên là bắt buộc'),

  gender: yup.string().required('Giới tính là bắt buộc'),

  dayOfBirth: yup
    .string()
    .required('Ngày Sinh là bắt buộc')
    .test(
      'is-valid-date',
      'Ngày Sinh không hợp lệ',
      (value) => {
        const date = dayjs(value, 'YYYY-MM-DD', true);
        return date.isValid() && date.year() >= 1940 && date.year() <= 2024;
      },
    ),

  identityNumber: yup
    .string()
    .matches(/^\d{12}$/, 'Căn Cước Công Dân phải có 12 số')
    .required('Căn cước công dân là bắt buộc'),

  studentStatus: yup.string(),

  amountPaid: yup.string(),

  diligence: yup.string(),

  attitude: yup.string(),

  note: yup.string(),

  learningSituation: yup.string(),

  studentPhoneNumber: yup
    .string()
    .matches(phoneRegex, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),

  parentPhoneNumber: yup
    .string()
    .matches(phoneRegex, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),

  address: yup
    .string()
    .min(5, 'Địa Chỉ phải có ít nhất 5 ký tự')
    .max(100, 'Địa Chỉ không được vượt quá 100 ký tự'),
});

//=============================================================

// export const studentSchemaEditing = yup.object().shape({
//   name: yup
//     .string()
//     .min(2, 'Họ Và Tên phải có ít nhất 2 ký tự')
//     .max(50, 'Họ Và Tên không được vượt quá 50 ký tự')
//     .required('Họ Và Tên là bắt buộc'),

//   gender: yup.string().required('Giới tính là bắt buộc'),

//   dayOfBith: yup
//     .string()
//     .test('is-valid-date', 'Ngày Sinh không hợp lệ', (value) => {
//       return dayjs(value, 'YYYY-MM-DD', true).isValid();
//     }),

//   phone: yup
//     .string()
//     .matches(phoneRegex, 'Số điện thoại không hợp lệ')
//     .required('Số điện thoại là bắt buộc')
//     .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
//     .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),

//   identityNumber: yup
//     .string()
//     .matches(/^\d{12}$/, 'Căn Cước Công Dân phải có 12 số')
//     .required('Căn cước công dân là bắt buộc'),

//   studentStatus: yup.string(),

//   amountPaid: yup
//     .string()
//     .matches(vndCurrencyRegex, 'Số tiền không hợp lệ, yêu cầu định dạng VND')
//     .required('Số tiền là bắt buộc'),

//   diligence: yup.string(),

//   attitude: yup.string(),

//   provinceCode: yup.string().required('Tỉnh là bắt buộc'),

//   learningSituation: yup.string(),

//   studentPhoneNumber: yup.string().required('Số điện thoại là bắt buộc'),

//   parentPhoneNumber: yup.string(),

//   address: yup
//     .string()
//     .min(5, 'Địa Chỉ phải có ít nhất 5 ký tự')
//     .max(100, 'Địa Chỉ không được vượt quá 100 ký tự'),
// });
