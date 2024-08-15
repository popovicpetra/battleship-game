import React from 'react'

const Ship = ({ _, ship }) => {
  const style = {
    backgroundColor: ship.color || 'red',
    width: `${10 * ship.shipLength || 50}px`,
    height: '10px',
    margin: '3px',
    cursor: 'grab',
  }

  return <div style={style}></div>
}

export default Ship
