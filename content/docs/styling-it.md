---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Styling It
description: How To Style Your ScandiPWA Theme

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/development'
  title: Development
---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/W7BiWI4yVsc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
- [Adding style files (.css)](#adding-style-files-css)
- [Using CSS properties without a prefix](#using-css-properties-without-a-prefix)
- [Using CSS variables](#using-css-variables)
- [Switching to SCSS to build classnames](#switching-to-scss-to-build-classnames)
- [Organizing classnames with BEM](#organizing-classnames-with-bem)

After watching this video, you should be able to discuss the following topics:
- Gluing classnames with “&”
- Mods with boolean and non-boolean modifiers
- Using mix prop to combine classes
- Root and non-root declarations of CSS custom properties

## Adding style files (.css)
Add a new style file `style.css` in your theme's `src` folder:
```bash
📂<your-app-name>
 ┣ 📂i18n          
 ┣ 📂magento
 ┣ 📂node_modules   
 ┣ 📂public         
 ┣ 📂src 
 ┃ ┣ 📜index.js
 ┃ ┗ 📜style.css      # new file
 ┣ 📜composer.json
 ┣ 📜package.json
 ┗ 📜yarn.lock
```
After adding `style.css` you need to import it in `index.js` by adding:
```js
import './style.css';
```

This tutorial builds on the previous one. If you haven't completed it, you can just copy the following contents and add them to `src/index.js`.
```js
/* eslint-disable max-classes-per-file, @scandipwa/scandipwa-guidelines/only-one-class */

import { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// new style import
import './style.css';

class Button extends PureComponent {
    // use either propTypes or defaultProps
    static propTypes = {
        // sets the required prop
        wrapperCount: PropTypes.number
    };

    static defaultProps = {
        // sets the default value
        wrapperCount: 0
    };

    constructor (props){
        super(props);

        this.state = {
            clickCount: 0,
            // set a new default
            prevWrapperCount: 0
        };


    static getDerivedStateFromProps(props, state) {
        // no access to current value is present
        // no access to `this`

        const { wrapperCount } = props;
        const { prevWrapperCount } = state;
        // you need to keep previous value in state

        // if wrapper count is not equal to previous value
        if (wrapperCount !== prevWrapperCount) {
            return{
                // update click count to wrapper count
                clickCount: wrapperCount,
                // update previous value
                prevWrapperCount: wrapperCount
            };
        }

        return null;
    }

    componentDidMount() {
        console.log('mount', document.getElementById('abc'));
    }
    componentDidUpdate() {
        // triggered by state & props change
        console.log('update');
    }

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    }

    render () {
        const { clickCount } = this.state;   

        return (
            <div id="abc">
                <span>
                    You clicked me
                    <b>{ clickCount }</b>
                </span>
                <button onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
}



class Wrapper extends Component  {
    // defines the state
    state = {
        clickCount: 0     
    };

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    };

    render() {
        const { clickCount } = this.state;

        return(
            <div>
                <Button wrapperCount= { clickCount } />
                <button onClick={ this.onButtonClick }>Update wrapper</button>
            </div>
        );
    }
}

ReactDOM.render(
    // renders the wrapper component instead
    <Wrapper />,            
    document.getElementById('root')
);
```
## Using CSS properties without a prefix
It is recommended to stick to styling by classes, as it'll make your life easier in the long run:
```css
// this is className="heading" in index.js
.heading {
    font-size: 20px;
    font-family: monospace;
}

// this is className="button" in index.js
.button {
    appearance: none;
    border: 1px solid black;
    padding: .25rem 1rem;
    background-color: hotpink;
}
```
A REM unit is equal to computed value of font-size for the root element. So, if your font default is 12px, 1 REM unit will be 12px as well and 0,25 REM units will be 3px.

In order to make the styles work, we need to add class names to the render methods found in `index.js`.

First, let's edit the `class Button`:
```js
    render () {
        const { clickCount } = this.state;   

        return (
            <div id="abc">
                {/* change span to h1 and add classNames */}
                <h1 className="heading">
                    You clicked me
                    <b>{ clickCount }</b>
                </h1>
                <button className="button" onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
```
Next, the same for `class Wrapper`:
```js
    render() {
        const { clickCount } = this.state;

        return(
            <div>
                <Button wrapperCount= { clickCount } />
                <button className="button" onClick={ this.onButtonClick }>Update wrapper</button>
            </div>
        );
    }
```
For now, ESlint rules won't let you use className, so for the sake of this tutorial, disable this rule for the whole file.

Now the style should change accordingly. If we use 'Inspect element' on a button in the browser, we should see in the Styles tab that a previously unknown property `webkit-appearance` has been added. This happened due to the fact that the compilator automatically adds vendor prefixes to the properties. 

Here you can see browser specific examples:
```text
…
-webkit-flex: 101;  # Chrome and Safari
-moz-flex: 101;     # Mozilla
-o-flex: 101;       # Opera
-ms-flex: 101;      # Internet Explorer
…
```
## Using CSS variables
Instead of writing out the color references directly, we should use CSS variables or CSS custom properties. They are declared in the `root` element and later referenced using `var()`.
```css
:root {
    --button-color: hotpink;
    --button-border-color: black;
}

.heading {
    font-size: 20px;
    font-family: monospace;
}

.button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);
}
```
In order to showcase the differences in these approaches more clearly, we can define a new `className` in the `Button` component. 
```js
    render () {
        const { clickCount } = this.state;   

        return (
            <div className="button-wrapper">
                <h1 className="heading">
                    You clicked me
                    <b>{ clickCount }</b>
                </h1>
                <button className="button" onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
```
Now, let's style the `button-wrapper`:
```css
:root {
    --button-color: hotpink;
    --button-border-color: black;
}

.heading {
    font-size: 20px;
    font-family: monospace;
}

.button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);
}

.button-wrapper {
    --button-color: green;
}
```
Now, the background color of the button in `<div className="button-wrapper">` should be green. This happens because a CSS custom property has inheritance - it takes the topmost parent and goes downwards, looking for re-definition of the variable. If the property finds a re-definition, it'll use the one closest to it.

This comes in handy when changing hover colors:
```css
:root {
    --button-color: hotpink;
    --button-hover-color: pink;
    --button-border-color: black;
}

.heading {
    font-size: 20px;
    font-family: monospace;
}

.button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);
}

.button:hover {
    --button-color: var(--button-hover-color);
}

.button-wrapper {
    --button-color: green;
}
```
## Switching to SCSS to build classnames
In order to improve the readability of the style file we can switch to SCSS - rename `style.css` to `style.scss` and change the name of `import` in `index.js` as well.
```js
import './style.scss';
```
Now, instead of repeating `.button` over and over again, we can, for example, add the `:hover` pseudo-class by nesting the properties.
```scss
:root {
    --button-color: hotpink;
    --button-hover-color: pink;
    --button-border-color: black;
}

.heading {
    font-size: 20px;
    font-family: monospace;
}

.button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);

    &:hover {
        --button-color: var(--button-hover-color);
    }

    &-wrapper {
        --button-color: green;
    }   
}
```
The `&` works like glue that allows us to place our `className` and any selector or different `className` together.

## Organizing classnames with BEM
We can use [BEM](http://getbem.com/introduction/) to further organize our style files.
```scss
:root {
    --button-color: hotpink;
    --button-hover-color: pink;
    --button-border-color: black;
}

/**
BEM - Block, Element, Modifier

Block (block): Heading, Button, MyElement (.)
.MyElement { ... }

Element (elem): Heading-Strong, Button-Icon, MyElement-Key
.Heading-Strong { ... }
.MyElement {
    &-Key {
        ...
    }
}

Modifiers (mods): Heading_isLarge, Button_type_icon
.Heading {
    &_isLarge {
        ...
    }

    &_type {
        &_icon {
            ...
        }
    }
}
*/

.heading {
    font-size: 20px;
    font-family: monospace;
}

.button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);

    &:hover {
        --button-color: var(--button-hover-color);
    }

    &-wrapper {
        --button-color: green;
    }   
}
```
Notice that blocks are named using PascalCase - each word in a compound word is capitalized. A block's declaration usually is preceded by a dot, for example, `.MyElement`.

An element always follows a block and is defined using a dash and PascalCase, for example, `.Heading-Strong` where `Heading` is the block and `-Strong` is the element.

If, we're using SCSS, we can use glue or `&` for BEM elements as well, for example:
```scss
.MyElement{
    &-Key {
        ...
    }
}
```
Modifiers are the state definitions of an element or a block, these are usually preceded by an underscore and named using camelCase. Note that you can use either one-part or two-part modifiers. 

One-part modifier is a boolean modifier that should start with `is` and non-boolean modifiers should be split in two parts, where the first part defines the type of the modification and the second part defines a value.

The next example uses the gluing method to define `.Heading_isLarge`, `.Heading-Key_isHuge` and `.Heading_type_icon`:
```scss
.Heading {
    &_isLarge {
        ...
    }

    &-Key {
        &_isHuge {
            ...
        }
    }

    &_type {
        &_icon {
            ...
        }
    }
}
```
Let's rearrange our style file to follow the BEM standards:
```scss
:root {
    --button-color: hotpink;
    --button-hover-color: pink;
    --button-border-color: black;
}

/**
BEM - Block, Element, Modifier

Block (block): Heading, Button, MyElement (.)
.MyElement { ... }

Element (elem): Heading-Strong, Button-Icon, MyElement-Key
.Heading-Strong { ... }
.MyElement {
    &-Key {
        ...
    }
}

Modifiers (mods): Heading_isLarge, Button_type_icon
.Heading {
    &_isLarge {
        ...
    }

    &_type {
        &_icon {
            ...
        }
    }
}
*/

.Heading {
    font-size: 20px;
    font-family: monospace;
}

.Button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);

    &:hover {
        --button-color: var(--button-hover-color);
    }

    &-Wrapper {
        --button-color: green;
    }   
}
```
We should apply the same rules for `className` in `index.js`. For the `Button` class:
```js
    render () {
        const { clickCount } = this.state;   

        return (
            <div className="Button-Wrapper">
                <h1 className="Heading">
                    You clicked me
                    <b>{ clickCount }</b>
                </h1>
                <button className="Button" onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
```
And for the `Wrapper` class:
```js
    render() {
        const { clickCount } = this.state;

        return(
            <div>
                <Button wrapperCount= { clickCount } />
                <button className="Button" onClick={ this.onButtonClick }>Update wrapper</button>
            </div>
        );
    }
```
Since it's not exactly convenient to concatenate strings, in order to have multiple elements or modifiers, we should use the BEM HTML helpers. Let's also add a modifier:
```js
class Button extends PureComponent {

// some stuff

    render () {
        const { clickCount } = this.state;   

        return (
            <div 
                block="Button" 
                elem="Wrapper" 
                mods={ { isLarge: true } }
            >
                <h1 block="Heading">
                    You clicked me
                    <b>{ clickCount }</b>
                </h1>
                <button block="Button" onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
}

class Wrapper extends Component  {

// some stuff

    render() {
        const { clickCount } = this.state;

        return(
            <div>
                <Button wrapperCount= { clickCount } />
                <button block="Button" onClick={ this.onButtonClick }>Update wrapper</button>
            </div>
        );
    }
}
```
Add the same modifier to the style file:
```scss
:root {
    --button-color: hotpink;
    --button-hover-color: pink;
    --button-border-color: black;
}

.Heading {
    font-size: 20px;
    font-family: monospace;
}

.Button {
    /** ... gets auto-prefixed */
    appearance: none;
    border: 1px solid var(--button-border-color);
    padding: .25rem 1rem;
    background-color: var(--button-color);

    &:hover {
        --button-color: var(--button-hover-color);
    }

    &-Wrapper {
        --button-color: green;

        &_isLarge {
            --button-color: blue;
        }
    }   
}
```
If you're using the ScandiPWA ESlint rules, you can re-enable the no classNames rule, since we're using BEM props now.

If you want to write something that previously consisted of two classNames, you can still use BEM. This can be done with `mix`, for example:
```js
class Wrapper extends Component  {

// some stuff

    render() {
        const { clickCount } = this.state;

        return(
            <div>
                <Button wrapperCount= { clickCount } />
                <button 
                    block="Button" 
                    mix={ { block:'Hello', elem:'World' } }
                    onClick={ this.onButtonClick }
                >
                    Update wrapper
                </button>
            </div>
        );
    }
}
```
We can see what happens in CSS by inspecting the button:
```css
<button class="Button Hello-World">
```
If you want to add a third block, you can mix it in the first mix:
```js
class Wrapper extends Component  {

// some stuff

    render() {
        const { clickCount } = this.state;

        return(
            <div>
                <Button wrapperCount= { clickCount } />
                <button 
                    block="Button" 
                    mix={ { block:'Hello', elem:'World', mix: {block: 'Alfred'} } }
                    onClick={ this.onButtonClick }
                >
                    Update wrapper
                </button>
            </div>
        );
    }
}
```
And by inspection we'll see three class names:
```css
<button class="Button Hello-World Alfred">
```