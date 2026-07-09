import { ObjectId } from "mongodb";

export class BaseEntity {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;

  constructor({ _id, created_at, updated_at }: Partial<BaseEntity> = {}) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? new Date();
  }
}
