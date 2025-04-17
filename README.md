# NestJS hexagonal boilerplate

## Table of Contents

- [Overview](#overview)
- [Code architecture](#code-architecture)
  - [Folder structure](#folder-structure) 
    - [Application layer](#application-layer)
    - [Domain layer](#domain-layer)
    - [Infrastructure layer](#infrastructure-layer)
    - [Shared kernel layer](#shared-kernel-layer)
  - [Code design](#code-design)
    - [Models, database entities and DTOs](#models-database-entities-and-dtos)
    - [Common exceptions](#common-exceptions)
    - [Duplication exceptions](#duplication-exceptions)
- [OpenAPI](#openapi)
- [Build](#build)
- [Configuration](#configuration)
- [Run](#run)
  

## Overview

A boilerplate designed to use NestJS with hexagonal architecture,
DDD and some other design patterns to make the code more readable,

This boilerplate includes:

- Mongoose (in `mongoose` branch)
  - Pre-built tools for virtual `id` field instead of `_id` 
  - Pagination using `mongoose-paginate-v2`
- TypeORM (in `typeorm` branch)
  - URI type connection string 
  - Preconfigured migrations
  - Simple migration commands on `npm run`
- OpenAPI (Swagger) docs
- Built in CRUDL operations to fasten the development
  - CRUDL service
    - Mongoose
    - TypeORM
    - Supports custom filters for operations
  - CRUDL controller with OpenAPI specs
- Common and simple pagination
  - Pagination integrated for CRUDL list operations
  - Support custom filters
- Authentication module (authn)
- RBAC basic authorization module (authz)
- Docker

---

## Code architecture

The codebase is designed to separate concerns and responsibilities into
different layers according to hexagonal architecture principles,
separating the business logic from the application and its 
infrastructure associated with it.

We will use a Shared Kernel layer to get all the shared components 
in one place, detailed info will be in  `Shared kernel` section.


### Folder structure

The folder structure is as follows:

| Directory        | Layer          | Description                                                                      |
|------------------|----------------|----------------------------------------------------------------------------------|
| `application`    | Application    | Application services, DTOs, Nest Modules, NestJS controllers, etc                |
| `domain`         | Domain         | Business logic, entities, value objects, domain services, etc                    |
| `infrastructure` | Infrastructure | External interfaces, repositories, adapters, anti-corruption layers, etc         |
| `shared`         | Shared kernel  | Shared infrastructure components, common code like utilities and decorators, etc |

#### Application layer

The application layer is designed to store application services and DTOs
also can have different application inside it, the only app by default
in the boilerplate is `api`.

Directory structure:

| Directory  | Description               |
|------------|---------------------------|
| `api`      | Default `api` application |
| `dtos`     | Data Transfer Objects     |
| `services` | Application services      |

Directory structure for default `api` NestJS application:

| Directory                         | Description                                                     |
|-----------------------------------|-----------------------------------------------------------------|
| `examples`                        | "Example" namespace for the `api`                               |
| `app.module.ts`                   | Main application module                                         |
| `api-modules.export.ts`           | File to easy export the modules will be used in the application |
| `confirugation.ts`                | Application configuration                                       |
| `shared-infrastructure.module.ts` | A special module to call shared infrastructure components       |

#### Domain layer

The domain layer is designed to store business logic, entities, value
objects. This means every logic that can be used in different 
applications attached to the business logic.

Directory structure:

| Directory       | Description   |
|-----------------|---------------|
| `entities`      | Entities      |
| `services`      | Services      |
| `value-objects` | Value objects |
| `interfaces`    | Interfaces    |

#### Infrastructure layer

The infrastructure layer is the bridge between the application and
every external service associated with it, like databases, message
brokers, etc. 

The design pattern adopted to connect with external services is the
repository pattern.

By default, the only infrastructure is the `database`.


Directory structure:

| Directory               | Description                                  |
|-------------------------|----------------------------------------------|
| `database`              | Database infrastructure                      |
| `database/repositories` | Repositories                                 |
| `database/entities`     | Entities (schemas, models, interfaces, etc.) |

#### Shared kernel layer

The shared kernel layer is designed to keep all the shared components
in one place and use it in different layers if is just one service or
to share it between different applications if is a monorepo or to
separate them into a new package if you go with polyrepo.

Here are the components that can be shared like utils, decorators, some
common services or modules, everything reusable between domains or
layers.

Also, we will use the concept of shared infrastructure to store the adapters
of different services owned by the company but in different domains.

Directory structure:

| Directory        | Description                                              |
|------------------|----------------------------------------------------------|
| `common`         | Common non-nestjs components like utils, decorators, etc |
| `infrastructure` | Shared infrastructure components.                        |
| `nestjs`         | NestJS shared components                                 |
| `nestjs/common`  | Common                                                   |
| `nestjs/health`  | Health check module                                      |
| `nestjs/logger`  | Logger module                                            |

### Code design

The code design was made to be as clean as possible, following the
DDD and hexagonal architecture principles, the proper NestJS 
conventions and some approaches to make the code more readable and
maintainable.


#### Models, database entities and DTOs

To do a clear code we use the following convention:

1. Main model for entities will be  in `domain` layer, with its 
   validations and business logic all that is provided by 
   `class-validator` and `class-transformers` module.
2. Database entities will be in `infrastructure` layer, being an
   inherited class from main model in `domain` layer with all
   data validation like unique, indexes, etc.
3. DTOs will be in `application` layer, being an inherited class
   from main model in `domain` layer, with all the OpenAPI/Swagger
   documentation and validation for the API and no business logic.

#### Common exceptions

We will use common exceptions in the services to handle the errors
and will be converted to a proper response in the controller by
`common-exception` module.

#### Duplication exceptions

To handle the duplication exceptions we will catch the `unique` or
`primary key` exception and replacing it for a 
`DuplicateEntryException` that will be handled by `common-exception`

---
## OpenAPI

by calling the following endpoint you can see the Swagger OpenApi 
documentation and explore all the available apis and schemas.

`http://localhost:{port_number}/api/{api_version}/spec`


---
## Build

In favor of having a lightweight service, we use `pnpm` as package manager,
anything else is just a regular everyday normal `nest build` command.

For pipelines, we recommend to change `"typeCheck"` setting in `nest-cli.json` 
to `false` to avoid type checking on build time.

**Pipeline example**.
```bash
npm install pnpm
pnpm install
sed -i -e 's/\("typeCheck":\)[ \t]*true/\1 false/g' nest-cli.json
npx nest build
```

---
## Configuration

To run the application you must configure the environment, here is a file
[`.env.example`](.env.example) with the default value, you can copy it to
`.env` and change the values to your needs.

---
## Run

The main entrypoint file must be `dist/application/api/main.js` and you must
have a `.env` file or set the environment variables in the system.

For now the application can be packed on **Docker** and **Docker Compose**, 
there is a `Dockerfile` and `docker-compose.yaml` file to pack and run the 
application.

**NOTE:`docker-compose.yaml` also get configs from environment**
