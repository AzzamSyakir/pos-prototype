export class UserEntity {
  constructor(id, name, email, password, phone_number, stripe_customer_id) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone_number = phone_number;
    this.stripe_customer_id = stripe_customer_id;
  }
}
