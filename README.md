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
3. expose postgress on port [http://localhost:5432]

### REDIS

instal the redis and expose it on defaul port [http://localhost:6379]

### app

after running the commands for local you can run the porject and it is accessable on [http://localhost:3000/]

### swagger

Access the api doc via [http://localhost:3000/api]

## Running porject on docker

1. install Postgress db image and configure it
2. install Redis image and configure it
3. run the docker compose command

## ENV file example

```
APP_PORT = "3000" # app expose port

DB_TYPE = "postgres" # if using other type of SQL DB change it to your DB of choise

REDIS_HOST="redis"  # if using the local version of the redis, change this to "localhost"
REDIS_PORT=6379

POSTGRES_DB="taskmanagernest"
POSTGRES_HOST="postgres" # if using the local version of the postgress, change this to "localhost"
POSTGRES_USER="root" #your user in db
POSTGRES_PASSWORD="123456789" #your Password in db
POSTGRES_PORT=5432

```

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
