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

As of v3, ScandiPWA supports frontend plugins - reusable extensions that, once created, can be used in any project using ScandiPWA v3. These can be used to modify the functionality of almost any part of ScandiPWA.

## Extension file structure

A ScandiPWA extension is a M2 composer package with an additional directory - `scandipwa`, which contains ScandiPWA frontend-related functionality. The extension can contain any other M2 directories for implementing backend functionality. For example, the extension below has the `etc` and `Model` directories.

All directories in `scandipwa` are optional. However, following the specified structure is mandatory - the `app` and `sw` subdirectories of `scandipwa` must have the same structure as `vendor/scandipwa/source/src/(app|sw)`. These directories have the same meaning: `component` is for your extension's components, `query` is for GraphQl queries, etc.

The `plugin` directory can contain files specifying the configuration and implementation of your plugins. Details will be provided below.

A ScandiPWA extension's file structure overview:

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
 ┃   ┃ ┗ 📂plugin
 ┃   ┃   ┗ 📜<name>.plugin.js # Plugin configuration and implementation
 ┃   ┗ 📂 sw       # Plugins and functionality for the Service Worker context
 ┃     ┣ 📂handler
 ┃     ┣ 📂util
 ┃     ┗ 📂plugin
 ┃       ┗ 📜<name>.plugin.js # Plugin configuration and implementation
 ┣ 📜package.json  # JS dependencies
 ┗ 📜composer.json # Composer dependencies and the PACKAGE NAME which is mandatory
```

## Creating a simple extension

1. In a subdirectory of your package, `src/scandipwa/app/plugin`, create files for your plugins. By convention, these end with `.plugin.js`

    i. Implement your plugin's logic (see [Plugin implementation](#plugin-implementation))

    ii. Configure your plugin's target (see [Plugin configuration](#plugin-configuration))

2. List your plugin files in `index.js` (see [Listing plugin files](#listing-plugin-files))

3. Enable your extension in scandipwa.json (see [Enabling extensions](#enabling-extensions))

4. Restart your frontend container for the configuration to take effect. This is necessary whenever the scandipwa.json file is changed.

## Plugin implementation

Plugins are used to alter the behavior of functions or classes. This is done by creating wrappers for existing values to control their new behavior, similarly to Magento "around" plugins/interceptors.

There are 2 main types of plugins: plugins that wrap around functions and those that wrap around other properties. Function plugins act as wrappers for the function they plug in to, and are called every time the original function is called. Property plugins are called to initialize the property, and must return the value that the property should have.

### Function plugins
Each plugin which wraps around a function is a function with the following arguments.
- `args`: an array of the original arguments that were passed to the function
- `callback`: a function that calls the original method, or the next plugin if another plugin is configured
- `instance`: the instance that the function was called on

The plugin is itself the new function that the target function should be replaced with. Whatever the plugin returns is what callers of the function will get.

Example:

```javascript
// It is essential that wrapper function is an arrow function if you are writing a class.
const aroundFunction = (args, callback, instance) => {
	// Use array destructuring to get specific arguments from the array
	const [foo] = args;

	console.log(`The first argument is ${foo}`)

	// Call the original function with the original arguments
	callback(...args);
}
```

>**Note**:
>
> It is recommended to follow the naming convention for the arguments of these functions for consistency and clarity

### Property plugins

Each plugin that wraps around a **_property_**  is a function with the following arguments:

- `prop` is the value you are wrapping around
- `instance` the instance this property belongs to (if any)

Unlike function plugins, the plugin is a function that returns the new value that the property should now be replaced with. Any users of the property will now get the new value.


```javascript
// We can wrap around any value - objects, arrays, strings...
// Example: wrapping around an object
const property = (prop, instance) => {
    return {
        ...prop, // Keep the original values
        // Let's add a new value to this object
        someAddedValue: 'new value!'
    }
}

// We can also wrap around a class!
const classWrapper = (Class) => {
    // E.g: return the original class wrapped in a HOC
    return withRouter(Class);
}
```

## Plugin configuration

Once you have created your plugin functions, you need to specify which values you want to plug in to. For this, each plugin file should have a default export - an object specifying the plugin configuration.

In the plugin configuration, you can specify the following information:

**The target namespace**: Every class and function that can be plugged in to has a namespace, indicated with the `@namespace` decorator.

**What** aspect of the namespace you want to modify...

(A) If you are plugging into a *class*: 

- Specify `class` and a property plugin if you want to replace the entire class (e.g. with a version of the class that is wrapped in another class). While technically possible to replace the class with another class entirely, this is not recommended.
- Specify `member-function` and a function plugin if you want to alter the behavior of the class's method. E.g: plug in to `render` or `componentDidMount`.
- Specify `member-property` and a property plugin if you want to alter the value of a field of the class. E.g: plug in to `state`.
- Specify `static-member` and a property plugin if you want to modify a static field of the class.

If you want to plug in to a class member that is an arrow function, use `member-function`, not `member-property`.

(B) If you are plugging in to a *function* that is not part of a class and has its own namespace: Use the `function` plugin type to wrap around the function, and implement a function plugin.

**Name**: if you are targetting a class member, you must specify its name.

**Position** (Optional, defaults to 100): Specifies the order in which plugins will be applied. Plugins with a lower position will be called before plugins with a higher position.

> **Note**:
>
> You can create class members that do not exist in the original classes and they will be called as you'd expect writing them directly in the class. It is useful when you need some lifecycle member functions that are not present in the original class. **Remember** to call `callback` even if the original member is not present, that will make your plugin compatible with other plugins around the same member, by calling them after your plugin finishes its work.

### Plugin configuration object format

```javascript
export default {
    '<namespace>': {
        'member-function': {
            '<name>': plugin
        },
        'member-property': {
            '<name>': plugin
        },
        'static-member': {
            '<name>': plugin
        },

        'function': plugin,
        'class': plugin
    }
}
```

Where *plugin* can be in one of the following four formats:

```javascript
// example plugin:
// const somePlugin = (args, callback, instance) => callback(...args)

// To specify a simple plugin, use:
somePlugin

// If you want to specify multiple plugins for the same namespace and target:
[somePlugin, someOtherPlugin]

// If you want to specify a position for your plugin:
{
    position: 42,
    implementation: somePlugin
}

// If you want to specify multiple plugins for the same namespace and target, as well as a position for each:
[
    {
        position: 42,
        implementation: somePlugin
    },
    {
        position: 1984,
        implementation: someOtherPlugin
    }
]
```

Example:

```javascript
// e.g.
// const hideMenuPlugin = (args, callback, instance) => null;

export default {
    'Component/Header/Component': {
        'member-function': {
            'renderMenu': hideMenuPlugin
        },
        'member-property': {
            'renderMap': {
                    implementation: alterRenderMapPlugin,
                    position: 101
                }
        },
        'static-member': {
            'propTypes': [
                {
                    position: 66,
                    implementation: updatePropTypesPlugin
                },
                {
                    position: 67,
                    implementation: anotherUpdatePropTypesPlugin
                }
            ]
        },
    },
    'Component/Header/Container/mapDispatchToProps': {
        'function': mapDispatchToPropsPlugin
    }
};
```

### Listing plugin files
For ScandiPWA to be able to detect what plugins your extension has, you must create a file called `<extension root>/src/scandipwa/index.js`. This file should have a default export - an array of paths to your plugin files.

Example:

```javascript

module.exports = [
    './app/plugin/somePluginFile.js',
    './app/plugin/anotherPlugin.js',
];
```

Where `somePluginFile.js` is a plugin file as described above.

## Enabling extensions

In the frontend root of the ScandiPWA theme, there is a file called `scandipwa.json`. In this file, you can specify the path to the extensions that the theme should use. Without specifying an extension here, all of its plugins will be ignored.

The plugins are specified in the `extensions` section of `scandipwa.json`. It has the following format:

```json5
{
    // ...
    "extensions": {
        "<name>": "<path>",
        "<name2>": "<path2>",
        // Example:
       "PayPal": "vendor/scandipwa/paypal-graphql",
    }
    // ...
}
```

Where:
- `<name>` is an arbitrary name for the plugin
- `<path>` is the relative path from Magento root to the extension's root

## Plugging in to other plugins' classes

ScandiPWA allows plugging into plugins' classes, such as the components, queries, etc. The plugin configuration files (`.plugin.js`) cannot be plugged into however, due to the configuration builder's limitations. Plugins can still be overridden in the theme though.

## Outdated video tutorials

> **Note**:
>
> You may use these videos for general guidance of the plugin development process, but please be aware that they are outdated. Read the documentation above for the most up-to-date details

### Implementing an extension from scratch
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/9f6rpIrlNMk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Implementing an extension from customization
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/N2TJJbSDTbM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
