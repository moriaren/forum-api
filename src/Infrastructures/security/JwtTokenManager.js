import jwt from 'jsonwebtoken';
import InvariantError from '../../Commons/exceptions/InvariantError.js';
import config from '../../Commons/config.js';

class JwtTokenManager {
  constructor(jwtLibrary = jwt) {
    this._jwt = jwtLibrary;
  }

  _accessKey() {
    return config.auth.accessTokenKey || process.env.ACCESS_TOKEN_KEY || 'secret';
  }

  _refreshKey() {
    return config.auth.refreshTokenKey || process.env.REFRESH_TOKEN_KEY || 'refresh';
  }

  generateAccessToken(payload) {
    return this._jwt.sign(payload, this._accessKey(), {
      expiresIn: '1h',
    });
  }

  async createAccessToken(payload) {
    return this.generateAccessToken(payload);
  }

  generateRefreshToken(payload) {
    return this._jwt.sign(payload, this._refreshKey(), {
      expiresIn: '7d',
    });
  }

  async createRefreshToken(payload) {
    return this.generateRefreshToken(payload);
  }

  async verifyRefreshToken(token) {
    try {
      return this._jwt.verify(token, this._refreshKey());
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  verifyAccessToken(token) {
    return this._jwt.verify(token, this._accessKey());
  }

  async decodePayload(token) {
    try {
      return this._jwt.verify(token, this._accessKey());
    } catch {
      throw new InvariantError('token tidak valid');
    }
  }
}

export default JwtTokenManager;
