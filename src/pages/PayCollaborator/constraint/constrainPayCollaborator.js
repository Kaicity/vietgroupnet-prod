import * as yup from 'yup';

export const payCollaboratorSchema = yup.object().shape({
  payHistoryName: yup.string().required('Nội dung trả tiền là bắt buộc'),

  collaboratorCode: yup.string().required('Mã cán bộ nhân viên là bắt buộc'),

  percent: yup
    .number()
    .typeError('Vui lòng nhập giá trị % hợp lệ')
    .min(0, 'Không thể nhỏ hơn 0%')
    .max(100, 'Không vượt quá 100%')
    .required('% hoa hồng là bắt buộc'),

  commission: yup.string().required('Số tiền là bắt buộc'),

  status: yup.string(),

  //
});
