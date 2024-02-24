import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Button, Icon, Tooltip } from '@theme';
import React from 'react';

import cn from '@utils/classnames.tsx';
import { formatBytes, getLastElementOfPath, round } from '@utils/helpers.ts';
import { isModelCached, setModelCached } from '@utils/localStorage.ts';

import styles from './ModelOption.module.css';

const ModelOption: React.FC<{
  name: string;
  value: string;
  title: string;
  cardLink?: string;
  content?: React.ReactElement | Array<React.ReactElement | string> | string;
  downloadModel?: () => Promise<any>;
  downloadProgress?: number | boolean;
  downloadDisabled?: boolean;
  progressItems?: Array<{
    file: string;
    progress: number;
  }>;
  size?: number;
  className?: string;
  checked: boolean;
  onCheck: () => void;
}> = ({
  name,
  value,
  title,
  cardLink = null,
  downloadModel = null,
  downloadProgress = null,
  downloadDisabled = false,
  progressItems = [],
  content = null,
  size = 0,
  className = '',
  checked = false,
  onCheck,
}) => {
  const { trackEvent } = useMatomo();
  const tooltipRef = React.useRef<HTMLSpanElement>(null);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  React.useEffect(() => {
    setDisabled(value !== 'none' && !isModelCached(`${name}/${value}`));
  }, []);

  return (
    <label className={cn(className, styles.root)}>
      <div className={styles.inputWrapper}>
        <input
          disabled={disabled}
          type="radio"
          name={name}
          value={value}
          className={styles.input}
          checked={checked}
          onChange={(e) => e.target.checked && onCheck()}
        />
        {disabled ? (
          <React.Fragment>
            <span className={styles.visualInput} ref={tooltipRef} />
            <Tooltip tooltipRef={tooltipRef} placement="right" width={220}>
              You need to install the model before you can use it.
            </Tooltip>
          </React.Fragment>
        ) : (
          <span className={styles.visualInput} />
        )}
      </div>
      <div className={styles.about}>
        <h3 className={styles.aboutTitle}>{title}</h3>
        {Boolean(cardLink) && (
          <p className={styles.cardLink}>
            <a href={cardLink} target="_blank">
              {cardLink}
            </a>
          </p>
        )}
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      <div className={styles.controls}>
        {!disabled && value !== 'none' ? (
          <p className={styles.controlsInstalled}>
            <Icon icon="check" className={styles.iconLoaded} /> installed
          </p>
        ) : (
          disabled &&
          Boolean(downloadModel) && (
            <Button
              round
              {...(typeof downloadProgress === 'number'
                ? { progress: downloadProgress }
                : { loading: downloadProgress })}
              disabled={downloadDisabled}
              onClick={async () => {
                try {
                  await downloadModel();
                  setModelCached(`${name}/${value}`);
                  trackEvent({
                    category: 'download-model',
                    action: `${name}/${value}`,
                  });
                  setDisabled(
                    value !== 'none' && !isModelCached(`${name}/${value}`)
                  );
                } catch (e) {
                  alert('Model could not be loaded');
                  console.log(e);
                }
              }}
              icon="download-outline"
              layout="outline"
            >
              Install{size !== 0 ? ` (${formatBytes(size)})` : ''}
            </Button>
          )
        )}
        {progressItems.map((item) => (
          <div className={styles.downloadProgress}>
            <span
              className={styles.downloadProgressBar}
              style={{ width: round(item.progress) + '%' }}
            >
              {getLastElementOfPath(item.file)}
            </span>
            <p className={styles.downloadProgressFile}>
              {getLastElementOfPath(item.file)}
            </p>
          </div>
        ))}
      </div>
    </label>
  );
};

export default ModelOption;
