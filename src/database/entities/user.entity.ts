import { Role } from "#/guard/index.js";
import { BaseEntity } from "#/shared/common/base-entity.js";

export class UserEntity extends BaseEntity {
  role: Role;
  name: string;
  email: string;
  password: string;

  constructor(
    props: {
      role: Role;
      name: string;
      email: string;
      password: string;
    } & Partial<BaseEntity>,
  ) {
    super(props);
    this.role = props.role;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }
}
