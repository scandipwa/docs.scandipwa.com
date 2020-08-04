/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import {Link} from 'gatsby';
import React from 'react';
import {colors, media} from 'theme';

import type {Node} from 'react';

type Props = {
  children: Node,
  target?: string,
  to: string,
};

const FooterLink = ({children, target, to}: Props) => (
  <Link
    css={{
      lineHeight: 2,
      marginRight: 20,
      transition: 'color .1s ease',
      [media.lessThan('large')]: {
        marginBottom: 10,
        marginRight: 0,
      },
      ':hover': {
        color: colors.brand,
      },
    }}
    to={to}
    target={target}>
    {children}
  </Link>
);

export default FooterLink;
