const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../utils');

const { EMAIL_REGEXP } = require('../constants/regexp');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 170,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      match: EMAIL_REGEXP,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { collection: 'contacts', versionKey: false, timestamps: true },
);

contactSchema.post('save', handleMongooseError);

const Contact = model('contact', contactSchema);

module.exports = Contact;
