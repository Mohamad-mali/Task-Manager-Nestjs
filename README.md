## Description

Nest js centered api for a TaskManger app

-porject needs-

postgress SQL, or any type of SQL Database
Redis
Node v22.18

--Running the project on local--

-DATABASE SETUP!

go to the env file and change the POSGRESS username, password to yours
inside of the sql you must create a db named "taskmanagernest"
expose postgress on port "5432"

-REDIS

instal the redis and expose it on defaul port "6379"

-app

after running the commands for local you can run the porject and it is accessable on port 3000

--Running porject on docker--

-install Postgress db image and configure it

-install Redis image and configure it

-run the docker compose command

## Project setup

# Docker

```bash
$ Docker compose up

```

# local

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test


# test coverage
$ npm run test:cov
```
