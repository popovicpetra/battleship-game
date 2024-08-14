import React from 'react'
import styles from './MyGameboard.module.css'
import { useState } from 'react'

import MyField from '../MyField/MyField'

const MyGameboard = (props) => {
  const [currentlyPlacing, setCurrentlyPlacing] = useState('ce vidimo')

  return (
    <div className={styles.board}>
      {props.myBoard.map((row, columnIndex) => {
        return row.map((_, rowIndex) => (
          <MyField key={`cell_${rowIndex}_${columnIndex}`}></MyField>
        ))
      })}
    </div>
  )
}

export default MyGameboard
