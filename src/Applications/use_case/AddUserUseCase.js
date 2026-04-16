import RegisterUser from '../../Domains/users/entities/RegisterUser.js';

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);

    await this._userRepository.verifyAvailableUsername(registerUser.username);

    const hashedPassword = await this._passwordHash.hash(registerUser.password);

    return this._userRepository.addUser({
      username: registerUser.username,
      password: hashedPassword,
      fullname: registerUser.fullname,
    });
  }
}

export default AddUserUseCase;