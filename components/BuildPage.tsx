import alertsJSON from "assets/dashboard/alerts.json";
import basicJSON from "assets/dashboard/basic.json";
import miscJSON from "assets/dashboard/miscellaneous.json";
import moderationJSON from "assets/dashboard/moderation.json";
import 'emoji-mart/css/emoji-mart.css';
import { useRouter } from 'next/router';
import objectPath from "object-path";
import { Dispatch, useEffect, useState } from 'react';
import Loader from "react-loader-spinner";
import Select, { Theme, ValueType } from "react-select";
import Switch from "react-switch";
import Swal from "sweetalert2";
import { diff, isNull } from 'utils/tools';
import { HelpSVG } from 'utils/tsxUtils';
import vm from "vm";
import styles from "../styles/mode.module.scss";
import { SavePopup } from './SavePopup';
import { TharButton } from './TharButton';

const BuildPage = ({ mode, guild }: { mode: string, guild: string }) => {
  const [update, setUpdate] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<any>({});
  const [fetched, setFetched] = useState<any>({});
  const [textToggle, setTextToggle] = useState<TextToggleInt>({});
  const router = useRouter();

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
        }).catch(() => {
          Swal.fire("Internal Server Error", 'An internal server error occurred. If this problem persists, please contact the developers!', 'error')
            .then(() => { if (location.pathname) location.pathname = "/dashboard" })
        });
      })
    }
  })


  if (Object.keys(fetched).length <= 0)
    return <>
      <h1>Loading</h1>
      <Loader type="Bars" color="#00BFFF" height={80} width={80} />
    </>

  if (typeof fetched === "string") return <h1>{fetched}</h1>

  if (fetched.error === "No session") {
    router.push("/");
    return <h1>Redirecting No session</h1>
  }

  if (!isNull(fetched.error)) {
    return <>
      <h1>ERROR</h1>
      <span>{JSON.stringify(fetched.error)}</span>
      <TharButton color="white" anim="green" width={"100px"} height={"50px"} onClick={() => { window?.history?.back() }}>Back</TharButton>
    </>
  }

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
          enabled: isNull(text) ? false : true,
          value: isNull(text) ? "" : text,
          changed: false
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
        const textInfo = d[saveID];
        textInfo.changed = text !== textInfo.value;
        console.log("Enabled", textInfo.enabled, "Val", textInfo.value)
        if (textInfo.enabled) {
          userData[saveID] = textInfo.value;
        }
        else {
          userData[saveID] = undefined;
        }
        setTextToggle(d);
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
      const generatedSelect = generateSelect(options, options.find(i => i.value === defaultValue) ?? options[options.length - 1], d => {
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
        <h2 className={styles.spaceTop} key={"title-" + item.text}>{item.text}</h2>
      )
    }
  });


  //Components.push(<Picker set={"twitter"} title='Pick your emoji…' onSelect={() => { }} theme={"dark"}/>)
  const filtered = Object.keys(difference).filter(key => !isNull(difference[key]))
  return <>
    {Components}
    {<SavePopup onSave={() => saveData(guild, userData, setLoading, setSaving)} enabled={Object.keys(filtered).length !== 0} saving={saving} />}
  </>
};

function saveData(guild: string, userData: any, setLoading: Dispatch<boolean>, setSaving: Dispatch<boolean>) {
  setSaving(true)
  fetch(`/api/discord/save?id=${guild}`, { method: "POST", body: JSON.stringify(userData), headers: { "Content-Type": "application/json" } }).then(resp => {
    if (resp.status !== 200) {
      Swal.fire('Error', "Your Settings did not get saved because of an internal error", "error").then(() => {
        if (typeof location !== "undefined") location.reload()
      });
      setSaving(false)
      setLoading(false)
    }
  })
}

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
    return vm.runInNewContext(toEval, { data: data, guild: guild });
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
    <div className={styles.inputDiv}>
      <input
        key={`${saveID}-Input`}
        placeholder={placeholder}
        value={textToggle[saveID].value ?? defaultValue}
        onChange={s => { textToggle[saveID].value = s.target.value; setTextToggle(textToggle) }}

        type={"text"}
        className={`${styles.inputAnimated} ${textToggle[saveID].enabled ? styles.activeInput : ""}`}
      />
    </div>
  </>
)







const generateSelect = (options: SelectInterface[], defaultValue: SelectInterface, setChange: (newValue: ValueType<SelectInterface, false>) => void) => {
  return <Select options={options} styles={customStyles} isMulti={false} theme={styleFn} defaultValue={defaultValue} onChange={newValue => {
    setChange(newValue)
  }} />
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
    value: string,
    changed: boolean
  }
}

export default BuildPage;