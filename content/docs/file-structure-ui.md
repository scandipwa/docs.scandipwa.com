---
# Page settings
layout: default
keywords:
comments: false

# Hero section
title: File structure and UI components
description: Learn the file structure and UI components.

# Micro navigation
micro_nav:
  enabled: true
  url: '/docs/installation/docker'
  title: Docker

---

## The first part of introduction to ScandiPWA

ScandiPWA tech lead provides a review of configuration, components of the latest ScandiPWA version (2.0), recommends setup, and shares some tips on it.

<div class="video">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/LcM3DlQ8TbU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>




1. Theme folder structure review (installed via scandipwa-installer)
2. Explanation of package defined scripts
3. Explanation of PM2 watch process (which is run by frontend container)
4. Details of issues with simple "watch" process and "Fallback plugin"
5. Overriding with "Fallback Plugin"
6. Configuring editor workspace to include both theme folder and source folder
7. Showcase and explanation of index components
8. Component file-structure review (container, styles, component, index)
9. Queries and their structures (how to override)
10. Global store related files review (dispatcher, action, reducer, index)
11. Types definitionsUtilities and their must-get-familiars: Request, Query, Promise
12. Details & use of QueryDispatcherGuide on testing queries (with GraphQL playground)
13. Core (important) UI component review