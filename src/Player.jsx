import React from "react";
import {FaForward, FaBackward, FaPlay} from 'react-icons/fa';


const Player = (props) =>{
  return (
    <div>
    <button className="btn btn-info"><FaBackward/></button>
    <button className="btn btn-info"><FaPlay/></button>
    <button className="btn btn-info"><FaForward/></button>
    </div>
  )
}
export default Player