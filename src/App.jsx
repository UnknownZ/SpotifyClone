import { useState } from 'react'
import './App.css'
import MusicList from './MusicList'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <MusicList/>
      </div>
    </>
  )
}

export default App
