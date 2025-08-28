import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [value, setValue] = useState("")

  const handleChange = (event) =>{
    setValue(event.target.value)
  }
  return (
    <div className='chat-container'>
      <div className='message-container'>
        <p>AQUI AS MENSAGENS SERAO EXIBIDAS</p>
      </div>
      <div className="input-box">
        <input type="text" id="user-input" value={value} onChange={handleChange} placeholder='Digite sua dúvida aqui...'></input>
      </div>
    </div>
  )
}

export default App
