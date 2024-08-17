import React from 'react';
import styles from './EnemyGameboard.module.css';

import EnemyField from '../EnemyField/EnemyField';

const EnemyGameboard = (props) => {
  return (
    <div className={styles.board}>
      {props.enemyBoard.map((row, rowIndex) => {
        return row.map((_, columnIndex) => (
          <EnemyField
            key={`cell_${rowIndex}_${columnIndex}`}
            id={`cell_${rowIndex}_${columnIndex}`}
          ></EnemyField>
        ));
      })}
    </div>
  );
};

export default EnemyGameboard;
