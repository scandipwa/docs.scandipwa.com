---
# Page settings
layout: default
keywords:
comments: false

# Hero section015fea704470e9039eb45055765cf72948112118
title: Theme Build and Configuration
description: In this guide we explain how to <b>Work With Theme Build and Configuration</b>.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/DUmx_95V1Ps" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
1.	[What Is Webpack?](#1-what-is-webpack) <br>
    1.1.	[webpack: Source And Destination Folders](#webpack-source-and-destination-folders)
2.	[Differences Between Production And Development Set-Up](#2-differences-between-production-and-development-set-up) <br>
    2.1.	[Code Minification And Splitting](#code-minification-and-splitting) <br>
    2.2.	[The Manifest](#the-manifest) <br>
    2.3.	[Service Worker Pre-cache](#service-worker-pre-cache) <br>
    2.4.	[The Source Map](#the-source-map) <br>
    2.5.	[The Hot Reload](#the-hot-reload) <br>
    2.6.	[The Development Server](#the-development-server) <br>
    2.7.	[The HTML Entry File](#the-html-entry-file) <br>
    2.8.	[Debugging And Building](#debugging-and-building) <br>
3.	[The `config` Folder](#3-the-config-folder) <br>
4.	[Available Commands](#4-available-commands) <br>

## 1. What Is Webpack?
Webpack allows us to bundle a theme or an application. It’s run in the development set-up in order to create prioritized bundles of modules and files that will then be run as the application starts. 

The reason why we need to bundle our application is because assets like (images, styles, modules etc.) are not included by default. Furthermore, there are a number of features that are not unanimously supported by all browsers.

For example, we can type:
```javascript
import 'abc';
import 'react';
```
Keep in mind that the `node_modules` folder is never shared, so we can’t access the exact `'react'` file from there and we would not be able to open this file in a browser. 

If we try:
```javascript
import 'style.scss';
```
The browser won’t understand the `.scss` file, so we will need to transform it into a `.css` file. The browser also doesn’t know what `'react'` or the other modules are, so we need to include them into our script as well.

Things like arrow functions `( ) => {…}`, classes and class proposal properties (e.g., `prop = 1;`) are not included by default or supported by most browsers, so we need to transform these features into a format that older browsers will understand. Simply put, if the code is written in ECMAScript5, we need to find a way to transform it into ES2015. 

Luckily, webpack has a different tool for each of these transformations.
-	`webpack` in itself is responsible for handling the imports and their dependencies
-	`babel-loader` – helps you compile code from newer versions of JavaScript down to a version that will be supported by your environment
-	`sass-loader` – transforms the more easily maintainable .scss files to .css files

So, what are these loaders? Loaders are webpack features that allow you to load a specific type of asset.

Let’s look at a simple CSS flexbox example, using the shorthand `flex`, which combines `flex-grow`, `flex-shrink` and `flex-basis`:
```text
flex: 101;
```
Due to the fact that not all browsers support the shorthand properties of `flex`, we need to add certain vendor prefixes to it, in order to make our code render the same way in different browsers. The prefixes are as follows `-webkit` for Chrome and Safari, `-moz` for Firefox, `-o` for Opera and `-ms` for Internet Explorer.

Fortunately, webpack has a `postcss-loader`, which will do this for you using the `autoprefixer` plug-in. So, the processed code will look something like this:
```text
…
-webkit-flex: 101;  # Chrome and Safari
-moz-flex: 101;     # Mozilla
-o-flex: 101;       # Opera
-ms-flex: 101;      # Internet Explorer
…
```
It might be inconvenient in development to import or load CSS files as they are. For example, if we have multiple CSS files, we don’t want them to load one by one. We might want them to load simultaneously or we might want them to load inside JavaScript. This can also be done by different webpack loaders.

To quickly sum up, webpack is a code transformation tool that can handle JavaScript and other files using various loaders. It will take your source files and output transformed files into a destination folder, while also simultaneously optimizing the code, plugging in extensions, or performing other tasks that you’ve set.

### webpack: Source And Destination Folders
Let’s look at our folder structure:
```bash
📂pwa
 ┣ 📂Magento_Theme
 ┣ 📂src
 ┃ ┣ 📂app			 
 ┃ ┣ 📂config
 ┗ ┗ 📂public  	
```
So, what happens when you run `webpack`? It takes a source with all of its contents, e.g. `src/` and outputs it into a destination, for example `Magento_Theme/`.
```bash
📂pwa
 ┣ 📂Magento_Theme
 ┃ ┣ 📂templates
 ┃ ┗ 📂web
 ┣ 📂src
 ┃ ┣ 📂app    
 ┃ ┃ ┣ 📜<name>.js
 ┃ ┃ ┗ 📜<name>.scss 
 ┃ ┣ 📂config
 ┃ ┗ 📂public  
 ┗   ┗ 📜index.production.phtml
```
In this case `webpack` or more specifically `html-webpack-plugin` will take the `index.production.phtml` or `index.development.phtml` and rename it to `root.phtml` and place it into `Magento_Theme/templates` folder. 
```bash
📂pwa
 ┣ 📂Magento_Theme
 ┃ ┣ 📂templates
 ┃ ┃ ┗ 📜root.phtml
 ┃ ┗ 📂web
 ┣ 📂src
 ┃ ┣ 📂app    
 ┃ ┃ ┣ 📜<name>.js
 ┃ ┃ ┗ 📜<name>.scss 
 ┃ ┣ 📂config
 ┃ ┗ 📂public  
 ┗   ┗ 📜index.production.phtml
```
Now Magento will understand that there’s a theme that’ll override the root template. Same with JavaScript and style files, which after processing will appear in the `Magento_Theme/web` folder. This is how `webpack` helps Magento understand ScandiPWA as a theme.
```bash
📂pwa
 ┣ 📂Magento_Theme
 ┃ ┣ 📂templates
 ┃ ┃ ┗ 📜root.phtml
 ┃ ┣ 📂web
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂icons
 ┃ ┃ ┃ ┗📜<name>.bundle.js
 ┃ ┗ ┗ 📂<...>
 ┣ 📂src
 ┃ ┣ 📂app    
 ┃ ┃ ┣ 📜<name>.js
 ┃ ┃ ┗ 📜<name>.scss 
 ┃ ┣ 📂config
 ┃ ┗ 📂public  
 ┗   ┗ 📜index.production.phtml
```
## 2. Differences Between Production And Development Set-Up
If we take a look at the `root.phtml` and `index.production.phtml` files, we can see that they’re very similar. However, the style files will look completely different. This is because, in the process of parsing the code, the `babel` plug-in will transform and optimize it. 

This is where the differences between the production and development set-up will come in.

|PRODUCTION|DEVELOPMENT|
|-----|----|
|[Code is minified](#code-minification-and-splitting)|[Source maps](#the-source-map)|
|[Code splitting or bundling](#code-minification-and-splitting)|[Hot reload (`NODE_ENV`)](#the-hot-reload)|
|[Service Worker Pre-Cache to pre-load assets](#service-worker-pre-cache)|[Dev server (with cache)](#the-development-server)|
|[`index.production.phtml`](#the-html-entry-file)|[`index.development.html`](#the-html-entry-file)|
|[TWO-STEP BUILD](#debugging-and-building)|[NO FILES GENERATED](#debugging-and-building)| 
<br>

### Code Minification And Splitting
In the production set-up code will be minified by the `babel` plug-in, i.e. all of the unnecessary characters will be removed, making it appear as a single line. 

`Webpack` will ensure that the code will get split into multiple parts, in this specific case its 20 bundles. Code splitting allows us to load the code when needed, thus making the website faster and more efficient. Besides bundling, `webpack` also ensures that the code is loaded as needed according to priority.

### The `manifest`
Let’s look at the `manifest` a little. It doesn’t differ between the development and production set-ups. The `manifest` is a specific feature of PWA or Progressive Web Applications in general. It is automatically generated and allows us to install the application correctly. 

PWA manifests usually include things like the app name, author, version, description and a list of resources among other things.

### Service Worker Pre-cache
The `precache-manifest`, however, is only generated in production. Service Worker Pre-cache will download all of the split code or bundles by itself without a specific request and return the bundles immediately when requested. 

The pre-loaded bundles will also ensure that all of the application will be available to you offline even though you haven’t visited it. This only applies to the application’s parts like ‘my account’, ‘card’, ‘checkout’, etc., not the actual data.

### The Source Map
One of the things that only appears in development is a source map. Source maps provide a reference for the code, mapping the minified or transformed code to the original source, thus being a handy debugging tool.

### The Hot Reload
Not all of the logic can be executed in development mode.
```bash
📂source
 ┣ 📂<…>
 ┣ 📂src
 ┃ ┣ 📂app	
 ┃ ┃ ┣ 📂<…>
 ┃ ┃ ┗ 📜index.js		 
 ┃ ┣ 📂config
 ┃ ┣ 📂public
 ┗ ┗ 📂sw 	
```
If we go to the `source` folder and open the main `index.js` file, we can see that some logic runs only in development, more specifically it’s the hot reload.

The value `process.env.NODE_ENV === ‘development’` ensures that our React application or any other dependent application will have hot reload enabled, that is - the app will reload automatically any time our code changes.

The app is kept running on the development server with periodic injections of new file versions that are edited at runtime. The main plus of hot reload is the fact that the app's state is not lost, which is especially useful when customizing a theme.

### The Development Server
The development server is what allows us to use hot reload and memory cache. Only changed files are regenerated, which allows us to perform bundling quicker. 

This is why if you run `npm run build` it takes a long time every time, but if you run `npm run watch` it takes a long time only once and any subsequent loads will be quick.

### The HTML Entry File
Another thing that differs between the production and development set-up is the HTML entry file. In a production environment, this file is called `index.production.phtml` and in development, it’s `index.development.html`.

### Debugging And Building
It’s worthwhile mentioning that in production set-up, the build process itself is different, i.e. the production set-up application follows a two-step build process where first the Service Worker Pre-Cache is built, after which the actual application is built. 

And lastly, the biggest difference in terms of debugging is the fact that no files are generated in development mode, due to the development server’s memory cache. This can be seen by browsing our folder structures. In development mode the `Magento-Theme` folder will not appear. 

## 3.	The `config` Folder
```bash
📂source
 ┣ 📂<…>
 ┣ 📂src
 ┃ ┣ 📂app     
 ┃ ┣ 📂config
 ┃ ┃ ┣ 📜<…>
 ┃ ┃ ┣ 📜babel.config.js
 ┃ ┃ ┣ 📜meta.config.js
 ┃ ┃ ┣ 📜tests.config.js
 ┃ ┃ ┣ 📜webpack.core.config.js
 ┃ ┃ ┣ 📜webpack.development.config.js
 ┃ ┃ ┣ 📜webpack.extract-translations.config.js
 ┃ ┃ ┣ 📜webpack.production.config.js
 ┃ ┃ ┗ 📜webpack.sw.config.js
 ┃ ┣ 📂public
 ┗ ┗ 📂sw     
```
A brief overview of the `config` folder would be as follows:
-	`webpack.development.config.js` and `webpack.production.config.js`
    -	The differences are as mentioned in [section 2](#2-differences-between-production-and-development-set-up).
-	`webpack.extract-translations.config.js`
    -	Extracts the internationalization strings from the application. We need to do this periodically in order to update the `.json` files with new translations.

We can execute this webpack config file by running the `extract-translations` command. We can execute npm commands by typing `npm run <name-of-command>`, e.g. `npm run extract-translations`, you can read more about npm [here](https://docs.npmjs.com/). Running a npm command this way ensures that the configuration preset in `package.json` file is used.
-	`webpack.sw.config.js`
    -	The Service Worker configuration file is a part of the two-step build production set-up.
-	`webpack.core.config.js`
    -	Configuration of core contribution.
-	`babel.config.js`
    -	Configuration of the `babel-loader`. Read more in [webpack documentation](https://webpack.js.org/loaders/babel-loader/), as well as [babel documentation](https://babeljs.io/docs/en/).
-	`meta.config.js`
    -	Configuration of meta tags that need to be included into our HTML document.

## 4.	Available Commands
npm or Node package manager allows us to use some nifty aliases that are defined in the `package.json` file. This file can be found in the main `source` folder. 

`npm run build` is the most valuable command preset in the `package.json` file, because running it allows Magento to recognize a production ready theme. 
```javascript
"scripts": {

  "build": "npm run build-sw && webpack --config ./src/config/webpack.production.config.js",

  "build-sw": "webpack --config ./src/config/webpack.sw.config.js --mode=production",
}
```
 These are only two of the ready made scripts. Check out more npm presets in the `package.json` file.

### What To Run In Which Situation?
If you’re using our Docker environment you don’t have to run anything. Docker does the job on its own.

However, if you decide to develop on your local machine, the following commands might come in handy: 
1)	[`npm ci <package-name>`](#npm-ci-package-name)
2)	[`npm run build`](#npm-run-build)
3)	[`npm run pm2-watch`](#npm-run-pm2-watch)
4)	[`npm run extract-translations`](#npm-run-extract-translations)

### `npm ci <package-name>`
If you’re running an existing Magento instance and you want to install a theme you need to run `npm ci` first. Not `npm install` or `npm i`. 

`npm ci` ensures that you’ll get a more reliable build by firstly deleting your `node_modules` folder giving you a fresh start, as well as looking into your `package-lock.json` file and installing dependencies of a specified version, instead of modifying the `package-lock.json` file like `npm i` does.

`npm ci` is a security measure that allows us to not break our replication in case of one of the dependencies having a new broken minor release.

### `npm run build`
The next command you run will be different depending on your needs. If you want to compile a theme and test if Magento is able to recognize it, you need to run `npm run build`. This will build the theme and generate a `Magento_Theme` folder.
```bash
📂<parent-folder>
 ┣ 📂Magento_Theme
 ┃ ┣ 📂templates
 ┃ ┃ ┗ 📜root.phtml
 ┗ ┗ 📂web
 ```
If you have the `Magento_Theme` folder with `root.phtml` file and `web` folder, it means that Magento should be able to recognize the theme.

If your application has the `Magento_Theme` folder with its contents, but Magento is not able to recognize the theme, you should check the Magento tables and look whether your theme’s name is added to the list.

### `npm run pm2-watch`
This command will start the development server, which will be restarted every time you create a new folder. You need to restart the server when creating a new folder because of the memory cache. If you’re creating a new folder with what you want to override a specific component, you need to recompile and the `pm2` or process manager will handle this and restart the watching process.

The development server will be started in the port `:3003`, keep in mind that Magento might not function properly, because the request to `/graphql` might not be properly sent. 

In this case you might need to change the request-URI constant `cons REQUEST_URI` in the `util-request` which can be found in `source`.

Another approach would be by adding a NGINX config, which you can locate in our front-end configuration containers as well.

If none of these solutions work, we would recommend developing your application in our Docker environment which includes everything you need to start building applications seamlessly.

### `npm run extract-translations` 
This command will parse through all of your files and find every single template literal ( --(\` \`); ) that you’ve added. Notice that there should be a simple string in between the backticks, not a variable. After that, the contents of the backticks will be put into the `i18n` internationalization folder under the specific language, e.g. all English strings will be appended to the `en_US.json` file.

If a language file’s string translation is `null`, that means that we don’t have a translation for the specific term at the moment, so feel free to contribute if you know the language.

## To Docker Or Not To Docker?
The use of `npm run build`, `npm run pm2-watch` and `npm run extract-translations` is not needed if you choose to develop in our Docker environment. These commands will only be required if you decide to install on your local machine.

However, the command `npm ci <package-name>` is always needed when you pull the latest changes, because we want to make sure that the latest working versions of the packages are installed.
