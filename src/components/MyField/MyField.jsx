import React from 'react';
import styles from './MyField.module.css';
import { SHIPS } from '../../utils/DB';

const MyField = ({ id, ship, handleDragOver, handleOnDrop }) => {
  let color = 'white';
  if (ship) color = SHIPS.find((obj) => obj.id === ship).color;

  const style = {
    backgroundColor: color || 'white',
  };
  return (
    <div
      id={id}
      style={style}
      className={styles.field}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
    ></div>
  );
};

export default MyField;
