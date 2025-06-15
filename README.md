aequum NestJS hexagonal boilerplate
===================================

aequum framework based boilerplate for NestJS applications 
using hexagonal architecture.


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
- [`@aequum` Modules](#aequum-modules)
- [OpenAPI](#openapi)
- [Build](#build)
- [Configuration](#configuration)
- [Run](#run)
  

---

## Overview

Designed to create apps simple, easy and fairly fast, using 
NestJS with hexagonal architecture, DDD and some other design 
patterns to make the code more readable, maintainable and 
testable.

This boilerplate includes:

- Mongoose (In `base+mongoose` and `base+auth+mongoose` branch)
  - Pre-built tools for virtual `id` field instead of `_id` 
  - Pagination using `mongoose-paginate-v2`
- TypeORM (In `base+typeorm` and `base+auth+typeorm` branch)
  - URI type connection string 
  - Preconfigured migrations
  - Simple migration commands on `npm run`
- OpenAPI (Swagger) docs
- Built in CRUD/CRUDL operations to fasten the development
  - CRUD/CRUDL service
    - Mongoose
    - TypeORM
    - Supports custom filters for operations
  - CRUD/CRUDL controller
    - With configurable options
    - Supports custom filters for operations
    - OpenAPI/Swagger documentation automatically generated
- Descriptive, rich, autoexlpainable and debugable exceptions
  - `@aequum/nestjs-exceptions` module
- Common and simple pagination
  - Pagination integrated for CRUDL list operations
  - Support custom filters
- Authentication module via `@aequum/nestjs-auth` (In `base+auth`, `base+auth+mongoose` and `base+auth+typeorm` branches)
  - JWT authentication using passport
  - Password hashing via bcrypt
  - Decorator for user authentication
- RBAC basic authorization module via `@aequum/nestjs-authz`
  - User roles and permissions
  - Decorators
- Docker


## Code architecture

The codebase is designed to separate concerns and responsibilities into
different layers according to hexagonal architecture principles,
separating the business logic from the application and its 
infrastructure associated with it.

We will use a Shared Kernel layer to get all the shared components 
in one place, detailed info will be in  `Shared kernel` section.


## `@aequum` modules

The boilerplate over the time becomes a framework of packages to
use in favor to have shared components, versioning and all the 
advantages of port to a package.

### Base `aequum` modules

- **[@aequum/crudl](https://github.com/fbuccioni/aequum/blob/main/packages/crudl/)**: CRUD/CRUDL operations common components
- **[@aequum/exceptions](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/)**: Common exceptions collection
- **[@aequum/geojson-models](https://github.com/fbuccioni/aequum/blob/main/packages/geojson-models/)**: GeoJSON models with `class-validator`
- **[@aequum/mongoose](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/)**: Aequum mongoose tools for repository, pagination, CRUD/CRUDL, configs, and utils
- **[@aequum/paginate-common](https://github.com/fbuccioni/aequum/blob/main/packages/paginate-common/)**: Paginated results common components
- **[@aequum/typeorm](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/)**: Aequum TypeORM tools for repository, pagination, CRUD/CRUDL, configs, and utils
- **[@aequum/types](https://github.com/fbuccioni/aequum/blob/main/packages/types/)**: Common types collection
- **[@aequum/utils](https://github.com/fbuccioni/aequum/blob/main/packages/utils/)**: aequum util functions collection
- **[@aequum/validators](https://github.com/fbuccioni/aequum/blob/main/packages/validators/)**: Custom validators for `class-validator`

### NestJS `aequum` modules

- **[@aequum/crudl](https://github.com/fbuccioni/aequum/blob/main/packages/crudl/)**: CRUD/CRUDL operations common components
- **[@aequum/exceptions](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/)**: Common exceptions collection
- **[@aequum/geojson-models](https://github.com/fbuccioni/aequum/blob/main/packages/geojson-models/)**: GeoJSON models for `class-validator`
- **[@aequum/mongoose](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/)**: Mongoose tools
- **[@aequum/paginate-common](https://github.com/fbuccioni/aequum/blob/main/packages/paginate-common/)**: Pagination common components
- **[@aequum/typeorm](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/)**: TypeORM tools
- **[@aequum/types](https://github.com/fbuccioni/aequum/blob/main/packages/types/)**: Common types collection
- **[@aequum/utils](https://github.com/fbuccioni/aequum/blob/main/packages/utils/)**: Util functions collection
- **[@aequum/validators](https://github.com/fbuccioni/aequum/blob/main/packages/validators/)**: Custom validators for `class-validator`


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
`@aequum/nestjs-exceptions` module.

#### Duplication exceptions

To handle the duplication exceptions we will catch the `unique` or
`primary key` exception and replacing it for a 
`DuplicateEntryException` that will be handled by `common-exception`


## OpenAPI/Swagger

by calling the following endpoint you can see the Swagger OpenApi 
documentation and explore all the available apis and schemas.

`http://localhost:{port_number}/api/{api_version}/spec`


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


## Configuration

To run the application you must configure the environment, here is a file
[`.env.example`](.env.example) with the default value, you can copy it to
`.env` and change the values to your needs.


## Run

The main entrypoint file must be `dist/application/api/main.js` and you must
have a `.env` file or set the environment variables in the system.

For now the application can be packed on **Docker** and **Docker Compose**, 
there is a `Dockerfile` and `docker-compose.yaml` file to pack and run the 
application.

**NOTE:`docker-compose.yaml` also get configs from environment**
