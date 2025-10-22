import React from 'react';

import styles from "./container.module.css"

interface ContainerProps {
  isElement:boolean;
  children: React.ReactNode;
  
}


const Container: React.FC<ContainerProps> = ({children, isElement}) => {
  return (
    <div className={isElement ? styles.container : styles.containerElement}>
     {children}
    </div>
  );
};

export default Container;