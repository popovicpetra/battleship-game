import React from 'react';
import styles from './Ship.module.css';

const Ship = ({ _, ship, handleOnDrag }) => {
  let shipId = ship.id;

  const style = {
    backgroundColor: ship.color || 'red',
    //width: `${40 * ship.shipLength || 50}px`,
    //height: '40px',
    margin: '3px',
    cursor: 'grab',
    border: '1px outset ' + ship.color,
  };
  //
  return (
    <div
      style={style}
      id={ship.id}
      draggable
      onDragStart={(e) => handleOnDrag(e)}
      className={`${styles.ship} ${styles[shipId]}`}
    ></div>
  );
};

export default Ship;
