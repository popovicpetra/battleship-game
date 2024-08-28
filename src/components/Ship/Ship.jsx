import React from 'react';

const Ship = ({ _, ship, handleOnDrag }) => {
  const style = {
    backgroundColor: ship.color || 'red',
    width: `${20 * ship.shipLength || 50}px`,
    height: '20px',
    margin: '3px',
    cursor: 'grab',
    border: '1px outset ' + ship.color,
  };

  return (
    <div
      style={style}
      id={ship.id}
      draggable
      onDragStart={(e) => handleOnDrag(e)}
    ></div>
  );
};

export default Ship;
