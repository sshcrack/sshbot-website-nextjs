import styles from "styles/TharButton.module.scss"
import styled from "styled-components";
import { MouseEventHandler, ReactNode } from 'react';

export const TharButton = ({ color, anim, width, height, className: additionalClass, children, onClick }: Props) => {
  const StyledButton = styled.div`
  --color: ${color};
  --anim: ${anim};
  height: ${height};
  width: ${width};
  `


  return <StyledButton className={additionalClass ? `${styles.button} ${additionalClass}` : styles.button} onClick={onClick}>
      {children}
  </StyledButton>
}

interface Props {
  color?: string,
  anim?: string,
  width?: string,
  height?: string,
  className?: string,
  children?: ReactNode,
  onClick?: MouseEventHandler
}