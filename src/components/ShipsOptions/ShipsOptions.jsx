import React from 'react';
import styles from './ShipsOptions.module.css';
import { useState, useRef } from 'react';

import Ship from '../Ship/Ship';
import Button from '../Button/Button';

const ShipsOptions = ({
  isHorizontal,
  setIsHorizontal,
  availableShips,
  handleOnDrag,
}) => {
  const [angle, setAngle] = useState(0);
  const shipsRef = useRef(null);

  const flipShips = () => {
    const optionShips = Array.from(shipsRef.current.children);

    const nextAngle = angle === 0 ? 90 : 0;
    setAngle(nextAngle);
    setIsHorizontal(!isHorizontal);

    optionShips.forEach(
      (optionShip) => (optionShip.style.transform = `rotate(${nextAngle}deg)`)
    );
  };

  return (
    <div className={styles.containerForOptions}>
      <div className={styles.shipsOptions} ref={shipsRef}>
        {availableShips.map((ship) => (
          <Ship
            key={ship.id}
            id={ship.id}
            ship={ship}
            handleOnDrag={handleOnDrag}
          ></Ship>
        ))}
      </div>
      <Button text={'FLIP'} fun={flipShips}></Button>
    </div>
  );
};

export default ShipsOptions;
