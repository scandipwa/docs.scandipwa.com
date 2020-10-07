---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Ngrok container HOWTO
description: ScandiPWA Docker setup provides an Ngrok container in order to simplify third-party services' integrations' development and testing process

---

## What is this?

Ngrok container is a thing that can save you a decent amount of time during the third-party integrations' development process. Feel welcome to get acknowledged with the documentation [on the official website](https://ngrok.com/).

The `ngrok` container provides an opportunity to get your application tunnelled from your `localhost` to a remote `ngrok` domain, which is cost-free for up to 8 hours and is convenient to enter into any API that should whitelist you explicitly.

## Before you start

Make sure your Docker setup is relevant - it should have a `docker-compose.ngrok.yml` file provided. If you don't see this file - try simply migrating this single file from the latest Docker setup version.

## It is time to setup!

The only thing necessary here is including the `docker-compose.ngrok.yml` file in your startup/teardown sequence.

### Linux

In order to launch the project with the ngrok container on Linux platform, you should add a new alias to your alias pool. See an example below.

```bash
# Having the following alias
alias dcf='docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml'

# Create a new one for startup with the ngrok container
alias dcn='dcf -f docker-compose.ngrok.yml'
```

### Mac

In order to launch the project with the ngrok container on Mac platform, you should modify the `mutagen.<...>.yml` file(s) which you use to start the application. See an example below.

```yml
beforeCreate:
  - >
    <....>
    -f docker-compose.ngrok.yml
    up -d --force-recreate
afterCreate:
  - >
    <....>
    -f docker-compose.ngrok.yml
    logs -f app
afterTerminate:
  - >
    <....>
    -f docker-compose.ngrok.yml
    down
```

## Using the container

1. Start the application using the new alias (Linux) or the updated file (Mac)
2. Go to `localhost:4040`
3. Utilise the functionality! See the ngrok usage instructions either inside of that panel or on the official website.
