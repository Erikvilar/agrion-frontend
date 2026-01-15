

import styles from "./container.module.css"
// @ts-ignore
import React from "react";

interface ContainerProps {
  isElement:boolean;
  children: React.ReactNode;
  
}


const Container =  ({children, isElement}:ContainerProps) => {
  return (
    <div className={isElement ? styles.container : styles.containerElement}>
     {children}
    </div>
  );
};

export default Container;