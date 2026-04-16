import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';

class LoginUserUseCase {
  constructor({ userRepository, authenticationRepository, passwordHash, tokenManager }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const { username, password } = useCasePayload;

    if (!username || !password) {
      throw new AuthenticationError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new AuthenticationError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const user = await this._userRepository.getPasswordByUsername(username);

    if (!user) {
      throw new InvariantError('USER_LOGIN.USER_NOT_FOUND');
    }

    await this._passwordHash.compare(password, user.password);

    const accessToken = this._tokenManager.generateAccessToken({
      id: user.id,
      username,
    });

    const refreshToken = this._tokenManager.generateRefreshToken({
      id: user.id,
      username,
    });

    await this._authenticationRepository.addToken(refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default LoginUserUseCase;