import { ReactNode } from "react"
import styles from "../styles/NavItem.module.scss"
import anime from "animejs"

type Props = {
  children: ReactNode,
  hoverClass: string,
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

const NavItem = (props: Props) => {
  const children = props.children
  const CustomSVG = props.svg
  
  return (
  <div className={styles.navItem + " " + props.hoverClass}>
    <CustomSVG className={`${styles.svg} svg-inline--fa fa-w-16`}/>
    {children}
  </div>
)}

export default NavItem