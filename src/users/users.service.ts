import { Injectable } from '@nestjs/common';

// 这应该是一个表示用户实体的真实类/接口
export type User = any;

@Injectable()
export class UsersService {
    private readonly users = [{
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'maria',
        password: 'guess',
      },
    ];

    async findOne(username:string):Promise<User | undefined>{
        return this.users.find(user=>user.username === username);
    }
}
