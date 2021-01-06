import moderationJSON from "assets/dashboard/moderation.json";
import basicJSON from "assets/dashboard/basic.json";
import alertsJSON from "assets/dashboard/alerts.json";
import miscJSON from "assets/dashboard/miscellaneous.json";
import objectPath from "object-path";
import { Dispatch, useEffect, useState } from 'react';
import Switch from "react-switch"
import { diff, isNull } from 'utils/tools';
import styles from "../styles/mode.module.scss";
import Swal from "sweetalert2";
import { HelpSVG } from 'utils/tsxUtils';
import { SavePopup } from './SavePopup';
import Select, { Theme, ValueType } from "react-select"

const BuildPage = ({ mode, guild }: { mode: string, guild: string }) => {
  const [update, setUpdate] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>({});
  const [fetched, setFetched] = useState<any>({});
  const [textToggle, setTextToggle] = useState<TextToggleInt>({});
  let difference = diff(userData, fetched);
  Object.keys(difference).forEach(key => {
    if (userData[key] === "")
      delete difference[key];
  });

  const files = {
    basic: basicJSON,
    moderation: moderationJSON,
    alerts: alertsJSON,
    miscellaneous: miscJSON
  }

  const Components: JSX.Element[] = [];

  const basicModule: BasicStructure = (files as { [key: string]: any })[mode];
  const items = basicModule.items;
  useEffect(() => {
    if (!loading && typeof window !== "undefined" && !isNull(guild)) {
      setLoading(true)
      const url = processString(basicModule.fetch, undefined, guild);
      fetch(url).then(res => {
        res.json().then(t => {
          setUserData(Object.assign({}, t));
          setFetched(Object.assign({}, t));
        });
      })
    }
  })

  items.forEach(anyItem => {
    if (anyItem.type === "switch") {
      const item: SwitchStruct = (anyItem as any);
      const switchValue = processString(item.default, userData, guild);
      const saveID = item.saveID;
      const label = item.label;
      let fireHelp = () => { }
      if (!isNull(item.help)) {
        fireHelp = () => Swal.fire({
          icon: "info",
          html: isNull(item.help?.html) ? `
          <p>${item.help?.text}</p>
          <img src="${item.help?.image}" alt="Example" style="width: 100%;">
          ` : item.help?.html
        })
      }
      const generatedSwitch = generateSwitch(switchValue ?? false, userData, d => { setUserData(d); setUpdate(!update) }, saveID);
      Components.push(
        <div className={styles.setting} key={`${saveID}-Settings`}>
          <div className={styles.text} key={`${saveID}-TextDiv`}>
            <span key={`${saveID}-HelpLabel`}>{label}</span>
            {isNull(item.help) ? <></> : <HelpSVG onClick={() => fireHelp()} />}
          </div>
          <div className={styles.subSetting} key={`${saveID}-SubSetting`}>
            <div style={{ display: "flex", justifyContent: "center" }} key={`${saveID}-FlexContent`}>
              {generatedSwitch}
            </div>
          </div>
        </div>
      );
    }

    if (anyItem.type === "text_toggle") {
      const item: TextToggleStruct = (anyItem as any);
      const text = processString(item.default, userData, guild);
      const saveID = item.saveID;
      const label = item.label;

      if (isNull(textToggle[saveID])) {
        textToggle[saveID] = {
          enabled: false,
          value: ""
        }
        setTextToggle(textToggle);
        setUpdate(!update);
      }

      let fireHelp = () => { }
      if (!isNull(item.help)) {
        fireHelp = () => Swal.fire({
          icon: "info",
          html: isNull(item.help?.html) ? `
          <p>${item.help?.text}</p>
          <img src="${item.help?.image}" alt="Example" style="width: 100%;">
          ` : item.help?.html
        })
      }
      const generatedText = generateTextToggle(text, item.placeholder, textToggle, d => {
        setTextToggle(d);
        if (d[saveID].enabled)
          userData[saveID] = d[saveID].value;
        else
          userData[saveID] = "";
        setUserData(userData);
        setUpdate(!update)
      }, saveID);
      Components.push(
        <div className={styles.setting} key={`${saveID}-Settings`}>
          <div className={styles.text} key={`${saveID}-TextDiv`}>
            <span key={`${saveID}-HelpLabel`}>{label}</span>
            {isNull(item.help) ? <></> : <HelpSVG onClick={() => fireHelp()} />}
          </div>
          <div className={`${styles.subSetting} ${styles.noOverflow}`} key={`${saveID}-SubSetting`}>
            {generatedText}
          </div>
        </div>
      );
    }

    if (anyItem.type === "select") {
      const item: SelectStruct = (anyItem as any);
      const defaultValue = processString(item.default, userData, guild);
      const saveID = item.saveID;
      const label = item.label;
      const itemLabels: string[] = processString(item.itemLabel, userData, guild) ?? [];
      const itemValues: string[] = processString(item.itemValues, userData, guild) ?? [];
      let options: SelectInterface[] = [];
      itemLabels.forEach((label, i) => {
        options.push({
          label: label,
          value: itemValues[i]
        })
      });
      options.unshift({ value: "", label: "Disabled" })

      if (isNull(textToggle[saveID])) {
        textToggle[saveID] = {
          enabled: false,
          value: ""
        }
        setTextToggle(textToggle);
        setUpdate(!update);
      }

      let fireHelp = () => { }
      if (!isNull(item.help)) {
        fireHelp = () => Swal.fire({
          icon: "info",
          html: isNull(item.help?.html) ? `
          <p>${item.help?.text}</p>
          <img src="${item.help?.image}" alt="Example" style="width: 100%;">
          ` : item.help?.html
        })
      }
      const generatedSelect = generateSelect(options, defaultValue, d => {
        console.log(d);
        userData[saveID] = d;
        setUserData(userData);
        setUpdate(!update);
      });

      Components.push(
        <div className={styles.setting} key={`${saveID}-Settings`}>
          <div className={styles.text} key={`${saveID}-TextDiv`}>
            <span key={`${saveID}-HelpLabel`}>{label}</span>
            {isNull(item.help) ? <></> : <HelpSVG onClick={() => fireHelp()} />}
          </div>
          <div className={styles.subSetting} key={`${saveID}-SubSetting`}>
            {generatedSelect}
          </div>
        </div>
      );
    }

    if (anyItem.type === "title") {
      const item: TitleStruct = anyItem as any
      Components.push(
        <h2 className={styles.spaceTop}>{item.text}</h2>
      )
    }
  });


  return <>
    {Components}
    {Object.keys(difference).length !== 0 ? <SavePopup onSave={() => { }} /> : <></>}
  </>
};

function processString(str: string, data: any, guild: string) {
  guild = guild;
  if (isNull(str)) return str;
  if (!str?.startsWith("path$") && !str?.startsWith("eval$")) return str;

  if (str.startsWith("path$")) {
    if (isNull(data)) return undefined;
    const path = str.substr("path$".length);
    return objectPath.get(data, path);
  }

  if (str.startsWith("eval$")) {
    const toEval = str.substr("eval$".length);
    return eval(toEval);
  }
}

export interface BasicStructure {
  items: {
    type: string,
    default: string,
    saveID: string,
  }[],
  fetch: string
}

export interface SwitchStruct {
  type: string,
  default: string,
  saveID: string,
  label: string,
  help?: HelpInterface
}

export interface TextToggleStruct {
  type: string,
  default: string,
  saveID: string,
  label: string,
  placeholder: string
  help?: HelpInterface
}

export interface SelectStruct {
  type: string,
  label: string,
  default: string,
  saveID: string,
  itemValues: string,
  itemLabel: string,
  help?: HelpInterface
}

export interface HelpInterface {
  image: string,
  text?: string
  html?: string
}

export interface TitleStruct {
  type: string,
  text: string
}

const generateSwitch = (defaultValue: boolean, userData: any, setUserData: Dispatch<any>, saveID: string) => (
  <Switch key={`${saveID}-Switch`} onChange={(current) => { userData[saveID] = current; setUserData(userData) }} checked={defaultValue} />
)

const generateTextToggle = (defaultValue: string, placeholder: string, textToggle: TextToggleInt, setTextToggle: Dispatch<TextToggleInt>, saveID: string) => (
  <>
    <Switch key={`${saveID}-Switch`} onChange={v => { textToggle[saveID].enabled = v; setTextToggle(textToggle); }} checked={textToggle[saveID].enabled}></Switch>
    <input
      key={`${saveID}-Input`}
      placeholder={placeholder}
      value={textToggle[saveID].value ?? defaultValue ?? ""}
      onChange={s => { textToggle[saveID].value = s.target.value; setTextToggle(textToggle) }}

      type={"text"}
      className={`${styles.inputAnimated} ${textToggle[saveID].enabled ? styles.activeInput : ""}`}
    />
  </>
)







const generateSelect = (options: SelectInterface[], defaultValue: SelectInterface, setChange: (newValue: ValueType<SelectInterface, false>) => void) => (
  <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={defaultValue} onChange={newValue => {
    setChange(newValue)
  } } />
)

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
      "backgroundColor": backgroundColor
    }
  }
}

interface SelectInterface {
  value: string | undefined,
  label: string
}




interface TextToggleInt {
  [key: string]: {
    enabled: boolean,
    value: string
  }
}

export default BuildPage;