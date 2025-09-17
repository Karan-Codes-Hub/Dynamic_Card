import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ExampleCardView from './generateCardView/ExampleCardView'
import CardViewLandingPage from './components/CardViewLandingPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CardViewLandingPage />
      {/* <ExampleCardView />     */}
    </>
  )
}

export default App
