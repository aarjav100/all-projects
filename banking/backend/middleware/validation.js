const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
const authSchemas = {
  register: Joi.object({
    fullName: Joi.string().required().min(2).max(100).messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required'
    }),
    phone: Joi.string().optional().pattern(/^\+?[\d\s-()]+$/).messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
    dateOfBirth: Joi.date().max('now').optional().messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      country: Joi.string().default('USA')
    }).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  })
};

const transactionSchemas = {
  create: Joi.object({
    type: Joi.string().valid('deposit', 'withdrawal', 'transfer', 'payment', 'refund').required(),
    amount: Joi.number().positive().required().messages({
      'number.positive': 'Amount must be positive',
      'number.base': 'Amount must be a number'
    }),
    description: Joi.string().required().max(200).messages({
      'string.empty': 'Description is required',
      'string.max': 'Description cannot exceed 200 characters'
    }),
    category: Joi.string().valid('food', 'transport', 'entertainment', 'shopping', 'bills', 'salary', 'other').default('other'),
    recipientAccount: Joi.when('type', {
      is: 'transfer',
      then: Joi.string().required(),
      otherwise: Joi.optional()
    }),
    recipientName: Joi.when('type', {
      is: 'transfer',
      then: Joi.string().required(),
      otherwise: Joi.optional()
    })
  }),

  update: Joi.object({
    status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled'),
    description: Joi.string().max(200)
  })
};

const beneficiarySchemas = {
  create: Joi.object({
    name: Joi.string().required().max(100).messages({
      'string.empty': 'Beneficiary name is required',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    accountNumber: Joi.string().required().messages({
      'string.empty': 'Account number is required'
    }),
    bankName: Joi.string().required().messages({
      'string.empty': 'Bank name is required'
    }),
    bankCode: Joi.string().optional(),
    routingNumber: Joi.string().optional(),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please enter a valid email address'
    }),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
    nickname: Joi.string().max(50).optional().messages({
      'string.max': 'Nickname cannot exceed 50 characters'
    }),
    transferLimit: Joi.number().positive().default(10000),
    dailyLimit: Joi.number().positive().default(5000),
    monthlyLimit: Joi.number().positive().default(50000),
    notes: Joi.string().max(500).optional().messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
  }),

  update: Joi.object({
    name: Joi.string().max(100),
    bankName: Joi.string(),
    bankCode: Joi.string(),
    routingNumber: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/),
    nickname: Joi.string().max(50),
    transferLimit: Joi.number().positive(),
    dailyLimit: Joi.number().positive(),
    monthlyLimit: Joi.number().positive(),
    status: Joi.string().valid('active', 'inactive', 'pending'),
    notes: Joi.string().max(500)
  })
};

const userSchemas = {
  update: Joi.object({
    fullName: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postalCode: Joi.string(),
      country: Joi.string()
    })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'string.empty': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.empty': 'New password is required'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Please confirm your password'
    })
  })
};

module.exports = {
  validate,
  authSchemas,
  transactionSchemas,
  beneficiarySchemas,
  userSchemas
}; 