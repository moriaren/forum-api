import InvariantError from '../../Commons/exceptions/InvariantError.js';

class RefreshAuthenticationUseCase {
  constructor({ authenticationRepository, tokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    try {
      await this._authenticationRepository.verifyToken(refreshToken);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new InvariantError('REFRESH_AUTHENTICATION_USE_CASE.INVALID_REFRESH_TOKEN');
    }

    const decoded = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({
      username: decoded.username,
      id: decoded.id,
    });

    return accessToken;
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new InvariantError(
        'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
      );
    }

    if (typeof refreshToken !== 'string') {
      throw new InvariantError(
        'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

export default RefreshAuthenticationUseCase;