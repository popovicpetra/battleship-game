import React, { useEffect } from 'react';
import styles from './GamePage.module.css';
import { useState, useRef} from 'react';

import { hasEnoughBlocksToDeploy, areBlocksFree, doesFieldHaveShip, countOccurrences } from '../../helpers/helpers';

import { SHIPS } from '../../utils/DB';
import MyGameboard from '../../components/MyGameboard/MyGameboard';
import EnemyGameboard from '../../components/EnemyGameboard/EnemyGameboard';
import ShipsOptions from '../../components/ShipsOptions/ShipsOptions';
import io from 'socket.io-client';
import PlayersInfo from '../../components/PlayersInfo/PlayersInfo';
import Button from '../../components/Button/Button'

const socket = io('http://localhost:5000'); 

const GamePage = () => {
  const [roomName, setRoomName] = useState('');
  const defaultMyBoard = Array.from({ length: 10 }, () => Array(10).fill(null)); //array of 10 items, every nested array has 10 items in it (10x10 board)
  const defaultEnemyBoard = Array.from({ length: 10 }, () =>
    Array(10).fill(null)
  );

  const [players,setPlayers]=useState(false)
  //const [hit,setHit]= useState(false)
  const [proba,setProba] = useState(null)
  const[turn,setTurn]=useState();

  const [hasGameStarted, setHasGameStarted] = useState(false); //has game started or player is preparing his board; false => preparing
  const [myBoard, setMyBoard] = useState(defaultMyBoard); //field has null value => free
  const [enemyBoard, setEnemyBoard] = useState(defaultEnemyBoard);

  const [availableShips, setAvailableShips] = useState(SHIPS); //ships that renders in ShipsOption container
  const [isHorizontal, setIsHorizontal] = useState(true); //axis

  const [draggedShip, setDraggedShip] = useState(null); //currently dragged

  const [hitFields, setHitFields] = useState([]);
  const [hitShips, setHitShips] = useState([]);
  const [sinkedShips, setSinkedShips] = useState([]);
  const [message, setMessage] = useState("");
 

  useEffect(()=>{
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('turn',turn=>{
      setTurn(turn);
    })

    socket.on('ready-reply',playersReady=>{
      for(let i=0;i<2;i++){
        if(playersReady[i]==false){
          setPlayers(false)
          return;
        }
      }
      setPlayers(true)
    })

    socket.on('fire',fieldId=>{
      let [_, fireRow,fireCol]= fieldId.split('_');
      fireRow = Number(fireRow);
      fireCol = Number(fireCol);
      if(doesFieldHaveShip(myBoard,fireRow,fireCol)){
        socket.emit('fire-reply', myBoard[fireRow][fireCol]);
      }else{
        socket.emit('fire-reply', myBoard[fireRow][fireCol]);
      }
      setTurn(!turn);
    })
    
  },[])
  
  const joinRoom = () => {
    socket.emit('join-room', roomName);
  };
  
  const waitForProbaUpdate = () => {
    return new Promise((resolve) => {
      socket.on('fire-reply', (hits) => {
        setProba(hits);
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

   //Click field functionality =>

    const handleFieldClick = async (e) => {
      if(availableShips.length!==0){
       setMessage("Prvo postavite sve brodove!");
       return;
     }
     
     if(!players){
       setMessage("Sacekajte protivnika")
       return;
     }

     if(!turn){
       setMessage('Nije vas red')
       return;
     }
     
     const fieldId = e.target.id;
     if(hitFields.includes(fieldId)){
       setMessage("Vec ste gadjali ovo polje. Probajte opet.")
       //fires again
       return
     }

     setHitFields(h=>[...h, fieldId]);
     let [, rowIndex, columnIndex] = fieldId.split('');
     rowIndex = Number(rowIndex);
     columnIndex = Number(columnIndex);
     
     socket.emit('fire', fieldId);
     setTurn(!turn);

     let color = "";
     //console.log(proba)
     //doesFieldHaveShip(enemyBoard,rowIndex,columnIndex)
     const hits = await waitForProbaUpdate();
     if(hits!== null){
       const shipId = hits;
       const ship = SHIPS.find(ship => ship.id === shipId);
       const shipLength = ship ? ship.shipLength : 0;
       setHitShips(h=>[...h,shipId]);
       console.log(countOccurrences(hitShips, shipId));
       console.log(hitShips);
       console.log(shipLength - 1);
       if (countOccurrences(hitShips, shipId) === shipLength - 1) {
         setMessage(`Bravo! Oborili ste ceo ${shipId} brod!`);

         //check if all ships are sinked
         if(hitShips.length===16){
           setMessage('POBEDILI STE');
           //sends message to other player
           //mozda promena u zeleno
           //prekid igrice
         }

       }
       else{
       setMessage("Bravo! Pogodak u brod!");
       }

       color="green";
     }
     else{
       color = "red";
       setMessage("Steta, promasaj.");
     }
    e.target.style.background = color;

  
     
    const newBoard = [...enemyBoard];
    setEnemyBoard(newBoard); 
   };

//<=

  return (
    <>
      <div className="game-info">
        <p>Unesite ime sobe: </p> <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <Button  text={"Uđi u sobu"} fun={joinRoom}/>
        <p>
          Turn: <span id="turn-display">{players ? (turn ? "Vi ste na redu" : "Protivnik je na redu") : "Pre nego sto gadjate, sacekajte  da svi igraci budu spremni"}</span>
        </p>
        <p>
          Info: <span id="info"></span>
        </p>
        <p>
          Message: {message}
        </p>
        <PlayersInfo socket={socket} allShipsPlaced={hasGameStarted} />  
        
     
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
          
    </>
  );
};

export default GamePage;
