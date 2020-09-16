---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: How To Write Better Code Using ESlint & StyleLint
description: This guide is meant for improving the quality of your code using ESlint & StyleLint.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---

<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/3nO6m4zDnqs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## ScandiPWA Recommended Linters:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - linter for ECMAScript or JavaScript
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - linter for your styles - CSS, SCSS and Less

## What Is A Linter?
According to [Wikipedia](https://en.wikipedia.org/wiki/Lint_(software)), lint, or a linter, is a tool that analyzes source code to flag programming errors, bugs, stylistic errors, and suspicious constructs

## Starting Out With Lint
Install and enable [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSCode and it'll start to give you suggestions. 

Open the `scandipwa-base/src/app/design/frontend/Scandiweb/pwa` folder.

For this extension to work, you need to install the ESLint library in your project's folder, if it's not there it'll look for a global install. To install eslint run:
```bash
npm install eslint      # run this in the workspace folder
npm install -g eslint   # global install
```
Look for the `.eslintrc.sample` file. Remove the `.sample` postfix in orded to create our own ESLint configuration.

If the configuration file is not present you can press `ctrl + p` in VSCode and search for `>Create ESLint configuration` or run `eslint` in terminal.

For a global installation run `eslint --init`, for local - `./node_modules/.bin/eslint --init` for Linux and Mac.

Additionally, you can open up the terminal and run `npm run eslint` and this will scan the project for linter issues.

Run `npm run eslint -- --fix` to fix any issues, if they are found.

More of the available command presets can be seen in the `base-theme/package.json` file 'script' field. Some of these commands are:
```js
"eslint": "eslint ./src/app --ignore-pattern *.test.*",

"eslint:fix": "npm run eslint -- --fix",

"eslint:cache": "eslint ./src/app --cache --ignore-pattern *.test.*",

"stylelint": "stylelint ./src/**/*.scss",

"stylelint:fix": "npm run stylelint -- --fix",

"stylelint:cache": "stylelint --cache ./src/**/*.scss"
```

Just as with ESLint, you need to get the [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) extension and install stylelint locally in your project's folder, or copy the `.stylelintrc` file from the `source` folder into your project's folder.

## Linting In Practice
First you'll need the ScandiPWA Developer Tools VSCode extension. Find out how to get started [here](https://docs.scandipwa.com/docs/vsc-extensions.html). 

Press `ctrl + p` and search for `>ScandiPWA: Extend source component`.

Select `AddToCart`, skip class container and select 'Extend them!' which will only extend the styles. This will create and open the `AddToCart.override.style.scss` file which, at the moment, will look like this:
```scss
.AddToCart{

}
```
This will create a stylelint pop-up that'll say `Unexpected empty block`. If now we run in terminal `npm run stylelint:fix`, we can check if something can be fixed.

> **Note**
>
> You can run ESLint and style lint in GitHub actions

