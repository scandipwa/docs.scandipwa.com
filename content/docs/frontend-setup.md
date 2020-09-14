---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: ScandiPWA Frontend Set-Up
description: This guide will lead you through setting up ScandiPWA Frontend

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/TqJw883qvrA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
- [How To Start The Development Set-Up?](#how-to-start-the-development-set-up)
- [Working With The Front-End Container: Difference Between The Production And Development Set-Up](#working-with-the-front-end-container-difference-between-the-production-and-development-set-up)
- [Overriding A Component: Step-By-Step Walkthrough](#overriding-a-component-step-by-step-walkthrough)

## What Is A Front-End Container?
ScandiPWA Docker set-up comes with two options. You can either wither with or without front-end.

A front-end container completely replaces the front-end for the application. So, instead of the Magento server providing you with the front-end, the `webpack` dev server does it.

## How To Start The Development Set-Up?
You can check out one of our [Docker set-up tutorials](https://docs.scandipwa.com/docs/linux.html) to find out more about the recommended aliases.

To start the development set-up use:
```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml up -d --remove-orphans
```

Or, if you have this alias set up
```bash
# docker-compose with front-end
alias dcf="docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.ssl.yml -f docker-compose.frontend.yml"
```
use
```bash
dcf up -d --remove-orphans
```

## Working With The Front-End Container: Difference Between The Production And Development Set-Up

|PRODUCTION SET-UP|DEVELOPMENT SET-UP|
|---|---|
||`...-f frontend.compose.frontend.yml...`|
|M2 <br> handles **all** requests |`/graphql`, `/admin` --> **M2** back-end server|
|`npm run build` | `/category`, `/123` etc. --> `webpack` dev server|
|Customization works|No customization|
|URL rewrites work|No URL/rewrites/redirects|
||Dev server watches the files|
||In-memory caching - quick recompilation|

### The Development Set-Up
- To start, use an additional file `docker-compose-frontend.yml` or the `dcf` alias.
- `/graphql` and `/admin` will be handled by Magento.
- `/category`, `/products` etc. will be handled by the `webpack` dev server
    - The `webpack` dev-server will be running in a container called `frontend`.
- No customization abilities.
    - ScandiPWA supports color and content customization, however, it won't function in development mode
- No URL rewrites/redirects .
    - Magento router is not involved in the response generation, instead it is done by the `webpack` dev server.
    - What are the pluses of this approach?
        - Dev server watches the files from your theme directory `app/design/frontend/Scandiweb/pwa`. Recompiles after every change.
        - In-memory caching allows for quick recompilation of only the files which are changed or hot-reloading.

### The Production Set-Up
- Every request is handled by Magento
- Any change in the ScandiPWA folder will require for you to run the command `npm run build` from its directory.
    - Any change requires full recompilement unlike in the development mode, where only the changed files are recompiled.
- URL rewrites work
- Customization works
    - If you want to check out your customization, you need to switch into production mode and remove `-f docker-compose.frontend.yml` from the stack

> **Note**
>
> The first set-up must be done in production mode, without the front-end container

You can check out our docs for a [step-by-step guide](https://docs.scandipwa.com/docs/linux.html) on how to correctly set-up.

## Overriding A Component: Step-By-Step Walkthrough
If you don't want to debug, change the `.env` file's `PROJECT-IMAGE = xdebug` to `PROJECT-IMAGE = latest`.
Now, when force recreating with `dcf up -d --remove-orphans` we see that the front-end container gets set up.

Use the alias `frontlogs` or `dcf logs -f frontend` to see what the state of the application is.

If you see the following output, the front-end is ready. You can open a browser and go to `scandipwa.local` to make sure that, indeed, the front-end is ready and will hot-reload.
```bash
ℹ ｢wdm｣: Compiled successfully
```
Open the folder `scandipwa-base/src/app/design/frontend/Scandiweb/pwa/src` and create an `app` folder in it. 

You can check out the ScandiPWA [VSCode extension](https://github.com/scandipwa/scandipwa-development-toolkit) to improve the speed of your workflow.

Assuming that you have the extension installed, search for `ScandiPWA: Extend source component` and select `Breadcrumbs` as a component to override. Press ok and then `Extend them!`.

You'll see the `Breadcrumbs.component.js` file. Here `eslint` is already configured, but feel free to read more [here](https://eslint.org/docs/2.0.0/user-guide/configuring) or [here](https://medium.com/progressivewebapps/scandipwa-updates-august-11-issue-58-f97853034ebe), and check out the ScandiPWA [`eslint` plug-in](https://github.com/scandipwa/eslint).

Open the `Breadcrumbs.override.style.scss` file, it will be full of warnings due to the fact that [`stylelint`](https://stylelint.io/) is working.

Let's check-out where the breadcrumbs are displayed on the web app. Go to your browser and type `scandipwa.local`. Then go to "woman" > "dresses" for example, and right-click "Inspect element".

You'll see the element class `Breadcrumbs` and all of its children who have `.Breadcrumbs-List` styles. This is called BEM or Block Element Modifier and you can read more about it [here](http://getbem.com/introduction/).

For this example we're interested in where the color of `Breadcrumbs` is and upon further inspection we can see that it happens in the `.Breadcrumbs` block. 

Return back to the `Breadcrumbs.override.style.scss` file and type the following.
```scss
:root{
  --breadcrumbs-background: red;
}
```
Go back to your browser to check if its working. You should see a red breadcrumb container. This happens because the front-end container immediately compiles the styles and anything else in the ScandiPWA front-end app.
