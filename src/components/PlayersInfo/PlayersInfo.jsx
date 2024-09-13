import React from 'react';
import { useState, useEffect } from 'react';
import styles from './PlayersInfo.module.css';
import Button from '../Button/Button';

const PlayersInfo = ({ socket, allShipsPlaced, roomName }) => {
  const [connections, setConnections] = useState([false, false]);
  const [playersReady, setPlayersReady] = useState([false, false]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('check-players-reply', (conn) => {
      setConnections(conn);
      console.log(connections[0] + ' ' + connections[1]);
    });

    socket.on('ready-reply', (players) => {
      setPlayersReady(players);
      console.log(players);
    });

    return () => {
      socket.off('check-players-reply');
      socket.off('ready-reply');
    };
  }, [roomName]);

  const ready = () => {
    if (!allShipsPlaced) {
      setMessage('Niste postavili sve brodove');
      return;
    }
    setMessage('');
    socket.emit('ready', roomName);
  };

  return playersReady[0] == true && playersReady[1] == true ? (
    <div className={styles.begin}>
      <h3>Igra je pocela!</h3>
    </div>
  ) : (
    <div className={styles.container}>
      <p>
        Sacekaj da i protivnik udje u igru, a zatim postavi svoje brodove i neka
        igra pocne!
      </p>
      <div className={styles.players}>
        <div>
          <p>
            Igrač 1{' '}
            <span
              className={connections[0] ? styles.conn : styles.notConn}
            ></span>
          </p>
          <p>
            Spreman{' '}
            <span
              className={playersReady[0] ? styles.conn : styles.notConn}
            ></span>{' '}
          </p>
        </div>
        <div>
          <p>
            Igrač 2{' '}
            <span
              className={connections[1] ? styles.conn : styles.notConn}
            ></span>
          </p>
          <p>
            Spreman{' '}
            <span
              className={playersReady[1] ? styles.conn : styles.notConn}
            ></span>{' '}
          </p>
        </div>
      </div>
      <Button text={'Spreman!'} fun={ready}></Button>
      <p>{message}</p>
    </div>
  );
};

export default PlayersInfo;
