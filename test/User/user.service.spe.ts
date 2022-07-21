import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/modules/user/user.entity';
import { UserService } from '../../src/modules/user/user.service';
import { Repository } from 'typeorm';
import { repositoryMockFactory, type MockType } from '../mocker';

describe('UserService', () => {
  let userService: UserService;
  let repositoryMock: MockType<Repository<User>>;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    repositoryMock = moduleRef.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email', async () => {
    const user = { email: '123', password: 'password', _id: '1d12edas' };
    repositoryMock.findOneBy.mockReturnValue(user);
    expect(userService.findOneBy(user.email)).toEqual(user);
  });

  it('should find all registed users', async () => {
    const users = [
      { email: '123', password: 'password', _id: '1d12edas' },
      { email: '456', password: 'pass', _id: 'Casct' },
      { email: '789', password: 'word', _id: 'jtydasd' },
    ];
    repositoryMock.find.mockReturnValue(users);
    expect(userService.findAll()).toEqual(users);
  });

  it('should remove all user', async () => {
    repositoryMock.delete.mockReturnValue([]);
    expect(userService.removeAll()).toEqual([]);
  });

  it('should create a user', async () => {
    const user = { email: '123', password: 'password', _id: '1d12edas' };
    repositoryMock.findOneBy.mockReturnValue(null);
    repositoryMock.save.mockReturnValue(user);
    expect(await userService.create(user)).toEqual(user);
  });

  it.only("shouldn't create a user if email already exist", async () => {
    const user = { email: '123', password: 'password', _id: '1d12edas' };
    repositoryMock.findOneBy.mockReturnValue(user);
    expect(() => userService.create(user)).rejects.toThrow(
      'Email already exist',
    );
  });
});
