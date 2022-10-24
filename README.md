# TODO List - REST API

## [Demo Video](https://youtu.be/fytZMP_d95Q)

## Supported APIs
To test APIs, simply import [TODO List - REST API Collection](https://www.getpostman.com/collections/1fb39503a7df2d1d31a7) to Postman
- Creates a User to use in TODO requests
- Creates a TODO item
- Fetch all TODO items
- Fetch TODO item details
- Update TODO item
- Delete TODO item

## Prerequisite
- [Node.js](https://nodejs.org/en/) **16.x >=**
- [Docker](https://www.docker.com/products/docker-desktop/) **20.x.x >=**

## Setup
```
$ ./0.setup.sh
```
## Run App
```
$ yarn start
```

## Unit Test
![Unit Test Coverage](https://user-images.githubusercontent.com/2268807/197543173-61005b70-469e-46b8-92cf-fc2bf890b47f.png)

To run unit tests locally:
```
$ yarn test
```

Coverage:
```
$ yarn test:c
```

