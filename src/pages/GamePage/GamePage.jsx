import React, { useEffect } from 'react';
import styles from './GamePage.module.css';
import { useState, useRef } from 'react';

import { hasEnoughBlocksToDeploy, areBlocksFree } from '../../helpers/helpers';

import { SHIPS } from '../../utils/DB';
import MyGameboard from '../../components/MyGameboard/MyGameboard';
import EnemyGameboard from '../../components/EnemyGameboard/EnemyGameboard';
import ShipsOptions from '../../components/ShipsOptions/ShipsOptions';

const GamePage = () => {
  const defaultMyBoard = Array.from({ length: 10 }, () => Array(10).fill(null)); //array of 10 items, every nested array has 10 items in it (10x10 board)
  const defaultEnemyBoard = Array.from({ length: 10 }, () =>
    Array(10).fill(null)
  );

  const [hasGameStarted, setHasGameStarted] = useState(false); //has game started or player is preparing his board; false => preparing
  const [myBoard, setMyBoard] = useState(defaultMyBoard); //field has null value => free
  const [enemyBoard, setEnemyBoard] = useState(defaultEnemyBoard);

  const [availableShips, setAvailableShips] = useState(SHIPS); //ships that renders in ShipsOption container
  const [isHorizontal, setIsHorizontal] = useState(true); //axis

  const [draggedShip, setDraggedShip] = useState(null); //currently dragged

  useEffect(() => {
    if (availableShips.length == 0) setHasGameStarted(true);
  }, [availableShips]);

  //Drag and drop functionality =>
  const handleOnDrag = (e) => {
    setDraggedShip(e.target);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleOnDrop = (e) => {
    const startBlockId = e.target.id;
    const ship = draggedShip.id;
    let shipLength = availableShips.find((ship) => {
      return ship.id === draggedShip.id;
    }).shipLength;

    console.log(myBoard);
    if (addShipToTheBoard(ship, shipLength, startBlockId))
      setAvailableShips(
        availableShips.filter((ship) => {
          return ship.id != draggedShip.id;
        })
      );
    else console.log('The ship is not deployed');
  };

  const addShipToTheBoard = (ship, shipLength, startBlockId) => {
    let [_, rowNum, columnNum] = startBlockId.split('_');
    rowNum = Number(rowNum);
    columnNum = Number(columnNum);
    const newBoard = [...myBoard];

    if (
      //functions from helpers.js
      hasEnoughBlocksToDeploy(isHorizontal, shipLength, rowNum, columnNum) &&
      areBlocksFree(myBoard, isHorizontal, shipLength, rowNum, columnNum)
    ) {
      for (let i = 0; i < shipLength; i++) {
        if (isHorizontal) {
          newBoard[rowNum][columnNum + i] = ship;
        } else {
          newBoard[rowNum + i][columnNum] = ship;
        }
      }
    } else {
      return false;
    }

    setMyBoard(newBoard);
    return true;
  };
  //<=

  return (
    <>
      <div className="game-info">
        <p>
          Turn: <span id="turn-display"></span>
        </p>
        <p>
          Info: <span id="info"></span>
        </p>
      </div>

      <div className={styles.allBoardsContainer}>
        <div className={styles.boardContainer}>
          <MyGameboard
            handleDragOver={handleDragOver}
            handleOnDrop={handleOnDrop}
            myBoard={myBoard}
            setMyBoard={setMyBoard}
            hasGameStarted={hasGameStarted}
          ></MyGameboard>
          {hasGameStarted || (
            <ShipsOptions
              isHorizontal={isHorizontal}
              setIsHorizontal={setIsHorizontal}
              availableShips={availableShips}
              handleOnDrag={handleOnDrag}
            ></ShipsOptions>
          )}
        </div>
        <div className={styles.boardContainer}>
          <EnemyGameboard
            enemyBoard={enemyBoard}
            hasGameStarted={hasGameStarted}
          ></EnemyGameboard>
        </div>
      </div>
    </>
  );
};

export default GamePage;
