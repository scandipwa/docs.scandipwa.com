---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Core React Concepts
description: Going over core React concepts that will let you start working with ScandiPWA.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/development'
  title: Development
---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/0cdrcAbzlr0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

In this tutorial we will discuss the following React concepts:
- [Component state](#component-state)
- [Components update tracking logic](#components-update-tracking-logic)
- [ShouldUpdate method](#shouldupdate-method)
- [PureComponents VS traditional Components](#purecomponents-vs-traditional-components)
- [Handling side-effects in getDerivedStateFromProps](#handling-side-effects-in-getderivedstatefromprops)

You should be able to discuss the following topics after watching this video:
- onClick as an arrow function, bind, non-bind
- setState as a function and via state destruct
- Checking for prev value in componentDidUpdate
- Defining state examples, in constructor, as a property
- Updating state in component did-update consequences
- Keeping previous property in state

This tutorial builds on the [previous](https://docs.scandipwa.com/docs/environment-set-up.html) one. If you've been wanting to work with ScandiPWA you'll know that it's meant to be extended. This is done by creating new files in your project that will override the defaults.

Run `yarn start` to start the development set-up and let's start by overriding the `index.js` file. Create a new `index.js` file in your `src` folder. The application should compile automatically after you've saved any changes.

This is what our `src/index.js` should contain:
```js
import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    render () {
        return (
            <button>Click me!</button>
        );
    }
}

ReactDOM.render(
    // this is the component's template
    <Button />,                 
    document.getElementById('root')
);
```
The component should be passed as a render template and after this we should tell React where we expect this element to render.

If you go to `localhost:3000` in your browser you'll see that the element has rendered.

Let's make it a clickable button:
```js
import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    onButtonClick() {
        // writes logs in console
        console.log('you clicked me!');         
    }

    render () {
        return (
            // adds event listener
            <button onClick={ this.onButtonClick }>Click me!</button>
        );
    }
}

ReactDOM.render(
    <Button />,               
    document.getElementById('root')
);
```
In React you need to provide a listener for the element when it's initially rendered, with the listener in this case being `<button onClick={ this.onButtonClick }>`. You can read more about handling events in React [here](https://reactjs.org/docs/handling-events.html).

## Component state
Let's set the default state and change it dynamically. The following code should start counting the clicks from zero:
```js
import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    state = {
        // sets the default state
        clickCount: 0     
    };

    onButtonClick = () => {
        // imports the default state
        const { clickCount } = this.state;
        // updates the new state 
        this.setState({ clickCount: clickCount + 1 })
        console.log('you clicked me!');
    };

    render () {
        return (
            <button onClick={ this.onButtonClick }>Click me!</button>
        );
    }
}

ReactDOM.render(
    <Button />,               
    document.getElementById('root')
);
```
We need to transform the simple method `onButtonClick()` to a function property in order to not get a TypeError: Cannot read property 'state' of undefined. This can be done by adding an arrow function to `onButtonClick = () =>`. You can read about passing fuctions to components in React [here](https://reactjs.org/docs/faq-functions.html).

## Components update tracking logic
Let's see how we can update the component with a simple tracking feature:
```js
import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    state = {
        clickCount: 0     
    };

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    };

    render () {
        // imports the latest click count from state
        const { clickCount } = this.state;   

        return (
            <div>
                <span>
                    You clicked me
                    <b>{ clickCount }</b>
                </span>
                <button onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
}

ReactDOM.render(
    <Button />,            
    document.getElementById('root')
);
```
> **Note**
>
> JSX expects one root element

Since JSX expects only one root element to be present, we encase the `span` and `button` tags with `div`.

An alternative way to set the state would be:

```js
    onButtonClick = () => {
        // const { clickCount } = this.state;
        // this.setState({ clickCount: clickCount + 1 });

        this.setState(({ clickCount }) => ({ clickCount: clickCount + 1 }));

    };
```
`const { clickCount } = this.state;` lets us further on just use `{ clickCount }` to refer to `this.state.clickCount`. These are called state hooks and you can read more about them [here](https://reactjs.org/docs/hooks-state.html).

```js
import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
// proper state declaration
//    state = {
//        clickCount: 0     
//    };

// alternative state declaration
    constructor (props){
        super(props);

        this.state = {
            clickCount: 0
        };
    }

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    };

    render () {
        // imports the latest click count from state
        const { clickCount } = this.state;   

        return (
            <div>
                <span>
                    You clicked me
                    <b>{ clickCount }</b>
                </span>
                <button onClick={ this.onButtonClick }>Click me!</button>
            </div>
        );
    }
}

ReactDOM.render(
    <Button />,            
    document.getElementById('root')
);
```
An alternative way to set the default state would be the following, which is very similar to PHP:
```js
class Button extends Component {
    constructor (props){
        // reference to a parent class that we extend
        super(props);

        this.state = {
            clickCount: 0
        };
    }
```
Let's consider the component's life cycle. We've created a state, but how can we trace what the component is/was doing?

First, let's name our division `<div id="abc">`, add some console logs and find out when they'll get triggered:
```js
import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    constructor (props){
        super(props);

        this.state = {
            clickCount: 0
        };

        // make any request here, besides DOM manipulation
        console.log('constructor', document.getElementById('abc'));
    }

    componentDidMount() {
        // implement any DOM manipulation
        console.log('mount', document.getElementById('abc'));
    }

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    };

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

ReactDOM.render(
    <Button />,            
    document.getElementById('root')
);
```
When we try this out in our browser we can see in the Console that the `constructor` returns `null` and `mount` returns `<div id="abc"></div>`.

This shows us that the component's constructor is called before it is mounted. You can read more about the constructor [here](https://reactjs.org/docs/react-component.html#constructor) and componentDidMount [here](https://reactjs.org/docs/react-component.html#componentdidmount).

If you want to add a CSS variable or have access to a DOM node, you can do it from here:
```js
    componentDidMount() {
        // implement any DOM manipulation
        console.log('mount', document.getElementById('abc'));
    }
```
Next, we have the [componentDidUpdate()](https://reactjs.org/docs/react-component.html#componentdidupdate) method which allows us to see if something was updated in the component:
```js
    componentDidMount() {
        // implement any DOM manipulation
        console.log('mount', document.getElementById('abc'));
    }

    componentDidUpdate() {
        // triggered by state & props change
        console.log('update');
    }
```
After adding the update log you should be able to see `update` in the Console any time the button had been clicked.

Let's add a new class. If ESlint is showing you a 'max classes per file' error, disable it for the sake of this tutorial. Note that when developing an actual project, try to stick to the one component per file rule.

You can disable ESlint rule warnings for the entire file by adding the `/* eslint-disable */` at the top of it.

```js
/* eslint-disable max-classes-per-file, @scandipwa/scandipwa-guidelines/only-one-class */

import { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    constructor (props){
        super(props);

        this.state = {
            clickCount: 0
        };

        console.log('constructor', document.getElementById('abc'));
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
    };

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

// the new class
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
        return(
            <div>
                {/* calls the button component */}
                <Button />
                {/* button with event listener */}
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
Let's go to our browser and try out the changes. So, if you click on the 1st button, the update will get triggered in Console, but if you click the 2nd button, the update will also get triggered. Why is that? This happens because any updates in the top component will update the bottom component in a very inefficient way.

## ShouldUpdate method
Instead we should put [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) in `Button`:

```js
class Button extends Component {
    constructor (props){
        super(props);

        this.state = {
            clickCount: 0
        };

        console.log('constructor', document.getElementById('abc'));
    }

    componentDidMount() {
        console.log('mount', document.getElementById('abc'));
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { clickCount: nextClickCount } = nextState;
        const { clickCount } = this.state;

        // updates only if state's click count changes
        if (clickCount !== nextClickCount) {
            return true;
        }

        return false;
    }     

    componentDidUpdate() {
        // triggered by state & props change
        console.log('update');
    }

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    };

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
```
Going back to the browser we can see that the clicks in `Button` will trigger updates, but clicks in `Wrapper` will not. The `shouldComponentUpdate()` method might get tedious if you're working with multiple components. This is where `PureComponents` come in.

## PureComponents VS traditional Components
PureComponent performs a shallow comparison of the props and state any time props or state changes. PureComponent essentially is Component with built in `shouldComponentUpdate` method.
```js
/* eslint-disable max-classes-per-file, @scandipwa/scandipwa-guidelines/only-one-class */

import { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';

class Button extends PureComponent {
    constructor (props){
        super(props);

        this.state = {
            clickCount: 0
        };

        console.log('constructor', document.getElementById('abc'));
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
    };

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
        return(
            <div>
                <Button />
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
This should act the same way as the previous Component with `shouldComponentUpdate` method. This is why it is preferred to use PureComponent by default. 

> **Note**
>
> `shouldComponentUpdate` only works if you're extending Component, not PureComponent

Let's change up the wrapper class and add the `wrapperCount= { clickCount }` property to `Button`.
```js
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
                {/* wrapperCount prop passed to Button component */}
                <Button wrapperCount= { clickCount } />
                <button onClick={ this.onButtonClick }>Update wrapper</button>
            </div>
        );
    }
}
```
Now, when trying this out in the browser, the update should also get triggered when clicking the 'Update wrapper' button.

Let's go back to the Button class. In order to change up the `componentDidUpdate` method we need to either set the required prop or set the default value.
```js
/* eslint-disable max-classes-per-file, @scandipwa/scandipwa-guidelines/only-one-class */

import { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

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
            clickCount: 0
        };

        console.log('constructor', document.getElementById('abc'));
    }

    componentDidMount() {
        console.log('mount', document.getElementById('abc'));
    }

    componentDidUpdate(prevProps) {
        // triggered by state & props change

        const { wrapperCount } = this.props;
        const { wrapperCount: prevWrapperCount } = prevProps;

        if (wrapperCount !== prevWrapperCount) {
            // console.log('update');
            this.setState({ clickCount: wrapperCount })
        }
    }

    onButtonClick = () => {
        const { clickCount } = this.state;
        this.setState({ clickCount: clickCount + 1 });
    };
...
```
This is where ESLint would notify you that you shouldn't use setState in `componentDidUpdate`. This is because setting the state here could lead to an infinite loop if the checkpoint before doing so would not be specific enough.

Read more about `componentDidUpdate` and infinite loops [here](https://reactjs.org/docs/react-component.html#componentdidupdate).

## Handling side-effects in getDerivedStateFromProps
We can bypass the `componentDidUpdate` issue by using  `getDerivedStateFromProps`. Note that this method can't access any values from the component.

```js
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
            return {
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
...
```
You should put `getDerivedStateFromProps` before `componentDidMount`. This should work as previously with `componentDidUpdate`, except there is no possibility to enter an infinite loop.