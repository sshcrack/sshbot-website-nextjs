import { MouseEvent } from 'react';
import styles from "../styles/mode.module.scss";
import Question from "../assets/svg/question.svg"

export const HelpSVG = (props: { onClick: (event: MouseEvent<HTMLElement>) => void }) => (
  <div className={styles.help} onClick={props.onClick}>
    <Question />
  </div>
)