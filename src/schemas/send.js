export default {
  address: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "address is required",
  },
  destination: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "destination is required",
  },
  private_key: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "private_key is required",
  },
  amount: {
    in: ["body"],
    isFloat: true,
    notEmpty: true,
    errorMessage: "amount is required",
  },
  symbol: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "address is required",
  },
};
