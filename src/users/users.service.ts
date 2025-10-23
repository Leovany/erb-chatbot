import { Injectable } from "@nestjs/common";

// 这应该是一个表示用户实体的真实类/接口
export type User = any;

/**
 * 用户模块
 */
@Injectable()
export class UsersService {
  // TODO: 从数据库取数据
  private readonly users = [
    {
      userId: 1,
      username: "admin",
      password: "123456",
    },
    {
      userId: 2,
      username: "bob",
      password: "bob",
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
