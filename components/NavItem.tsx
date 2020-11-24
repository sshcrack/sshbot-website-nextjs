import React, { Component, ReactNode, RefObject } from 'react';
import styles from "../styles/NavItem.module.scss";
import { AnimatedText } from './AnimatedText';
import Link from 'next/link';

export type svgType = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

type Props = {
  children?: ReactNode;
  hoverClass: string;
  svg: svgType;
  text: string;
  href ?: string;
  onClick ?: ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void)
};

export default class NavItem extends Component<Props> {
  private customSVG: svgType;
  private hoverClass: string;
  private text: string;
  private href: string;
  private singleTextRef: RefObject<AnimatedText>;
  private singleText: AnimatedText;
  private onClick: ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | undefined;

  constructor(props: Props) {
    super(props);

    this.customSVG = props.svg;
    this.text = props.text;
    this.href = props.href === undefined ? "#" : props.href;
    this.hoverClass = props.hoverClass;
    this.onClick = props.onClick;
    this.singleTextRef = React.createRef<AnimatedText>();
  }

  componentDidMount() {
    if (this.singleTextRef.current === null) return;
    this.singleText = this.singleTextRef.current;
  }

  render() {
    return (
      <Link href={this.href}>
        <a onClick={this.onClick}>
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