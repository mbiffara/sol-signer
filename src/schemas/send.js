export default {
  address: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "address is required",
  },
  private_key: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "address is required",
  },
};
