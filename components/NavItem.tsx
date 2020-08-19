import React, { Component, ReactNode, RefObject } from 'react';
import styles from "../styles/NavItem.module.scss";
import { SingleText } from './SingleText';

type svgType = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

type Props = {
  children ?: ReactNode;
  hoverClass: string;
  svg: svgType;
};

export default class NavItem extends Component<Props> {
  private customSVG: svgType;
  private hoverClass: string;
  private singleTextRef: RefObject<SingleText>;
  private singleText: SingleText;

  constructor(props: Props) {
    super(props);

    this.customSVG = props.svg;
    this.hoverClass = props.hoverClass;
    this.singleTextRef = React.createRef<SingleText>();
  }

  componentDidMount() {
    if(this.singleTextRef.current === null) return;
    this.singleText = this.singleTextRef.current;
  }

  render() {
    return (
      <div
        className={styles.navItem + " " + this.hoverClass}
        onMouseEnter={() => { this.singleText.animateIn() }}
        onMouseLeave={() => { 
          this.singleText.animateOut() }}
      >
        <this.customSVG className={`${styles.svg} svg-inline--fa fa-w-16`} />
        <SingleText
          text="Moderation"
          ref={this.singleTextRef}
          animClass={styles.moderationAnim}/*
          className={styles.singleText}
          emitter={emitter}*/
        />
        {this.props.children}
      </div>
    );
  }
}