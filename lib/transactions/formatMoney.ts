export const formatMoney = (value: number) =>
  `${value < 0 ? '-' : ''}$${Math.abs(value).toFixed(2)}`
