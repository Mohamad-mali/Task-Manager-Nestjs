## Description

Nest js centered api for a TaskManger app

## porject needs

1. postgress SQL, or any type of SQL Database
2. Redis
3. Node v22.18

## Running the project on local

You find some guides for the configuration in the env file too!!

### DATABASE SETUP

1. go to the env file and change the POSGRESS username, password to yours
2. inside of the sql you must create a db named "taskmanagernest"
3. expose postgress on port "5432"

### REDIS

instal the redis and expose it on defaul port "6379"

### app

after running the commands for local you can run the porject and it is accessable on port 3000

## Running porject on docker

1. install Postgress db image and configure it
2. install Redis image and configure it
3. run the docker compose command

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
