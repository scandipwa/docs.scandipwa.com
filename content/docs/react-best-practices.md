---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: React Best Practices
description: Learn the best React practices in this guide

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/0tSXwEg26UA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Main rules to follow:
- [One Class Per File](#one-class-per-file)
- [Export Class And Constants First](#export-class-and-constants-first)
- [Separate Into Functions And Keep JSX Nesting Low](#separate-into-functions-and-keep-jsx-nesting-low)
- [Master BEM And Escape `className`](#master-bem-and-escape-classname)
- [Split Into Smaller Components](#split-into-smaller-components)
- [Use ESlint](#use-eslint)
- [Place Business Logic In Containers](#place-business-logic-in-containers)
- [Use Container Props And Container Functions](#use-container-props-and-container-functions)
- [Keep propTypes Descriptive](#keep-proptypes-descriptive)
- [Make Sure To Follow The Code Standard](#make-sure-to-follow-the-code-standard)

All of the following examples will be based on code found in `Header.component.js`.

## One Class Per File
Notice that all of the components only have one class declaration. 
`export default` ideally shouldn't be present in the same line of code as the class declaration. It would be much better to export the class separately. The class export will always be the component.

You should `export default` the header itself. This way we are able to use function wrappers on it.

## Export Class And Constants First
Always export class and constants first. After which you can safely use `export default` and proceed.

Because when someone will be overriding or modifying your component they might want to work with your exported classes and not the class exported by default.

## Separate Into Functions And Keep JSX Nesting Low
When writing rendering functions, try to keep JSX nesting to a minimum. This will make it easier for others to modify your code.

## Master BEM And Escape `className`
Make sure to get comfortable with writing code using the [rebem-jsx](https://github.com/rebem/rebem-jsx) library. Use `block`, `elem`, `mods` and `mix` properties to generate the appropriate class names using JSX HTML elements. Refrain from using the className property as it is banned in ScandiPWA by ESlint config.

If you want to use the BEM properties outside of JSX, you'll have to declare them and handle them separately.

Another reason for straying clear of className is their static nature. `className` property is not a dynamic field, so it's very hard to work with it.

## Split Into Smaller Components
Let's look at an example where you have an element array that you'd like to map, firing an action on each click on an element.

If you're using arrow functions while rendering an array, you'll be creating an anonymous function on every render, which then will be very slow.
```html
<ul>
  items.map(item) => {
    return(
      <li onclick={()=> this.handleClick(id)}>
      ...
      </li>
    );
  }
</ul>
```
Instead of rendering your list element on every click, you should create a smaller component `<listItem>` that accepts a prop `Item`. So, instead of passing the `id` and creating an anonymous function on every click you create a smaller component and pass an `Item` property to it. This way rendering can be performed much faster.

## Use ESlint
If you don't know how to configure ESlint, check out [how it's done]((https://docs.scandipwa.com/docs/eslint-stylelint.html)) in ScandiPWA.

ESlint will allow you to maintain the most stringent of code standards, making your code easy, breezy and beautiful. If you choose to use the ScandiPWA ESlint configuration, contributing and consequently reviewing your code will be made much easier.

## Place Business Logic In Containers
Make sure your component's expected functionality is crystal clear. The `container.js` files should contain all the logic for the functionality of your component.

Make sure you're using the containers in the previously established manner.

## Use Container Props And Container Functions
`containerProps()` provide constant values that are required for the component to render and the `containerFunctions()` are what's calling on the component to change the state or make a request.

Another reason for adhering to this rule is that it'll allow you to have a more efficient rendering process. This happens because instead of passing the props from the parent component you are passing the processed props from your component.

Make sure that your containers and components are using and declaring `propTypes` and `defaultProps`. If you're using the ScandiPWA ESlint configuration, you'll receive a reminder to do so.

## Keep propTypes Descriptive
When declaring a `propType`, don't be lazy and type `propTypes.shape`. Instead try to be as informative as possible and use descriptibe `propType`. ScandiPWA has a specific folder for storing `propTypes`. You can find it in `app/type` directory.

## Make Sure To Follow The Code Standard
Make sure to follow overall coding best practices and keep your code clean. You can also check out ScandiPWA's [best practices for working with styles](https://docs.scandipwa.com/docs/best-practices-styles.html).