class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, res, next) {
    try {
      const loginUserUseCase = this._container.getInstance('LoginUserUseCase');

      const { accessToken, refreshToken } = await loginUserUseCase.execute(req.body);

      return res.status(201).json({
        status: 'success',
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      return next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      const refreshAuthenticationUseCase = this._container.getInstance('RefreshAuthenticationUseCase');

      const accessToken = await refreshAuthenticationUseCase.execute(req.body);

      return res.status(200).json({
        status: 'success',
        data: { accessToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      const logoutUseCase = this._container.getInstance('LogoutUserUseCase');

      await logoutUseCase.execute(req.body);

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthenticationsHandler;