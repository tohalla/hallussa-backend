# Endpoints

- [Endpoints](#endpoints)
  - [Routes](#routes)
    - [Auth](#auth)
    - [Account](#account)
    - [Organisation](#organisation)
      - [Appliances](#appliances)
      - [Maintainers](#maintainers)
    - [Maintenance](#maintenance)
  - [Protection levels](#protection-levels)

## Routes

### Auth

| method | route  | description                                                             | protection level |
| ------ | ------ | ----------------------------------------------------------------------- | ---------------- |
| GET    | /auth/ | Renew jwt                                                               | auth             |
| POST   | /auth/ | Authentication route. Requires password and email to be present in body | none             |

### Account

| method | route     | description                              | protection level |
| ------ | --------- | ---------------------------------------- | ---------------- |
| GET    | /account/ | Get authenticated account information    | auth             |
| POST   | /account/ | Add new account (registration)           | none             |
| PATCH  | /account/ | Update authenticated account information | auth             |

### Organisation

| method | route                        | description                                       | protection level |
| ------ | ---------------------------- | ------------------------------------------------- | ---------------- |
| GET    | /organisations/              | Get all organisations listed under active account | auth             |
| POST   | /organisations/              | Add new organisation                              | auth             |
| GET    | /organisations/:organisation | Get single organisation                           | organisation     |

#### Appliances

| method | route                                                          | description                                     | protection level |
| ------ | -------------------------------------------------------------- | ----------------------------------------------- | ---------------- |
| GET    | /organisations/:organisation/appliances                        | Get all organisations appliances                | organisation     |
| POST   | /organisations/:organisation/appliances                        | Add new appltiance                              | organisation     |
| GET    | /organisations/:organisation/appliances/qr?appliances=[]       | Get QR -codes for appliances. Returns html page | organisation     |
| GET    | /organisations/:organisation/appliances/:appliance             | Get single appliance                            | organisation     |
| PATCH  | /organisations/:organisation/appliances/:appliance             | Patch single appliance                          | organisation     |
| DEL    | /organisations/:organisation/appliances/:appliance             | Delete single appliance                         | organisation     |
| GET    | /organisations/:organisation/appliances/:appliance/maintainers | Get maintainers for appliance                   | organisation     |
| POST   | /organisations/:organisation/appliances/:appliance/maintainers | Add maintainer to appliance                     | organisation     |
| DEL    | /organisations/:organisation/appliances/:appliance/maintainers | Remove maintainer from appliance                | organisation     |

#### Maintainers

| method | route                                                           | description                          | protection level |
| ------ | --------------------------------------------------------------- | ------------------------------------ | ---------------- |
| GET    | /organisations/:organisation/maintainers                        | Gest all organisations maintainers   | organisation     |
| POST   | /organisations/:organisation/maintainers                        | Add new maintainer                   | organisation     |
| GET    | /organisations/:organisation/maintainers                        | Gets all organisations maintainers   | organisation     |
| GET    | /organisations/:organisation/maintainers/:maintainer            | Get single maintainer                | organisation     |
| DEL    | /organisations/:organisation/maintainers/:maintainer            | Delete single maintainer             | organisation     |
| PATCH  | /organisations/:organisation/maintainers/:maintainer            | Patch single maintainer              | organisation     |
| GET    | /organisations/:organisation/maintainers/:maintainer/appliances | Get appliances for single maintainer | organisation     |

### Maintenance

These endpoints are for filling in maintenance requests and maintainer maintenance forms

| method | route                                        | description                                                       | protection level |
| ------ | -------------------------------------------- | ----------------------------------------------------------------- | ---------------- |
| GET    | /maintenance/:applianceHash                  | Get maintenance request form. **Returns HTML page**               | none             |
| POST   | /maintenance/:applianceHash                  | Endpoint for handling maintenance request form. Adds new request. | none             |
| GET    | /maintenance/:applianceHash/:taskHash        | Maintenance task endpoint. Will return page pased on task status. | maintainer       |
| POST   | /maintenance/:applianceHash/:taskHash        | Handle maintainer form. Sets maintenance event to resolved.       | maintainer       |
| POST   | /maintenance/:applianceHash/:taskHash/accept | Accept maintenance event.                                         | maintainer       |

## Protection levels

|              | Description                                                                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| none         | Anyone can access the resource.                                                                                                                                                                                                |
| maintainer   | Anyone providing correct hash combinations can access the resource. Hashes are provided to maintainers via email. Will not provide access to maintenance events if some other maintainer has already accepted maintenance task |
| auth         | Only authenticated users can access the resource.                                                                                                                                                                              |
| organisation | Only authenticated users, that are members of the organisation can access the resource                                                                                                                                         |
