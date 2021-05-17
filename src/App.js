import logo from './logo.svg';
import './App.css';

import io from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

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
const position = [51.505, -0.09]
function App() {
  return (
    <div className="App">
      <Map center={position} zoom={2} scrollWheelZoom={false} style={{ height: '100vh', width: '100wh' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>

    </div>
  );
}

export default App;
