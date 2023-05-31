const fs = require('fs/promises');
// const path = require('path');

const { controllerWrapper } = require('../../utils');
const userServices = require('../../services/users.services');
const cloudServices = require('../../services/cloud.services');

const uploadAvatarUser = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  const pathFile = req.file.path;

  const { secure_url: avatarURL, public_id: idCloudAvatar } =
    await cloudServices.uploadAvatar(pathFile);

  const oldAvatar = await userServices.getAvatar(_id);
  await cloudServices.deleteAvatar(oldAvatar);
  await userServices.updateAvatar(_id, avatarURL, idCloudAvatar);
  await fs.unlink(pathFile);

  res.json({ avatarURL });
});

module.exports = uploadAvatarUser;
