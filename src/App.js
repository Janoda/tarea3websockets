import './App.css';
import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

// const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl/", {
//   transports: ['websocket']  // forces websockets only
// });
const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {path: '/flights'});
socket.on("connect", () => {
  console.log(socket.connected); // true
});

function App() {
  const [flights, setFlights] = useState([])
  const [positions, setPositions] = useState([])

  useEffect(() => {
    const listenerFlights = (flights) => {
      setFlights(flights);
      console.log(flights, "vuelos y largo:", flights.length)
      
    };
    console.log("USE EFFECT")
    socket.on('FLIGHTS', listenerFlights);
 
    return () => {
      socket.off('FLIGHTS', listenerFlights);
      console.log("SALIEDNO")
    };
 }, []);


  // socket.on("POSITION", (...args) => {
  //   console.log(args[0], "POSITION")
  // });
  // socket.on("FLIGHTS", (...args) => {
  //   console.log(args)
  //   setFlights([1,2,4,5])
  //   console.log(flights, "vuelos y largo: ", flights.length)
    
  // });
  // socket.on("CHAT", (...args) => {
  //   console.log('CHAT')
  // });
  console.log(flights.length)
  if (flights.length === 0){
    console.log("ENTRE")
    socket.emit("FLIGHTS")
    
  }
  const position = [51.505, -0.09]
  
  const colors = [{color: "blue", dashArray: "12"}, { color: 'lime' , dashArray: "20"}, { color: 'purple' ,dashArray: "18"}, { color: 'yellow' , dashArray: "13"}]
  return (
    <div className="App">
      <MapContainer center={position} zoom={2} scrollWheelZoom={false} style={{ height: '100vh', width: '100wh' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {flights.map((el, index) => {
          console.log(index%4, "INDICES")
          return <Polyline pathOptions={colors[index%4]} positions={[el.origin, el.destination]}>

          </Polyline>
        })}


        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>

    </div>
  );
}

export default App;
