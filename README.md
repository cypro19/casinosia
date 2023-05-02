## Starting the project

1. Install dependencies:

```
npm --prefix=management-frontend install
npm --prefix=gs-admin-backend install
npm --prefix=gs-admin-frontend install --legacy-peer-deps
npm --prefix=gs-casino-backend install
npm --prefix=gs-casino-cron install
npm --prefix=gs-casino-services install
npm --prefix=infrastructure install
```

2. Start docker compose:

```
docker-compose up -V --build
```

## Service Ports

- Management frontend - port 8001
- Postgres database - port 5432
- GS Backend - port 4000
- GS Frontend - port 3000
- GS Casino Services - port 5500
- GS Casino Backend - port 5000

## Local Database

- [DBeaver](https://dbeaver.io/) - UI tool for working with Postgres

connecting to db:

```
psql postgresql://postgres_database:postgres__database@localhost:5432/
```

restore backup:

1. Requires user in database - `create user postgres;`
2. Create custom database - `create database casino_db_restored;`

3. Insert Dump:

```
psql postgresql://postgres_database:postgres\_\_database@localhost:5432/casino_db_restored < sql-dump/backup > dump-log.log 2>&1

```

- Sometimes getting error that database already exists: Then just run docker compose with `--build` parameter.

## AWS CLI Credentials

To use credentials using [CLI and SSO](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html):

Important to to set environment name to `nx-dev` since the name is used by `docker-compose.yaml`.

```
aws sso login
aws configure sso
export AWS_PROFILE=nx-dev
export AWS_REGION=eu-central-1
```

### Output specify

```
SSO start URL [None]: networx-casino.awsapps.com/start
SSO region [None]: eu-central-1
CLI default client Region [us-east-1]: eu-central-1
CLI default output format [json]:
CLI profile name [role]: nx-dev
```
