import './App.css';
import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';


// const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl/", {
//   transports: ['websocket']  // forces websockets only
// });
const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {path: '/flights'});
socket.on("connect", () => {
  console.log(socket.connected); // true
});

const planeIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Plane_icon.svg',
  //iconRetinaUrl: 'https://i.ya-webdesign.com/images/sample-png-image-download-3.png',
  iconAnchor: new L.Point(16, 16),
  popupAnchor: new L.Point(0, 0),
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(32, 32),
  className: 'leaflet-div-icon8',
  markerColor: 'transparent',
  
});

function App() {
  const [flights, setFlights] = useState([])
  const [positions, setPositions] = useState({})
  const [messages, setMessages] = useState([])
  const [send, setSend] = useState("")
  const [nick, setNick] = useState("")

  useEffect(() => {
    const listenerFlights = (flights) => {
      setFlights(flights);
      console.log(flights, "vuelos y largo:", flights.length)
      
    };
    
    const listenerChat = (pos) => {

      setMessages((prevState)=>{
        const p1 = [...prevState]
        p1.push(pos)
        return[...p1]
        
      })
      
      
      
    };


    const listenerPositions = (pos) => {
      // if (!(position[0] in Object.keys(positions))){
      //console.log(position)
      // const p1 = {...positions}
      // p1[pos.code] = pos.position
      // console.log("p1 es ", p1)
      // // setPositions({...p1});
      // setPositions(5);
      const updated = {}
      updated[pos.code] = pos.position
      // setPositions({...positions, ...updated})
      setPositions((prevState)=>{
        const p1 = {...prevState}
        p1[pos.code] = pos.position
        return{
          ...p1
        }
        
      })
      // console.log(updated)
 
      
      // console.log("positions es ",positions)
      
      
      
    };
    console.log("USE EFFECT")
    socket.on('FLIGHTS', listenerFlights);
    //socket.emit("FLIGHTS")
    socket.on('POSITION', listenerPositions);
    socket.on("CHAT", listenerChat)
 
    return () => {
      socket.off('FLIGHTS', listenerFlights);
      socket.off('POSITION', listenerPositions);
      console.log("SALIEDNO")
      socket.off("CHAT", listenerChat)
    };
 }, []);


  const position = [-34.82264, -58.533321]
  const handleSend = ()=>{
    console.log({"name": nick, "message": send})
    setSend("")
    socket.emit("CHAT", {"name": nick, "message": send})
  }
  const handleGetinfo = ()=>{
    socket.emit("FLIGHTS")
  }
  
  const colors = [{color: "blue", dashArray: "12"}, { color: 'lime' , dashArray: "20"}, { color: 'purple' ,dashArray: "18"}, { color: 'yellow' , dashArray: "13"}]
  return (
    <div className="App">
      <Grid container spacing={3}>
        <Grid item xs={8} style={{maxHeight: 400, overflow: 'auto'}}>
          <MapContainer center={position} zoom={3} scrollWheelZoom={true} style={{ height: '100vh', width: '100wh' }}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flights.map((el, index) => {
              //console.log(index%4, "INDICES")
              return <Polyline pathOptions={colors[index%4]} positions={[el.origin, el.destination]}>

              </Polyline>
            })}

            {Object.entries(positions).map((el)=>{
              return <Marker icon={planeIcon} position={el[1]}>
                      <Popup>
                        Avion {el[0]}.
                      </Popup>
                      <Tooltip>
                        Avion {el[0]}
                      </Tooltip>
                    </Marker>
            })}
            
          </MapContainer>
        </Grid>
        <Grid item xs={4}>

          <List style={{maxHeight: '400px', overflow: 'auto'}}>
            
            {messages.map((el)=>{
              return <ListItem>
              <ListItemText primary= {el.message} secondary={el.name+"@"+ new Date(el.date)}>

              </ListItemText>
            </ListItem>
            })}
          </List>
          <TextField id="standard-basic" value={nick} label="Nickname" onChange={(e)=>setNick(e.target.value)}/>

          <TextField id="standard-basic" value={send} label="Mensaje" onChange={(e)=>setSend(e.target.value)}/>
          <Button variant="contained" onClick={handleSend}>Enviar</Button>

        </Grid>
        <Button variant="contained" onClick={handleGetinfo}>Get Info</Button>

        <Grid item xs={8} style={{maxHeight: 400, overflow: 'auto', maxWidth:'50%'}}>
         {flights.map((el)=>{
           let pass = ""
           el.passengers.forEach((el2)=>{
             pass += el2.name
             pass += ", \n"
           })
          //  console.log("AOASo", el.passengers)
          //  for (const key in el.passengers) {
          //    //console.log("ASDASD")
          //    //console.log(key)
          //    pass += key.name
          //    pass += '\n'
          //  }
           return (
           <Paper style={{maxHeight: 200, overflow: 'auto'}}>
             <List>
              <ListItem>
              <ListItemText primary={"Nombre Avion: " + el.plane} />
              </ListItem>
              <ListItem>
              <ListItemText primary={"Aerolinea: " + el.airline} />
              </ListItem>
              <ListItem>
              <ListItemText primary={"Codigo: " + el.code} />
              </ListItem>
              <ListItem>
              <ListItemText primary={"Asientos: " + el.seats} />
              </ListItem>
              <ListItem>
              <ListItemText primary={"Origen: " + el.origin} />
              </ListItem>
              <ListItem>
              <ListItemText primary={"Destino: " + el.destination} />
              </ListItem>
              <ListItem>
              <ListItemText primary={"Pasajeros"} secondary={pass} />
              </ListItem>
             </List>
             </Paper>
             )
         })}
        </Grid>
        
      </Grid>
      
      {/* <p>{positions["INT470"][0]?positions["INT470"][0]:"asd"}</p> */}


    </div>
  );
}

export default App;
