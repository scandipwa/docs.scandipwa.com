---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: How To Migrate To A Newer Version OF ScandiPWA
description: How to migrate to a Newer Version of ScandiPWA.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/u6a5Abd_4fc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

We'll look at a situation where you've already developed your theme on ScandiPWA, and you're looking to update to a newer version.

Go to the [ScandiPWA base theme GitHub repository](https://github.com/scandipwa/scandipwa-base). In order to be notified of the latest [releases](https://github.com/scandipwa/scandipwa-base/releases) and/or updates make sure you're watching the repository or chosen 'Releases only'. 

Here you can see all of the minor and major releases and their features. If there are any, pay attention to the 'Important notes' section. 

If, for example, you need to add new dependencies to the project you need to go to `pwa/package.json` and check if the depencency and the version number is added there.  

If the depencency is not present in your `package.json` file, go to `scandipwa-base` folder and run:
```bash
dcf exec frontend bash
```
After this, run the following command that'll install the dependencies.
```bash
npm run <package-name>
```
If you need to install a specific version of a package you can use:
```bash
npm install <package>@<version>
```

If you need to adapt to changes in `webpack` production and development configs and update your files, do the following:
- Open up the release 
- Click compare, select the version you have and click on tab 'Files changed'
- After this you can just `ctrl + F` the files you specifically need, look at the changes and copy-paste into your `config` files.

These are the basic principles for ensuring that the update will go smoothly.

## Updating the base theme
You need to run the update through composer, since ScandiPWA is a composer app.

Run the following commands. If you need a refresher on aliases, go [here](https://docs.scandipwa.com/docs/linux.html).
```bash
// starts the app and opens bash
inapp bash

// updates the whole ScandiPWA package list
composer update scandipwa/* 

// updates Magento database schema and data
magento setup:upgrade
```
After this, you'll see changes in the `composer.lock` file. Make sure to commit these changes in order for them to be present throughout your deployments.

In order for the changes to take place you can use the [`docker restart`](https://docs.docker.com/engine/reference/commandline/restart/) command if you're using Docker, or go to your theme's directory in app and run `npm ci` and `npm run build`.

`npm run build` will build the application from the source and create a `Magento_Theme` folder. You can read more about `npm run build` [here](https://docs.scandipwa.com/docs/build-and-configuration.html#what-to-run-in-which-situation). 

> **Note**
>
> Don't forget to flush the Varnish cache

You can read about how to make Magento do it [here](https://devdocs.magento.com/guides/v2.4/config-guide/varnish/use-varnish-cache.html) and read the Varnish documentation [here](https://varnish-cache.org/docs/trunk/users-guide/purging.html). 