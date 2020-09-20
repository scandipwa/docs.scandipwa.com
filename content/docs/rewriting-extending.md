---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Rewriting and Extending A Theme
description: How to rewrite and extend a theme.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/TW31C4HbfC4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

1. [Structured data explanation and testing example](#structured-data-explanation-and-testing-example)
2. [Pagination implementation details](#pagination-implementation-details)
3. [Style structure (abstract folder)](#style-structure-abstract-folder)
4. [Mention of coding standards](#mention-of-coding-standards)
5. [Guide to rewriting](#guide-to-rewriting)
6. [Rewriting simple components like Header](#rewriting-simple-components-like-header)
7. [Overriding and extending the styles](#overriding-and-extending-the-styles)
8. [Rewriting styles only](#rewriting-styles-only)
9. [Creating a new page and adding it to the router](#creating-a-new-page-and-adding-it-to-the-router)
10. [Creating a container with connection to global state](#creating-a-container-with-connection-to-global-state)
11. [Extending the Header business logic (its state)](#extending-the-header-business-logic-its-state)

## Structured data explanation and testing example
We can go to a page in `scandipwa.local`, Inspect it and copy the HTML. After this when going to [Google schema checker](https://search.google.com/structured-data/testing-tool) we'll be able to see info about the organization. This information is originally declared in the `Header.component.js` file.

Additionally we'll see the breadcrumbs list, multiple products and their details. This info in useful when you want to see your product readily selectable from a Google search.

## Pagination implementation details
Go to `scandipwa.local` woman's section and you'll see pagination happening while scrolling to the bottom of the page. Notice the URL changes while scrolling. After reloading the site will display only the current page, with the option to 'Load previous'.

This is important for Google's crawlers. This way they'll receive only one page at a time.

## Style structure (abstract folder)
The `app/style` is divided in abstract and base styles. Abstract styles mean that these files contain no real selector declarations. These styles are available to any component's style.

For example, the `Breadcrumb.style.scss` file contains:
```scss
@include before-desktop {
  --breadcrumbs-background: #fff;

  display: none;
}
```
Which is included in the `app/style/abstract/_media.scss` file as:
```scss
@mixin before-desktop {
    @media (max-width: 1024px) {
        @content;
    }
}
```
Refrain from declaring things in the `abstract` files. This will lead to your declaration appearing in multiple component's styles that had used the abstraction.

The `style/base` folder contains the default styles that you'll encounter. This folder contains styles for simple HTML elements without classes.

## Mention of coding standards
Check out our docs on code standards - [React](https://docs.scandipwa.com/docs/react-best-practices.html), [styles](https://docs.scandipwa.com/docs/best-practices-styles.html[) and [BEM](https://docs.scandipwa.com/docs/coding-standard.html). These docs are made on the basis of compiling the most common code review issues on ScandiPWA.

## Guide to rewriting
Let's look at an example where we want to change the logo 'ScandiPWA' in `scandipwa.local`. 

First, find `Header.component.js` to find out where the header is located in `source`. In this case it's located in `app/component/Header`.

Go to your theme's app `pwa/src/app` and create a new folder called `component` and in it a `Header` folder. After this you can check if the application compiles successfully by running the alias `dcf logs -f --tail-100 frontend`. Use the `tail` flag to only see the last 100 lines of the log file.

You can read more about the ScandiPWA permanent aliases [here](https://docs.scandipwa.com/docs/linux.html). 

To override the original header, add a `Header.component.js` to your newly created folder.

It's important to import from the component, because otherwise you might import the container or something else that you have not specifically asked for.

This is what your new header file will have to contain:
```js
import React from 'react';

// imports the original header from vendor folder
import SourceHeader from `SourceComponent/Header/Header.component';

// imports Link from your theme; or vendor folder if not found in theme
import Link from 'Component/Link';

// export everything from the source header
export * from `SourceComponent/Header/Header.component';

class Header extends SourceHeader {
// original method copied from source header file
      renderLogo(isVisible = false) {
        const { isLoading } = this.props;

        if (isLoading) {
            return null;
        }

        return (
            <Link
              to="/"
              aria-label="Go to homepage by clicking on ScandiPWA logo"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
              block="Header"
              elem="LogoWrapper"
              mods={ { isVisible } }
              key="logo"
            >
            {/* this is our customization */}
                <span>Alfred</span>
            </Link>
        );
    }
}

export default Header;
```
After doing this we wait for the dev server reload and we'll be able to see our changes on `scandipwa.local`. Instead of the ScandiPWA logo, the homepage now should have 'Alfred' as a link in place.

## Overriding and extending the styles
A plain link text doesn't look so great, so let's change the styles as well. You can approach styling in two ways - completely overriding them or extending them.

In order to not have code duplications in the project, let's extend the style file. The same way as previously make a `Header.style.scss` file in the `pwa/src/app/component/Header` folder.
If your file contains the following:
```scss
.Header{

}
```
You'll see that the header in `scandipwa.local` will have been completely overriden. So, we recommend to instead name the new style file `Header.override.style.scss`. It is important to stick to the naming convention in order for the fallback mechanism to work. So, the style file name should be `<name>.override.style.scss`.
```scss
.Header{
  &-Logo{
    width: min-content;
    height: auto;
  }
}
```
Let's also declare BEM properties for span inside `Header.component.js`:
```js
import React from 'react';
import SourceHeader from `SourceComponent/Header/Header.component';
import Link from 'Component/Link';
export * from `SourceComponent/Header/Header.component';

class Header extends SourceHeader {
// original method copied from source header file
      renderLogo(isVisible = false) {
        const { isLoading } = this.props;

        if (isLoading) {
            return null;
        }

        return (
            <Link
              to="/"
              aria-label="Go to homepage by clicking on ScandiPWA logo"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
              block="Header"
              elem="LogoWrapper"
              mods={ { isVisible } }
              key="logo"
            >
            {/* this is our customization */}
                <span
                block="Header"
                elem="MyName"
                >Alfred</span>
            </Link>
        );
    }
}

export default Header;
```
You can read more about BEM [here](https://docs.scandipwa.com/docs/coding-standard.html). 

The `MyName` element then can be styled in the `Header.override.style.scss` file:
```scss
.Header {
  &-Logo {
    width: min-content;
    height: min-content;
  }
  &-MyName {
    color: $black;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    }
  }
}
```
The `$black` is declared in `_variables.scss` file. After writing out your style, don't forget to import it in the `Header.component.js` file. So, the imports will look like this:
```js
import React from 'react';
import SourceHeader from `SourceComponent/Header/Header.component';
import Link from 'Component/Link';
import './Header.override.style.scss';
```
The dot at the start of the path signifies that the `Header.component.js` should look for the import in the same folder where it's located.

If you want to remove the brand rendering from the product card find the `ProductCard.component.js` and create a new folder, just like with the `Header` folder. So, just the sake of repetition, you create in the following path: `pwa/src/app/component/ProductCard`. In this folder create a `ProductCard.component.js` file that will be meant for overriding the `source` component. The skeleton of the code will be fairly similar to the previous header example.
```js
import React from 'react';
import SourceProductCard from `SourceComponent/ProductCard/ProductCard.component';
export * from `SourceComponent/ProductCard/ProductCard.component';

class ProductCard extends SourceProductCard {

}
export default ProductCard;
```
Now we have to look where the brand is rendered in the source `ProductCard` and copy that code into our new file.
```js
import React from 'react';
import SourceProductCard from `SourceComponent/ProductCard/ProductCard.component';
export * from `SourceComponent/ProductCard/ProductCard.component';

class ProductCard extends SourceProductCard {
    renderAdditionalProductDetails() {
      return null;
    }
}
export default ProductCard;
```
This will remove the brand name from the product card. We can also introduce the product card to us:
```js
import React from 'react';
import SourceProductCard from `SourceComponent/ProductCard/ProductCard.component';
export * from `SourceComponent/ProductCard/ProductCard.component';

class ProductCard extends SourceProductCard {
    renderAdditionalProductDetails() {
      return (
        <p>
          Hi, I am a product card!
        </p>
      );
    }
}
export default ProductCard;
```
Now after rendering you'll see this text under every product card.

If we don't like the look of breadcrumbs, we can try to change the style of them. Just like in all of the previous examples we need to make a new breadcrumbs folder in our app and create a style file in it. So, the folder path would be: `pwa/src/app/component/Breadcrumbs` and the copy the source `Breadcrumbs.style.scss` file in it for this example.

Let's change the colors. Note, that you need to keep all of the rest of the style declarations, since the file's name is not `Breadcrumbs.override.style.scss`.
## Creating a new page and adding it to the router
Create a new folder in the `src/app/route` folder to create a new page. The path will look like this `src/app/route/NewPage`. The `NewPage` folder should contain a `NewPage.component.js` file and `index.js` file.

The `NewPage.component.js` should contain:
```js
import React, { PureComponent } from 'react';

class NewPage extends PureComponent{
  render() {
    return(
      <p>Hello, this is a new route/page.</p>
    );
  }
}

export default NewPage;
```
Now we need to add this to `NewPage/index.js`:
```js
export { default } from './Newpage.component';
```
After this we need to add this additional route to the ``Router.component.js` file in the switch items section by adding:
```js
component: <Route path="/new-page" exact component {NewPage} />
position: 11
```
Add the following to the imports:
```js
import NewPage from 'Route/NewPage';
```
## Creating a container with connection to global state
To add breadcrumbs, create a `NewPage.container.js` file in `src/app/route/NewPage` directory.
```js
import { connect } from 'react-redux';
import { BreadCrumbsDispatcher } from 'Store/Breadcrumbs';

import NewPage from './NewPage.component';

export const mapDispatchToProps = dispatch => ({
  updateBreadCrumbs: breadcrumbs => BreadcrumbsDispatcher.update(breadcrumbs, dispatch)
})

export default connect(null, mapDispatchToProps)(NewPage);
```
Now let's call it in `NewPage.component.js`:
```js
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class NewPage extends PureComponent{
  constructor(props){
    super(props);

    const { updateBreadcrumbs } => props;
    updateBreadcrumbs([
      { url: '/new-page', name: __('New Page') },
      { url: '/', name: __('Home') }
    ])
  }

  render() {
    return(
      <main block="NewPage">
      <p>Hello, this is a new route/page.</p>
      </main>
    );
  }
}

NewPage.propTypes = {
  updateBreadcrumbs: PropTypes.func.isRequired
};

export default NewPage;
```
We also need to change the `NewPage/index.js` and export the container in order to not have undefined props.
```js
export { default } from './Newpage.container';
```
We can create style for the NewPage in the same manner as previously by adding a `NewPage.style.scss` file to the `NewPage` folder. There we need to declare the new page and style away!
```scss
:root{
  --new-page-background: red;
}

// class name is generated from the component's block
.NewPage{
  // style
  background: var(--new-page-background);
}
```
Use variables in styles to be able to override the style from a parent component. Add the style to your component by adding `import './NewPage.style';`.

We can also move the content around, so we need to BEM the elements in `NewPage.component.js`:
```js
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './NewPage.style';

class NewPage extends PureComponent{
  constructor(props){
    super(props);

    const { updateBreadcrumbs } => props;
    updateBreadcrumbs([
      { url: '/new-page', name: __('New Page') },
      { url: '/', name: __('Home') }
    ])
  }

  render() {
    return(
      <main block="NewPage">
      <p block="NewPage" elem="Note">Hello, this is a new route/page.</p>
      </main>
    );
  }
}

NewPage.propTypes = {
  updateBreadcrumbs: PropTypes.func.isRequired
};

export default NewPage;
```
Consequently in our `NewPage.style.scss` we add:
```scss
:root{
  --new-page-background: red;
}

// class name is generated from the component's block
.NewPage {
  background: var(--new-page-background);
  display: flex;
  justify-content: center;
  align-items: center;
  
  &-Note {
    display: inline-block;
  }
}
```
## Extending the Header business logic (its state)
Say we wanted to change stuff in the header and exchange the menu button for a 'back' button. Go to your header extension file `Header.component.js`

```js
import React from 'react';
import SourceHeader from `SourceComponent/Header/Header.component';
import Link from 'Component/Link';
import PropTypes from 'prop-types';
// import prop types from source header

export * from `SourceComponent/Header/Header.component';
export const NEW_PAGE = 'new_page';

class Header extends SourceHeader {
// overrides the source header's state map
  constructor(props) {
    super(props);

    this.stateMap = {
      ...this.stateMap.
      [NEW_PAGE]: {
        back: true
      };
    };
  }

      renderLogo(isVisible = false) {
        const { isLoading } = this.props;

        if (isLoading) {
            return null;
        }

        return (
            <Link
              to="/"
              aria-label="Go to homepage by clicking on ScandiPWA logo"
              aria-hidden={ !isVisible }
              tabIndex={ isVisible ? 0 : -1 }
              block="Header"
              elem="LogoWrapper"
              mods={ { isVisible } }
              key="logo"
            >
                <span
                block="Header"
                elem="MyName"
                >Alfred</span>
            </Link>
        );
    }
}

Header.propTypes = {
  ...Header.propTypes,
  // copy header state from source header
  name: PropTypes.oneOf([
    // add new page
    NEW_PAGE
  ])
},
export default Header;
```
In your theme's header folder add `Header.container.js` where we'll need to extend the source header's container and export everything else.
```js
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  HeaderContainer as SourceHeaderContainer,
  mapStateToProps,
  mapDispatchToProps 
} from 'SourceComponent/Header/Header.container';
import Header, { NEW_PAGE } from 'Component/Header/Header.component';

export class HeaderContainer extends SourceHeaderContainer {
  constructor(props) {
    super(props);

    const { history } = props;

    this.routeMap = {
      ...this.routeMap,
      // go to home when clicking back button
      '/new-page': { name: NEW_PAGE, onBackClick: () => history.push('/') }
    }
  }
}

HeaderContainer.propTypes = {
  ...HeaderContainer.propTypes,
  headerState: Header.propTypes.headerState
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderContainer));
```
Now, let's add the new page to the admin dashboard. Go to `scandipwa.local/admin` and log in. Then go to 'Scandiweb' - 'Menu Manager'. Go to assigned items and add an aditional item with the title 'New Page'. URL type is custom URL and it should be `/new-page` and parent 'Categories'.

After this go to cache management and 'Flush Cache Storage'. After this you should be able to navigate to your page in `scandipwa.local`.