---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: FAQ about development
description: Resolve your development issue in this FAQ.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/faq'
  title: FAQ

---

**If you have not found an answer to your issue** here, but happened to resolve it on your own / with help of community - please open a pull-request, or an issue with solution details.

Alternatively, write us in [Slack](https://join.slack.com/t/scandipwa/shared_invite/enQtNzE2Mjg1Nzg3MTg5LTQwM2E2NmQ0NmQ2MzliMjVjYjQ1MTFiYWU5ODAyYTYyMGQzNWM3MDhkYzkyZGMxYTJlZWI1N2ExY2Q1MDMwMTk).

## Refetch component data when navigating back

Use “withRouter” to check for the URL and check if the new URL is different from the previous one.

## Understand important changes when upgrading ScandiPWA versions

All the important changes with each release are listed in GitHub under the [GitHub Release important notes section](https://github.com/scandipwa/base-theme/releases).

You can also compare two tags using [GitHub compare functionality](https://docs.github.com/en/github/committing-changes-to-your-project/comparing-commits).

General advice for easier upgrade process is to extend the code and keep the pure override count low. Extend original classes in overrides, do not copy them.

## Theme doesn't work if the index.php configured is not in the pub folder resulting in 404 error when requesting resources

ScandiPWA does not support installation in non /pub folder. Magento 2 also recommends installing it under /pub folder.

## Can't access Docker MySQL on my local setup

You can access Docker MySQL on your local setup with credentials from .application file and using 3307 port.

## ERROR: Connection to Redis redis:6379 failed after 2 failures.Last Error: (0) php_network_getaddresses: getaddrinfo failed: Name or service not known

This can happen after running the following command:

```bash
magento scandipwa:theme:bootstrap Scandiweb/pwa
```

To solve it you have to restart the app container. If this doesn't help run the following command:

```bash
docker run -it -e COMPOSER_AUTH --entrypoint /bin/bash APP_CONTAINER_NAME
```

After rerun the command:

```bash
magento scandipwa:theme:bootstrap Scandiweb/pwa"
```

## Where is the correct place to install a new font for the base theme?

Fonts should be installed in the theme public folder and in index.development.html

Before that you must create a file with a different name as it is always taken from vendor:
1. Rename the index file
2. Change webpack import for it
3. Add your new fonts there

## ERROR: main.CRITICAL: Class ...\App\Config\Initial\Reader\Proxy does not exist

Run the following command from Magento 2 root to resolve the issue:

```bash
rm -rf generated && magento c:f && chmod -R 777
```

## How to bypass HTTPs on local?

Site can be opened with HTTP and HTTPs by default on local.

## Newly added store is not working altough is shows up in the store switcher

Ensure that newly created stores are added to your Nginx configuration.

## Does ScandiPWA plan to implement TypeScript?

The core will not migrate to TypeScript in a relatively long term. The extensions however - might be done in any language. This is because of the learning curve needed for TypeScript. We prefer simplier technology - most M2 developer are relatively unexperienced with JavaScript. The interfaces and some TypeScript based components might come with UI library in the future. It is important step for extensions, as there is a need to depend on some abstraction when writing an extension.

## ERROR: no such file or directory, open '.../Scandiweb/pwa/package.json'

Run the following Magento command from the container:

```bash
scandipwa:theme:bootstrap Scandiweb/pwa
```

If it fails please remove the folder app/design/frontend/Scandiweb/pwa

## How to view real time code changes to the Theme?

Create a file with the same name in app/design and watch the following [tutorial video](https://www.youtube.com/watch?v=LcM3DlQ8TbU) to learn how to customize it.

## How to modify the root.phtlm on my custom theme?

Change the file name of your index.production.phtml and change the path to it in webpack.

## Can I extend constructors?

Changes in constructor at this momemnt irrevertable. While we are working on making them extendable please override them completly.

## Chrome extensions don't work.

You can run chrome with WEB security disabled.

## dcf up -d --remove-orphans can't bring frontend container up

Running the following command solves it:

```bash
dcf build
```

After build just rerun the following command:

```bash
dcf up -d --remove-orphans
```

<!-- ## What is the best practice to implement a new module between Magento and ScandiPWA?

You should develop using [ScandiPWA plugin mechanism](http://docs.scandipwa.com/docs/development/plugin-mechanism/). -->

## How ScandiPWA manages cache?

1. Utilizes default Magento 2 cache control mechanism over X-Magento-Tags-Pattern header.
2. Provides AddTagsToResponsePlugin to add entity headers to each GraphQl cacheable response.
3. Utilizes custom Cache entity (singleton), to gather all entities, that were loaded during current request.
4. Flush happens based on default cache_flush events for most entities.
5. CMS pages has own event observers to track response/flush.

## Don't see src folder changes immediatelly on update

Make sure -f docker-compose.local.yml is included

## Copying /abstract/_icons.scss file in custom pwa folder and changing menu icon didn't affect to the site.

Replace main.scss and replace it. After import original files from vendor and your custom file.

## Content is not appearing on fronted after installing ScandiPWA in running Magento instance

Your server is not configured to execute PHP. Configure web server property.

## How do I get public and private key from Magento marketplace?

Follow the steps provided in [the offical Magento Developer Docs](https://devdocs.magento.com/guides/v2.4/install-gde/prereq/connect-auth.html#:~:text=Click%20Access%20Keys%20in%20the,you%20can%20click%20to%20copy).

## ERROR: 413 Request Entity Too Large when uploading Slider images

Slider has 1 MB limit for images. Optimize image to be smaller than 1 MB. This will also boost your performance.

## How do I recompile file on frontend?

Restart the frontend container.

## How can I add an image to the splash screen?

To add an image to the splash screen you need modify config/webmanifest.config.js file.

## Can I use ScandiPWA theme only for mobile and tablet versions of the website?

You can do it by configuring NGINX. Additionally creating a separate store-view would help archive this.

## How do I add icons to the header, for example, wishlist icon?

You need to extend the header component and add the new icon.

## Can't open non-pwa page

All URLs that are PWA have to be configured in getBypassCacheHosts within scandipwa/source/src/sw/handler/UrlHandler.js file.

Example: 

```bash
'(?!^.*admin)', // Magento Admin. '(?!^.*default/inipay/std/test)', //
```

## How can I add additional fields in the checkout?

To add additional fields in the checkout:

1. Override and extend CheckoutAddressForm component (CheckoutAddressForm.component.js) method filedMap in the front end
2. The key you add must be a key matching GraphQL schema defined field key you plan to send to BE
3. On backend create a new Magento module, add new field to schema - the child field of input AddressInput
4. If that does not work add a resolver to the field and save the value of the field in quote

## Can't add new menu items to menu

Pay attention to the root parent item and make sure your root structure looks something like this: root < rootitem < men, women, kids, etc.

You need to create a new item to be on root.

## Where do I change the stylesheet for menu items?

You change the stylesheet where the BEM (block) part is declared. If class starts with "Hello-Friends_isGood" then look for "Hello" component.

## How do I create a multi-language website?

You can find information on multilanguage support [here](https://github.com/scandipwa/base-theme/releases/tag/2.7.0).

## How can I add a new page to the router?

Follow these steps to add a new page to the router:
1. Add it from constructor. 
2. Make sure you export everything just like the original class did. 
3. Import everything you plan to reuse (make sure to not import the default export).

## How can you add CMS block identifiers in the header?

You need to add them into the router as well because the request is proceessed there. currently the page is responsible for block loading not the CMS block itself. Add CMS block to getCmsBlocksToRequests() in the index.js (the main router). See the template for this file in override in [docs](https://docs.scandipwa.com/#/scandipwa/development/overrides).

## Translation is not working even after rebuilding the theme

Make sure you have set up Magento locale correctly in your store.

## ERROR: "Command make not found"

This command should be preinstalled. If it is not install the make command.

## How can I implement autoslider?

You would have to make direct changes to the JS component and do custom implementation of this feature.

## How can I call custom Magento modules with ScandiPWA theme?

If the module interacts with Frontend then you will have to implement ScandiPWA compatibility for it. Backend only modules work out of the box without any additional work.

Please see how [Plugin Mechanism](https://docs.scandipwa.com/docs/plugin-mechanism.html) works and how you can use it to create reusable ScandiPWA theme extensions.

## How can I add changes to index.js file under the app directory?

Index.js file has to be renamed before you can make overrides within it. Afterwards make sure to change the file name to the new one in the webpack configuration.

## How do I make some elements extendable (Accordion) just in mobile view?

The best way would be to create a Magento widget with title and field for content. Alternatively, you can parse all elements to make them extendable.

## Cache clean command not working: bin/magento c:c

You should never run commands from your host machine if you are using Docker. You should run it from the container using the in app command.