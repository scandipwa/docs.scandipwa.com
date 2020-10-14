---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: "Plugins: installation and marketplace"
description: Interaction with the marketplace is essential for plugin users and developers
---

As of v3, ScandiPWA supports frontend plugins - reusable extensions that once created can be used in any project utilising ScandiPWA v3. These can be used to modify the functionality of almost any part of ScandiPWA.

## Valid extension definition

1. Is a valid M2 package.

2. If it contains any frontend functionality - the `src/scandipwa` directory with corresponding contents should be present.

3. If it contains any node dependencies - there must be a `package.json` file with all of the dependencies neighboring the `composer.json`

4. Should follow the guidelines described in [the plugin development guide](https://docs.scandipwa.com/docs/plugin-mechanism.html)

5. Should have a definitive installation and configuration guide in `README.md` or a reference to one (either within the archive or online).

## Uploading an extension to the marketplace

1. Implement an extension!

2. Create an empty `app` directory and a `code` directory inside of it.

3. Place your extension (M2 module) inside of the `code` directory mentioned above.

4. Archive your extension - call the archive `<vendor>--<name> <version> for ScandiPWA <supported version(s)>`. All the letters in the archive name are going to get converted to the lowercase by the marketplace.

5. See that your extension is installable following the guide beneath.

6. Follow [the guide on the marketplace](https://marketplace.scandipwa.com/create-and-sell.html) to create an account and submit your extension. All the other details regarding this process can be found there.

## Installing an extension

1. Download the desired extension from [the marketplace](https://marketplace.scandipwa.com/)

2. Unzip it, see the `app/code/<vendor>/<extension>` like file structure inside.

3. Merge the `app` folder you unpacked from the extension with the `app` directory of your Magento 2 instance.

4. Run `magento se:up` command so that the module is registered in the Magento. Check whether your module is installed properly with `magento mo:st`

5. Go to the `app/design/frontend/<vendor>/<theme>` - your ScandiPWA installation directory. There, add `"<name>": "app/code/<vendor>/<theme>"` to the `"extensions"` block of the `scandipwa.json` file.

6. Follow any additional instructions provided in the `README.md` file.

7. Recompile the theme, flush caches if necessary.
