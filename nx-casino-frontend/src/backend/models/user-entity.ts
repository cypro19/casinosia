import { Entity, Column, CreateDateColumn } from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity {
  @Column({
    comment: "Cognito sub attribute",
    primary: true,
  })
  user_id!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  email!: string;

  @CreateDateColumn()
  date_of_birth!: Date;

  @Column()
  gender!: string;

  @Column()
  username!: string;

  @Column()
  country_code!: string;

  @Column()
  phone_code!: string;

  @Column()
  city!: string;

  @Column()
  zip_code!: string;

  @Column()
  password!: string;

  @Column()
  sign_in_count!: number;

  @Column()
  is_active!: boolean;

  @Column()
  affiliate_status!: boolean;

  @Column()
  currency_code!: string;

  @Column()
  kyc_status!: string;

  @Column()
  logged_in!: boolean;

  @Column()
  address!: string;

  @Column()
  level!: Number;

  @Column()
  loyalty_points!: number;

  @CreateDateColumn()
  created_at!: Date;

  @CreateDateColumn()
  updated_at!: Date;
}
