import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { request } from 'express';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../../src/modules/user/dto/create-user.dto';
import { createRequest, createResponse } from 'node-mocks-http';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: any;
  const req = createRequest();
  req.res = createResponse();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  let target: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  const metadataBody: ArgumentMetadata = {
    type: 'body',
    metatype: CreateUserDto,
    data: '',
  };

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'email',
        password: 'password',
      };
      authService.register.mockReturnValue(dto);
      expect(await authController.register(dto)).toEqual(dto);
    });

    it('should validate email and password', async () => {
      const dto = {};
      await target.transform(<CreateUserDto>dto, metadataBody).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'Email is not valid',
          'Password must be at least 8 characters long',
          'Password is required',
        ]);
      });
    });
  });

  describe.only('login', () => {
    it('should return a login jwt token', async () => {
      const dto = {
        email: 'email',
        password: 'password',
      };
      const token = 'token';
      authService.login.mockReturnValue(token);
      expect(await authController.login(req, dto)).toEqual(token);
    });
  });

  describe('profile', () => {
    it('should return a user profile', async () => {
      const user = {
        email: 'email',
        password: 'password',
      };
      req.user = user;
      expect(await authController.getProfile(req)).toEqual(user);
    });
  });
});
