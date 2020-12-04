import Head from 'next/head';
import { useState } from 'react';
import Select, { Theme } from "react-select";
import Switch from 'react-switch';
import Swal from 'sweetalert2'
import ModeProps from 'utils/modeProps';
import { isNull } from 'utils/tools';
import styles from "../../styles/basic.module.scss";


export const Basic = ({ data }: ModeProps) => {
  const [detailedLogging, setDetailedLogging] = useState<boolean | undefined>(undefined);
  const [leaveEnabled, setLeaveEnabled] = useState<boolean>(!isNull(data.leaveMSG));
  const [leaveMSG, setLeaveMSG] = useState<string>(data.leaveMSG);

  const [joinEnabled, setJoinEnabled] = useState<boolean>(!isNull(data.joinMSG));
  const [joinMSG, setJoinMSG] = useState<string>(data.joinMSG);
  var options: SelectInterface[] = [];
  if (!isNull(data)) {
    if (isNull(detailedLogging))
      setDetailedLogging(!data.disableDetailedLogging);
    options = data.channels.map(value => {
      return {
        value: value.id,
        label: value.name
      }
    });
  }
  options.unshift({ value: "", label: "Disabled" })

  console.log(options.find(s => data.levelUpChannel === s.value));

  const welcome = options.find(s => data.welcomeChannel === s.value) ?? options[0];
  const levelUp = options.find(s => data.levelUpChannel === s.value) ?? options[0];
  const privChannel = options.find(s => data.privateChannel === s.value) ?? options[0];
  return <>
    <Head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@3/dark.css" />
    </Head>
    <div className={styles.setting}>
      <span>Detailed Logging</span>
      <div className={styles.subSetting}>
        <Switch onChange={setDetailedLogging} checked={detailedLogging ?? false} />
      </div>
    </div>
    <div className={styles.setting}>
      <span>Level Up Channel</span>
      <div className={styles.subSetting}>
        <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={levelUp} />
      </div>
    </div>
    <div className={styles.setting}>
      <span>Private Channel</span>
      <div className={styles.subSetting}>
        <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={privChannel} />
      </div>
    </div>
    <div className={styles.setting}>
      <span>Welcome Channel</span>
      <div className={styles.subSetting}>
        <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={welcome} />
      </div>
    </div>
    <div className={styles.setting}>
      <span>Join Message</span>
      <div className={styles.subSetting}>
        <Switch onChange={setJoinEnabled} checked={joinEnabled}></Switch>
        <button onClick={() => {
          Swal.fire({
            title: "Test title",
            text: "Lol haha alert",
            icon: "info"
        })}}>
          Open
        </button>
        <input placeholder={"Leave Message"} type={"text"} value={joinMSG} className={`${styles.inputAnimated} ${joinEnabled ? styles.activeInput : ""}`} onChange={s => setJoinMSG(s.target.value)}/>
      </div>
    </div>
    <div className={styles.setting}>
      <span>Leave Message</span>
      <div className={styles.subSetting}>
        <Switch onChange={setLeaveEnabled} checked={leaveEnabled}></Switch>
        <input placeholder={"Leave Message"} type={"text"} value={leaveMSG} className={`${styles.inputAnimated} ${leaveEnabled ? styles.activeInput : ""}`} onChange={s => setLeaveMSG(s.target.value)}/>
      </div>
    </div>
  </>
}

function styleFn(theme: Theme) {
  const color = "var(--roleSelect)"
  const lighterColor = "var(--borderColor)"

  const keys = Object.keys(theme.colors)
  keys.forEach(key => {
    var setColor = "#fffff";
    if (key.startsWith("neutral") && !key.includes(color)) {
      setColor = "var(--primary-font-color)"
    }
    if (key === "neutral0") setColor = color;
    if (key === "neutral20") setColor = lighterColor;
    if (key === "primary25") setColor = "var(--hoverColor)";

    theme.colors[key] = setColor
  })
  console.log(theme)
  return theme;
}

const customStyles = {
  option: (provided: any, state: any) => {
    var backgroundColor = state.isFocused ? "var(--borderColor)" : 'var(--roleSelect)'
    if (state.isSelected) {
      backgroundColor = 'var(--alertInfo)';
    }

    return {
      ...provided,
      color: (state.isFocused || state.isSelected) ? 'white' : 'var(--primary-font-color)',
      "background-color": backgroundColor
    }
  }
}

interface SelectInterface {
  value: string | undefined,
  label: string
}