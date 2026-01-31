const { z } = require('zod');

const validate = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      req[property] = await schema.parseAsync(req[property]);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid request data'
      });
    }
  };
};

module.exports = validate;
