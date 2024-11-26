export const transformMoneyToNumeric = (value) => {
  return parseInt(value.replace(/\./g, ''), 10);
};

export const transformNumericToMoney = (value) => {
  return parseInt(value.replace(/\D/g, ''), 10);
};

export const formattedAmountByNumeric = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};
