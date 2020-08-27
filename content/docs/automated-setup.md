---
# Page settings
layout: default
keywords:
comments: false
# Hero section
title: Automated setup (BETA)
description: This guide is for setting up on ScandiPWA loaclly using automated setup.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---

## Supported Systems

- Arch
- Ubuntu (18.4, 19.10, 20.04)
- Manjaro (20.0.3)
- Linux Mint (19.10)
- MacOS Catalina 

## Before you start

1. Make sure you have a valid Magento 2 `COMPOSER_AUTH` set. This is an environment variable set on your host machine. To test if it is set, use:

```bash
env | grep COMPOSER_AUTH
```

If the output of this command is empty, or, if the output (JSON object) does not contain `"repo.magento.com"` key, you need to set / update the environment variable.

2. If you have nodejs preinstalled, make sure you are using version 10.2

3. If you have aliases preinstalles / same aliases used - you won't be asked if you want to add them
   

## Automated Setup Repository

Get the automated setup code from its [public GitHub repository](https://github.com/scandipwacloud/autoscandipwa).

## Linux Start

1. Run the script: 

```bash
bash install.sh
```

## MacOS Start

1. [Install docker](https://hub.docker.com/editions/community/docker-ce-desktop-mac/), run it and give special permissions manually

2. Run the script: 

```bash
bash install.sh
```

## FAQ

### Database migration failed: manual action required / magento: command not found

To solve that problem you need you to run the migration again:

```bash
docker ps | grep mysql
docker cp deploy/latest.sql <CONTAINER ID>:/tmp/dump.sql
docker-compose exec mysql bash
mysql -u root -pscandipwa -e "DROP DATABASE magento; CREATE DATABASE magento;"
mysql -u root -pscandipwa magento < /tmp/dump.sql
```

### SSL certificates

If scandipwa.local website is not trusted by default, then please:

1. Import the scandipwa-base/opt/cert/scandipwa-fullchain.pem

2. Type thisisunsafe on the certificate error page

### Please set COMPOSER_AUTH environment variable

Stop docker containers and restart the script.

### 502 bad gateway

Chrome and other browsers can cache page, just use hard reload or incognito mode. If doesn't help restart some containers.

- With aliases:

```bash
dc restart nginx ssl-term
dc restart varnish
```

- Without aliases:

```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml restart nginx ssl-term
docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml restart varnish
```

### Port {port} is used problem

If you don't know what can use specific port, you can print it:

```bash
sudo lsof -i -P -n | grep -w "*:{port} (LISTEN)" 
```

### Set up from beginning (install demo again)

Delete .env file in root of autoscandipwa folder:

```bash
rm -rf .env
```

### Elasticsearch dead

```bash
dcf down
docker volume rm scandipwa-base_elasticsearch-data
dcf pull
dcf up -d
```

### SSL container is dead

- Check if scandipwa-base/opt/cert/ is not empty
- Remove .env from autoscandipwa folder
- Rerun the script and watch for SSL generation errors

### Other useful information

### Stop demo

- With aliases

```bash
cd scandipwa-base && dcf down
```

- Without aliases

```bash
cd scandipwa-base && docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml down 
```

### Delete some of demo docker images (others should be deleted manually)

```bash
docker rmi scandipwa/base scandipwa/rendertron scandipwa/varnish
```

### Delete all the demo docker images (including ALL other docker images)

```bash
docker system prune -a
```

### Aliases added by script

- Use dc to start without frontend container

```bash
alias dc="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml"
```

- Use dcf to start with frontend container

```bash
alias dcf="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml"
```

- Use inapp to quickly get inside of the app container

```bash
alias inapp="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml exec -u user app"
```

- Use infront to quickly get inside of the frontend container

```bash
alias infront="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml exec -w /var/www/public/app/design/frontend/Scandiweb/pwa/ frontend"
```

- Use applogs to quickly see the last 100 lines of app container logs

```bash
alias applogs="docker-compose logs -f --tail=100 app"
```

- Use frontlogs to quickly see the last 100 lines of frontend container logs

```bash
alias frontlogs="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml logs -f --tail=100 frontend"
```

## Something does not work?

Follow this simple algorithm:

1. Refer to the [FAQ page](./installing.html). It most probably already has the solution to your problem.

2. If the issue still persists, [join our community slack](https://join.slack.com/t/scandipwa/shared_invite/enQtNzE2Mjg1Nzg3MTg5LTQwM2E2NmQ0NmQ2MzliMjVjYjQ1MTFiYWU5ODAyYTYyMGQzNWM3MDhkYzkyZGMxYTJlZWI1N2ExY2Q1MDMwMTk), and feel free to ask questions in `#pwa_tech` public channel.

3. Alternatively [create an issue on GitHub](https://github.com/scandipwacloud/autoscandipwa/issues/new) - however, the response time there will be a little-bit longer than in community Slack.

