const express = require('express')
const path = require('path')
const http = require('http')
const PORT = 8000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const session = require("express-session")
const fs = require("fs")
const bcrypt = require("bcrypt")
const onlineUser = []

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 }
});
app.use(chatSession);

io.use((socket, next) => {
  chatSession(socket.request, {}, next);
});

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}
//handle /signin

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
  // Get the JSON data from the body
  const { username, password } = req.body;
  var user = null ;

  //
  // D. Reading the users.json file
  //
  const jsonData = fs.readFileSync("data/users.json");
  const users = JSON.parse(jsonData);
  //
  // E. Checking for username/password
  //
  if(username in users){
      user = users[username];
      // check password
      if(!bcrypt.compareSync(password, user.password)){
          res.json({status: "error", error: "Incorrect password."});
          return;
      }
  }
  else{
      res.json({status: "error",
          error:"This username has not been registered."});
      return;
  }
  //
  // G. Sending a success response with the user account
  //
  // put the user account into the current session
  req.session.user = {username, name: user.name};
  // return success with user object
  if(req.session.user){ // if it exist
    console.log(req.session.user.username)
    const {username, name} = req.session.user; //socket.request.session.user is current session
    // onlineUser[username] = {name}; // use username as key
    onlineUser.push(req.session.user.username)
    console.log("onlineUser log: ", onlineUser);

    // Broadcast the signed-in player
    io.emit("add player", onlineUser);
    
  }
  res.json({status: "success", user:{username, name: user.name}});
});

//handle /register
app.post("/register", (req, res) => {
  // Get the JSON data from the body
  const { username, name, password } = req.body;

  //
  // D. Reading the users.json file
  //
  const jsonData = fs.readFileSync("data/users.json");
  const users = JSON.parse(jsonData);
  //
  // E. Checking for the user data correctness
  //
  // Debug: Username, name, avatar, pw not empty
  if(!username|| !name || !password){
      res.json({status: "error",
                error:"Username/avatar/name/password cannot be empty."});
      return;
  }

  // Debug: username contains only underscore, letters or numbers
  if(!containWordCharsOnly(username)){
      res.json({status: "error",
                error:"Username must contains only underscore, letters or numbers."});
      return;
  }
  // Debug: username does not exist in current list of users
  //
  if (username in users){
      res.json({status: "error",
                error:"This username has already registered."});
      return;
  }
  //
  // G. Adding the new user account, update
  //
  const hash = bcrypt.hashSync(password, 10);
  // add new user with information into user list
  users[username]= {name, password: hash};
  //
  // H. Saving the users.json file
  //
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, " "));
  //
  // I. Sending a success response to the browser
  //
  res.json({status: "success"});
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
    console.log("got server /validate");

    //
    // B. Getting req.session.user
    //
    if(!req.session.user){
        res.json({status:"error", error: "You have not signed in."});
        return;
    }
    //
    // D. Sending a success response with the user account
    //
    res.json({status: "success", user:req.session.user});
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle a socket connection request from web client
const connections = [null, null]

io.on('connection', socket => {
  // console.log('New WS Connection')
  //console.log(socket.request.session.user)
  // Find an available player number
  let playerIndex = -1;
  for (const i in connections) {
    if (connections[i] === null) {
      playerIndex = i
      break
    }
  }

  // Tell the connecting client what player number they are
  socket.emit('player-number', playerIndex)

  console.log(`Player ${playerIndex} has connected`)

  // Ignore player 3
  if (playerIndex === -1) return
  
  // // should be success connection of player 1 or 2
  if(socket.request.session.user){ // if it exist
    const {username, name} = socket.request.session.user; //socket.request.session.user is current session
    onlineUser[username] = {name}; // use username as key
    console.log(onlineUser);

    // Broadcast the signed-in player
    socket.broadcast.emit("add player", onlineUser);
  }

  connections[playerIndex] = false

  // Tell eveyone what player number just connected
  socket.broadcast.emit('player-connection', playerIndex)

  // Handle Diconnect
  
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null
    // console.log("disconnect session user: ", socket.request.session.user);
    if(onlineUser.length == 2)
      onlineUser.splice(playerIndex, 1)
    else
      onlineUser.pop()

    socket.broadcast.emit("remove player", onlineUser);
    console.log("onlineuser remove: ", onlineUser)
    // if(socket.request.session.user){
    //   const {username} = socket.request.session.user;
    //   if (onlineUser[username]) delete onlineUser[username];
    //   console.log("disconnect: ", onlineUser);

    //   //broadcast the signed-out player
    //   socket.broadcast.emit("remove player", onlineUser);
    // }
    
    //Tell everyone what player number just disconnected
    socket.broadcast.emit('player-connection', playerIndex)
  })

  // On Ready
  socket.on('player-ready', () => {
    socket.broadcast.emit('enemy-ready', playerIndex)
    connections[playerIndex] = true
  })

  // Check player connections
  socket.on('check-players', () => {
    const players = []
    for (const i in connections) {
      connections[i] === null ? players.push({connected: false, ready: false}) : players.push({connected: true, ready: connections[i]})
    }
    socket.emit('check-players', players)
  })

  // On Fire Received
  socket.on('fire', shotsFired => {
    console.log(`Shots fired from ${playerIndex}`, shotsFired)

    // Emit the move to the other player
    socket.broadcast.emit('fireReceived', shotsFired)
  })

  // on Fire Reply
  socket.on('fire-reply', CLArr => {
    console.log(CLArr)

    // Forward the reply to the other player
    socket.broadcast.emit('fire-reveal', CLArr)
  })

  socket.on('sonar-select', selectedSquare =>{
    console.log(selectedSquare)
    socket.broadcast.emit('sonar-deploy', selectedSquare)
  })

  socket.on('sonar-confirm', shipLocs =>{
    console.log(shipLocs)
    socket.broadcast.emit('sonar-marking', shipLocs)
  })

  socket.on('reveal-cheat', () =>{
    console.log('reveal cheat activated')
    socket.broadcast.emit('request-shipLocs')
  })

  socket.on('return-shipLocs', shipLocs =>{
    console.log(shipLocs)
    socket.broadcast.emit('reveal-map', shipLocs)
  })
  
  socket.on('big-red-button', () =>{
    console.log('Tactical nuke incoming')
    socket.broadcast.emit('nuke-fired')
  })

  socket.on('nuke-boom', shipLocs =>{
    //console.log(shipLocs)
    socket.broadcast.emit('nuke-aftermath', shipLocs)
  })

  socket.on('reset', () =>{
    socket.broadcast.emit('reset-name')
  })
  
  // Timeout connection
  setTimeout(() => {
    connections[playerIndex] = null
    socket.emit('timeout')
    socket.disconnect()
  }, 300000) // 10 minute limit per player
})




// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))