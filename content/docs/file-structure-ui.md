---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: File structure and UI components
description: Learn the file structure and UI components.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/LcM3DlQ8TbU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
1. [Theme folder structure review (installed via scandipwa-installer)](#theme-folder-structure-review-installed-via-scandipwa-installer)
2. [Explanation of package defined scripts](#explanation-of-package-defined-scripts)
3. [Explanation of PM2 watch process (which is run by frontend container)](#explanation-of-pm2-watch-process-which-is-run-by-frontend-container)
4. [Details of issues with simple watch process and Fallback plugin](#details-of-issues-with-simple-watch-process-and-fallback-plugin)
5. [Overriding with Fallback Plugin](#overriding-with-fallback-plugin)
6. [Configuring editor workspace to include both theme folder and source folder](#configuring-editor-workspace-to-include-both-theme-folder-and-source-folder)
7. [Showcase and explanation of index components](#showcase-and-explanation-of-index-components)
8. [Component file-structure review (container, styles, component, index)](#component-file-structure-review-container-styles-component-index)
9. [Queries and their structures (how to override)](#queries-and-their-structures-how-to-override)
10. [Global store related files review (dispatcher, action, reducer, index)](#global-store-related-files-review-dispatcher-action-reducer-index)
11. [Type definitions](#type-definitions)
12. [Utilities and their must-get-familiars: Request, Query, Promise](#utilities-and-their-must-get-familiars-request-query-promise)
13. [Details and use of QueryDispatcherGuide on testing queries (with GraphQL playground)](#details-and-use-of-querydispatcherguide-on-testing-queries-with-graphql-playground)
14. [Core (important) UI component review](#core-important-ui-component-review)

## Theme folder structure review (installed via scandipwa-installer)
Let's first look at the `app` which is created by the [installer](https://github.com/scandipwa/installer). The installer's main job is to copy files from the `vendor` folder to a folder where you've installed the project. 

Find the `webpack.development.config.js` file. This will be the main configuration file that you'll be concerned with while developing. 

You can also use the [ScandiPWA Docker set-up](https://github.com/scandipwa/scandipwa-base).

## Explanation of package defined scripts
Let's look at the scripts available in your `package.json` file.
The frontend process in itself is a `webpack` development server, which runs the `pm2-watch` npm script. 
```bash
"pm2-watch": "./node_modules/.bin/pm2 start process.yml --no-daemon"
```
By closer inspection you can see that it runs `process.yml`, which runs the `dev-server` and `watch-dev-server`.
```yml
apps:
  - script: "npm run dev-server"
  - script: "npm run watch-dev-server"
```
`dev-server` is a `webpack` development server that is running `forever`, i.e. restarting after failure.
```bash
"dev-server": "forever ./node_modules/webpack-dev-server/bin/
```

## Explanation of PM2 watch process (which is run by frontend container)
`watch-dev-server` is a watching program for `.js` and `.scss` files which restarts all `forever` processes. This means that it will restard the compiler after you've created a new file.
```bash
"watch-dev-server": "SHELL=/bin/bash chokidar --silent \"src/**/*.js\" \"src/**/*.scss\"  -c \"[ '{event}' = 'add' ] || [ '{event}' = 'unlink' ] && forever restartall \""
```

## Details of issues with simple watch process and Fallback plugin
If you only run `watch` and `dev-server` the `FallbackPlugin`, which rewrites files, won't function. If you create a new file which is meant to override a previous file that `webpack` was referencing it will fail to override. You must restart the dev server for the changes to take place. This is why `watch-dev-server` is needed.

## Overriding with Fallback Plugin
`FallbackPlugin` let's you fall back to a file if it doesn't exist. If we want to override a vendor file we have to put it in the same directory as previously. For vendor files it would be the `vendor/scandipwa/source` directory.

## Configuring editor workspace to include both theme folder and source folder
It would be recommended to add the `source` folder to your workspace for ease of use. If you have both the `pwa` and `source` folders added to your workspace you can easily deduce that the file structure in both is quite similar. 

## Showcase and explanation of index components
The file `source/app/index.js` is the entry point for your project's application. It defines a provider for Redux with `AppRouter` as a child component. App router is the `src/app/route/index.js`.

## Component file-structure review (container, styles, component, index)
Let's look at the `CartPage.component.js`. This file contains some render methods and references to props. In order to efficiently manipulate the props we have the `container.js` files which allow you to define some additional functions for your components. The component file also includes the styles which can be overriden in the same way as the components. The component's file folder also includes an `index.js` which is simply forwarding the export of page container or page container.

## Queries and their structures (how to override)
`query.js` file query the GraphQL server. By opening the `ProductList.query.js` file we can see that the `ProductList` query is initialized by `getQuery`.

Methods that are preceded by an underscore are the so-called private methods, e.g. `_getProductsField`. These methods are not callable. Since we can't scope the methods in JavaScript by declaring that they are public or private, we use naming conventions.

You can override the methods by copying the files, placing them in the same place, except in the `pwa` folder and extending the methods. Notice that the class exports a new instance of an object, which means that in order to rewrite it you need to import the product list query as a class, not the pruduct list query as default.

## Global store related files review (dispatcher, action, reducer, index)
`store` is meant for global state manipulation. Here you see all the folders containing `.reducer.js` and other files that are grouped together.

The reducer is responsible for managing state updates for dispatched actions. Actions are simple declarations that will be later called upon at runtime. Dispatcher is responsible for handling the updates. The methods of this file are called to update the state. The index file forwards different exports to the other components, so you could reference them by simply writing `store/Breadcrumbs`.

## Type definitions
You can find types in the `type` folder. These are files containing useful things that can be declared as `propTypes`.

You can override types by importing all of them, changing what you want and exporting them back.

## Utilities and their must-get-familiars: Request, Query, Promise
Utilities are helper functions. One of the must-know utilities is the Request utility, because it contains everything you might need to make a request. It exports `executePost`, `executeGet` and `listenForBroadcast`.

`executeGet` is used for all cachable things and it takes three parameters.

`queryObject` which you can create by using files in the `query` folder. `name` is the name of the model to which service worker will send the broadcast updates to. This is useful when you want to immediately supply the client with data, while waiting for the server to give you real-time data with which the state gets updated.

`cacheTTL` is the cache lifespan in seconds for service worker to cache responses. This is also used for Varnish in some set-ups. Make sure to put here a real value like the month or date etc.

```js
export const executeGet = (queryObject, name, cacheTTL)
```

The request folder also contains query dispatcher which is the dispatcher type for `store` which makes it easier to make requests. By going into `app/store/Category.dispatcher.js` you can see that the category dispatcher is extending the query dispatcher and implements only `onSuccess`, `onError` and `prepareRequest` which returns back the query or array of queries.

The `fetchQuery` function is made for when you need a POST request to get customer data. This is not a cachable request, so instead of `executeGet` you run `fetchQuery`.

In order to simplify cancelling promises we've also implemented a `MakeCancelable.js` utility for cancelling promises. You can call this utility to make a promise cancelable at any time.

## Details and use of QueryDispatcherGuide on testing queries (with GraphQL playground)
If you want to familiarize yourself with GraphQL Playground, you can do so [here](https://docs.scandipwa.com/docs/postman-graphql-playground.html).

## Core (important) UI component review
The field component can be found in `app/component/field` directory. This component can render multiple types of fields:
```js
// renderable fields
CHECKBOX_TYPE,
NUMBER_TYPE,
PASSWORD_TYPE,
RADIO_TYPE,
SELECT_TYPE,
TEXTAREA_TYPE
```
We can see this in action by going to the ScandiPWA [demo website](demo.scandipwa.com) and adding a product to our cart. After this we'll go to check out and we'll see the simple input types for text.

If you go to a product's page, you can enter a quantity value which is the number input type or `NUMBER_TYPE`. The maximum allowed value here is 99.

So, this is the field component, it allows us to have input type rendering with wrappers like labels and messages. The messages can be controlled by either the field component or a form `Form.component.js`. 

Let's look at the form component a little closer. If we go to `CheckoutShipping.component.js` we see that this has a render method that has a form. This form component allows you to submit the form and get all the inputs back to you and validate them if the validation prop has been passed to the field. The validation messages can be seen in `Form.config.js`.

The `Draggable.component.js` allows for mouse and touchpad manipulations. Here you can see the draggable prop types like `onDrag` etc. This is useful if you want to implement a slider. ScandiPWA also has a slider component that's written on top of the draggable component and it's purely responsible for rendering the children slides.

The slider in itself doesn't implement any breadcrumbs or thumbnails. They need to be implemented separately. 

Additionally we have `ExpandableContent` which is a component that allows for content expansion and hiding when changing devices. 

`Header` is a complex UI component, because it has history. This allows for search and filters to be applied. Each of the render methods in this file is mapped and you can explore further by looking at the `Header.component.js` file.

The header also has a container that receives info from the global application:
```js
/** @namespace Component/Header/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    setNavigationState: (stateName) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});
```
If we go to the `Overlay.component.js` we can see the mechanics of overlaying content on a page. Overlay in action can be seen when using a smaller screen, like phone. Toggling the search and navigation functions will create an overlay on the original content. Only one overlay can be opened per page and this can be seen by alternating between 'Menu' and 'Search'. 

`NotificationList` and `Notification` show us when we add and remove a product from a cart by creating a pop-up. There can be multiple pop-ups per page as they will stack under one another. 

`Image.component.js` is responsible for image rendering. It has internal state in it which is useful when we can't find an image or don't have an image specified. You can rewrite these frontend placeholders as you wish.
```js
case IMAGE_NOT_FOUND:
  return this.renderImageNotFound();
case IMAGE_NOT_SPECIFIED:
   return (
    <span block="Image" elem="Content">{ __('Image not specified') }</span>
      );
...
```
We also have `Link.component.js` which is a UI component. This allows you to render links of different types, such as 3rd party links. Notice that you can also use the BEM method to render a link.

The `Meta.component.js` allows you to provide additional metatags to the head of a document, such as title, description and keywords.

`TextPlaceholder` is a simple component that allows you to have placeholders for text. This can be seen by going to a product's page. After content gets passed to it, it renders.

You'll notice that brands are also not rendered. This occurs due to the fact that brands are not set as visible on frontend. To fix this you need to go to your page's admin panel `scandipwa.local/admin` and make the element visible in frontend.

We can access the admin page by making a trust certificate which is done by running `make cert` in terminal. After this you need to import it into the system which is done by `trust anchor <path-to-certificate>`, e.g. `trust anchor opt/cert/scandipwa-ca.pem` and then `sudo trust extract-compatible`. After this the certificate should be trusted.

Make sure to check out what the specific command for your system are. The previous sequence was proven to be working on Arch linux.

If the connection still isn't trusted open Chrome's settings, go to 'Manage certificates' - 'Authorities' and import the `scandipwa-ca.pem` file and select trust certificate for identifying websites.

If you go to `scandipwa.local/admin` you should be able to enter the username which is `admin` and the password that can be found in the `.application` file. You can easily find it by running `cat .application` in terminal and you'll see the `MAGENTO_PASSWORD`.