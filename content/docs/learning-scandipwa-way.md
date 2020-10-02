---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Learning ScandiPWA Way
description: A brief look at the ScandiPWA main component files.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/development'
  title: Development
---
<div>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/c62CDwvnutk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

In this tutorial we will talk about the main component files in ScandiPWA:
- [.component](#component)
- [.config](#config)
- [Map approach for component types](#map-approach-for-component-types)
- [.container](#container)
- [Container structure: containerProps, containerFunctions](#container-structure-containerprops-containerfunctions)
- [.style](#style)

More specifically we will talk about:
- [.component](#component)
- [.config](#config)
- [Map approach for component types](#map-approach-for-component-types)
- [.container](#container)
- [Container structure: containerProps, containerFunctions](#container-structure-containerprops-containerfunctions)
- [.style](#style)

After watching this tutorial you should be able to discuss the following:
- Using VSCode extension for component bootstrap
- Top-level contents must be exported in .config file
- Map property principle
- Escaping for loops and lets

To follow along with this tutorial, you should start with the [environment set-up](https://docs.scandipwa.com/docs/environment-set-up.html). For this demonstration we'll be using VSCode.

Run `yarn start` to start the development server and add an `index.js` file to the `src` folder:
```bash
📂<your-app-name>
 ┣ 📂i18n           
 ┣ 📂magento
 ┣ 📂node_modules   
 ┣ 📂public         
 ┣ 📂src
 ┃ ┗ 📜index.js     # new file            
 ┣ 📜composer.json
 ┣ 📜package.json
 ┗ 📜yarn.lock
```
The `index.js` file should look like this:
```js
import ReactDOM from 'react-dom';

ReactDOM.render(
    <UrlResolver />,
    document.getElementById('root')
);
```
You'll see an error saying 'UrlResolver' is not defined. If you've followed along with the [environment set-up](https://docs.scandipwa.com/docs/environment-set-up.html), you'll already have ScandiPWA Development Toolkit installed, which will be necessary for the rest of this tutorial.

To resolve the 'not defined' issue, press `ctrl + shift + P` to access the VSCode command pallette and type in '>Create new component' and press enter. 

You should then be prompted to type in your new component's name, in this case it's `UrlResolver`, select the `Contains business logic` feature and press enter.

The ScandiPWA Development Toolkit will generate a ScandiPWA `UrlResolver` component folder which will contain template files:
```bash
📂<your-app-name>
 ┣ 📂i18n           
 ┣ 📂magento
 ┣ 📂node_modules   
 ┣ 📂public         
 ┣ 📂src
 ┃ ┣ 📂component/UrlResolver
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜UrlResolver.component.js
 ┃ ┃ ┣ 📜UrlResolver.container.js
 ┃ ┃ ┗ 📜UrlResolver.style.scss
 ┃ ┗ 📜index.js                 
 ┣ 📜composer.json
 ┣ 📜package.json
 ┗ 📜yarn.lock
```
If you have any issues with the imports, ScandiPWA Development Toolkit allows you to click on your issue and 'Fix all auto-fixable problems'. 

So, now we can go back to `src/index.js` and import the `UrlResolver`:
```js
import ReactDOM from 'react-dom';

import UrlResolver from 'Component/UrlResolver';

ReactDOM.render(
    <UrlResolver />,
    document.getElementById('root')
);
```
Notice that we don't have to use the relative path, instead we can use an alias for the absolute path of the `Component` folder.

You can check out what path aliases are available by going to `node_modules/@scandipwa/scandipwa/src`. The folders here represent the available aliases and these are as follows: `component`, `query`, `route`, `store`, `style`, `type` and `util`. The alias for referencing these folders is simply the folder name - capitalized.

## .component
Using the previously created `component/UrlResolver` folder, let's edit the `UrlResolver.component.js` file:
```js
// some stuff

render() {
    return (
        <div block="UrlResolver">
            Hello!
        </div>    
    );
}
```
If you go to Chrome `localhost:3000`, you'll see the 'Hello!' being output there.

>**Note**
>
>The main tasks of `UrlResolver.component.js` are:
>- Determining the page type
>- Rendering the proper page

So, we'll need to take a URL using the location API and we'll need to detect to which entity type the URL refers to, e.g. a page, a category or a product.

First, let's look at page rendering. Let's assume that there are multiple page types. How can we render them?

Since the `component.js` files are made for pure rendering, we'll assume that the page type will be coming from props and we'll not determine page type in the component.

The URL determination will be done in the `container.js` and we'll tackle that a bit later.

Let's assume that the `container` ships us a type as a prop:
```js
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './UrlResolver.style';

class UrlResolver extends PureComponent {
    static propTypes = {
        // a propType of type string is required
        type: PropTypes.string.isRequired
    };

    render() {
        const { type } = this.props;

        if (type === 'product') {
            return 'product';
        } 
        
        if (type === 'category') {
            return 'category';
        }
        return 'cms_page';
    }
}
```
Let's add individual render methods for each product type:
```js
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './UrlResolver.style';

class UrlResolver extends PureComponent {
    static propTypes = {
        // a propType of type string is required
        type: PropTypes.string.isRequired
    };

    renderProduct() {
        return 'product';
    }

    renderCategory() {
        return 'category';
    }

    renderCmsPage() {
        return 'cms_page';
    }

    render404() {
        return '404';
    }

    render() {
        const { type } = this.props;

        if (type === PRODUCT_TYPE) {
            return this.renderProduct();
        } 
        
        if (type === CATEGORY_TYPE) {
            return this.renderCategory();
        }
        return this.renderCmsPage();
    }
    // some stuff
}
```
## .config
Add the product page types as constants in `UrlResolver.config.js`:
```js
export const PRODUCT_TYPE = 'product';
export const CATEGORY_TYPE = 'category';
export const CMS_PAGE_TYPE = 'cms_page';
```
We shouldn't add the constants to the `component.js` file due to the fact that in order for `webpack` to be able to create smaller sized bundles, we need to add the constants that might be reused by different modules to the `config.js` file - outside of large modules.

`webpack` can't split modules apart, so, if only a constant is needed, the bundle size would be minimized significally by using a constant-only file. In this case, creating a new file means creating a new module.

The issue with our `UrlResolver.component.js` file now is that the code repeats itself. An option is to write `switch` statements instead of `if` statements:
```js
// some stuff

render(){
    const { type } = this.props;

    switch (type) {
    case PRODUCT_TYPE:
        return this.renderProduct();
    case CATEGORY_TYPE:
        return this.renderCategory(); 
    case CMS_PAGE_TYPE:
        return this.renderCmsPage(); 
    default:
        return this.render404();
    }
}
```
Notice that ScandiPWA has a specific writing convention in place for `switch` statements - the cases should be on the same indentation level as the `switch` itself.

Since we haven't imported the constants from the `config` file, we can use auto-fixer to 'Fix this simple import-sort/sort problem' and it'll add the following to our imports:
```js
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import {
    CATEGORY_TYPE,
    CMS_PAGE_TYPE,
    PRODUCT_TYPE
} from './UrlResolver.config';

import './UrlResolver.style';
```
If we check-in with the browser, `localhost:3000` will display '404' as the type of page hasn't yet been passed, it's undefined.

## Map approach for component types
The `switch` approach for component types is still not the most efficient way to go about rendering since we can't quickly extend the method. The solution to this is to create a rendering map:
```js
class UrlResolver extends PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired
    };

    renderMap = {
        [CATEGORY_TYPE]: this.renderCategory.bind(this),
        [PRODUCT_TYPE]: this.renderProduct.bind(this),
        [CMS_PAGE_TYPE]: this.renderCmsPage.bind(this),
    };

    // other stuff
```
As you might know `this` can cause context loss, so we need to `bind` the type to the render method.

After creating the render map, we need to replace our `switch` statement:
```js
// some stuff

render(){
    const { type } = this.props;

    const renderFunction = this.renderMap[type];

    if (renderFunction) {
        return renderFunction();
    }

    return this.render404();

}
```
We can further optimize this by using the logical operator OR (||)
```js
// some stuff

render(){
    const { type } = this.props;

    const renderFunction = this.renderMap[type] || this.render404.bind(this);
    return renderFunction();
}
```
In both cases our render will return '404' in the case if no type was found.

So, the finalized `component` file will look like this:
```js
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import {
    CATEGORY_TYPE,
    CMS_PAGE_TYPE,
    PRODUCT_TYPE
} from './UrlResolver.config';

import './UrlResolver.style';

class UrlResolver extends PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired
    };

    renderMap = {
        [CATEGORY_TYPE]: this.renderCategory.bind(this),
        [PRODUCT_TYPE]: this.renderProduct.bind(this),
        [CMS_PAGE_TYPE]: this.renderCmsPage.bind(this),
        // add a new [KEY] to object to extend
        // type constants are in config file 
    };

    renderProduct() {
        return 'product';
    }

    renderCategory() {
        return 'category';
    }

    renderCmsPage() {
        return 'cms_page';
    }

    render404() {
        return '404';
    }

    render(){
        const { type } = this.props;

        const renderFunction = this.renderMap[type] || this.render404.bind(this);
        return renderFunction();
    }
}

export default UrlResolver;
```
## .container
The `container` has all of the business logic inside of it. So, in order to determine the URL, we should go to the URL container. We can try to guess the URL type based on the URL, but we can also request the URL from the Magento URL resolver aka UrlRewrite\resolve. 

For now, let's just guess which type we're referring to based on the location. So, to actually do it we should first understand the concept of a `container`. 

## Container structure: containerProps, containerFunctions
A `container` file has two functions always defined:
```js
containerFunctions = {
    // getData: this.getData.bind(this)
};

containerProps = () => {
    // isDisabled: this._getIsDisabled()
};
```
`containerFunctions` is an object containing the mapping of a key that will be later passed to your component as a prop and the function that'll be used to implement the prop.

The `getData` key will be passed as a prop to the `component`, where it'll call it and then it'll return some data. So, the logic itself will be located in the `container` and the `component` will simply call it.

We won't be using the `containerFunctions` in this tutorial, so we can remove all references to it from the `container` file.

Next are the `containerProps` which are meant for props mapping. For example, if you have a property to define, like `isDisabled` or a type, you provide a function that will `get` this property for you. 

Again, the property itself is used in the `component` for rendering, but the value retrieved from the `container`.

In order to determine the page type let's do the following in the `container.js` file.
```js
// add () to get a valid object returned, instead of a function
containerProps = () => ({
    type: this._getTypeFromURL()
});

_getTypeFromURL() {
    return PRODUCT_TYPE;
}

// some stuff
```
In order to use `PRODUCT_TYPE` we also need to import it in the `UrlResolver.container.js` file:
```js
import { PureComponent } from 'react';

import UrlResolver from './UrlResolver.component';
import { PRODUCT_TYPE } from './UrlResolver.config';
```
If we compile and go to `localhost:3000` in our browser, we should see 'product' now.

Now, we need to implement mapping itself. Let's assume that the page we're visiting contains the type and the URL. This means that we need to implement mapping again. This time instead of mapping to a function, let's use regex, since it's one of the faster ways to find strings.

```js
// some stuff

typeMap = {
    [CATEGORY_TYPE]: /category/,
    [PRODUCT_TYPE]: /product/,
    [CMS_PAGE_TYPE]: /page/,
};

containerProps = () => ({
    type: this._getTypeFromURL()
});

_getTypeFromURL() {
    // eslint-disable-next-line fp/no-let
    for (let i = 0; i < Object.entries.(this.typeMap).length; i++){
        const [type, regex] = Object.entries(this.typeMap)[i];

        // checking if the provided path name matches
        if (regex.test(window.location.pathname)) {
            return type;
        }
    }
    return ''; // will be handled as 404 by component
}
```
Disable any ESlint warnings and don't forget to:
```js
import {
    CATEGORY_TYPE,
    CMS_PAGE_TYPE,
    PRODUCT_TYPE
} from './UrlResolver.config';
```
So in `localhost:3000` we'll see '404', but if we go to `localhost:3000/product` in our browser, we'll see 'product'.

A way of optimizing the for loop would be by defining the array beforehand:
```js
_getTypeFromURL() {
    const array = Object.entries.(this.typeMap);

    // eslint-disable-next-line fp/no-let
    for (let i = 0; i < array.length; i++){
        const [type, regex] = array[i];

        // checking if the provided path name matches
        if (regex.test(window.location.pathname)) {
            return type;
        }
    }
    return ''; // will be handled as 404 by component
}
```
Instead of the type map, we should make a type list that'll work as an array. This will work much better for us, as it'll be possible to loop through it right away:
```js
typeList = [
    {
        type: CATEGORY_TYPE,
        regex: /category/
    },
    {
        type: CMS_PAGE_TYPE,
        regex: /page/
    },
    {
        type: PRODUCT_TYPE,
        regex: /product/
    },
]

containerProps = () => ({
    type: this._getTypeFromURL()
});

_getTypeFromURL() {
    // eslint-disable-next-line fp/no-let
    for (let i = 0; i < this.typeList.length; i++){
        const { type, regex } = this.typeList[i];

        // checking if the provided path name matches
        if (regex.test(window.location.pathname)) {
            return type;
        }
    }
    return ''; // will be handled as 404 by component
}
```
Another way of optimizing would be by using array functions:
```js
_getTypeFromURL() {
    const { type } = this.typeList.find(
        ({ type, regex }) => regex.test(window.location.pathname)
    );
    return type;
}
```
An issue with using `find` is that it can return `null`. In this case we'll get a TypeError: Cannot destructure property 'type' because it's undefined. 

A solution would be to return an empty array in case nothing is found. If an empty array is destructured the type is 'undefined', this then can be handled by the `component`:
```js
_getTypeFromURL() {
    const { type } = this.typeList.find(
        ({ type, regex }) => regex.test(window.location.pathname)
    ) || {};

    return type; // will be handled as 404 if undefined by component
}
```
We can see that by using `typeList` the rest of our logic shrunk down as well. This is why we need to understand which data structure is needed before attempting to implement anything.

For example, arrays come in handy when you need to find something, but for rendering maps are a better solution.
## .style
Let's go back to the `UrlResolver.component.js` file and implement `renderType` as a separate function. This is needed because the `render` itself should return the style wrapper:
```js
// some stuff

    render404() {
        return '404';
    }

    renderType() {
        const { type = '404' } = this.props;
        const renderFunction = this.renderMap[type] || this.render404.bin(this);
        return (
            <article
                block="UrlResolver"
                elem="Type"
                mods={ { type } }
            >
                { renderFunction();}
            </article>
        );
    }

    render(){
        return (
            <main block="UrlResolver">
                { this.renderType() }
            </main>
        );
    }
}

export default UrlResolver;
```
Wrapping the `renderFunction` in `article` ensures that we'll be able to reference to it using a BEM abstraction later on.

Go to `UrlResolver.style.scss` to apply some styles. If you want to take an in-depth look at ScandiPWA styling conventions, go [here](https://docs.scandipwa.com/docs/theme-styling.html).
```scss
:root {
    --url-resolver-color: orange;
}

.UrlResolver {
    font-size: 20px;

    &-Type {
        color: var(--url-resolver-color);

        // type specific colors
        &_type {
            &_404 {
                color: red;
            }
        }
    }
}
```
The issue with `&_404 { color: red; }` is that we're redefining a property, instead we should redefine the CSS custom variable:
```scss
:root {
    --url-resolver-color: orange;
}

.UrlResolver {
    font-size: 20px;

    &-Type {
        color: var(--url-resolver-color);

        // type specific colors
        &_type {
            &_404 {
                --url-resolver-color: red;
            }
        }
    }
}
```
What if we move the variable declaration a level up?
```scss
:root {
    --url-resolver-color: orange;
}

.UrlResolver {
    font-size: 20px;
    color: var(--url-resolver-color);

    &-Type {
        &_type {
            &_404 {
                --url-resolver-color: red;
            }
        }
    }
}
```
Now, the logic will stop working and '404' will be orange. As mentioned in [the previous tutorial](https://docs.scandipwa.com/docs/theme-styling.html) the CSS custom variables are resolved from the top of the file. 

The first element it'll look at is the <html> and there the variable will be defined in `:root{}`. Going further down to <body>, <div id="root"> and further on we can see no declarations of this variable. 

It'll not care if the variable declaration appears inside the element, it only cares if the declaration happens above the element.

This is why color property declarations should appear on the same level or deeper than the variable re-declaration.

The only thing left to do is to get rid of the hardcoded red:
```scss
:root {
    --url-resolver-color: orange;
    --url-resolver-404-color: red;
}

.UrlResolver {
    font-size: 20px;
    color: var(--url-resolver-color);

    &-Type {
        &_type {
            &_404 {
                --url-resolver-color: var(--url-resolver-404-color);
            }
        }
    }
}
```