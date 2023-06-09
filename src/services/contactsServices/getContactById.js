const { Contact } = require('../../models');
const { HttpError } = require('../../utils');

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, owner: userId });
  if (!contact) {
    throw new HttpError(404, `Contact with id: ${contactId} not found`);
  }
  return contact;
};

module.exports = getContactById;
