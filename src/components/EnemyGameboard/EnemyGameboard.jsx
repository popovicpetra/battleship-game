import React from 'react'
import styles from './EnemyGameboard.module.css'

import EnemyField from '../EnemyField/EnemyField'

const EnemyGameboard = (props) => {
  return (
    <div className={styles.board}>
      {props.enemyBoard.map((row, columnIndex) => {
        return row.map((_, rowIndex) => (
          <EnemyField key={`cell_${rowIndex}_${columnIndex}`}></EnemyField>
        ))
      })}
    </div>
  )
}

export default EnemyGameboard
