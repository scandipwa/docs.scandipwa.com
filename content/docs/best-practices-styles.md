---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: Best Practices For Working With Styles
description: In this guide you`ll be introduced with some of the best practices for working with styles

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---
<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/W4LUYfLUCqs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

ScandiPWA recommended best practices:
- [Only One Class Declaration Per `.scss` File](#only-one-class-declaration-per-.scss-file)
- [Preferably Concatenate Class Names](#preferably-concatenate-class-names)
- [Follow The BEM Methodology](#follow-the-bem-methodology)
- [Use Sass Variables Or CSS Custom Variables](#use-sass-variables-or-css-custom-variables)
- [Don't Write Vendor Prefixes](#dont-write-vendor-prefixes)
- [Use StyleLint](#use-stylelint)
- [Prefer `rem` Units For Content Specific Elements](#prefer-rem-units-for-content-specific-elements)
- [Know The Defaults And Utilities](#know-the-defaults-and-utilities)


## Only One Class Declaration Per `.scss` File

Let's look at one of the components. Open up a `style.scss` file.
You'll notice that the component's class is declared only once at the top of the page and there are no other declarations of classes in this document.

This lets you quickly find and edit any elements you need.

## Preferably Concatenate Class Names

This can be done due to the fact that ScandiPWA uses [BEM or Block Element Modifiers](http://getbem.com/introduction/). Note that the elements are divided using dashes (-) and the modifiers are divided using underscores (_). Blocks and elements need to be capitalized, modifiers, however, start with lowercase.

```scss
.ClassName{         # block
  &-Element{        # element
    // ...
  }
  &-OtherElement{
    &_isGood        # modifier
  }
}
```
This will have the following representation in React:
```js
.ClassName                  
┃ ┗.ClassName-Element       
┗.ClassName-Element_isGood
```
This way you can nest the names of the classes, instead of the selectors.

Try to refrain from nesting classes unless absolutely necessary. Nested classes will add to the complexity of your code and make it difficult to debug, override and render.

### Types Of Modifiers
- Boolean modifier
    - e.g., `_isHovered`
- Mixed modifier (`_type_value`)
    - e.g., `_color_error`
    - Note that the modifier shouldn't mimic a CSS property, like in the example `_color_green`. Class names are not style values.

## Follow The BEM Methodology
[Get it,](http://getbem.com/) and [check out the naming conventions.](http://getbem.com/naming/)

If you want to find out more about BEM in the context of ScandiPWA, read our [BEM doc](https://docs.scandipwa.com/docs/coding-standard.html).

## Use Sass Variables Or CSS Custom Variables
Sass variables are easy to simple: `$<name>: <value>;` and that's it. After making this style variable you can refer to it using the variable name, instead of the value.

Read more about Sass variables [here](https://sass-lang.com/documentation/variables).

You can declare custom variables for later usage in the `:root` element. Note that the variable names should be unique throughout the application. Context specific name usage is recommended.

In the case of CSS the property notation is as follows. Declaration, e.g. `--variable-name: value;`. Access happens through the `var()` function, e.g. `var(--variable-name);`.

You can read more about using CSS custom variables [here](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

## Don't Write Vendor Prefixes
In the development set-up ScandiPWA uses `webpack` which has a `postcss-loader` with an `autoprefixer` plug-in that will add the vendor prefixes for you.

## Use StyleLint
Follow the style conventions used in ScandiPWA files to ensure consistency. Check out our guide on how to get started with ESlint and StyleLint [here](https://docs.scandipwa.com/docs/eslint-stylelint.html).

## Prefer `rem` Units For Content Specific Elements
`Rem` units are a type of relative sizing units for CSS. `1rem` unit is equal to the value of `font-size` on an HTML element, which is 16px for most browsers. If you want to really dig into `rem` units, check out [this](https://www.sitepoint.com/understanding-and-using-rem-units-in-css/) article.

Note that `rem` units are used only for content specific elements, e.g. buttons, not graphic elements like logos.

## Know The Defaults And Utilities
Check out `_reset.scss` to find out the ScandiPWA default values and develop accordingly.

Check out our `_abstract.scss` file to see what style values or mixins are already available.

Use the `_loader.scss` for elements you don't want to render, but you would like to extend. 

There are also button and icon mixins available. If you have some more abstracts that you'd like to reuse go ahead and add them to the `_abstracts.scss`. Make sure to check out our guide for adding abstracts [here](https://docs.scandipwa.com/docs/extension.html#overriding-the-styles).