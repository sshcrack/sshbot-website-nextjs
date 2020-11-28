import { useState } from 'react';
import Select, { Theme } from "react-select";
import Switch from 'react-switch';
import ModeProps from 'utils/modeProps';
import { isNull } from 'utils/tools';
import styles from "../../styles/basic.module.scss";


export const Basic = ({ data }: ModeProps) => {
  const [detailedLogging, setDetailedLogging] = useState<boolean | undefined>(undefined);
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
  options.unshift({value: "", label: "Disabled"})

  console.log(options.find(s => data.levelUpChannel === s.value));
  return <>
    <div className={styles.setting}>
      <span>Detailed Logging</span>
      <Switch onChange={setDetailedLogging} checked={detailedLogging ?? false}/>
    </div>
    <div className={styles.setting}>
      <span>Level Up Channel</span>
      <Select options={options} isMulti={false} theme={ styleFn } value={options.find(s => data.levelUpChannel === s.value) ?? options[0]}/>
    </div>
    <div className={styles.setting}>
      <span>Private Channel</span>
      <Select options={options} isMulti={false} theme={ styleFn } defaultValue={options.find(s => data.privateChannel === s.value) ?? options[0]}/>
    </div>
    <div className={styles.setting}>
      <span>Welcome Channel</span>
      <Select options={options} isMulti={false} theme={ styleFn } defaultValue={options.find(s => data.welcomeChannel === s.value) ?? options[0]}/>
    </div>
    <div className={styles.setting}>
      <span>Join Message</span>
      <input type={"text"} value={data.joinMSG} />
    </div>
    <div className={styles.setting}>
      <span>Leave Message</span>
      <input type={"text"} value={data.leaveMSG} />
    </div>
  </>
}

function styleFn(theme: Theme) {
  const color = "var(--darkerBackground)"
  const lighterColor = "var(--borderColor)"

  const keys = Object.keys(theme.colors)
  keys.forEach(key => {
    var setColor = "#fffff";
    if (key.startsWith("neutral") && !key.includes(color)) {
      const value = theme.colors[key];
      setColor = value.replace("0,", color + ",");
    }
    if (key === "neutral0") setColor = color;
    if (key === "neutral20") setColor = lighterColor;
    if (key === "primary25") setColor = "var(--hoverColor)";

    theme.colors[key] = setColor
  })
  console.log(theme)
  return theme;
}

interface SelectInterface {
    value: string | undefined,
    label: string
}