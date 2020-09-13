---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: How To Debug ScandiPWA In Chrome
description: This guide is for learning <b>How to Debug ScandiPWA in Chrome</b>.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/cyDwoVLH_hA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Tools you need to install in your Chrome browser:
- [Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)

Run the ScandiPWA [front-end container](https://docs.scandipwa.com/docs/frontend-setup.html) in development mode, go to `scandipwa.local` using Chrome and click on the "Components" section in devtools.

The Components section includes the names of the components and the logic of them. 

> **Note**
>
> You can use the React Developer Tools in development mode

The React Developer Tools Chrome extension will not work in production mode, due to the fact that in the code optimisation process the code gets minified.

The Redux Devtools extension allows you to traverse the history of your application, i.e. see the process of navigation. We can also see the state which is currently in action, as well as see what actions had happened etc.

## Connecting VSCode to Google Chrome
Open your VSCode editor, search for "Debugger for Chrome" and install it.

After this click on the application panel. Here we can see that our application either has or doesn't have configurations. Click on the settings icon to see what configurations are available. 

### Making A Configuration
Select "Chrome" in the application configuration settings and open `launch.json`.
```javascript
"configurations":[
  {
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome against localhost",
    "url": "http://localhost:8080",
    "webRoot": "${workspaceFolder}",
  }
]
```

Here we don't want Chrome to launch agains localhost, so change `http://localhost:8080` to `https://scandipwa.local` and click the launch button.

The error `[debugger for chrome] Error processing "launch": Can't find Chrome` may happen if your version of the Chrome executable is different from the one VSCode has.

You can look for your executable by typing:
```bash
ls /bin | grep chrome
```
Instead of `chrome` your executable might be `google-chrome-stable`. In this case, you need to go back to VSCode and in the `launch.json` file provide a runtime executable pointing to your specific Chrome executable.
```javascript
"configurations":[
  {
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome against localhost",
    "url": "https://scandipwa.local",
    "webRoot": "${workspaceFolder}",
    "runtimeExecutable": "/bin/google-chrome-stable"
  }
]
```
After this, try launching again. If this doesn't work, we can try launching Chrome separately and attach VSCode to it later. To do this you need to change the request to `attach`, also the runtime executable is not needed. If you want to declare a new port, you can add it to the configurations as well. 
```javascript
"configurations":[
  {
    "type": "chrome",
    "request": "attach",
    "name": "Launch Chrome against localhost",
    "url": "https://scandipwa.local",
    "webRoot": "${workspaceFolder}",
    "port": 9222 
  }
]
```
To run Chrome for VSCode attachment, you need to execute the following command:
```bash
google-chrome-stable --remote-debugging-port=9222 --user-data-dir=~/Downloads/debug-data
```

Executing this will open up Chrome, go to `scandipwa.local`, open up VSCode and try to launch again.

In the VSCode debug console we can see our browser logs, which we can compare with the browser by clicking "Inspect element" and "Console". If they are the same, we can deduce that VSCode is connected to Chrome.