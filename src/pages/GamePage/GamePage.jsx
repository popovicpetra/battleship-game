import React from 'react'
import styles from './GamePage.module.css'
import { useState, useRef } from 'react'

import { SHIPS } from '../../utils/DB'
import MyGameboard from '../../components/MyGameboard/MyGameboard'
import EnemyGameboard from '../../components/EnemyGameboard/EnemyGameboard'
import ShipsOptions from '../../components/ShipsOptions/ShipsOptions'

const GamePage = () => {
  const defaultMyBoard = Array(10).fill(Array(10).fill(null)) //array of 10 items, every nested array has 10 items in it (10x10 board)
  const defaultEnemyBoard = Array(10).fill(Array(10).fill(null))

  const [hasGameStarted, setHasGameStarted] = useState(false) //has game started or player is preparing his board; false => preparing
  const [myBoard, setMyBoard] = useState(defaultMyBoard)
  const [enemyBoard, setEnemyBoard] = useState(defaultEnemyBoard)

  const [availableShips, setAvailableShips] = useState(SHIPS)
  let isHorizontal = true

  const myBoardRef = useRef(null)

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

      <div className={styles.boardsContainer}>
        <MyGameboard
          ref={myBoardRef}
          myBoard={myBoard}
          setMyBoard={setMyBoard}
          hasGameStarted={hasGameStarted}
        ></MyGameboard>
        <EnemyGameboard
          enemyBoard={enemyBoard}
          hasGameStarted={hasGameStarted}
        ></EnemyGameboard>
      </div>
      <ShipsOptions
        isHorizontal={isHorizontal}
        availableShips={availableShips}
      ></ShipsOptions>
      <button
        onClick={() => {
          console.log(defaultMyBoard.type)
        }}
      >
        leeej
      </button>
    </>
  )
}

export default GamePage
