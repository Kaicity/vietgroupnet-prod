import { format } from 'date-fns';

export const formatDate = (value) => {
  return format(new Date(value), 'dd-MM-yyyy');
};
