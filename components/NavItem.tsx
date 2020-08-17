import { ReactNode } from "react";

type Props = {
  children: ReactNode
}

const NavItem = ({children }: Props) => (
  <div>
    {children}
  </div>
)

export default NavItem;