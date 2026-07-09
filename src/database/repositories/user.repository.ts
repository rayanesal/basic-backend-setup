import { Db, ObjectId } from "mongodb";

import { UserEntity } from "#/database/entities/user.entity.js";

export class UserRepository {
  private collection;

  constructor(db: Db) {
    this.collection = db.collection<UserEntity>("users");
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.collection.findOne({ email });
    return doc ? new UserEntity(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? new UserEntity(doc) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    await this.collection.insertOne(user);
    return user;
  }
}
