import React, { Component, DetailedReactHTMLElement, HTMLAttributes, ReactHTML, RefObject } from 'react';
import styles from "../styles/animatedText.module.scss";
import { getStyle, getAnimation } from 'utils/tools';

interface Props {
  text: string,
  animClass: string,
  type ?: keyof ReactHTML
}

type ReactType = DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>

export class AnimatedText extends Component<Props> {
  private text: string;
  private type: keyof ReactHTML;
  private animClass: string;
  private mainRef: RefObject<HTMLDivElement>;
  private mainDiv: HTMLDivElement;
  private normalClass = styles.normalClass;

  constructor(props: Props) {
    super(props)

    this.mainRef = React.createRef<HTMLDivElement>();

    this.type = props.type === undefined ? "span" : props.type;
    this.text = props.text;
    this.animClass = props.animClass;
  }

  componentDidMount() {
    if(this.mainRef.current === null) return;

    this.mainDiv = this.mainRef.current;
  }

  render() {
    let characters = this.text.split("");

    let divs: ReactType[] = [];

    divs = characters.map((character, index) => {
      let element = React.createElement(this.type, { key: index }, character);

      return element;
    })

    return (
      <div className={styles.rootDiv}>
        <div className={styles.singleText} ref={this.mainRef}>
          {divs}
        </div>
      </div>
    )
  }

  public animateIn() {
    let rules = getStyle(`.${this.animClass}`, this.mainDiv);
    if(rules === undefined) return;

    let animation = getAnimation(this.mainDiv, rules);
    animation.play();
  }

  public animateOut() {
    let rules = getStyle(`.${this.normalClass}`, this.mainDiv);
    if(rules === undefined) return;

    let animation = getAnimation(this.mainDiv, rules);
    animation.play();
  }
}