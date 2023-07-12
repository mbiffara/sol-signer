export default {
  address: {
    in: ["query"],
    isString: true,
    notEmpty: true,
    errorMessage: "address is required",
  },
};
