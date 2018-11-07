# Endpoints

- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Account](#account)
  - [Organisation](#organisation)
    - [Appliances](#appliances)
    - [Maintainers](#maintainers)

## Auth

| method | route  | description                                                             | protection level |
| ------ | ------ | ----------------------------------------------------------------------- | ---------------- |
| GET    | /auth/ | Renew jwt                                                               | auth             |
| POST   | /auth/ | Authentication route. Requires password and email to be present in body | none             |

## Account

| method | route     | description                              | protection level |
| ------ | --------- | ---------------------------------------- | ---------------- |
| GET    | /account/ | Get authenticated account information    | auth             |
| POST   | /account/ | Add new account (registration)           | none             |
| PATCH  | /account/ | Update authenticated account information | auth             |

## Organisation

| method | route                        | description             | protection level |
| ------ | ---------------------------- | ----------------------- | ---------------- |
| POST   | /organisations/              | Add new organisation    | auth             |
| GET    | /organisations/              | Get all organisations   | auth             |
| GET    | /organisations/:organisation | Get single organisation | organisation     |

### Appliances

| method | route                                              | description                      | protection level |
| ------ | -------------------------------------------------- | -------------------------------- | ---------------- |
| POST   | /organisations/:organisation/appliances            | Add new appltiance               | organisation     |
| GET    | /organisations/:organisation/appliances            | Get all organisations appliances | organisation     |
| GET    | /organisations/:organisation/appliances/:appliance | Get single appliance             | organisation     |
| PATCH  | /organisations/:organisation/appliances/:appliance | Patch single appliance           | organisation     |

### Maintainers

| method | route                                                | description                        | protection level |
| ------ | ---------------------------------------------------- | ---------------------------------- | ---------------- |
| POST   | /organisations/:organisation/maintainers             | Add new maintainer                 | organisation     |
| GET    | /organisations/:organisation/maintainers             | Gest all organisations maintainers | organisation     |
| PATCH  | /organisations/:organisation/maintainers/:maintainer | Patch single maintainer            | organisation     |
