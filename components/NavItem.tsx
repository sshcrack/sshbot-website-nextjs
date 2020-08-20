import React, { Component, ReactNode, RefObject } from 'react';
import styles from "../styles/NavItem.module.scss";
import { AnimatedText } from './AnimatedText';
import Link from 'next/link';

type svgType = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

type Props = {
  children?: ReactNode;
  hoverClass: string;
  svg: svgType;
  text: string;
  href: string;
};

export default class NavItem extends Component<Props> {
  private customSVG: svgType;
  private hoverClass: string;
  private text: string;
  private href: string;
  private singleTextRef: RefObject<AnimatedText>;
  private singleText: AnimatedText;

  constructor(props: Props) {
    super(props);

    this.customSVG = props.svg;
    this.text = props.text;
    this.href = props.href;
    this.hoverClass = props.hoverClass;
    this.singleTextRef = React.createRef<AnimatedText>();
  }

  componentDidMount() {
    if (this.singleTextRef.current === null) return;
    this.singleText = this.singleTextRef.current;
  }

  render() {
    return (
      <Link href={this.href}>
        <a>
          <div
            className={styles.navItem + " " + this.hoverClass}
            onMouseEnter={() => { this.singleText.animateIn() }}
            onMouseLeave={() => {
              this.singleText.animateOut()
            }}
          >
            <div className={styles.svg}>
              <this.customSVG className={`svg-inline--fa fa-w-16`} />
            </div>
            <AnimatedText
              text={this.text}
              ref={this.singleTextRef}
              animClass={this.hoverClass + "::before"}
            />
            {this.props.children}
          </div>
        </a>
      </Link>
    );
  }
}