const { BadRequestError } = require("../errors");

module.exports = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      throw new BadRequestError(errorMessage);
    }

    req.value = value;
    next();
  };
};
