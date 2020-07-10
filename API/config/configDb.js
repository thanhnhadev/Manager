/*
    DB : PostgresSQL
 */

const { Pool } = require("pg");
/*--Config-for-local--*/
 const _pool = new Pool({
     user: "postgres",
     host: "localhost",
     database: "project-manager",
     password: "root",
     port: 5432
 });

/*--Config-for-server--*/
//const _pool = new Pool({
//    user: "khcjbbjsxxskot",
//    host: "ec2-54-225-242-183.compute-1.amazonaws.com",
//    database: "d76b1qlh6jdv6c",
//    password: "4d6149ded823948ddfc2a185b8c2f9265f0582fa21b8f2a48af6b153ec16e76e",
//    port: 5432,
//    ssl: true,
//    dialect: "postgres",
//    dialectOptions: {
//        "ssl": { "require": true }
//    }
//});

module.exports = { _pool };