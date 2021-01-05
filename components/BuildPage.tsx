import moderationJSON from "assets/dashboard/moderation.json";
import basicJSON from "assets/dashboard/basic.json";
import alertsJSON from "assets/dashboard/alerts.json";
import miscJSON from "assets/dashboard/miscellaneous.json";
import objectPath from "object-path";
import { Dispatch, useEffect, useState } from 'react';
import Switch from "react-switch"
import { isNull } from 'utils/tools';
import styles from "../styles/mode.module.scss";
import Swal from "sweetalert2";
import { HelpSVG } from 'utils/tsxUtils';

const BuildPage = ({ mode, guild }: { mode: string, guild: string }) => {
  const [update, setUpdate] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>({});

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
          setUserData(t);
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
          html: `
          <p>${item.help?.text}</p>
          <img src="${item.help?.image}" alt="Example" style="width: 100%;">
          `
        })
      }
      const generatedSwitch = generateSwitch(switchValue ?? false, userData, d => { setUserData(d); setUpdate(!update) }, saveID);
      Components.push(
        <div className={styles.setting}>
          <div className={styles.text}>
            <span>{label}</span>
            {isNull(item.help) ? <></> : <HelpSVG onClick={() => fireHelp()} />}
          </div>
          <div className={styles.subSetting}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {generatedSwitch}
            </div>
          </div>
        </div>
      );
    }
  });


  return <>
    {Components}
  </>
};

function processString(str: string, data: any, guild: string) {
  guild = guild;
  if (!str.startsWith("path$") && !str.startsWith("eval$")) return str;

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
    type: string
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

export interface HelpInterface {
  image: string,
  text: string
}

const generateSwitch = (defaultValue: boolean, userData: any, setUserData: Dispatch<any>, saveID: string) => (
  <Switch key={`${saveID}-Switch`} onChange={(current) => { userData[saveID] = current; setUserData(userData) }} checked={defaultValue} />
)

export default BuildPage;