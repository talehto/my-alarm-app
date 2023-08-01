# my-alarm-app
Alarm application for an Android

## Executing app
This chapter contains commands to start an application.

### Server

Compiling a server code.
```
$ cd server
$ npm run build
```

Running a server in the development mode.
```
$ cd server
$ npm run dev
```

## Create a project
This chapter contains instructions how this project has been created.

### Server side
Server uses Nodejs + Express + Typescript + MongoDB stack.
https://blog.logrocket.com/how-to-set-up-node-typescript-express/ 

https://www.youtube.com/watch?v=Ne0tLHm1juE&ab_channel=ZachGollwitzer

https://github.com/zachgoll/express-jwt-authentication-starter

https://www.youtube.com/watch?v=Gwru3BueuiE&ab_channel=NathanielWoodbury

https://github.com/jerrychong25/node-express-mongo-passport-jwt-typescript

```
$ cd server
$ npm init -y
# This command installs Typescipt globally.
$ npm install -g typescript
```
Generating tsconfig.json file.
```
$ npx tsc --init
```

Modify generated tsconfig.json file, so that it has following definitions:
```
{
  "compilerOptions": {                        
    "target": "es6",                               
    "module": "commonjs",                           
    "outDir": "./dist",                             
    "rootDir": "./src",                             
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,                       
  },
  "exclude":[
    "./node_modules"
  ]
}
```
Install following npm packages:
```
$ npm install express dotenv
$ npm install -D typescript concurrently nodemon @types/express @types/node
```

Add following definitions to package.json file:
```
{
  "scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\""
  }
}
```

Building a server side:
```
npm run build
```

Running server in the development mode:
```
cp .env ./dist/
npm run dev
```

