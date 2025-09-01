export class UserModel {
  constructor(id, name, email, password, phoneNumber, stripeCustomerId, created_at, updated_at) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.stripeCustomerId = stripeCustomerId;
    this.created_at = created_at;
    this.updated_at = updated_at
  }
}
