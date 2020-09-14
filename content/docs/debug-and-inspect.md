---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: How To Debug And Inspect A Theme
description: This guide is for learning <b>How to Debug and Inspect a Theme</b>.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/LBSovCTT7rM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Prerequisites:
- Installation of ScandiPWA [theme](https://docs.scandipwa.com/docs/linux.html)
- Knowledge of ScandiPWA [file structure and UI components](https://docs.scandipwa.com/docs/file-structure-ui.html)

This tutorial assumes that you have installed the ScandiPWA [base theme](https://docs.scandipwa.com/docs/linux.html) and are familiar with ScandiPWA [file structure and UI components](https://docs.scandipwa.com/docs/file-structure-ui.html). 

Go to `scandipwa-base` folder and run the following alias
```bash
dcf up -d
```
Use the alias `frontlogs` or `dcf logs -f frontend` to see what the state of your application is.

The following output means that the front-end is ready:
```bash
ℹ ｢wdm｣: Compiled successfully
```
Open the folder `scandipwa-base/src/app/design/frontend/Scandiweb/pwa` with your text editor.

It is recommended to open an additional workspace for the vendor theme - add the `scandipwa-base/src/vendor/scandipwa/source` folder.

To start the debugging process open Chrome, go to `scandipwa.local` and compare the output with your requirements.

For example, say we needed to change the border of the product cart when it's loading. How to understand where to look and what is the correct component name?

Turns out its pretty easy due to the fact that ScandiPWA uses [BEM or Block Element Modifiers](http://getbem.com/introduction/). It's a tool for organizing class names, this lets us have a block that has elements, all with modifiers.

```bash
block[modifier]         # parent block
┃ ┗ element[modifier]
┗ element[modifier]
```
In React it could have the following representation:
```bash
.Breadcrumbs            # block
┃ ┗ .Breadcrumbs-list   # element
┗ .Breadcrumbs-item     # element
```
The elements are divided using dashes (`-`) and the modifiers are divided using underscores (`_`).

Why do we need to have the `Breadcrumbs-list` and `Breadcrumbs-item`? It allows us to have no nesting in our styles. 

The specificity of the BEM styles will be very low and thus the rerendering will be very cheap resource wise. When you're writing the SCSS for them it will look something like this:
```css
.Breadcrumbs{
  &-list{
    ...
  }
}
```
Let's inspect an element:
```css
.ProductCard-Image_large
```
This means that we need to search in the component called `ProductCard`. If you're using VSCode you can press `ctrl + P` to search for files and type in `ProductCard`. Select the `ProductCard.style.scss` file and you'll see that right there we have a declaration:
```scss
.ProductCard {            
    padding-left: 0;
    min-width: 0;

    &::before {
        content: none;
    }
...
```

How can we be 100% sure that any element we see inside of our application will be connected and declared in our block?

You must make sure that the block is declared in your element's file. In this case it's `block="ProductCard"` in the file `ProductCard.component.js` which generates the `ProductCard` class name, which is the parent block.

```javascript
render() {
    const {
        children,
        mix,
        isLoading
    } = this.props;

     return (
        <li
          block="ProductCard"  
          mix={ mix }
...
```
Next in the file we see the following element that will generate `.ProductCard-Figure` where the block is `ProductCard` and element is `Figure`, separated by a dash.
```javascript
<figure block="ProductCard" elem="Figure"> 
  { this.renderPicture() }
</figure>
```
You can inspect any element in your browser and look for blocks and elements. Use the class names to easily find the component and style files using the VSCode search function. 

If you put an angle bracket before the class name `<some-name`, you can easily find the usage of the component is JSX templates.

Chrome developer tool "Components" tab is basically a React debugger tool, which allows you to inspect your components using a debugger. It tells you what state your component is in, what's in its props and how it's interacting with them.