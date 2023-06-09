const jwt = require('jsonwebtoken');
const { HttpError, assignTokens } = require('../utils');
const { userServices, tokenServices } = require('../services');
const { JWT_ACCESS_TOKEN_SECRET_KEY, JWT_REFRESH_TOKEN_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  const [bearer, token] = authorization.split(' ');

  let fetchedUser;

  try {
    if (bearer !== 'Bearer' || !token) {
      throw new HttpError(401, 'Invalid or absent token');
    }

    const { userId } = jwt.decode(token);

    fetchedUser = await userServices.getUserById(userId);

    if (!fetchedUser || !fetchedUser.refreshToken) {
      throw new HttpError(401, 'Not authorized');
    }

    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET_KEY);

    req.user = fetchedUser;

    next();
  } catch (error) {
    if (error.name !== 'TokenExpiredError') {
      return next(new HttpError(401, 'Not authorized'));
    }

    try {
      jwt.verify(fetchedUser.refreshToken, JWT_REFRESH_TOKEN_SECRET_KEY);
      const { accessToken, refreshToken } = assignTokens(fetchedUser);
      await tokenServices.updateRefreshToken(fetchedUser._id, refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(new HttpError(401, 'Refresh token is expired'));
    }
  }
};

module.exports = authenticate;
