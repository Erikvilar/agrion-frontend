import {type ReactNode } from "react";
import styles from './styles.module.css';
import { useIsMobile } from "../../hooks/useIsMobile";

interface AdapativeInterface{
    children: ReactNode;
}

const Adaptive = ({ children }:AdapativeInterface) => {
 const isMobile = useIsMobile();
  return (
    <div className={isMobile ? styles.safeMobile : styles.safeDesktop}>
      {children}
    </div>
  );
};

export default Adaptive;