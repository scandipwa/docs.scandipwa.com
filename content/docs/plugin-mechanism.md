---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: ScandiPWA plugins
description: Definitive guide for ScandiPWA plugin functionality.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/development'
  title: Development

# Page navigation
page_nav:
    prev:
        content: Extension mechanism
        url: '/docs/development/extension'
    next:
        content: Debugging
        url: '/docs/development/debugging'

---

ScandiPWA v3 (currently in beta) supports frontend plugins, which allow reusing one piece of code throughout a lot of completely different projects. This guide is devoted to explaining all the functionality related to plugins.


## Watch outdated explanation videos with correct general approach

> **Note**:
>
> this videos are going to be updated, they are **much less relevant** then the text documentation. Use them to understand the main workflows, but seek **ONLY** these guidelines that are described in this article, because many things changed since these two videos have been released.

### Implementing an extension from scratch
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/9f6rpIrlNMk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Implementing an extension from customization
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/N2TJJbSDTbM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Extension's file structure

ScandiPWA extension is M2 composer package with one extra directory - `scandipwa`. Inside of it ScandiPWA frontend-related functionality is stored. Any other M2 related folders with backend-related functionality can be stored in such package. You see `etc` and `Model` in this example, but these are not the only possible ones.

All _directories_ inside of `scandipwa` are optional, nevertheless following the provided structure is mandatory. You see `app` and `sw` subdirectories in it, these folders' structure is the same as you see in `vendor/scandipwa/source/src/(app|sw)` and they have the same meaning: inside of them are all parts that your extension requires: extra components, queries, routes etc.

`Plugin` directory contains plugin definitions: which functionality parts are you plugging into and how you want to change their behaviour. More about that below. All the files with `.plugin.js` extension will be found there and imported into the application.

```bash
📦my-awesome-extension
 ┣ 📂src
 ┃ ┣ 📂etc
 ┃ ┃ ┗ # ...
 ┃ ┣ 📂Model
 ┃ ┃ ┗ # ...
 ┃ ┗ 📂scandipwa   # Frontend-related functionality
 ┃   ┣ 📂 app      # Plugins and functionality for the app context
 ┃   ┃ ┣ 📂component
 ┃   ┃ ┣ 📂query
 ┃   ┃ ┣ 📂route
 ┃   ┃ ┣ 📂store
 ┃   ┃ ┣ 📂util
 ┃   ┃ ┗ 📂plugin  # Plugging logic declarations
 ┃   ┃   ┗ 📜<name>.plugin.js
 ┃   ┗ 📂 sw       # Plugins and functionality for the Service Worker context
 ┃     ┣ 📂handler
 ┃     ┣ 📂util
 ┃     ┗ 📂plugin  # Plugging logic declarations
 ┃       ┗ 📜<name>.plugin.js
 ┣ 📜package.json  # JS dependencies
 ┗ 📜composer.json # Composer dependencies and the PACKAGE NAME which is mandatory
```

## A step-by-step algorithm of creating a simple extension

This document is a more relevant alternative to the video tutorials above. You are still welcome to watch them in order to learn the general approach from an example. Start with understanding how you wish to change ScandiPWA logic. Find the places which need modification.

1. Create a `localmodules` directory in the magento root of your application. Then create a composer package there. Inside of it, in `src/scandipwa/app/plugin`, create `<name>.plugin.js` file.

2. Create a function that is going to wrap around the original namespace member, following the guidelines above. This function is going to be called instead of the original member, very similar to the Magento 2 **"around plugins."**

>**Note**:
>
> It is recommended to stick to the naming convention regarding the arguments of these functions.

Each member which wraps around a **_function_** has the following arguments.
- `args` is an array of original arguments that are passed to the function this one is wrapped around.

- `callback` is a function that calls the next plugin if there is one, or the original method (bound to the instance), when all plugins defined for this method are applied.

- `instance` references the instance of class that you are plugging into.

Each member which wraps around a **_property_**  has the following arguments:

- `prop` is a member you are plugging into.

- `instance` same as above.

```javascript
// This wraps around the member function, logs the arguments and adds one to the first argument
// It is essential that wrapper function is an arrow function, if you are writing a class.
const aroundFunction = (args, callback, instance) => {
	// Arguments, which have been passed to the member
	// Either original or already modified by other plugins.
    console.log(args);

	// Use array destructuring to get specific arguments from the array
	const [something] = args;

	// The callback is always bound to the `instance`, you do not need to provide context here.
	// It is impossible to bind the callback to something else hence.
    callback(...args);
}

// This wraps around a property
const property = (prop, instance) => {
    return {
        ...prop,
        // And adds this new value to it
        someAddedValue: 'new value!'
    }
}

const classWrapper = (Class) => {
    // Return the original class intact
    return Class;

    // Return the original class wrapped into HOC or something else
    return withRouter(Class);
    return connect(...)(Class);

    // Replace the original class with something else
	// DANGEROUS and NOT RECOMMENDED
    return OtherClass;
}
```

3. Create the configuration in the bottom of `.plugin.js` file. This object must be a default export. The following things are defined in this configuration:

- Which namespace to modify

- How what exactly in the namespace would you like to modify

  - **'member-function'** plugins intercept calls to **instance members**. These plugins are used to change the behavior of member functions, which are called on instance.

  - **'member-property'** is an approach to change **properties**, which are not available on prototypes, e.g. state in a way it's defined throughout the ScandiPWA (`state = { ... };`). Do not use this for class properties, which are arrow functions (`onUpdate = () => {....}`), use the _member-function_ for that.

  - **'static-member'** plugins enable changing classes' **static members**.

  - **'function'** is an approach to change **functions** which are not class members, e.g. `mapStateToProps` or `mapDispatchToProps`.

  - **'class'** is an approach to modify **classes**. These plugins are able to modify the class, wrapping it into HOC or, in extreme cases, replacing it with other class. Replacing is not recommended because it is not well-compatible with potential other plugins wrapping around members of the same namespaces.

- Name of the member to modify (for everything apart of 'function' and 'class' plugins, which are the only namespaces members and have reduced structure)

- Optional: a position, in which this plugin will be called. **Defaults to 100**. There may be multiple plugins for a single member if there are several extensions active in the application. The closer the position to 0 - the sooner it is called. The higher a position - the later. Non-unique.

> **Note**:
>
> You can create class members that do not exist in the original classes and they will be called as you'd expect writing them directly in the class. It is useful when you need some lifecycle member functions that are not present in the original class. **REMEMBER** to call `callback` even if the original member is not present, that will make your plugin compatible with other plugins around the same member, by calling them after your plugin finishes its work.

Configuration should follow this format:

```javascript
const config = {
    namespace: {
        'member-function': {
            '<name>': Plugins1
        },
        'member-property': {
            '<name>': Plugins2
        },
        'static-member': {
            '<name>': Plugins3
        },

        // Reduced structure for functions and classes
        'function': Plugins4,
        'class': Plugins5
    }
}
```

Where `Plugins` is either a function, an object or an Array of functions/objects. See valid `Plugins` blocks' example below.

```javascript
// Simplest option, you are going to use it in most cases
const Plugins1 = A;

// If you need more granular logic around one original member
const Plugins2 = [B, C];

// Specify a position to execute your plugins sooner/later in the pipeline
const Plugins3 = {
    position: 0,
    implementation: aVeryImportantFunction
};

// Same as 2nd option, but with positions.
const Plugins4 = [
    {
        position: 0,
        implementation: oneMoreVeryImportantFunction
    },
    {
        position: 1000,
        implementation: notVeryImportantFunction
    }
];
```

The example below demonstrates an example of multiple syntax opportunities for writing a configuration part.

```javascript
const config = {
    namespace: {
        'member-function': {
            '<name>': B
        },
        'member-property': {
            '<name>': [
                {
                    implementation: D
                }
            ]
        },
        'static-member': {
            '<name>': [
                {
                    position: E,
                    implementation: F
                }
            ]
        },
        'function': [ I, J ],
        'class': K
    }
}
```

4. Activate your plugin. In the FE root of your theme, there is a file called `scandipwa.json`. It is responsible for theme's configuration. Active plugins should be defined there.

Contents:

- `<extension name>`: should be picked by you, it is not related to any functionality, just denotes which plugin files are meant for which extension. Put anything you like here.

- `<path>`: a single relative path from Magento root to the extension's root.

The format for the 'extensions' block of this file is the following:
```javascript
{
    // ...
    "extensions": {
        "PayPal": "vendor/scandipwa/paypal-graphql",
        "<extension2>": "<path2>",
        /** other extensions */
    }
    // ...
}
```

## Plugins for plugins!

ScandiPWA allows **plugging into plugins**. All classes that your plugin requires should be assigned namespaces by wrapping them into the `middleware` function. The only exception is that plugin class in `.plugin.js` file **cannot** be plugged into due to configuration builder's limitations. It still can be overriden as described in the extension guide though.
