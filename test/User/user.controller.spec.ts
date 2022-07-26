import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/modules/user/user.entity';
import { UserService } from '../../src/modules/user/user.service';
import { Repository } from 'typeorm';
import { repositoryMockFactory, type MockType } from '../mocker';
import { UserController } from '../../src/modules/user/user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('findAll', () => {
    const users = [
      { email: '123', password: 'password', _id: '1d12edas' },
      { email: '456', password: 'pass', _id: 'Casct' },
      { email: '789', password: 'word', _id: 'jtydasd' },
    ];
    it('should return an array of users', async () => {
      userService.findAll.mockReturnValue(users);
      expect(userController.findAll()).toBe(users);
    });
  });
});
