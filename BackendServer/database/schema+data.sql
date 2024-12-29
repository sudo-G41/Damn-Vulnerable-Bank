drop database if exists dvba;
create database if not exists dvba;
use dvba;

create table users (
  id integer PRIMARY KEY auto_increment,
  username varchar(100) UNIQUE NOT NULL,
  password varchar(1024) NOT NULL,
  account_number integer UNIQUE,
  balance integer default 10000 NOT NULL,
  is_admin boolean default false,
  sign_in integer default 0,
  resident_number varchar(15) UNIQUE NOT NULL,
  profile_image varchar(255) DEFAULT NULL
) engine = innodb;

create table transactions (
  id integer PRIMARY KEY auto_increment,
  from_account int(11) NOT NULL,
  to_account int(11) NOT NULL,
  amount int NOT NULL
) engine = innodb;

create table beneficiaries (
  id integer PRIMARY KEY auto_increment,
  account_number int(11) NOT NULL,
  beneficiary_account_number int(11) NOT NULL,
  approved boolean default false NOT NULL
) engine = innodb;


INSERT INTO `users` values (default, "user1", "password1", 111111, default, default, default, "000101-3234567", default);
INSERT INTO `users` values (default, "user2", "password2", 222222, default, default, default, "000101-4234567", default);
INSERT INTO `users` values (default, "user3", "password3", 333333, default, default, default, "990101-1234567", default);
INSERT INTO `users` values (default, "user4", "password4", 444444, default, default, default, "990101-2234567", default);
INSERT INTO `users` values (default, "admin", "admin", 999999, default, true, default, "000000-0000000", default);
INSERT INTO `users` values (default, "test", "test123", 999999, default, default, default, "001225-4057788", default);

INSERT INTO `transactions` values (default, 111111, 222222, 100);
INSERT INTO `transactions` values (default, 222222, 111111, 200);
INSERT INTO `transactions` values (default, 111111, 333333, 100);
INSERT INTO `transactions` values (default, 111111, 444444, 100);

INSERT INTO `beneficiaries` values (default, 111111, 222222, true);
INSERT INTO `beneficiaries` values (default, 111111, 333333, true);
INSERT INTO `beneficiaries` values (default, 111111, 444444, true);