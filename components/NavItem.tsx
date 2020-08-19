import { ReactNode, MouseEvent } from "react"
import styles from "../styles/NavItem.module.scss"

type Props = {
  children: ReactNode,
  hoverClass: string,
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  onMouseEnter ?: ((event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void),
  onMouseLeave ?: ((event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void)
}

const NavItem = (props: Props) => {
  const children = props.children
  const CustomSVG = props.svg
  
  return (
  <div className={styles.navItem + " " + props.hoverClass} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
    <CustomSVG className={`${styles.svg} svg-inline--fa fa-w-16`}/>
    {children}
  </div>
)}

export default NavItem