/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 */

import React, {Component} from 'react';
import Flex from 'components/Flex';
import Section from './Section';
import ScrollSyncSection from './ScrollSyncSection';
import {media} from 'theme';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeSections: []
    };
  }


  getStoredActiveSections(storage) {
    if(storage.activeSections) {
      this.setState({
        activeSections: JSON.parse(storage.getItem('activeSections'))
      })
    }
    else{
    this.setState({
      activeSections: this.props.sectionList.map(obj => obj["title"])
    });
  }
}

  componentDidMount() {
    this.getStoredActiveSections(sessionStorage)
  }


  componentWillUnmount() {
    sessionStorage.setItem('activeSections', JSON.stringify(this.state.activeSections))
  }

  render() {
    const {
      closeParentMenu,
      createLink,
      enableScrollSync,
      location,
      sectionList,
    } = this.props;


    const SectionComponent = enableScrollSync ? ScrollSyncSection : Section;

    return (
      <Flex
        type="nav"
        direction="column"
        halign="stretch"
        css={{
          width: '100%',
          paddingLeft: 20,
          position: 'relative',

          [media.greaterThan('largerSidebar')]: {
            paddingLeft: 40,
            paddingBottom: 30,
            paddingTop: 30,
          },

          [media.lessThan('small')]: {
            paddingBottom: 100,
          },
        }}>
        {sectionList.map((section, index) => (
          <SectionComponent
            createLink={createLink}
            activeSections={ this.state.activeSections }
            title={section["title"]}
            key={index}
            location={location}
            onLinkClick={closeParentMenu}
            onSectionTitleClick={this._toggleSection}
            section={section}
          />
        ))}
      </Flex>
    );
  }

  _toggleSection = (title) => {
    this.state.activeSections.includes(title)
      ? this.setState({
        activeSections: this.state.activeSections.filter(section => section !== title)
      })

      : this.setState({
        activeSections: [...this.state.activeSections, title]
      })
  }
}

export default Sidebar;