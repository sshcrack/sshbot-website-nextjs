import anime from "animejs";
import { useState } from 'react';
import styles from "../styles/savePopup.module.scss";
import Loader from "react-loader-spinner"

const disabledBottom = "-5rem";
const enabledBottom = "2rem";

export const SavePopup = (props: { onSave: () => void, enabled: boolean, saving: boolean }) => {
  const [previous, setPrevious] = useState<boolean>(false);

  if (!previous && props.enabled)
    handleEnable()

  if (previous && !props.enabled)
    handleDisable()

  if (previous !== props.enabled)
    setPrevious(props.enabled);

  return <>
    <div className={styles.savePopup} style={{bottom: props.enabled ? enabledBottom : disabledBottom}}>
      <span>You have unsaved changes</span>
      <button className={styles.saveButton} onClick={() => props.saving ? () => { } : props.onSave()}>
        {props.saving ? <Loader type="ThreeDots" color="#FFFFFF" height={40} width={80} /> : <span>Save Changes</span>}
      </button>
    </div>
  </>
};

function handleEnable() {
  anime({
    targets: `div.${styles.savePopup}`,
    autoplay: true,
    bottom: enabledBottom,
    easing: "easeOutElastic"
  })
};

function handleDisable() {
  anime({
    targets: `div.${styles.savePopup}`,
    autoplay: true,
    bottom: disabledBottom,
    easing: "easeOutElastic"
  })
};