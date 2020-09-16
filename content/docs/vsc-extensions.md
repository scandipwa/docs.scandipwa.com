---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: ScandiPWA Recommended VSCode Extensions
description: Check out which VSCode extensions are used by the ScandiPWA team

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/hmzcmb611x0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
- [ScandiPWA Recommended Extensions](#scandipwa-recommended-extensions)
- [ScandiPWA VSCode Extension Set-Up](#scandipwa-vscode-extension-set-up)
    - [Set-Up Command Overview](#set-up-command-overview)
    - [Working With ScandiPWA Developer Tools](#working-with-scandipwa-developer-tools)

## ScandiPWA Recommended Extensions
- [Better Comments Extension](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) - lets you highlight comments in your code using different colors. This is handy to use for setting priorities and *really* highlighting something.
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - corrects your code's grammar so you can write error-free. Works well with camelCase.
- [Debugger For Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) - lets you debug JavaScript code in the Google Chrome browser. Read more about debugging ScandiPWA in Chrome [here](https://docs.scandipwa.com/docs/debug-in-chrome.html).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - another JavaScript code quality assurance tool. ESlint analyzes your code and warns you of any errors that could compromise its stability. You can read more about ESlint and StyleLint [here](https://docs.scandipwa.com/docs/eslint-stylelint.html).
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - allows you to quickly see why, when and by whom a line of code was changed. Harness the power of `git` in VSCode.
- [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) - handy if you work in a large team and need to handle multiple pull requests and issues. 
- [ScandiPWA Development Toolkit](https://marketplace.visualstudio.com/items?itemName=ScandiPWA.scandipwa-development-toolkit) - lets you simplify work with ScandiPWA internals by providing you with code snippets and command presets.
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - helps you avoid errors and stick to conventions in your styles. Used on CSS, SCSS and Less files.
- [Trailing Spaces](https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces) - highlights trailing spaces and lets you delete them instantly, unlike ESLint which only tells you about some *space* being there, without tracking it down.

## ScandiPWA VSCode Extension Set-Up
Download this extension either from [VisualStudio marketplace](https://marketplace.visualstudio.com/items?itemName=ScandiPWA.scandipwa-development-toolkit) or [GitHub](https://github.com/scandipwa/scandipwa-development-toolkit). 

If you're installing from VisualStudio marketplace launch VisualStudio Code and press `ctrl + P`, this will open the VSCode Quick Open. Paste in the following command and press enter.
```bash
ext install ScandiPWA.scandipwa-development-toolkit
```

If you're installing from GitHub, clone the `scandipwa-development-toolkit` repo. Decide where you want to clone and change your directory. Clone the repo with the following command:
```bash
git clone https://github.com/scandipwa/scandipwa-development-toolkit.git
```
Now go to the ScandiPWA Developer Tools folder:
```bash
cd scandipwa-development-toolkit-2.0
```
If you open this folder in VSCode, you'll see the README file which contains the requirements for the usage of this extension, as well as some tips.

Requirements:
- NodeJS v10 or higher + npm v6.8 or higher
- VSCode v1.45 or higher

You can check what version each of these programs has by typing:
```bash
node -v        # NodeJS version
npm -v         # Node Package Manager version
code -v        # VSCode version
```

### Set-Up Command Overview
Overview of commands that need to be executed while `scandipwa-development-toolkit-2.0` directory is open in VSCode:
1. `ctrl + shift + `\`
2. `npm ci`
3. `npm i -g vsce`
4. `vsce package`
5. `ctrl + p` and type `> Install from VSIX`
6. Select `scandipwa-development-toolkit-1.0.1.vsix`

If you already have the `scandipwa-development-toolkit-2.0` folder open in VSCode, you can press `ctrl + shift + `\` or go to 'Terminal' -> 'Open New Terminal'.

You can run `pwd` in the terminal to make sure that you're in the right directory. If the output is `/<your>/<path>/scandipwa-development-toolkit-2.0`, you're in the right place and you can run:
```bash
npm ci
```
This will install node modules. `npm ci`  will look into the `package-lock.json` file for any specific modules needed.


Next, install `vsce` which is the official VSCode extension packaging tool. The flag `-g` means that the installation will be global.
```bash
npm i -g vsce
```
The following command will generate a `.vsix` file, which essentially is the extension, which then can be installed.
```bash
vsce package
```
After this launch VSCode Quick Open by hitting `ctrl + p` on your keyboard and type in the search bar `> install from VSIX`, which will then open the `scandipwa-development-toolkit-2.0` folder, where the `scandipwa-development-toolkit-1.0.1.vsix` file should be.

Reload VSCode and the extension should become available. Press `ctrl + p` and type `> ScandiPWA` you should be able to preview all of the presets.

At the moment, ScandiPWA Developer Tools extension is very specific about the file structure that it needs to acces, so if you select any of the presets while in the wrong directory, you'll see an error:
```text
ScandiPWA directory is not recognized!
```

### Working With ScandiPWA Developer Tools

Ultimately you need to open your theme folder.
Go to `./../../../../vendor/scandipwa/source/` and open it in VSCode. 

It is recommended to add this as an additional workspace. You can do this by clicking 'File' -> 'Add Folder To Workspace'. 

In order to make the extension work, we also need to make an `app` folder inside `pwa/src`. So, the finished structure would look like this:

```bash
📂pwa
 ┣ 📂Magento_Theme
 ┣ 📂...
 ┣ 📂src
 ┃ ┣ 📂app	# this is the folder we need to add		 
 ┃ ┣ 📂config
 ┗ ┗ 📂public  	
```
Now we can try out the extension.
We recommend to check the `Extend source component` command. Find this by pressing `ctrl + p` and writing `>extend source component`.

Select `ScandiPWA: Extend source component` and you should see a list of extendable components. 

We can look at a quick example. Select the `Breadcrumbs` component and follow through with the prompts. This will create a new component in the newly created `app` folder.

```bash
📂pwa
 ┣ 📂Magento_Theme
 ┣ 📂...
 ┣ 📂src
 ┃ ┣ 📂app	                         # this is the folder we added	
 ┃ ┃	┗ 📂component
 ┃ ┃	   ┗📜Breadcrumbs.component.js     # this is the new component
 ┃ ┣ 📂config
 ┗ ┗ 📂public  	
```
Open `Breadcrumbs.component.js` and start implementing your new component!
Nonspecifically the file should look like this:
```js
import <source> from <path>

export class <class-name> extends <source>{
     // Override original methods
}

export default class <class-name> extends PureComponent {
```
More specifically our `export` would look like this:
```js
export class Breadcrumbs extends SourceBreadcrumbs{
     // Override original methods
}
```
We can click on the 'SourceBreadcrumbs' link in VSCode and it'll take us to the original class, in this case, the original `Breadcrumbs.component.js` file. This is where we can see what we can extend.

To learn more about how to extend ScandiPWA take a look at our [Extension doc](https://docs.scandipwa.com/docs/extension.html).