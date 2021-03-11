import { Component, ReactNode } from 'react'
import styles from "../styles/dropdownMenu.module.scss"

class DropdownMenu extends Component<Props, {enabled: boolean}> {
  private children: ReactNode;

  constructor(props: Props) {
    super(props)
    this.children = props.children;
    this.state = {
      enabled: false
    };
  }

  render() {
    const enabledClass = this.state.enabled ? styles.enabled : styles.disabled;
    const ulClass = `${styles.menu} ${enabledClass}`;

    return <ul className={ulClass}>
      {this.children}
    </ul>
  }

  public toggleEnabled() {
    this.setState({ enabled: !this.state.enabled });
  }
}

const DropdownItem = ({ children }: ItemProps) => (
  <li className={styles.item}>
    {children}
  </li>
)

interface Props {
  children: ReactNode
}

interface ItemProps {
  children: ReactNode
}

export { DropdownMenu, DropdownItem }