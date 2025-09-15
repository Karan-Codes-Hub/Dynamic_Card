import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ExampleCardView from './generateCardView/ExampleCardView'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ExampleCardView />    
    </>
  )
}

export default App
