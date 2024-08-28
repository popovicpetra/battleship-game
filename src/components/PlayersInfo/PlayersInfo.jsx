import React from 'react'
import { useState, useEffect } from 'react';
import styles from './PlayersInfo.module.css'
import Button from '../Button/Button';


const PlayersInfo = ({socket, allShipsPlaced}) =>{
  
  const [connections,setConnections]=useState([false,false])
  const [playersReady,setPlayersReady]= useState([false,false])
  const [message,setMessage]= useState("")
  
  useEffect(()=>{

    socket.emit('check-players')
    socket.on('check-players-reply', (conn)=>{

      setConnections(conn);
      console.log(connections[0] + ' ' + connections[1])
      console.log(conn)
      
    })

    socket.on('ready-reply', players =>{
      setPlayersReady(players)
      console.log(players);
    })
    

    return ()=>{
      socket.off('check-players-reply')
      socket.off('ready-reply')
    }
  },[])
    
  const ready = ()=>{

    if(!allShipsPlaced){
      setMessage("Niste postavili sve brodove");
      return;
    }
    setMessage("");
    socket.emit('ready')
  }

  
  return(
  <>
    <div className={styles.container}>
      <div>
        <p>Igrač 1 <span className={connections[0] ? styles.conn:styles.notConn}></span></p>
        <p>Spreman <span className={playersReady[0]? styles.conn:styles.notConn}></span> </p>
      
      </div>
      <div>
        <p>Igrač 2 <span className={connections[1]?styles.conn:styles.notConn}></span></p>
        <p>Spreman <span className={playersReady[1]? styles.conn:styles.notConn}></span> </p>
      </div>
    </div>
    <Button text={'Spreman!'} fun={ready}></Button>
    <p>{message}</p>
  </>

)};

export default PlayersInfo;