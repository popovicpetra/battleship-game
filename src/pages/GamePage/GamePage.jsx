import React from 'react'
import styles from './GamePage.module.css'
import { useState, useRef } from 'react'

import { hasEnoughBlocksToDeploy, areBlocksFree } from '../../helpers/helpers'

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
  const [draggedShip, setDraggedShip] = useState(null)

  const myBoardRef = useRef(null)

  const handleOnDrag = (e) => {
    setDraggedShip(e.target)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleOnDrop = (e) => {
    const startBlockId = e.target.id
    const ship = draggedShip.id
    let shipLength = availableShips.filter((ship) => {
      return ship.id != draggedShip.id
    }).length

    addShipToTheBoard(ship, shipLength, startBlockId)

    setAvailableShips(
      availableShips.filter((ship) => {
        return ship.id != draggedShip.id
      })
    )
  }

  const addShipToTheBoard = (ship, shipLength, startBlockId) => {
    let [_, rowNum, columnNum] = startBlockId.split('_') //cell_0_0
    rowNum = Number(rowNum)
    columnNum = Number(columnNum)
    const newBoard = [...myBoard]

    if (
      hasEnoughBlocksToDeploy(isHorizontal, shipLength, rowNum, columnNum) &&
      areBlocksFree(myBoard, isHorizontal, shipLength, rowNum, columnNum)
    ) {
      console.log(newBoard)
      console.log('yeye')
      for (let i = 0; i < shipLength; i++) {
        //console.log(rowNum)
        //console.log(columnNum)
        if (isHorizontal) {
          newBoard[rowNum][columnNum + i] = ship
        } else {
          newBoard[rowNum + i][columnNum] = ship
        }
      }
    } else {
      console.log('nene')
    }

    console.log(newBoard)
    setMyBoard(newBoard)
  }

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
          handleDragOver={handleDragOver}
          handleOnDrop={handleOnDrop}
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
        handleOnDrag={handleOnDrag}
      ></ShipsOptions>
    </>
  )
}

export default GamePage
