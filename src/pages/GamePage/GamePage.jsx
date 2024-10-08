import React, { useEffect } from 'react';
import styles from './GamePage.module.css';
import { useState, useRef } from 'react';

import {
  hasEnoughBlocksToDeploy,
  areBlocksFree,
  doesFieldHaveShip,
  countOccurrences,
} from '../../helpers/helpers';

import { SHIPS } from '../../utils/DB';
import MyGameboard from '../../components/MyGameboard/MyGameboard';
import EnemyGameboard from '../../components/EnemyGameboard/EnemyGameboard';
import ShipsOptions from '../../components/ShipsOptions/ShipsOptions';
import io from 'socket.io-client';
import PlayersInfo from '../../components/PlayersInfo/PlayersInfo';
import Button from '../../components/Button/Button';

import { playerUsername } from '../LoginSignupPage/LoginSignupPage';

const socket = io('http://localhost:5000');

const GamePage = () => {
  const [roomName, setRoomName] = useState('');
  const [block, setBlock] = useState(false);
  const defaultMyBoard = Array.from({ length: 10 }, () => Array(10).fill(null)); //array of 10 items, every nested array has 10 items in it (10x10 board)
  const defaultEnemyBoard = Array.from({ length: 10 }, () =>
    Array(10).fill(null)
  );

  const [players, setPlayers] = useState(false);
  const [turn, setTurn] = useState();

  const [hasGameStarted, setHasGameStarted] = useState(false); //has game started or player is preparing his board; false => preparing
  const [myBoard, setMyBoard] = useState(defaultMyBoard); //field has null value => free
  const [enemyBoard, setEnemyBoard] = useState(defaultEnemyBoard);

  const [availableShips, setAvailableShips] = useState(SHIPS); //ships that renders in ShipsOption container
  const [isHorizontal, setIsHorizontal] = useState(true); //axis

  const [draggedShip, setDraggedShip] = useState(null); //currently dragged

  const [hitFields, setHitFields] = useState([]);
  const [hitShips, setHitShips] = useState([]);

  const [message, setMessage] = useState('');
  const [roomMessage, setRoomMessage] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    socket.on('room-full', () => {
      setRoomMessage('Ova soba je puna, ne mozete joj se pridruziti.');
    });

    socket.on('joined-room', () => {
      setJoinedRoom(true);
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('turn', (turn) => {
      setTurn(turn);
    });

    socket.on('ready-reply', (playersReady) => {
      for (let i = 0; i < 2; i++) {
        if (playersReady[i] == false) {
          setPlayers(false);
          return;
        }
      }
      setMessage('');
      setPlayers(true);
    });

    socket.on('not-ready', () => {
      setMessage('Prvo udjite u sobu i sačekajte da i drugi igrač uđe!');
    });

    socket.on('fire', (fieldId) => {
      let [_, fireRow, fireCol] = fieldId.split('_');
      fireRow = Number(fireRow);
      fireCol = Number(fireCol);
      socket.emit('fire-reply', myBoard[fireRow][fireCol], roomName);
      myBoard[fireRow][fireCol] = 'hit';
      const newBoard = [...myBoard];
      setMyBoard(newBoard);
      setTurn(!turn);
    });

    // socket.on('end',()=>{

    //   setMessage('Jedan od igraca je napustio igru. Igra je gotova.');
    //   setBlock(true);
    // })

    socket.on('victory', () => {
      setMessage('Nazalost, izgubili ste. Vise srece drugi put!');
      setBlock(true);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        setMessage('Jedan od igraca je napustio igru. Igra je gotova.');
      } else {
        setMessage('Problem sa serverom');
      }
      setBlock(true);
    });

    return () => {
      socket.off('connect');
      socket.off('turn');
      socket.off('ready-reply');
      socket.off('fire');
      socket.off('end');
    };
  }, [roomName]);

  const joinRoom = () => {
    socket.emit('join-room', roomName);
  };

  const waitForProbaUpdate = () => {
    return new Promise((resolve) => {
      socket.on('fire-reply', (hits) => {
        resolve(hits); // Resolving the promise with the hits value
      });
    });
  };

  useEffect(() => {
    if (availableShips.length == 0) {
      setHasGameStarted(true);
    }
  }, [availableShips]);

  //Drag and drop functionality =>
  const handleOnDrag = (e) => {
    if (block) {
      return;
    }
    setDraggedShip(e.target);
  };

  const handleDragOver = (e) => {
    if (block) {
      return;
    }
    e.preventDefault();
  };

  const handleOnDrop = (e) => {
    if (block) {
      return;
    }
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
    let [_, rowNum, columnNum] = startBlockId.split('_'); //cell_0_0
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

  //Click field functionality =>

  const handleFieldClick = async (e) => {
    if (block) {
      return; //kad se diskonektuje ne moze da radi nista
    }
    if (availableShips.length !== 0) {
      setMessage('Prvo postavite sve brodove!');
      return;
    }

    if (!players) {
      setMessage('Sacekajte protivnika');
      return;
    }

    if (!turn) {
      setMessage('Nije vas red');
      return;
    }

    const fieldId = e.target.id;
    if (hitFields.includes(fieldId)) {
      setMessage('Vec ste gadjali ovo polje. Probajte opet.');
      //fires again
      return;
    }

    setHitFields((h) => [...h, fieldId]);
    let [_, rowIndex, columnIndex] = fieldId.split('_');
    rowIndex = Number(rowIndex);
    columnIndex = Number(columnIndex);

    socket.emit('fire', fieldId, roomName);

    setTurn(!turn);

    let color = '';
    //console.log(proba)
    //doesFieldHaveShip(enemyBoard,rowIndex,columnIndex)
    const hits = await waitForProbaUpdate();

    if (hits !== null) {
      const shipId = hits;
      const ship = SHIPS.find((ship) => ship.id === shipId);
      const shipLength = ship ? ship.shipLength : 0;
      setHitShips((h) => [...h, shipId]);
      if (countOccurrences(hitShips, shipId) === shipLength - 1) {
        setMessage(`Bravo! Oborili ste ceo ${shipId} brod!`);

        //check if all ships are sinked
        if (hitShips.length === 16) {
          setMessage('POBEDILI STE');
          socket.emit('victory', roomName);
          setBlock(true);
        }
      } else {
        setMessage('Bravo! Pogodak u brod!');
      }

      color = 'green';
    } else {
      color = 'red';
      setMessage('Steta, promasaj.');
    }
    e.target.style.background = color;

    const newBoard = [...enemyBoard];
    setEnemyBoard(newBoard);
  };

  //<=

  return (
    <>
      <div className={styles.gameInfo}>
        <div className={joinedRoom ? styles.disappear : styles.roomEntry}>
          <h3>Unesite ime sobe: </h3>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          {roomMessage}
          <Button text={'Uđi u sobu'} fun={joinRoom} />
        </div>

        <div className={joinedRoom ? styles.game : styles.disappear}>
          <div className={styles.info}>
            <h3>{playerUsername}</h3>
            <PlayersInfo
              socket={socket}
              allShipsPlaced={hasGameStarted}
              roomName={roomName}
            />

            <p>
              <b>Message:</b> {message}
            </p>
            {!block ? (
              <p>
                <b>Turn:</b>{' '}
                <span id="turn-display">
                  {players
                    ? turn
                      ? 'Vi ste na redu'
                      : 'Protivnik je na redu'
                    : 'Pre nego sto gadjate, sacekajte  da svi igraci budu spremni'}
                </span>
              </p>
            ) : (
              ''
            )}
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
              {!hasGameStarted && (
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
                handleFieldClick={handleFieldClick}
              ></EnemyGameboard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
