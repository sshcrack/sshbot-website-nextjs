import styles from "../styles/savePopup.module.scss";
import anime from "animejs";
import { useEffect, useState } from 'react';

export const SavePopup = (_props: { onSave: () => void }) => {
  const [didLoad, setDidLoad] = useState<boolean>(false);
  useEffect(() => {
    if (!didLoad) {
      handleLoad();
      setDidLoad(true);
    }
  })

  return <>
    <div className={styles.savePopup}>
      <span>You have unsaved changes</span>
      <button className={styles.saveButton} onClick={() => _props.onSave()}>Save Changes</button>
    </div>
  </>
};

function handleLoad() {
  anime({
    targets: `div.${styles.savePopup}`,
    autoplay: true,
    bottom: "2rem",
    easing: "easeOutElastic"
  })
};