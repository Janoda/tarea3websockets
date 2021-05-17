import logo from './logo.svg';
import './App.css';

import io from "socket.io-client";

// const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl/", {
//   transports: ['websocket']  // forces websockets only
// });

const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {path: '/flights'});

socket.on("connect", () => {
  console.log(socket.connected); // true
});

// socket.on("POSITION", (...args) => {
//   console.log(args[0], "POSITION")
// });
socket.on("FLIGHTS", (...args) => {
  console.log(args)
});
socket.on("CHAT", (...args) => {
  console.log('CHAT')
});
socket.emit("FLIGHTS")

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
