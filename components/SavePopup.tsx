import styles from "../styles/savePopup.module.scss";

export const SavePopup = (_props: { onSave: () => void, onCancel: () => void }) => (
  <div className={styles.savePopup}>
    <span>You have unsaved changes</span>
    <button className={styles.saveButton}>Save Changes</button>
  </div>
);

