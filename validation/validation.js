const { body } = require("express-validator");

validationSchema = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 2 })
      .withMessage("name must be at least 2 characters"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be a number"),
  ];
};

module.exports = {
  validationSchema
}