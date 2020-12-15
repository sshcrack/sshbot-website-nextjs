import { SavePopup } from 'components/SavePopup';
import { Dispatch, SetStateAction, useState } from 'react';
import Select, { Theme } from "react-select";
import Switch from 'react-switch';
import ModeProps from 'utils/modeProps';
import { isNull } from 'utils/tools';
import { HelpSVG } from 'utils/tsxUtils';
import styles from "../../styles/mode.module.scss";
import { Help } from './Help/Help';


export const Basic = ({ data }: ModeProps) => {
  const [welcomeImage, setWelcomeImage] = useState<boolean | undefined>(undefined);
  const [leaveEnabled, setLeaveEnabled] = useState<boolean>(!isNull(data.leaveMSG));
  const [leaveMSG, setLeaveMSG] = useState<string>(data.leaveMSG);

  const [joinEnabled, setJoinEnabled] = useState<boolean>(!isNull(data.joinMSG));
  const [joinMSG, setJoinMSG] = useState<string>(data.joinMSG);
  var options: SelectInterface[] = [];
  if (!isNull(data)) {
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
    <div className={styles.setting}>
      <div className={styles.text}>
        <span>LevelUp Channel</span>
        <HelpSVG onClick={() => Help.levelUpChannel()} />
      </div>
      <div className={`${styles.subSetting} ${styles.overflowAuto}`}>
        <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={levelUp} />
      </div>
    </div>
    <div className={styles.setting}>
      <div className={styles.text}>
        <span>Private Channels</span>
        <HelpSVG onClick={() => Help.privateChannels()} />
      </div>
      <div className={styles.subSetting}>
        <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={privChannel} />
      </div>
    </div>

    <WelcomeSettings
      options={options}
      default={welcome}

      welcomeImage={welcomeImage}
      setWelcomeImage={setWelcomeImage}

      joinMSG={joinMSG}
      setJoinMSG={setJoinMSG}

      joinEnabled={joinEnabled}
      setJoinEnabled={setJoinEnabled}

      leaveEnabled={leaveEnabled}
      setLeaveEnabled={setLeaveEnabled}

      leaveMSG={leaveMSG}
      setLeaveMSG={setLeaveMSG}
    />
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

const WelcomeSettings = (props: {
  options: SelectInterface[],
  default: SelectInterface,
  setWelcomeImage: Dispatch<SetStateAction<boolean | undefined>>,
  welcomeImage: boolean | undefined,

  joinMSG: string,
  joinEnabled: boolean | undefined,
  setJoinMSG: Dispatch<SetStateAction<string>>,
  setJoinEnabled: Dispatch<SetStateAction<boolean>>,

  leaveMSG: string,
  leaveEnabled: boolean | undefined,
  setLeaveEnabled: Dispatch<SetStateAction<boolean>>,
  setLeaveMSG: Dispatch<SetStateAction<string>>,
}) => (
    <>
      <h2 className={styles.spaceTop}>Welcome</h2>

      <div className={styles.setting}>
        <div className={styles.text}>
          <span>Welcome Image</span>
          <HelpSVG onClick={() => Help.welcomeImage()} />
        </div>
        <div className={styles.subSetting}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Switch onChange={props.setWelcomeImage} checked={props.welcomeImage ?? false} />
          </div>
        </div>
      </div>

      <div className={styles.setting}>
        <div className={styles.text}>
          <span>Welcome Channel</span>
          <HelpSVG onClick={() => Help.welcomeChannel()} />
        </div>
        <div className={styles.subSetting}>
          <Select options={props.options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={props.default} />
        </div>
      </div>

      <div className={styles.setting}>
        <div className={styles.text}>
          <span>Join Message</span>
          <HelpSVG onClick={() => Help.joinMessage()} />
        </div>
        <div className={`${styles.subSetting} ${styles.noOverflow}`}>
          <Switch onChange={props.setJoinEnabled} checked={props.joinEnabled ?? false}></Switch>

          <input placeholder={"Leave Message"} type={"text"} value={props.joinMSG} className={`${styles.inputAnimated} ${props.joinEnabled ? styles.activeInput : ""}`} onChange={s => props.setJoinMSG(s.target.value)} />
        </div>
      </div>
      <div className={styles.setting}>
        <div className={styles.text}>
          <span>Leave Message</span>
          <HelpSVG onClick={() => Help.leaveMessage()} />
        </div>
        <div className={`${styles.subSetting} ${styles.noOverflow}`}>
          <Switch onChange={props.setLeaveEnabled} checked={props.leaveEnabled ?? false}></Switch>
          <input placeholder={"Leave Message"} type={"text"} value={props.leaveMSG} className={`${styles.inputAnimated} ${props.leaveEnabled ? styles.activeInput : ""}`} onChange={s => props.setLeaveMSG(s.target.value)} />
        </div>
      </div>

      <SavePopup onSave={() => console.log("save")} onCancel={() => console.log("Cancel")}/>
    </>
  )

interface SelectInterface {
  value: string | undefined,
  label: string
}