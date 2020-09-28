---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Setting Up The Environment
description: Setting Up The ScandiPWA Environment And Talking Theory

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/development'
  title: Development
---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/ON37CsjAANs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

ScandiPWA v3 has arrived at your doorstep and with it comes a new tech stack. Let's talk about it!

Topics covered in this tutorial:
- [What's Wrong With jQuery?](#whats-wrong-with-jquery)
- [History API](#history-api)
- [React and JSX](#react-and-jsx)
- [Setting Up The Environment](#setting-up-the-environment)
    - [VSCode Extensions](#vscode-extensions)
    - [Node](#node)
    - [Yarn](#yarn)
- [Installing The ScandiPWA App](#installing-the-scandipwa-app)

## What's Wrong With jQuery?
ScandiPWA v2 used [jQuery](https://jquery.com/) - an API for working with document object models or DOMs. Allegedly, jQuery lets you do more while writing less. So, why use something else?

Each page of an application has a header, a footer and some content. We need to customize all of this periodically. The jQuery library theoretically allows us to have easy access to any specific element, but it would be very messy to implement as a jQuery template due to the fact that it consists of pure strings that are hard to edit.

## History API
With the coming-of-age of [history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) ScandiPWA has switched to React.

Previously each page you visited made a request to a server, which then provided a renderable output. Now, we can skip the server step and start to render the page on the client's side by re-using the URL that's currently being visited, if it had been visited at some point in history.

The history API lets us track the changes made in the state of the application and control the routing.

## React and JSX
Moreover, [React](https://reactjs.org/) in itself allows us to write simple, editable templates and components. These so-called components are encapsulated code chunks that later will be shipped or not shipped based on necessity. 

React allows us to write templates using JSX. You can read more about JSX in the context of ScandiPWA [here](https://docs.scandipwa.com/docs/technology-stack.html#magento-vs-scandipwa-tech-stack). 

[JSX](https://reactjs.org/docs/introducing-jsx.html) is a syntax extension to JavaScript which means that we can use the JS variables, expressions etc. inside of it to write a template.

For example, here we define a constant that gets assigned a JSX tag:
```js
const element = <h1>Hello, world!</h1>;
```
The following example can be found [here](https://reactjs.org/docs/introducing-jsx.html) and it shows us how we can declare a variable, use it in a template and immediately render it:
```js
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Let's briefly look at the [components](https://reactjs.org/docs/components-and-props.html).

There are two types of components:
- functional components - processes properties and returns a template
- class components - let's you work with OOP concepts
    - very useful when you're working with a theme that should be extended (like ScandiPWA)

## Setting Up The Environment
The ScandiPWA team recommends using VSCode as a development environment due to its ease of use and extension availability.

### VSCode Extensions
Recommended VSCode extensions:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - JavaScript code quality assurance tool. ESlint analyzes your code and warns you of any errors that could compromise its stability.
- ScandiPWA Development Toolkit - lets you customize your theme with more ease, you can download the `.vsix` file [here](https://drive.google.com/file/d/1Xm_sWSh4ceFC70Gc88VvRy23w5F6C6Zd/view).

You can manually install a VSCode extension by going to the extensions view or hitting `Ctrl + Shift + X` on the keyboard. Then click on `Views And More Actions...` and `Install From VSIX`. 

Alternatively, you can also use the command line:
```bash
code --install-extension path/to/myextension.vsix
```
### Node
Check if [Node.js](https://nodejs.org/en/) is installed on your computer by typing the following command in the terminal:
```bash
node -v
```
For the development of ScandiPWA you need Node version 10 and higher.

### Yarn
Optional in order to get faster install times than using `npm`. If you don't want to use Yarn, `npm` will suffice.

## Installing The ScandiPWA App
After you have Node and Yarn installed you can type the following in your command line:
```bash
npx create-scandipwa-app <your-app-name>
```
After you've successfully created the ScandiPWA theme, go to your theme's folder and run the following command that will compile the project:
```bash
yarn start
```
Let's look at the file structure:
```bash
📂<your-app-name>
 ┣ 📂i18n           # internationalization folder
 ┣ 📂magento
 ┣ 📂node_modules   # contains the app's dependencies
 ┣ 📂public         # assets should be put here
 ┣ 📂src            # empty source folder
 ┣ 📜composer.json
 ┣ 📜package.json
 ┗ 📜yarn.lock
```
The `src` or source folder will be empty in a fresh install. Since ScandiPWA is meant to be extended, not modified, a fresh install will run the default ScandiPWA theme until new files that will override the theme are added to the `src` folder.

You can check out the what the default theme consists of in `node_modules/@scandipwa/scandipwa/src` - the original source folder.

The `public` folder should contain any assets you want to have like fonts, icons etc.

`i18n` or internationalization folder contains files for locale handling and translations of any phrases you have on the app.

The `package.json` file contains two dependencies:
```js
"dependencies": {
    "@scandipwa/scandipwa": "0.0.1",
    "@scandipwa/scandipwa-scripts": "0.0.5"
}
```
`scandipwa` dependency currently is in v2.17.0. `scandipwa-scripts` dependency contains the `webpack` configuration.

There are two scripts available out of the box as well:
```js
"scripts": {
    "start": "scandipwa-scripts start",
    "build": "scandipwa-scripts build"
}
```
The `start` command begins the local file watching process and starts the local dev server that will let you see the changes in the browser right as you've made them. 

Note that `yarn start` was the first command that we ran, thus the development process can begin. You can check out your theme by going to `localhost:3000` in your browser.

The `build` command is for starting the production build process. You can build in Magento mode as a Magento theme and you can also build as a store front. 

If you want to build ScandiPWA as a Magento theme, you'll notice that the `composer.json` file contains the theme registration and the `magento` folder contains all of the assets needed for defining a theme.