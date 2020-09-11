---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: ScandiPWA Technology Stack
description: Learn how to work with the ScandiPWA Technology Stack.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/fJV6wUZvvWw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Topics covered in this tutorial:
- [The Magento Tech Stack](#the-magento-tech-stack)
- [What Does CSR Mean?](#what-does-csr-mean)
    - [Why Is CSR More Efficient?](#why-is-csr-more-efficient)
    - [Single-Page Application And CSR](#single-page-application-and-csr)
- [Magento Vs. ScandiPWA Tech Stack](#magento-vs-scandipwa-tech-stack)
    - [JSX: A Brief Overview](#jsx-a-brief-overview)
    - [Some Notes On ReactJS](#some-notes-on-reactjs)
    - [Why Is JSX A Valid Alternative For The Layout System?](#why-is-jsx-a-valid-alternative-for-the-layout-system)
    - [React Component Lifecycle Methods](#react-component-lifecycle-methods)


## The Magento Tech Stack
Magento has a layout/template system, it uses the `.phtml` format to declare the templates, `.less` files to declare styles and `.xml` for layouts.

> **Magento file system:**
>
>- PHTML <-- templates <br>
>- LESS <-- style <br>
>- XML <-- layouts

The tech stack used in Magento file systems is mostly useful for server side rendering or SSR and ScandiPWA is not a server side application. ScandiPWA is a client side rendered or CSR application.
## What Does CSR Mean?
CSR or client-side rendering means that a client's browser is used as a machine to render the data. We are only providing an algorithm that generates HTML for the client from data that gets passed to it.

The data that gets passed to the algorithm comes from our GraphQL server, which is also known as Magento 2 or M2 in our current example.

So, to sum up, Magento works as our GraphQL server which sends data to our client's browser, inside of which the algorithm is run, that in turn transforms the code into HTML that the client can enjoy.
```text
+---------+         browser
|         |        +-------+       user
|   M2    +------->+       | HTML +-----+
| graphql |  data  |       +----->+ ^_^ |
| server  +------->+       |      +-----+
|         |        +-------+
+---------+
```

## Why Is CSR More Efficient?
CSR is considered more efficient, because this way we (or the browser) "know" everything about the application and we can immediatelly render any page necessary, if we have the data.

Furthermore, if we don't have the data, we can predict what should appear on the page and render some placeholders that are shown to the client while data is loading.

In short, it allows us to have a very smooth browsing experience and our screen will no longer be blank inbetween pages. In turn, what you will see during loading time is a nice placeholder. This is possible thanks to the fact that the browser is not downloading the whole HTML document, only fetching the data.

> **Benefits of CSR in a single-page application**
>
> - smoother browsing experience
> - animated transitions
> - faster second page load
> - faster website overall

We can not only have a smoother browsing experience and animated transitions, but also faster second page loads. The second page can be loaded faster due to the fact that we don't have to download the HTML file every time, we're effectively reusing the previous HTML that has been cached in the client's browser. This is the main difference between CSR and SSR, where the HTML is almost never cached in the browser.


CSR applications also don't have any render-blocking resources, because scripts are used for rendering the page, instead of HTML. Thus CSR marks a new era for web applications.

### Single-Page Application And CSR
You might say that Magento's 'card' and 'check-out' are also rendered on a client. Yes, but Magento can not be called a single page application.

Single-page application or SPA as a title can only be claimed if every page of an application is rendered on a client. So the previously mentioned benefits of CSR only apply to true single-page applications, not the client-side rendering itself. 

This means that we can't simply take our old Magento with it's template systems, old styles and layouts which are used to generate HTML on the server and transform it to a client-side rendered application. 

In order to transform Magento's file system into a client side renderable application we need to make some transformations.

## Magento Vs. ScandiPWA Tech Stack

|| Magento | ScandiPWA|
|-----------|---------|----------|
|Template:| PHTML|JSX|
|Style:|LESS|SCSS|
|Rendering:|XML|React|

Instead of PHTML for templates, we use JSX which contains HTML-like syntax for React applications. It effectively allows you to use HTML syntax in JavaScript code. It has the template string literals inside, allowing it to function just like a PHTML template, except now it happens in the front-end world.  

Instead of XML for layouts, we use React. We've already replaced two of the previously mentioned Magento file system's attributes with JavaScript, which means that everything can be done using one programming language, thus flattening the learning-curve. 

Here you might ask, what about LESS, it uses JavaScript already? 


Both Syntactically Awesome Stylesheets (Sass) and Leaner CSS (LESS) are CSS preprocessors. This means that these types of files are more syntactically sound and easier for a human to read, and both of these files need to be compiled into CSS stylesheets that then can be read and understood by a browser.

Instead of LESS, we've opted to use SCSS which is a newer version of Sass, due to the fact that it's more formal and pleasant to use.

> **The ScandiPWA stack:**
>
> - **JSX** - templates (HTML-like mark-up language for JavaScript) <br>
> - **SCSS** - style, CSS preprocessor <br>
> - **ReactJS** - classes (instead of layouts) declare rendering methods (JavaScript)

## JSX: A Brief Overview
Let's create an element using JSX:
```jsx
return(
  <div class="a"></div>
);
```
The syntax is probably very familiar to most people who've used HTML. Now, the same example in pure JavaScript:

```javascript
return(
  document.createElement(
    "div",          # element name
    {class: "a"},   # attributes
    []              # child element
  );
);
```
In fact, we use the `babel` compiler to transform a JSX file into a React file, going from this:
```jsx
<div className="a"></div>
```
to this:
```javascript
React.createElement(
  "div", 
  {className: "a"}
  );
```
> **Note**:
>
> `class` in ReactJS is called `className`

Notice that unlike in pure JavaScript, a `class` in ReactJS is called `className`, this is due to the fact that `class` is one of the reserved JavaScript keywords as of ECMAScript2015. With JSX being an extension of JavaScript, a new keyword was needed in order to not create any conflicts.

Overall the idea of JSX is to make your life easier when writing React applications. For example, you can put any child element inbetween the tags, as well as use curly brackets to denote a class name as a variable.

```jsx
return(
  <div className={a}> # 'a' variable, instead of "a" constant string
    # child element
  </div>
);
```
JSX is a very powerful tool, not to mention much more visually appealing than pure JavaScript. JSX lets you create elements in a more efficient and developer-friendly way.

## Some Notes On ReactJS
Some concepts of React are indeed very complex and hard to understand. At the moment we'll only talk about class components, because we, as Magento developers, are *super* confident in OOP world.

```php
class Bread extends Component{
  render(){
    return(
      # JSX template
    )
  }
}
```

### Why Is JSX A Valid Alternative For The Layout System?
This is due to the fact that it's possible to split the rendering process into multiple functions. For example by making `renderElOne()` and `render()` functions that each render a different part of the `Component`:

```php
class Bread extends Component{
  renderElOne(){
      # stuff happens
  }
  render(){
    return(
      # JSX template
    )
  }
}
```
Each of the render functions can be later extended, overriden or plugged into.

Of course, we don't have very powerful functionality, like we had in the Magento's layout system, where we were able to take one element from the footer and place it in the header only with a few lines of code. But this is powerful enough to let us rearrange these elements and perform various actions, in addition to them being defined in one place.

### React Component Lifecycle Methods
The JavaScript components are relatively simple, they have the so-called lifecycle methods. Therefore, mastering the JavaScript `class` will make you ready for developing on ScandiPWA. 

If you want to read more about React component lifecycle methods, you can do so [here](https://reactjs.org/docs/react-component.html).

This is all of the ScandiPWA tech stack, except for GraphQL, about which we'll talk about in a different tutorial.