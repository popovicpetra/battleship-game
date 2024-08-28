import React from 'react';
import styles from './EnemyField.module.css';



const EnemyField = ({ id, onClick }) => {
  return <div 
    className = {styles.field} 
    id={id}
    onClick={onClick}>
  </div>;
};

export default EnemyField;

