/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 */

'use strict';

module.exports = {
  siteMetadata: {
    title: 'ScandiPWA',
    siteUrl: 'https://docs.scandipwa.com',
    rssFeedTitle: 'ScandiPWA',
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': 'AuthorYaml',
  },
  plugins: [
    'gatsby-source-react-error-codes',
    'gatsby-transformer-authors-yaml',
    'gatsby-transformer-home-example-code',
    'gatsby-transformer-versions-yaml',
    'gatsby-plugin-netlify',
    'gatsby-plugin-glamor',
    'gatsby-plugin-twitter',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#61dafb',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-code-buttons',
          options: {
            buttonClass: `customButtonClass`,
            buttonText: `Copy`,
            toasterClass: `customToasterClass`,
            toasterTextClass: `customToasterTextClass`,
            toasterText: 'Copied',
            svgIcon: ``,
          }
          },
          'gatsby-remark-responsive-iframe',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 840,
            },
          },
          'gatsby-remark-external-links',
          'gatsby-remark-header-custom-ids',
          'gatsby-remark-use-jsx',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'gatsby-code-',
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'ScandiPWA Docs',
        short_name: 'ScandiPWA', // eg. React [%LANG_CODE%]
        // Translators: please change this and two above options (see https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/#feature-configuration---optional)
        lang: 'en',
        start_url: '/',
        background_color: '#20232a',
        theme_color: '#20232a',
        display: 'standalone',
        icon: 'static/logo-512x512.png',
        legacy: true,
      },
    },
  ],
};
