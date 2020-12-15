import { useState } from 'react';
import styles from "../../styles/mode.module.scss";
import ModeProps from 'utils/modeProps';
import { Help } from './Help/Help';
import { HelpSVG } from 'utils/tsxUtils';
import Switch from "react-switch";

export const Miscellaneous = ({ data }: ModeProps) => {
  const [prefix, setPrefix] = useState<string>(data.prefix);
  const [detailedLogging, setDetailedLogging] = useState<boolean | undefined>(!data.disableDetailedLogging);
  return <>
    <div className={styles.setting}>
      <div className={styles.text}>
        <span>Global Prefix</span>
        <HelpSVG onClick={() => Help.prefixMessage()} />
      </div>
      <div className={`${styles.subSetting} ${styles.noOverflow}`}>
        <input placeholder={"Global Prefix"} type={"text"} value={prefix} className={`${styles.inputAnimated} ${prefix ? styles.activeInput : ""}`} onChange={s => setPrefix(s.target.value)} />
      </div>
    </div>

    <div className={styles.setting}>
      <div className={styles.text}>
        <span>Detailed Logging</span>
        <HelpSVG onClick={() => Help.defaultLogging()} />
      </div>
      <div className={styles.subSetting}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Switch onChange={setDetailedLogging} checked={detailedLogging ?? false} />
        </div>
      </div>
    </div>
  </>
}