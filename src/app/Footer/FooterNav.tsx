import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Button, PortalBox, SHADOW_BOX_SIZES } from '@theme';
import React from 'react';

import cn from '@utils/classnames';
import { appTitle } from '@utils/constants';

import styles from './FooterNav.module.css';

type Menu = 'credits' | 'legal';

const NAVIGATION: Record<Menu, string> = {
  legal: 'legal',
  credits: 'credits',
};

const FooterNav = ({ className = '' }: { className?: string }) => {
  const [activeBox, setActiveBox] = React.useState<Menu>(null);
  const { trackEvent } = useMatomo();

  React.useEffect(() => {
    activeBox &&
      trackEvent({ category: 'page', action: 'open', name: activeBox });
  }, [activeBox]);

  return (
    <React.Fragment>
      <nav className={cn(className, styles.root)}>
        {Object.entries(NAVIGATION).map(([key, title]) => (
          <Button
            className={cn(styles.element)}
            layout="empty"
            onClick={() => setActiveBox(key as Menu)}
            key={key}
          >
            {title}
          </Button>
        ))}
        <PortalBox
          show={activeBox === 'credits'}
          setShow={(show) => setActiveBox(show ? 'credits' : null)}
          title="Credits"
          size={SHADOW_BOX_SIZES.SMALL}
        >
          <div className={styles.content}>
            <p>
              <b>{appTitle}</b> is a project by Nico Martin:{' '}
              <a
                href="https://nico.dev"
                target="_blank"
                rel="noreferrer noopener"
              >
                https://nico.dev
              </a>
            </p>
            <h2>Fonts</h2>
            <ul>
              <li>
                App:{' '}
                <a
                  rel="noreferrer noopener"
                  href="https://lobdell.me/affogato/"
                  target="_blank"
                >
                  Affogato
                </a>{' '}
                by{' '}
                <a
                  href="https://www.lobdell.me/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Eric Lobdell
                </a>
              </li>
              <li>
                Markup/Code:{' '}
                <a
                  rel="noreferrer noopener"
                  href="https://www.jetbrains.com/lp/mono/"
                  target="_blank"
                >
                  JetBrains Mono
                </a>{' '}
                by{' '}
                <a
                  href="https://www.jetbrains.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  JetBrains
                </a>
              </li>
              <li>
                Preview Editor: Segoe UI, system-ui, -apple-system or just
                sans-serif based on the operating system
              </li>
            </ul>

            <h2>Dependencies</h2>

            <p>
              <a href="https://github.com/nico-martin/markdown-editor/blob/main/package.json">
                https://github.com/nico-martin/markdown-editor/blob/main/package.json
              </a>
            </p>

            <h2>Open Source</h2>
            <p>
              The directory is publicly available on GitHub and is{' '}
              <a
                href="https://github.com/nico-martin/markdown-editor/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer noopener"
              >
                licensed under an open source license
              </a>
              . Just like most of my projects.
            </p>
            <p>
              <a href="https://github.com/nico-martin/markdown-editor/">
                https://github.com/nico-martin/markdown-editor/
              </a>
            </p>
          </div>
        </PortalBox>
        <PortalBox
          show={activeBox === 'legal'}
          setShow={(show) => setActiveBox(show ? 'legal' : null)}
          title="Legal"
          size={SHADOW_BOX_SIZES.SMALL}
        >
          <div className={styles.content}>
            <h2>Privacy</h2>
            <p>
              This web app does not collect any personal data. We use a{' '}
              <a href="https://analytics.sayhello.agency" target="_blank">
                self-hosted
              </a>{' '}
              <a href="https://matomo.org/" target="_blank">
                Matomo
              </a>{' '}
              instance where we collect anonymized data about the use of the
              app.
            </p>
            <h2>Contact</h2>
            <p>
              <strong>Nico Martin</strong>
              <br />
              Say Hello GmbH
              <br />
              Thunstrasse 4<br />
              CH-3700 Spiez
              <br />
              Switzerland
            </p>
            <p>
              <a href="mailto:nico@sayhello.ch">nico@sayhello.ch</a>
            </p>
          </div>
        </PortalBox>
      </nav>
    </React.Fragment>
  );
};

export default FooterNav;
