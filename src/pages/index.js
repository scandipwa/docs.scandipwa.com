import ButtonLink from 'components/ButtonLink';
import Container from 'components/Container';
import Flex from 'components/Flex';
import React, {Component} from 'react';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import {colors, media, sharedStyles} from 'theme';
import loadScript from 'utils/loadScript';
import createCanonicalUrl from 'utils/createCanonicalUrl';
import {babelURL} from 'site-constants';
import './../css/index.css'

class Home extends Component {
  state = {
    babelLoaded: false,
  };

  componentDidMount() {
    loadScript(babelURL).then(
      () => {
        this.setState({
          babelLoaded: true,
        });
      },
      error => {
        console.error('Babel failed to load.');
      },
    );
  }

  render() {
    const {babelLoaded} = this.state;
    const {location} = this.props;

    return (
      <Layout location={location}>
        <TitleAndMetaTags
          title="ScandiPWA"
          canonicalUrl={createCanonicalUrl('/')}
        />
        <div
          css={{
            width: '100%',
          }}>
          <header
            css={{
              backgroundColor: colors.dark,
              color: colors.white,
            }}>
            <div
              css={{
                paddingTop: 45,
                paddingBottom: 10,

                [media.greaterThan('small')]: {
                  paddingTop: 60,
                  paddingBottom: 70,
                },

                [media.greaterThan('xlarge')]: {
                  paddingTop: 95,
                  paddingBottom: 85,
                  maxWidth: 1500, // Positioning of background logo
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  position: 'relative',
                  '::before': {
                    content: ' ',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    opacity: 0.05,
                  },
                },
              }}>
              <div
                css={{
                  // Content should be above absolutely-positioned hero image
                  position: 'relative',
                }}>
                <Container>
                  <h1
                    css={{
                      color: colors.brand,
                      textAlign: 'center',
                      margin: 0,
                      fontSize: 45,
                      letterSpacing: '0.01em',
                      [media.size('xsmall')]: {
                        fontSize: 30,
                      },
                      [media.greaterThan('xlarge')]: {
                        fontSize: 60,
                      },
                    }}>
                    ScandiPWA
                  </h1>
                  <p
                    css={{
                      paddingTop: 15,
                      textAlign: 'center',
                      fontSize: 24,
                      letterSpacing: '0.01em',
                      fontWeight: 200,

                      [media.size('xsmall')]: {
                        fontSize: 16,
                        maxWidth: '12em',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      },

                      [media.greaterThan('xlarge')]: {
                        paddingTop: 20,
                        fontSize: 30,
                      },
                    }}>
                    The fastest Open-Source theme for Magento 2.
                  </p>
                  <Flex
                    valign="center"
                    halign="center"
                    css={{
                      paddingTop: 40,
                      flexWrap: 'wrap',
                      justifyContent: 'center',

                      [media.greaterThan('xlarge')]: {
                        paddingTop: 65,
                      },
                    }}>
                      <a
                        href="https://github.com/scandipwa/base-theme"
                        css={{
                          fontSize: 20,
                          color: colors.brand,
                          marginRight: 20,
                          [media.lessThan('small')]: {
                            marginBottom: 20,
                          },
                          transition: 'color .1s linear',
                          cursor: 'pointer',
                          ':hover': {
                            color: '#fff',
                        },
                      }}>
                        GitHub
                      </a>
                      <a
                        href="https://join.slack.com/t/scandipwa/shared_invite/enQtNzE2Mjg1Nzg3MTg5LTQwM2E2NmQ0NmQ2MzliMjVjYjQ1MTFiYWU5ODAyYTYyMGQzNWM3MDhkYzkyZGMxYTJlZWI1N2ExY2Q1MDMwMTk"
                        css={{
                          fontSize: 20,
                          color: colors.brand,
                          marginRight: 20,
                          [media.lessThan('small')]: {
                            marginBottom: 20,
                          },
                          transition: 'color .1s linear',
                          cursor: 'pointer',
                          ':hover': {
                            color: '#fff',
                        },
                      }}>
                        Slack
                      </a>
                    <CtaItem>
                      <ButtonLink
                        to="/docs/linux.html"
                        type="primary">
                        Let`s Get Started
                      </ButtonLink>
                    </CtaItem>
                  </Flex>
                </Container>
              </div>
            </div>
          </header>

          <Container>
            <div css={sharedStyles.markdown}>
              <section
                css={[
                  sectionStyles,
                  {
                    [media.lessThan('medium')]: {
                      marginTop: 0,
                      marginBottom: 30,
                      overflowX: 'auto',
                      paddingTop: 30,
                      WebkitOverflowScrolling: 'touch',
                      position: 'relative',
                      maskImage:
                        'linear-gradient(to right, transparent, white 10px, white 90%, transparent)',
                    },
                  },
                ]}>
                  <div className="MainLinks">
                    <span css={{fontSize: 24}}>Sections</span>
                    <ol>
                      <li css={{fontSize: 20}}>Start & Upgrade</li>
                        <ul>
                          <li><a href="./docs/linux.html">Linux</a></li>
                          <li><a href="./docs/mac.html">MacOS</a></li>
                          <li><a href="./docs/with-remote-m2.html">Remote Magento Instance</a></li>
                          <li><a href="./docs/update.html">Theme Upgrade</a></li>
                          <li><a href="./docs/automated-setup.html">Automated Setup</a></li>
                        </ul>
                      <li css={{fontSize: 20}}>A to Z Overview</li>
                        <ul>
                          <li><a href="./docs/motivation.html">Motivation</a></li>
                          <li><a href="./docs/challenges.html">Challenges</a></li>
                          <li><a href="./docs/file-structure-ui.html">File structure and UI components</a></li>
                          <li><a href="./docs/rewriting-extending.html">Rewriting and extending theme</a></li>
                        </ul>
                      <li css={{fontSize: 20}}>FAQ</li>
                        <ul>
                          <li><a href="./docs/installing.html">Installation</a></li>
                          <li><a href="./docs/development.html">Development</a></li>
                          <li><a href="./docs/billing-and-license.html">Billing and license</a></li>
                          <li><a href="./docs/product-support.html">Product support</a></li>
                          <li><a href="./docs/what-is-pwa.html">What is PWA</a></li>
                        </ul>
                      <li css={{fontSize: 20}}>How-to tutorials - Introductory</li>
                        <ul>
                          <li><a href="./docs/base-template.html">Base template</a></li>
                          <li><a href="./docs/connecting-resolver.html">Connecting to a GraphQL Resolver</a></li>
                          <li><a href="./docs/extension.html">Customizing and Overwriting</a></li>
                          <li><a href="./docs/creating-resolver.html">Creating GraphQL resolver</a></li>
                          <li><a href="./docs/debug-and-inspect.html">Debugging and Inspecting</a></li>
                          <li><a href="./docs/frontend-setup.html">Setting Up Frontend</a></li>
                          <li><a href="./docs/file-structure.html">File Structure</a></li>
                          <li><a href="./docs/data-flow.html">Data Flow</a></li>
                          <li><a href="./docs/technology-stack.html">Technology Stack</a></li>
                          <li><a href="./docs/configuration.html">Changing environment</a></li>
                          <li><a href="./docs/build-and-configuration.html">Theme Build and Configuration</a></li>
                          <li><a href="./docs/caching.html">Implementing Caching for New Caching Identities</a></li>
                        </ul>
                      <li css={{fontSize: 20}}>How-to tutorials - Intermediate</li>
                        <ul>
                          <li><a href="./docs/debug-in-chrome.html">Debugging in Chrome</a></li>
                          <li><a href="./docs/xdebug.html">Configuring XDebug</a></li>
                          <li><a href="./docs/cli.html">CLI in Docker</a></li>
                          <li><a href="./docs/postman-graphql-playground.html">Postman & GraphQL Playground</a></li>
                          <li><a href="./docs/vsc-extensions.html">VSCode Extensions</a></li>
                          <li><a href="./docs/plugin-mechanism.html">ScandiPWA plugins</a></li>
                          <li><a href="./docs/eslint-stylelint.html">ESlint & StyleLint</a></li>
                          <li><a href="./docs/contribute.html">How to Contribute</a></li>
                          <li><a href="./docs/migrate-newer-version.html">Migrating to a Newer Version</a></li>
                          <li><a href="./docs/on-existing-m2.html">Installation on Existing Magento 2 Server</a></li>
                          <li><a href="./docs/coding-standard.html">BEM and Coding Standards</a></li>
                          <li><a href="./docs/tools.html">Tools of ScandiPWA</a></li>
                          <li><a href="./docs/react-best-practices.html">React Best Practices</a></li>
                          <li><a href="./docs/best-practices-styles.html">Best Practices Working with Styles</a></li>
                        </ul>
                    </ol>
                  </div>
              </section>
            </div>
          </Container>
        </div>
      </Layout>
    );
  }
}


const CtaItem = ({children, primary = false}) => (
  <div
    css={{
      '&:first-child': {
        textAlign: 'right',
        paddingRight: 7,
        paddingLeft: 7,
        [media.lessThan('small')]: {
          marginBottom: 10,
        },
      },

      '&:nth-child(2)': {
        paddingRight: 7,
        paddingLeft: 7,
        [media.greaterThan('small')]: {
          paddingLeft: 15,
        },
        [media.lessThan('small')]: {
          marginBottom: 10,
        },
      },
    }}>
    {children}
  </div>
);

export default Home;

const sectionStyles = {
  marginTop: 20,
  marginBottom: 15,

  [media.greaterThan('medium')]: {
    marginTop: 60,
    marginBottom: 65,
  },
};


