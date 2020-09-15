---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Postman & GraphQL Playground
description: In this guide you can find out how to streamline your workflow with Postman, GraphQL playground and some other tools

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/27IHNDG4Kaw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

If you don't already have a preference of your own, check out the ScandiPWA tool recommendations for debugging and database management.

Recommended tools:
- [GraphQL Playground](https://github.com/prisma-labs/graphql-playground)
- [Postman](https://www.postman.com/)
- [DBeaver](https://dbeaver.io/) for Linux
- [Sequel Pro](https://www.sequelpro.com/) for Mac

Topics covered:
- GraphQL Playground features
- Postman features
- Database management tools

## GraphQL Playground Features
You can download the latest release for your platform of choice - Mac, Linux or Windows. 

- Ability to store schema, tabs and workspaces. 
- 'DOCS' section lets you preview GraphQL queries, type details and specific fields of a schema.
- The 'SCHEMA' tab allows you to preview the GraphQL schema and download it as a file. 
    - You can parse through 'SCHEMA' using regular expressions and search for 'DOCS' using the search field.
- Ability to add multiple URLs
- 'PRETTIFY' code feature
- Request history
- Support for HTTP headers and query variables
    - Send requests with HTTP headers by adding them as a JSON object in the 'HTTP HEADERS' section.

- No proper error handling
    - If your GraphQL server responds with a non-json error you'll see:
    ```javascript
    "error": "Unexpected token < in JSON at position 0"
    ```
    - In this case you can 'Inspect Element' with the Inspector and you'll see how the request is sent in the 'Response' and 'Preview' tab. In this case it's:
    ```text
    502 Bad Gateway
    ```

## Postman Features
Postman is a user-friendly tool for API testing. If you're not sure whether or not this tool is for you, just `ctrl + F` your request [here](https://www.postman.com/postman-features/).

Some of the major features are:
- Test writing
    - See the full error logs right away, not only for POST requests, but also for GET requests.
- Executing multiple simultaneous requests
    - Useful for finding bugs that happen radomly, i.e. in a specific period of time.

## Database Management Tools
[DBeaver](https://dbeaver.io/) for Linux. You can check out the user-guide [here](https://github.com/dbeaver/dbeaver/wiki).

MySQL database management application for Mac - [Sequel Pro](https://www.sequelpro.com/). Read how to get started [here](https://sequelpro.com/docs).