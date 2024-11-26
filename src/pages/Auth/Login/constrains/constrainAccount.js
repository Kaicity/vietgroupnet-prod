import * as Yup from 'yup';
export const AccountSchema = Yup.object({
  collaboratorCode: Yup.string().required('Mã định danh là bắt buộc.'),
  password: Yup.string().required('Mật khẩu là bắt buộc.'),
});
