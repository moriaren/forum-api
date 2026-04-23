import express from 'express';
import pool from '../database/postgres/pool.js';

// Repositories
import ThreadRepositoryPostgres from '../repository/ThreadRepositoryPostgres.js';
import CommentRepositoryPostgres from '../repository/CommentRepositoryPostgres.js';
import ReplyRepositoryPostgres from '../repository/ReplyRepositoryPostgres.js';
import UserRepositoryPostgres from '../repository/UserRepositoryPostgres.js';
import AuthenticationRepositoryPostgres from '../repository/AuthenticationRepositoryPostgres.js';
import UserCommentLikeRepositoryPostgres from '../repository/UserCommentLikeRepositoryPostgres.js';

// Use Cases
import AddThreadUseCase from '../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../Applications/use_case/GetThreadDetailUseCase.js';
import AddCommentUseCase from '../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../Applications/use_case/DeleteCommentUseCase.js';
import AddReplyUseCase from '../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../Applications/use_case/DeleteReplyUseCase.js';
import AddUserUseCase from '../../Applications/use_case/AddUserUseCase.js';
import LoginUserUseCase from '../../Applications/use_case/LoginUserUseCase.js';
import LogoutUserUseCase from '../../Applications/use_case/LogoutUserUseCase.js';
import RefreshAuthenticationUseCase from '../../Applications/use_case/RefreshAuthenticationUseCase.js';
import ToggleLikeCommentUseCase from '../../Applications/use_case/ToggleLikeCommentUseCase.js';

// Routes
import threads from '../../Interfaces/http/api/threads/index.js';
import comments from '../../Interfaces/http/api/comments/index.js';
import replies from '../../Interfaces/http/api/replies/index.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import likes from '../../Interfaces/http/api/likes/index.js';

// Security
import JwtTokenManager from '../security/JwtTokenManager.js';
import BcryptPasswordHash from '../security/BcryptPasswordHash.js';

// Error
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';

// Utils
import { nanoid } from 'nanoid';

const createServer = () => {
  const app = express();
  app.use(express.json());

  // ======================
  // Dependencies
  // ======================

  const threadRepository = new ThreadRepositoryPostgres(pool);
  const commentRepository = new CommentRepositoryPostgres(pool);
  const replyRepository = new ReplyRepositoryPostgres(pool);
  const userRepository = new UserRepositoryPostgres(pool, nanoid);
  const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  const userCommentLikeRepository = new UserCommentLikeRepositoryPostgres(pool, nanoid);

  const passwordHash = new BcryptPasswordHash();
  const tokenManager = new JwtTokenManager();

  // ======================
  // Use Cases
  // ======================

  const instances = {
    AddThreadUseCase: new AddThreadUseCase({ threadRepository }),

    GetThreadDetailUseCase: new GetThreadDetailUseCase({
      threadRepository,
      commentRepository,
      replyRepository,
    }),

    AddCommentUseCase: new AddCommentUseCase({
      commentRepository,
      threadRepository,
    }),

    DeleteCommentUseCase: new DeleteCommentUseCase({
      commentRepository,
      threadRepository,
    }),

    AddReplyUseCase: new AddReplyUseCase({
      replyRepository,
      commentRepository,
      threadRepository,
    }),

    DeleteReplyUseCase: new DeleteReplyUseCase({
      replyRepository,
      commentRepository,
      threadRepository,
    }),

    AddUserUseCase: new AddUserUseCase({
      userRepository,
      passwordHash,
    }),

    LoginUserUseCase: new LoginUserUseCase({
      userRepository,
      authenticationRepository,
      passwordHash,
      tokenManager,
    }),

    RefreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
      authenticationRepository,
      tokenManager,
    }),

    LogoutUserUseCase: new LogoutUserUseCase({
      authenticationRepository,
    }),

    ToggleLikeCommentUseCase: new ToggleLikeCommentUseCase({
      userCommentLikeRepository,
      commentRepository,
      threadRepository,
    }),

    JwtTokenManager: tokenManager,
  };

  const container = {
    getInstance: (name) => instances[name],
  };

  // ======================
  // Auth Middleware
  // ======================

  app.use((req, res, next) => {
    req.auth = null;

    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return next();

    try {
      const decoded = tokenManager.verifyAccessToken(token);
      req.auth = { credentials: decoded };
    } catch {
      req.auth = null;
    }

    return next();
  });

  // ======================
  // Routes
  // ======================

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  app.use('/threads', threads(container));
  app.use('/threads', comments(container));
  app.use('/threads', replies(container));
  app.use('/threads', likes(container));

  // ======================
  // 404 Handler
  // ======================

  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'route tidak ditemukan',
    });
  });

  // ======================
  // Error Middleware
  // ======================

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(err);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    if (process.env.NODE_ENV !== 'test') {
      console.error(err);
    }

    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

export default createServer;