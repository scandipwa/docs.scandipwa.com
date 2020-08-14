/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';
import {media} from 'theme';

import type {Node} from 'react';

type Props = {
  children: Node,
  title?: string,
  layoutHasSidebar: boolean,
};

const FooterNav = ({children, title, layoutHasSidebar = false}: Props) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      // width: '100%',
      paddingTop: 40,

      [media.size('sidebarFixed')]: {
        paddingTop: 0,
        // width: '25%',
      },
    }}>
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        [media.lessThan('medium')]: {
          flexDirection: 'column',
        },
      }}>
      {children}
    </div>
  </div>
);

export default FooterNav;
