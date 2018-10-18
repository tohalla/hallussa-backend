# HALLUSSA - server

This repository contains the server-side code of the HALLUSSA application.
HALLUSSA is an asset maintanance notifier / management application that utilizes QR codes for reporting issues.

This project is build using React.js, Redux, PostgreSQL, MongoDB, Typescript, Docker and Node.js among others.
An online demo is available at [here](https://www.google.com).

## Table of Contents

- [Git guidelines](#git-guidelines)
- [Getting started](#getting-started)
- [Project structue](#project-structure)
- [List of features](#list-of-features)
- [Deployment](#deployment)
- [Authors](#authors)

## Git guidelines

There are four (4) types of branches to be used in this project.

1. master
2. development
3. feature/[nameOfBranch]
4. hotfix/[nameOfBranch]

### 1. Branch master

The `master` branch should always be left in a state that it should be ready for production. This branch is the only branch from which deployment to server is made from.

Any non- or partially functioning `features/` should be left out of the `master` branch until they are fully finished.

Only the `development` branch and `hotfix/` type branches are allowed to be merged to `master`.

### 2. Branch development

The `development` branch should always be left in a state that the application can properly start up. Normally all features will be branched from the `development` branch. If you have to branch from `master` do not name the newly made branch with prefix `feature/`, but use `hotfix/` instead.

Merging `development` to `master` is done when all authors of the group unanimously agree that it is a good time to do so.

### 3. & 4. Branches of type /feature and /hotfix

The naming convention used in both `feature/` and `hotfix/` type branches is camel-casing eg. `feature/addReadmeToProject`.

#### 3. feature/

Any branches that is not meant for fixing something that is currently broken should be named `feature/nameOfFeature`.

#### 4. hotfix/

Any branches that aim to fix something that is currently broken should be named `hotfix/nameOfBrokenFeature`.

## Getting started

These instructions will guide you to running the project locally for development and testing purposes. See [Deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

Below are the mandatory requisites for this project:

- Node.js
- Yarn
- Docker
- docker-compose

### Installation

Below are guidelines for obtaining a copy of the project and running it on your local device.

#### Clone

Clone this repo to your local machine from URL.

#### Setup and development

1. Simply install the project dependencies:

   ```bash
   cd path\to\project
   yarn install
   ```

2. Run docker containers

   ```bash
   docker-compose up
   ```

3. After containers are up, run database migrations

   ```bash
   npm run migrate
   ```

## List of Features

- TODO

## Deployment

TODO

## Authors

- Touko Hallasmaa - touko.hallasmaa(at)aalto.fi
- Juho Jokela - juho.jokela(at)aalto.fi
- Hai Phan - minh.phan(at)aalto.fi

## Licence

TODO
