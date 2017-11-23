# Introduction
This is a web application for course enrollment. This project is built on Node.js with Express framework.

## Features
- register new account
- log in
- display enrolled courses and all available courses
- enroll courses
- drop courses
- log out

## Installation
```sh
$ npm install
```

## Dependencies
- [express](https://github.com/expressjs/express/)
- [mysql](https://github.com/mysqljs/mysql)
- [body-parser](https://github.com/expressjs/body-parser)
- [express-session](https://github.com/expressjs/session)
- [cookie-parser](https://github.com/expressjs/cookie-parser)
- [method-override](https://github.com/expressjs/method-override)
- [ejs](http://www.embeddedjs.com/)

## Database configuration
This application run with a MySQL database that has three tables: *user*, *course* and *enroll*.
You can create these tables by running [ntduy96.sql](ntduy96.sql) in this project folder.

### User

| Field    | Type         | Null | Key | Default | Extra |
|----------|--------------|------|-----|---------|-------|
| username | varchar(100) | NO   | PRI | NULL    |       |
| fname    | varchar(100) | NO   |     | NULL    |       |
| lname    | varchar(100) | NO   |     | NULL    |       |
| email    | varchar(100) | NO   | UNI | NULL    |       |
| password | varchar(256) | NO   |     | NULL    |       |

### Course
| Field       | Type          | Null | Key | Default | Extra |
|-------------|---------------|------|-----|---------|-------|
| course_id   | char(5)       | NO   | PRI | NULL    |       |
| course_name | varchar(512)  | NO   |     | NULL    |       |
| course_desc | varchar(1024) | NO   |     | NULL    |       |

### Enroll
| Field      | Type         | Null | Key | Default           | Extra |
|------------|--------------|------|-----|-------------------|-------|
| user       | varchar(100) | NO   | MUL | NULL              |       |
| course     | char(5)      | NO   | MUL | NULL              |       |
| created_at | timestamp    | NO   |     | CURRENT_TIMESTAMP |       |

## Run server
```sh
$ node app
```

## License

[MIT](LICENSE)
