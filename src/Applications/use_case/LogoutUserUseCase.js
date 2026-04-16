import InvariantError from '../../Commons/exceptions/InvariantError.js';

class LogoutUserUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = useCasePayload || {};

    if (!refreshToken) {
      throw new InvariantError(
        'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
      );
    }

    if (typeof refreshToken !== 'string') {
      throw new InvariantError(
        'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }

    await this._authenticationRepository.verifyToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }
}

export default LogoutUserUseCase;