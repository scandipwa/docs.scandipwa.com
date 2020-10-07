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

As of v3, ScandiPWA supports frontend plugins - reusable extensions that once created can be used in any project utilising ScandiPWA v3. These can be used to modify the functionality of almost any part of ScandiPWA.

## Extension file structure

A ScandiPWA extension is an M2 module (composer package) with an additional directory - `scandipwa`, which contains ScandiPWA frontend-related functionality. The extension can contain any other M2 directories with backend functionality implementation. For example, the extension below has the `etc` and `Model` directories.

All directories in `scandipwa` are optional. However, following the specified structure is mandatory - the `app` and `sw` subdirectories of `scandipwa` follow the same structure as `vendor/scandipwa/source/src/(app|sw)`. These directories have the same meaning: `component` is for your extension's components, `query` is for GraphQL queries, etc.

The `plugin` directory contains files specifying the configuration and implementation of your plugins. Details are provided below.

A correct file structure is essential for every ScandiPWA extension. Any diversity from the pattern talked about in this article can cause malfunction. ScandiPWA extension's file structure overview:

```bash
📦my-awesome-extension
 ┃ ┣ 📂etc
 ┃ ┃ ┗ # ...
 ┃ ┗ 📂Model
 ┃   ┗ # ...
 ┣ 📂src
 ┃ ┗ 📂scandipwa   # Frontend-related functionality
 ┃   ┣ 📂app      # Plugins and functionality for the app context
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

1. In a subdirectory of your package, `src/scandipwa/app/plugin`, create files for your plugins. By convention, these **must** end with `.plugin.js`

    i. Implement your plugin's logic (see [Plugin implementation](#plugin-implementation))

    ii. Configure your plugin's target (see [Plugin configuration](#plugin-configuration))

2. Enable your extension in scandipwa.json (see [Enabling extensions](#enabling-extensions))

3. Restart the frontend compilation script for the configuration to take effect. This is also necessary whenever the scandipwa.json file is changed.

## Plugin implementation

Plugins are used to alter the behavior of functions or classes. This is done by creating wrappers for existing values to control their new behavior, similarly to Magento "around" plugins.

There are 3 main types of plugins: plugins that wrap around functions, those that wrap around other properties and those that wrap around classes.

1. *Function* plugins act as wrappers for the function they plug into, and are called every time the original function's call is intercepted, instead of that function. The initial function is available in the plugin-wrapper as `callback`. It is always bound to the context it originated from (`instance` for members, `context` for regular functions).
2. *Property* plugins modify their instances' properties during the instantiation time. These plugins are called once for each new instance of a specific class.
3. *Class* plugins are meant to modify the classes themselves. It is possible to use them to wrap your component into some HOCs, although such approach is not recommended. Using these plugins (which wrap around classes) enables extending the original class via inheritance and replacing the original class in the application with the modified one (this replacement happens behind the scenes just as with the other plugin types).

### *Function* plugins
Each plugin which wraps around a function is a function of the following form: `function plugin(args, callback, instance) { ... }` with the following arguments' meanings.

- `args`: an array of arguments that are passed to the function
- `callback`: the original function, or the next plugin (which also has a `callback` which also has either the original function or the next plugin etc.)
- `instance`: the instance which is the original call context of the function

Example:

```javascript
const aroundFunction = (args, callback, instance) => {
	// Use array destructuring to get specific arguments from the array
	const [foo] = args;

	console.log(`The first argument is ${foo}`)

	// Proceed to the (original callee|next plugin)
	callback(...args);
}
```

>**Note**:
>
> It is recommended to follow the naming convention for the arguments of these functions for consistency and clarity

### *Property* plugins

Each plugin that wraps around a **_property_**  is a function of the following form: `function plugin(prop, instance) { ... }` with the following arguments' meanings.

- `prop`: the value you are wrapping around. Similar to the `callback` in the 'function' plugins, either has the original property or a value returned from the other plugin(s)
- `instance`: an instance this property is a member of

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
```

### *Class* plugins

Each plugin that wraps around a **_class_**  is a function of the following form: `function plugin(X) { ... }` with the following arguments' meanings.

- `X`: the class you are interacting with

The described below is a not recommended approach. This is risky because it may break some classes' properties due to the `babel-transform-class-properties` plugin's internal mechanics.

```javascript
const addRouter = (CategoryFilterOverlay) => {
    // E.g: return the original class wrapped in a HOC
    return withRouter(CategoryFilterOverlay);
}
```

The `class` API is designed to be used as follows. Remember that you **SHOULD NEVER** copy the original code to your extend's members, use `super` or any other level of abstraction for that.

>**Note**:
>
> Using this to implement React lifecycle members that are missing from the initial class is not recommended. Prefer using the regular `member-function` interception to do that, it provides an opportunity for different extensions to implement them without overriding each other.

```javascript
const addBlockBelow = (CategoryFilterOverlay) => (
	class ExtendedCategoryFilterOverlay extends CategoryFilterOverlay {
		render() {
			return (
				<>
				{ super.render() }
				<div>
					Additional block!
				</div>
				</>
			)
		}
	}
)
```

## Plugin configuration

Once you have created your plugin functions, you need to specify which places you want to plug into. In order to do this, each plugin file should have a default export - a plugin configuration object.

In the plugin configuration, the following information can be specified:

1. **Namespace**: Every class and function that can be plugged into has a namespace, indicated with the `@namespace` decorator.

2. **What** aspect of the namespace you want to modify...

### If you are plugging into a *class*:

- Use the `class` plugin if you want to replace the entire class with something else (see an example above). While it is technically possible to replace the class with another class entirely, this is VERY unsafe.
- Specify `member-function` and a function plugin if you want to alter the behavior of the class's method. E.g: plugging into `render` or `componentDidMount`.
- Specify `member-property` and a property plugin if you want to alter the value of a field of the class. E.g: plugging into `state`.
- Specify `static-member` and a property plugin if you want to modify a class' static field.

>**Note**:
>
> If you want to plug into a class member that is an arrow function, still use `member-function`, not `member-property`.

### If you are *not* plugging into a *class*:

If you are plugging into a function that has its own namespace and is not part of a class: Use the `function` plugin type.

**Name**: if you are targetting a class member, you must specify its name.

**Position** (Optional, defaults to 100): Specifies the order in which plugins are applied. Plugins with lower position will be called before plugins with higher position.

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

// If you want to specify multiple plugins for the same namespace and target (you are not going to need this often):
[somePlugin, someOtherPlugin]

// If you want to specify a priority for your plugin to be called sooner/later than other plugins:
{
    position: 42, // defaults to 100
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

## Enabling extensions

In the frontend root of the ScandiPWA theme, there is a file called `scandipwa.json`. In this file, you can specify the path to the extensions that the theme should use. Without specifying an extension here, all of its plugins will be ignored.

The plugins are specified in the `extensions` section of `scandipwa.json`. It has the following format:

```json5
{
    // ...
    "extensions": {
        "<name>": "<P>",
        "<name2>": "<P2>",
        // Example:
       "PayPal": "vendor/scandipwa/paypal-graphql",
    }
    // ...
}
```

Where:
- `<name>` is an arbitrary name for the plugin
- `<P>` is the relative path from Magento root to the extension's root

## Plugging into other plugins' classes

ScandiPWA allows plugging into plugins' classes, such as the components, queries, etc. The plugin configuration files (`.plugin.js`) cannot be plugged into due to the configuration builder's limitations. `.plugin.js` file contents can be overridden in the theme only.

## Outdated video tutorials

> **Note**:
>
> You may use these videos for some general guidance of the plugin development process, but please be aware that they are outdated. Read the documentation above for the most up-to-date details

### Implementing an extension from scratch
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/9f6rpIrlNMk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Implementing an extension from customization
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/N2TJJbSDTbM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
