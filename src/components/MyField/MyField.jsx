import React from 'react';
import { SHIPS } from '../../utils/DB';

const MyField = ({ id, ship, handleDragOver, handleOnDrop }) => {
  let color = 'white';
  let border = '0.1px solid black';
  if (ship) {
    color = SHIPS.find((obj) => obj.id === ship).color;
    border = '0.1px outset ' + color;
  }
  const style = {
    backgroundColor: color || 'white',
    border: border,
  };
  return (
    <div
      id={id}
      style={style}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
    ></div>
  );
};

export default MyField;
