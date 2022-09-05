//const { compareSync } = require("bcrypt")

// const { on } = require("nodemon")

document.addEventListener('DOMContentLoaded', () => {
  // const userName = document.querySelector('.player p1')
  //const fs = require("fs")
  const userGrid = document.querySelector('.grid-user')
  const computerGrid = document.querySelector('.grid-computer')
  const displayGrid = document.querySelector('.grid-display')
  const hideGrid = document.querySelector('.hide-display')
  const ships = document.querySelectorAll('.ship')
  const destroyer = document.querySelector('.destroyer-container')
  const submarine = document.querySelector('.submarine-container')
  const cruiser = document.querySelector('.cruiser-container')
  const battleship = document.querySelector('.battleship-container')
  const carrier = document.querySelector('.carrier-container')
  // Buttons
  const startButton = document.querySelector('#start')
  const rotateButton = document.querySelector('#rotate')
  const resetButton = document.querySelector('#reset')
  const randomButton = document.querySelector('#random')
  const fireButton = document.querySelector('#fire')
  const sonarButton = document.querySelector('#sonar')
  const revealButton = document.querySelector('#revealbutton')
  const nukeButton = document.querySelector("#nuke")
  // Info display
  const turnDisplay = document.querySelector('#whose-go')
  const infoDisplay = document.querySelector('#info')
  const roundDisplay = document.querySelector('#round_info')
  // Setup and action Buttons
  const setupButtons = document.getElementById('setup-buttons')
  const actionButtons = document.getElementById('action-buttons')
  // Cheat Buttons
  const cheatInput = document.getElementById('cheat')
  const cheatButton = document.querySelector('#cheat_button')
  const cheatShow = document.querySelector('#cheat_container')
  // Gameover Screen
  const gameoverShow = document.getElementById('gameover_screen')
  // After game button
  //const playAgainButton = document.getElementById('play_again')
  //const frontPageButton = document.getElementById('exit')

  const userSquares = []
  const computerSquares = []
  let isHorizontal = true
  let isGameOver = false
  let currentPlayer = 'user'
  const width = 10
  let playerNum = 0
  let ready = false
  let enemyReady = false
  let allShipsPlaced
  let cheatOn = false
  let shotFired = []
  let shotsHit = 0
  let enemyShotsHit = 0
  let shotsMissed = 0
  let enemyShotsMissed = 0
  let isSonar = false
  let cheatShipLocs = []
  let selfName = 'null'

  let selfShipSunk = 0
  let enemyShipSunk = 0
  let selfNumShots = 0
  let enemyNumShots = 0
  let turns = 1

  // fire svg
  var firesvg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="100%" height="100%" viewBox="50 50 60 130" enable-background="new 50 50 60 130" preserveAspectRatio="none" xml:space="preserve"> <path class="flame-main" fill="#F36E21" d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54c6.806,41.899,16.831,45.301,6.088,53.985"/><path class="flame-main one" fill="#F6891F" d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"/><path class="flame-main two" fill="#FFD04A" d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998C84.858,184.21,125.705,150.905,81.657,79.192z"/><path class="flame-main three" fill="#FDBA16" d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79C95.354,106.319,99.92,114.108,99.92,101.754z"/><path class="flame-main four" fill="#F36E21" d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041S134.387,164.603,103.143,105.917z"/><path class="flame-main five" fill="#FDBA16" d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"/><path class="flame" fill="#F36E21" d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"/><path class="flame one" fill="#F36E21" d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"/><path class="flame two" fill="#F36E21" d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"/></svg>';
  var holesvg = '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 125.82 127.68"><title>bullet-hole</title><path d="M38.83,29.08a7.93,7.93,0,0,1,3.6-2L40.55,16.25a2.4,2.4,0,0,1,4.31-1.82L51.76,23a25.18,25.18,0,0,1,2.79-1.14,20.13,20.13,0,0,1,2.87-.73L60.65,2a2.39,2.39,0,0,1,4.66-.3l5.18,14.76c1.2-.34,1.61-.38,4.23.15a3.68,3.68,0,0,1,.47.15,21.6,21.6,0,0,1,4.71,2.66,15,15,0,0,1,1.64,1.47l5.86-9.13a2.4,2.4,0,0,1,4.42,1.43L91.87,23l14-10.41a2.4,2.4,0,0,1,3.55,3l-8.07,17.25c4.6,3.38,6.65,6.34,9.51,10.47.75,1.07,1.55,2.23,2.48,3.51l9.38,2a2.4,2.4,0,0,1,.48,4.53l-6.36,3.3a18.47,18.47,0,0,1,1.09,6.74,25.3,25.3,0,0,1-1.6,7.74l2.31,6.36a2.42,2.42,0,0,1,0,1.74L117,83.15l8.21,9a2.39,2.39,0,0,1-.16,3.39,2.34,2.34,0,0,1-1.88.61l-7.79-.9,3.24,5.4a2.39,2.39,0,0,1-.81,3.29,2.43,2.43,0,0,1-1.69.31l-9-1.26c-2.68,4.43-3.76,4.88-7.42,6.44l-1.21.51,1.08,6.83a2.4,2.4,0,0,1-2,2.74,2.34,2.34,0,0,1-1.24-.13l-6.09-2-.44,7.77a2.41,2.41,0,0,1-4.34,1.29l-7.19-8.55-3.44,1,.31,6.3A2.39,2.39,0,0,1,71,126.91l-5.78-6.22a48.33,48.33,0,0,1-11-2.87,53.57,53.57,0,0,1-9.49-4.89L30,119.68a2.4,2.4,0,0,1-3.19-3.15h0l5.48-12.44a45.83,45.83,0,0,1-9.19-9,51.29,51.29,0,0,1-6.91-12.48L.75,68.06a2.4,2.4,0,0,1,1.82-4.13l15.22.56a38,38,0,0,1,.64-6.93A61.07,61.07,0,0,1,20.76,49l-1-6.88a2.41,2.41,0,0,1,2.05-2.71,2.19,2.19,0,0,1,.51,0l1.77,0L12.93,19.84a2.39,2.39,0,0,1,3.24-3.28L38.83,29.08ZM51.44,50.46a13.32,13.32,0,0,1,4.83-3.07l.28-3.62L59.42,46a9.94,9.94,0,0,1,4.38-1.44l.7-4.19,2,1.73a13,13,0,0,1,5,.2A9.89,9.89,0,0,1,75.84,46l2.58-2.1,1.12,3,3.19-.81L82.81,49c3.7,2.48,5.79,5.37,8.5,9l2,1.13-2,1.61c1.34,3,2.06,5.93,1,8.9l1.37,3.76L92.14,77,93.8,80l-3.1.84.7,2.36-2.62-.32a17.19,17.19,0,0,1-7.53,7.32l-.85,2.49L78,92.34l-2.1,2.55-1.81-2.14-3.54,1-.69,2.49-2.44-1.78a25.09,25.09,0,0,1-11.26-4.32l-4.6.07-.46-3.69a25.46,25.46,0,0,1-9.19-12.17l-1.55-4.78,2.94-1.33a25.82,25.82,0,0,1,1.5-10.06l-.19-3.48,2.86-.35,0-3.49,4-.41ZM44.19,31.53c-1.35.45-1.57.52-3.22,2.13a2.38,2.38,0,0,1-2.91.47L21.34,24.9l9.05,15.86a2.4,2.4,0,0,1-2.14,3.58l-3.31-.07.64,4.57A2.39,2.39,0,0,1,25.49,50a60,60,0,0,0-2.35,8.41,33.6,33.6,0,0,0-.47,8.4h0v.24a2.41,2.41,0,0,1-2.48,2.31L8.67,69,19.83,79.52a2.41,2.41,0,0,1,.58.88,47.45,47.45,0,0,0,6.45,11.81,42.16,42.16,0,0,0,9.6,9,2.4,2.4,0,0,1,1,3l-3.72,8.44,10-4.59a2.42,2.42,0,0,1,2.51.11,49.76,49.76,0,0,0,9.68,5.15A43,43,0,0,0,66.62,116a2.43,2.43,0,0,1,1.48.75l1.9,2-.07-1.48a2.39,2.39,0,0,1,1.73-2.58l6.75-1.93h0a2.39,2.39,0,0,1,2.49.76l4.42,5.25.27-4.87h0a2.6,2.6,0,0,1,.11-.62,2.39,2.39,0,0,1,3-1.52l5.44,1.81-.75-4.74a2.39,2.39,0,0,1,1.35-2.55c1.21-.56,2.19-1,3-1.33,2.78-1.18,3.42-1.45,5.93-5.78A2.41,2.41,0,0,1,106.16,98l5.73.8-3.17-5.26a2.45,2.45,0,0,1-.33-1.51A2.41,2.41,0,0,1,111.05,90l6.28.73-4.9-5.39a2.43,2.43,0,0,1-.47-2.57l1.85-4.43-2.25-6.19a2.35,2.35,0,0,1,0-1.75,22.12,22.12,0,0,0,1.62-7,15.11,15.11,0,0,0-1.53-6.76,2.41,2.41,0,0,1,1.09-3.12l2.49-1.28-3.75-.81h0a2.41,2.41,0,0,1-1.42-.91c-1.2-1.62-2.19-3.06-3.11-4.38C104,41.88,102.06,39,97,35.65a2.4,2.4,0,0,1-.84-3l4.94-10.55L90.93,29.64a2.31,2.31,0,0,1-1.42.47,2.38,2.38,0,0,1-2.4-2.38l0-6.55-3.28,5.11a2.25,2.25,0,0,1-.71.73,2.41,2.41,0,0,1-3.33-.67A12.45,12.45,0,0,0,77,23.22a16.75,16.75,0,0,0-3.47-1.95C72.11,21,72,21,71.57,21.14a17.31,17.31,0,0,1-2.13.51,2.4,2.4,0,0,1-2.76-1.55L63.83,12l-2,11.69a2.4,2.4,0,0,1-2.24,2,13.64,13.64,0,0,0-3.55.71,20.26,20.26,0,0,0-3.73,1.72,2.4,2.4,0,0,1-3.07-.58l-2.4-3,.64,3.7h0A2.39,2.39,0,0,1,46,30.91c-.7.26-1.28.46-1.77.62Z"/></svg>';

  const sounds = {
    background: new Audio("music/battle.mp3"),
    fire: new Audio("music/fire.mp3"),
    sonar: new Audio("music/sonar.mp3"),
    win: new Audio("music/win.mp3"),
    lose: new Audio("music/lose.mp3")
  };

  
  

  //Ships
  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, width]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, width, width * 2]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, width, width * 2]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4]
      ]
    },
  ]

  createBoard(userGrid, userSquares)
  createBoard(computerGrid, computerSquares)


  startMultiPlayer()
  

  // Multiplayer
  function startMultiPlayer() {
    const socket = io();

    // Get your player number
    socket.on('player-number', num => {
      if (num === -1) {
        infoDisplay.innerHTML = "Sorry, the server is full"
      } else {
        // add login here?
        playerNum = parseInt(num)
        if (playerNum === 1) currentPlayer = "enemy"

        console.log(playerNum)

        // Get other player status
        //socket.emit('check-players')
      }
    })

    // Another player has connected or disconnected
    // socket.on('player-connection', num => {
    //   console.log(`Player number ${num} has connected or disconnected`)
    //   playerConnectedOrDisconnected(num)
    // })

    // Add player 
    socket.on('add player', onlineUsers=> {
      console.log("online users: ", onlineUsers)
      //var currentUser = Authentication.getUser()
      //selfName = currentUser.username
      
      for(var i = onlineUsers.length-1; i >= 0; i--){
        if(selfName == 'null'){
          selfName = String(onlineUsers[i])
          socket.emit('reset')
        }
      }

      // if(onlineUsers.length > 1 && !(selfName == 'null')){
      //   selfName = onlineUsers[onlineUsers.length-1]
      // }

      console.log("selfname= ", selfName )
      for(var i = 0; i < onlineUsers.length; i++){
        var temp = String(onlineUsers[i])
        console.log('currently checking ', temp)
        if(!(selfName === temp)){
          console.log("in")
          $('#p2').text(onlineUsers[i])
        }
      }
      // for(var onlineUser in onlineUsers){
      //   console.log("hi ", onlineUser)
      //   var p1_innerHTML = document.getElementById("p1").innerHTML
      //   if(onlineUser != p1_innerHTML){
      //     console.log("in", onlineUsers[onlineUser])
      //     var p2_innerHTML = document.getElementByID('p2').innerHTML
      //     p2_innerHTML = onlineUser.name
      //   }
      // }
    })

    // Remove player 
    socket.on('remove player', onlineUsers=> {
      $('#p2').text("Waiting Player") 
      //selfName = 'null'   
    })

    // On enemy ready
    socket.on('enemy-ready', num => {
      enemyReady = true
      document.getElementById("p2ready").classList.toggle('active')
      //playerReady(num)
      console.log("enemy ready")
      if (ready) {
        playGameMulti(socket)
        setupButtons.style.display = 'none'
      }
    })


    // On Timeout
    socket.on('timeout', () => {
      infoDisplay.innerHTML = 'You have reached the 5 minute limit'
    })

    // Ready button click
    startButton.addEventListener('click', () => {
      if (allShipsPlaced) {
        sounds.background.volume = 0.1
        sounds.background.play()
        actionButtons.style.display = 'block'
        // infoDisplay.innerHTML = "Waiting for another player..."
        playGameMulti(socket)
      }
      else
        infoDisplay.innerHTML = "Please place all ships"
    })

    resetButton.addEventListener('click', resetShips)

    fireButton.addEventListener('click', fireShots)

    sonarButton.addEventListener('click', sonarToggle)

    cheatInput.addEventListener('input', () =>{
      cheatButton.style.display = 'block'
    })

    revealButton.addEventListener('click', () => {
      cheatOn = true
      socket.emit('reveal-cheat')
    })

    nukeButton.addEventListener('click', () => {
      cheatOn = true
      socket.emit('big-red-button')
    })

    cheatButton.addEventListener("click", (e) => {
      e.preventDefault()
      const cheatString = "painpeko"
      const cheatCheck = cheatInput.value
      //console.log("haha")
      // Clear text box input
      cheatInput.value = ""
      var result = (cheatString == cheatCheck)
      if (result) {
        //console.log("hi")
        cheatShow.style.display = "block"
      }
    })

    // Setup event listeners for firing
    computerSquares.forEach(square => {
      square.addEventListener('click', () => {
        if (currentPlayer === 'user' && ready && enemyReady) {
          if (!isSonar) {  // Normal firing mode
            var numShots = 5
            if (cpuDestroyerCount == 10)
              numShots--
            if (cpuSubmarineCount == 10)
              numShots--
            if (cpuCruiserCount == 10)
              numShots--
            if (cpuBattleshipCount == 10)
              numShots--
            if (cpuCarrierCount == 10)
              numShots--

            var selectedSquare = square.dataset.id
            var existCheck = shotFired.indexOf(selectedSquare)
            var enemySquare = computerGrid.querySelector(`div[data-id='${selectedSquare}']`)
            //console.log(enemySquare)

            // Still have remaining shots, square not selected yet
            // Still need to add check if square already shot at

            if (existCheck == -1 && shotFired.length < numShots && !enemySquare.classList.contains('boom') && !enemySquare.classList.contains('miss')) {
              shotFired.push(selectedSquare)
              // toggle selectedSquare color
              //square.style.backgroundColor = 'green'
              square.style.border = "3px dashed #FF0000";
            }
            // Square already selected, will remove selection
            else if (existCheck != -1) {
              shotFired.splice(existCheck, 1)
              //square.style.backgroundColor = 'transparent'
              square.style.border = "1px solid hsla(0, 0%, 100%, .2)";
              // if cheat is ON
              if (cheatOn) {
                for (let i = 0; i < cheatShipLocs.length; i++) {
                  if (cheatShipLocs[i] == selectedSquare)
                    //redraw the revealed ship position
                    square.style.border = "3px dashed #8800FF";
                }
              }
            }
            else return;
          }
          else { // Sonar selection mode
            shotFired = []
            var selectedSquare = square.dataset.id
            socket.emit('sonar-select', selectedSquare)
          }

        }
      })
    })

    function fireShots() {
      var numShots = 5
      if (cpuDestroyerCount == 10)
        numShots--
      if (cpuSubmarineCount == 10)
        numShots--
      if (cpuCruiserCount == 10)
        numShots--
      if (cpuBattleshipCount == 10)
        numShots--
      if (cpuCarrierCount == 10)
        numShots--

      if (shotFired.length == numShots){        
        roundDisplay.innerHTML = ""
        sounds.fire.play()
        socket.emit('fire', shotFired) 
        /*
        const audio = new Audio("music/fire.mp3")   
        audio.volume = 0.8    
        audio.play()     
        */   
      }        
      else{
        console.log("please select all the grids to fire at")
        // Round info display
        roundDisplay.innerHTML = "Please select all the grids to fire at."
      }
    }

    function sonarToggle() {
      if (cpuSubmarineCount == 10) {
        if (shotFired.length != 0) {
          for (let i = 0; i < shotFired.length; i++) {
            const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired[i]}']`)
            // Cheat is On            
            if (cheatOn) {
              for (let j = 0; j < cheatShipLocs.length; j++) {
                if (cheatShipLocs[j] == shotFired[i])
                  //redraw the revealed ship position
                  enemySquare.style.border = "3px dashed #8800FF";
              }
            }
            else {
              enemySquare.style.border = "1px solid hsla(0, 0%, 100%, .2)"
            }

          }
        }
        isSonar = false
        sonarButton.style.backgroundColor = "#555555"

        return
      }
      isSonar = !isSonar
      if (isSonar) {
        // Toggle fire button
        fireButton.disabled = true
        fireButton.style.backgroundColor = "#555555"
        sonarButton.style.backgroundColor = "hsl(30, 100%, 50%)"
        // Clear shotFired list 
        for (let i = 0; i < shotFired.length; i++) {
          const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired[i]}']`)
          if (cheatOn) {
            for (let j = 0; j < cheatShipLocs.length; j++) {
              if (cheatShipLocs[j] == shotFired[i])
                //redraw the revealed ship position
                enemySquare.style.border = "3px dashed #8800FF";
            }
          }
          else {
            enemySquare.style.border = "1px solid hsla(0, 0%, 100%, .2)"  // clear the border
          }

        }
        shotFired = []

      }
      else {
        fireButton.disabled = false
        fireButton.style.backgroundColor = "hsl(30, 100%, 50%)"
        sonarButton.style.backgroundColor = "#555555"

      }
    }

    // On Fire Received
    socket.on('fireReceived', shotsFired => {
      turns++
      var classListArr = []
      for (let i = 0; i < shotsFired.length; i++) {
        enemyGo(shotsFired[i])
        classListArr.push(userSquares[shotsFired[i]].classList)
      }
      //console.log(classListArr)
      //const square = userSquares[id]
      //console.log(square.classList)
      socket.emit('fire-reply', classListArr)
      playGameMulti(socket)
    })

    // On Fire Reply Received
    socket.on('fire-reveal', classListArr => {
      //console.log(classListArr[0])
      // for (let i = 0; i < classListArr.length; i++){  
      //   revealSquare(classListArr[i], i)
      // }   
      turns++
      revealSquare(classListArr)
      currentPlayer = 'enemy'
      playGameMulti(socket)
      shotFired = []
      console.log(destroyerCount, submarineCount, cruiserCount, battleshipCount, carrierCount)
      console.log(shotFired)
    })

    // Reveal your ship location that scanned by enemy 
    socket.on('sonar-deploy', selectedSquare => {
      turns++
      var sonarArea = [];
      // First row
      if (parseInt(parseInt(selectedSquare) / 10) == 0) {
        // Case location = [0,0]
        if (parseInt(parseInt(selectedSquare) % 10) == 0) {
          sonarArea = [parseInt(selectedSquare), parseInt(selectedSquare) + 1, parseInt(selectedSquare) + 10, parseInt(selectedSquare) + 11]
        }
        // Case location = [0,9] 
        else if (parseInt(parseInt(selectedSquare) % 10) == 9) {
          sonarArea = [parseInt(selectedSquare) - 1, parseInt(selectedSquare), parseInt(selectedSquare) + 9, parseInt(selectedSquare) + 10]
        }
        // the rest of the element on the first row 
        else {
          sonarArea = [parseInt(selectedSquare) - 1, parseInt(selectedSquare), parseInt(selectedSquare) + 1,
          parseInt(selectedSquare) + 9, parseInt(selectedSquare) + 10, parseInt(selectedSquare) + 11]
        }

      }
      // Last row
      else if (parseInt(parseInt(selectedSquare) / 10) == 9) {
        // Case location = [9,0]
        if (parseInt(parseInt(selectedSquare) % 10) == 0) {
          sonarArea = [parseInt(selectedSquare) - 10, parseInt(selectedSquare) - 9, parseInt(selectedSquare), parseInt(selectedSquare) + 1]
        }
        // Case location = [9,9]
        else if (parseInt(parseInt(selectedSquare) % 10) == 9) {
          sonarArea = [parseInt(selectedSquare) - 11, parseInt(selectedSquare) - 10, parseInt(selectedSquare) - 1, parseInt(selectedSquare)]
        }
        // the rest of last row
        else {
          sonarArea = [parseInt(selectedSquare) - 11, parseInt(selectedSquare) - 10, parseInt(selectedSquare) - 9,
          parseInt(selectedSquare) - 1, parseInt(selectedSquare), parseInt(selectedSquare) + 1]
        }

      }
      // First Column
      else if (parseInt(parseInt(selectedSquare) % 10) == 0) {
        sonarArea = [parseInt(selectedSquare) - 10, parseInt(selectedSquare) - 9,
        parseInt(selectedSquare), parseInt(selectedSquare) + 1,
        parseInt(selectedSquare) + 10, parseInt(selectedSquare) + 11]
      }
      // Last Column
      else if (parseInt(parseInt(selectedSquare) % 10) == 9) {
        sonarArea = [parseInt(selectedSquare) - 11, parseInt(selectedSquare) - 10,
        parseInt(selectedSquare) - 1, parseInt(selectedSquare),
        parseInt(selectedSquare) + 9, parseInt(selectedSquare) + 10, parseInt(selectedSquare) + 11]
      }
      else {
        sonarArea = [parseInt(selectedSquare) - 11, parseInt(selectedSquare) - 10, parseInt(selectedSquare) - 9,
        parseInt(selectedSquare) - 1, parseInt(selectedSquare), parseInt(selectedSquare) + 1,
        parseInt(selectedSquare) + 9, parseInt(selectedSquare) + 10, parseInt(selectedSquare) + 11]
      }

      /*
      var sonarArea = [parseInt(selectedSquare)-11, parseInt(selectedSquare)-10, parseInt(selectedSquare)-9, 
        parseInt(selectedSquare)-1, parseInt(selectedSquare), parseInt(selectedSquare)+1, 
        parseInt(selectedSquare)+9, parseInt(selectedSquare)+10, parseInt(selectedSquare)+11]
      */
      var shipLocs = []
      console.log("sonarArea:", sonarArea)
      for (let i = 0; i < sonarArea.length; i++) {
        var square = userSquares[sonarArea[i]]
        console.log(square)
        if (square.classList.contains('taken')) {
          shipLocs.push(sonarArea[i])
        }
      }
      socket.emit('sonar-confirm', shipLocs)
      //currentPlayer = 'enemy'
      currentPlayer = 'user'
      playGameMulti(socket)
    })

    // Mark sonar detected ships on grid
    socket.on('sonar-marking', shipLocs => {
      turns++
      // shipLocs => array contain locations with ships
      // Have to mark computer grid with green dots
      sounds.sonar.play()
      console.log(shipLocs)
      sonarToggle();   // change back to fire by default for next turn
      /*
      const audio = new Audio("music/fire.mp3")   
      audio.volume = 0.8    
      audio.play()       
      */

      // Add sonar CSS class to show sonar animation

      for (let i = 0; i < shipLocs.length; i++) {
        const enemySquare = computerGrid.querySelector(`div[data-id='${shipLocs[i]}']`)
        console.log(enemySquare)
        enemySquare.style.border = "3px dashed green"   // change this to green dot
        enemySquare.classList.add('sonar')
      }



      setTimeout(() => {
        for (let i = 0; i < shipLocs.length; i++) {
          const enemySquare = computerGrid.querySelector(`div[data-id='${shipLocs[i]}']`)
          if (cheatOn) {
            for (let j = 0; j < cheatShipLocs.length; j++) {
              if (cheatShipLocs[j] == shipLocs[i])
                enemySquare.style.border = "3px dashed #8800FF";
            }
          }
          else {
            enemySquare.style.border = "1px solid hsla(0, 0%, 100%, .2)"
          }
          enemySquare.classList.remove('sonar')

        }
      }, 2000)
      currentPlayer = 'enemy'
      fireButton.disabled = false
      fireButton.style.backgroundColor = "hsl(30, 100%, 50%)"
      playGameMulti(socket)
    })

    socket.on('request-shipLocs', () => {
      var shipLocs = []
      for (let i = 0; i < 100; i++) {
        var square = userSquares[i]
        if (square.classList.contains('taken')) {
          shipLocs.push(i)
        }
      }
      socket.emit('return-shipLocs', shipLocs)
    })

    socket.on('reveal-map', shipLocs => {
      cheatShipLocs = shipLocs
      for (let i = 0; i < shipLocs.length; i++) {
        const enemySquare = computerGrid.querySelector(`div[data-id='${shipLocs[i]}']`)
        console.log(enemySquare)
        enemySquare.style.border = "3px dashed #8800FF"   // change this to gay purple dot
      }
    })

    socket.on('nuke-fired', () => {
      var shipLocs = []
      for (let i = 0; i < 100; i++) {
        shipLocs.push(userSquares[i].classList)
        enemyGo(i)
      }
      socket.emit('nuke-boom', shipLocs)
    })

    socket.on('nuke-aftermath', shipClassList => {
      for (let i = 0; i < 100; i++) {
        shotFired.push(i)
      }
      revealSquare(shipClassList)
    })

    socket.on('reset-name', () =>{
      if(!(selfName == 'null') && playerNum == 1){
        selfName = 'null'
        console.log('resetted')
      }
    })

  }

  //Create Board
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.dataset.id = i
      grid.appendChild(square)
      squares.push(square)
    }
  }

  //Draw the player ships in random locations
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randomDirection]
    if (randomDirection === 0) direction = 1
    if (randomDirection === 1) direction = 10
    let randomStart = Math.abs(Math.floor(Math.random() * userSquares.length - (ship.directions[0].length * direction)))

    const isTaken = current.some(index => userSquares[randomStart + index].classList.contains('taken'))
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

    //if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => userSquares[randomStart + index].classList.add('taken', ship.name))

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      // horizontal ship
      if (randomDirection == 0) {
        for (let i = 0; i < ship.directions[0].length; i++) {
          let directionClass
          if (i === 0) directionClass = 'start'
          if (i === ship.directions[0].length - 1) directionClass = 'end'
          userSquares[randomStart + i].classList.add('taken', 'horizontal', directionClass, ship.name)
        }
      }
      // vertical ship
      else {
        for (let i = 0; i < ship.directions[0].length; i++) {
          let directionClass
          if (i === 0) directionClass = 'start'
          if (i === ship.directions[0].length - 1) directionClass = 'end'
          userSquares[randomStart + i * 10].classList.add('taken', 'vertical', directionClass, ship.name)
        }

      }
    }
    else generate(ship)
  }


  //Rotate the ships
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical')
      submarine.classList.toggle('submarine-container-vertical')
      cruiser.classList.toggle('cruiser-container-vertical')
      battleship.classList.toggle('battleship-container-vertical')
      carrier.classList.toggle('carrier-container-vertical')
      isHorizontal = false
      // console.log(isHorizontal)
      return
    }
    if (!isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical')
      submarine.classList.toggle('submarine-container-vertical')
      cruiser.classList.toggle('cruiser-container-vertical')
      battleship.classList.toggle('battleship-container-vertical')
      carrier.classList.toggle('carrier-container-vertical')
      isHorizontal = true
      // console.log(isHorizontal)
      return
    }
  }
  rotateButton.addEventListener('click', rotate)

  //move around user ship
  ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragover', dragOver))
  userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
  userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
  userSquares.forEach(square => square.addEventListener('drop', dragDrop))
  userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

  let selectedShipNameWithIndex
  let draggedShip
  let draggedShipLength

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id
    // console.log(selectedShipNameWithIndex)
  }))

  function dragStart() {
    draggedShip = this
    draggedShipLength = this.childNodes.length
    // console.log(draggedShip)
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
    // console.log('drag leave')
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id
    // console.log("shipNameWithLastId=", shipNameWithLastId)
    let shipClass = shipNameWithLastId.slice(0, -2)
    // console.log(shipClass)
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
    // console.log("lastshipindex=", lastShipIndex)
    let testChecker = false;

    if (isHorizontal) {
      let shipLastId = lastShipIndex + parseInt(this.dataset.id)
      selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

      shipLastId = shipLastId - selectedShipIndex
      shipFirstId = shipLastId - lastShipIndex
      testChecker = (Math.floor(shipFirstId / 10) == Math.floor(shipLastId / 10))
    }
    else {
      let shipLastId = (lastShipIndex * 10) + parseInt(this.dataset.id)
      selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))
      shipLastId = shipLastId - (selectedShipIndex * 10)
      shipFirstId = shipLastId - (lastShipIndex * 10)
      testChecker = (shipFirstId % 10 == shipLastId % 10) && (shipLastId < 100) && (shipFirstId >= 0)
    }

    if (isHorizontal && testChecker) {
      let overlap = false;
      for (let i = 0; i < draggedShipLength; i++) {
        if (userSquares[shipFirstId + i].classList.contains('taken')) {
          overlap = true;
          break
        }
      }

      if (overlap)
        return

      for (let i = 0; i < draggedShipLength; i++) {
        let directionClass
        if (i === 0) directionClass = 'start'
        if (i === draggedShipLength - 1) directionClass = 'end'
        userSquares[shipFirstId + i].classList.add('taken', 'horizontal', directionClass, shipClass)
      }
      //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
      //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    }
    else if (!isHorizontal && testChecker) {
      let overlap = false;
      for (let i = 0; i < draggedShipLength; i++) {
        if (userSquares[shipFirstId + 10 * i].classList.contains('taken')) {
          overlap = true;
          break
        }
      }

      if (overlap)
        return

      for (let i = 0; i < draggedShipLength; i++) {
        let directionClass
        if (i === 0) directionClass = 'start'
        if (i === draggedShipLength - 1) directionClass = 'end'

        userSquares[shipFirstId + 10 * i].classList.add('taken', 'vertical', directionClass, shipClass)
      }
    } else return

    hideGrid.appendChild(draggedShip)
    if (!displayGrid.querySelector('.ship')) allShipsPlaced = true
  }

  function dragEnd() {
    // console.log('dragend')
  }

  function resetShips() {
    for (let i = 0; i < (width * width); i++) {
      if (userSquares[i].classList.contains('taken')) {
        userSquares[i].className = ""
      }
    }
    displayGrid.appendChild(destroyer)
    displayGrid.appendChild(submarine)
    displayGrid.appendChild(cruiser)
    displayGrid.appendChild(battleship)
    displayGrid.appendChild(carrier)
  }

  function randomShips() {
    resetShips();
    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])
    hideGrid.appendChild(destroyer)
    hideGrid.appendChild(carrier)
    hideGrid.appendChild(submarine)
    hideGrid.appendChild(battleship)
    hideGrid.appendChild(cruiser)
    allShipsPlaced = true
  }
  randomButton.addEventListener('click', randomShips)




  // Game Logic for MultiPlayer
  function playGameMulti(socket) {
    setupButtons.style.display = 'none'
    if (isGameOver) return
    if (!ready) {
      socket.emit('player-ready')
      ready = true
      document.getElementById("p1ready").classList.toggle('active')
      // playerReady(playerNum)
    }
// 
    if (enemyReady) {
      if (currentPlayer === 'user') {
        turnDisplay.innerHTML = 'Your Turn'
      }
      if (currentPlayer === 'enemy') {
        turnDisplay.innerHTML = document.getElementById('p2').innerHTML + "'s Turn"
      }
    }
  }

  let destroyerCount = 0
  let submarineCount = 0
  let cruiserCount = 0
  let battleshipCount = 0
  let carrierCount = 0

  function revealSquare(classList) {
    for (let i = 0; i < classList.length; i++) {
      selfNumShots++
      const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired[i]}']`)
      if (cheatOn) {
        for (let j = 0; j < cheatShipLocs.length; j++) {
          if (cheatShipLocs[j] == shotFired[i]) {
            //redraw the revealed ship position
            enemySquare.style.border = "3px dashed #8800FF"
            break
          }
          else
            enemySquare.style.border = "1px solid hsla(0, 0%, 100%, .2)"
        }
      }
      else {
        enemySquare.style.border = "1px solid hsla(0, 0%, 100%, .2)"
      }

      const obj = Object.values(classList[i])
      console.log(obj)
      if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
        //console.log("yes")
        
        if (obj.includes('destroyer')) destroyerCount++
        if (obj.includes('submarine')) submarineCount++
        if (obj.includes('cruiser')) cruiserCount++
        if (obj.includes('battleship')) battleshipCount++
        if (obj.includes('carrier')) carrierCount++
      }
      if (obj.includes('taken')) {
        if (!enemySquare.classList.contains('boom')) {
          enemySquare.classList.add('boom')
          shotsHit++
          // Draw fire animation
          enemySquare.innerHTML += firesvg
        }
      }
      else if (!enemySquare.classList.contains('miss')) {
        enemySquare.classList.add('miss')
        enemySquare.innerHTML += holesvg;
        shotsMissed++
      }
      checkForWins()
    }
    //console.log(destroyerCount, submarineCount, cruiserCount, battleshipCount, carrierCount)
    //if(gameMode === 'singlePlayer') playGameSingle()
  }

  let cpuDestroyerCount = 0
  let cpuSubmarineCount = 0
  let cpuCruiserCount = 0
  let cpuBattleshipCount = 0
  let cpuCarrierCount = 0


  function enemyGo(square) {
    //if (gameMode === 'singlePlayer') square = Math.floor(Math.random() * userSquares.length)
    enemyNumShots++
    if (!userSquares[square].classList.contains('boom')) {
      const isBoom = userSquares[square].classList.contains('boom')
      const isMissed = userSquares[square].classList.contains('miss')
      if (!isBoom && !isMissed) {
        const hit = userSquares[square].classList.contains('taken')
        userSquares[square].classList.add(hit ? 'boom' : 'miss')
        if (hit) {
          // Fire animation
          sounds.fire.play()
          userSquares[square].innerHTML += firesvg;
          enemyShotsHit++
          /*
          const audio = new Audio("music/fire.mp3")   
          audio.volume = 0.8    
          audio.play() 
          */
                  
        }
        else {
          // Draw hole
          sounds.fire.play()
          userSquares[square].innerHTML += holesvg;
          enemyShotsMissed++
          /*
          const audio = new Audio("music/fire.mp3")   
          audio.volume = 0.8    
          audio.play() 
          */
          
        }
        if (userSquares[square].classList.contains('cruiser')) cpuCruiserCount++
        if (userSquares[square].classList.contains('battleship')) cpuBattleshipCount++
        if (userSquares[square].classList.contains('carrier')) cpuCarrierCount++
        if (userSquares[square].classList.contains('submarine')) cpuSubmarineCount++
        if (userSquares[square].classList.contains('destroyer')) cpuDestroyerCount++
        checkForWins()
      }
    } //else if (gameMode === 'singlePlayer') enemyGo()
    currentPlayer = 'user'
    turnDisplay.innerHTML = 'Your Turn'
  }

  function checkForWins() {
    let enemyName = document.getElementById('p2').innerHTML
    let enemy = 'computer'
    if (gameMode === 'multiPlayer') enemy = 'enemy'
    if (destroyerCount === 2) {
      infoDisplay.innerHTML = "You sunk " + enemyName + "'s destroyer!"
      destroyerCount = 10
      selfShipSunk++
    }
    if (submarineCount === 3) {
      infoDisplay.innerHTML = "You sunk " + enemyName + "'s submarine!"
      submarineCount = 10
      selfShipSunk++
    }
    if (cruiserCount === 3) {
      infoDisplay.innerHTML = "You sunk " + enemyName + "'s cruiser!"
      cruiserCount = 10
      selfShipSunk++
    }
    if (battleshipCount === 4) {
      infoDisplay.innerHTML = "You sunk " + enemyName + "'s battleship!"
      battleshipCount = 10
      selfShipSunk++
    }
    if (carrierCount === 5) {
      infoDisplay.innerHTML = "You sunk " + enemyName + "'s carrier!"
      carrierCount = 10
      selfShipSunk++
    }
    if (cpuDestroyerCount === 2) {
      infoDisplay.innerHTML = enemyName + ` sunk your destroyer!`
      cpuDestroyerCount = 10
      enemyShipSunk++
    }
    if (cpuSubmarineCount === 3) {
      infoDisplay.innerHTML = enemyName + ` sunk your submarine!`
      cpuSubmarineCount = 10
      sonarButton.style.backgroundColor = "#555555"
      sonarButton.disabled = true                       // disable sonar button if submarine is sunk
      enemyShipSunk++
    }
    if (cpuCruiserCount === 3) {
      infoDisplay.innerHTML = enemyName + ` sunk your cruiser!`
      cpuCruiserCount = 10
      enemyShipSunk++
    }
    if (cpuBattleshipCount === 4) {
      infoDisplay.innerHTML = enemyName + ` sunk your battleship!`
      cpuBattleshipCount = 10
      enemyShipSunk++
    }
    if (cpuCarrierCount === 5) {
      infoDisplay.innerHTML = enemyName + ` sunk your carrier!`
      cpuCarrierCount = 10
      enemyShipSunk++
    }

    if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
      infoDisplay.innerHTML = "YOU WIN"
      actionButtons.style.display = 'none'
      revealButton.style.display = 'none'
      nukeButton.style.display = 'none'
      sounds.background.pause()
      document.getElementById('gameover_player_1_win').innerHTML = "Winner"
      document.getElementById('gameover_player_1_win').style.color = "#00FF00"
      document.getElementById('gameover_player_2_win').innerHTML = "Loser"
      document.getElementById('gameover_player_2_win').style.color = "#FF0000"
      gameOver()
      sounds.win.play()
    }
    if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
      infoDisplay.innerHTML = document.getElementById('p2').innerHTML + ` WINS`
      actionButtons.style.display = 'none'
      revealButton.style.display = 'none'
      nukeButton.style.display = 'none'
      sounds.background.pause()
      document.getElementById('gameover_player_1_win').innerHTML = "Loser"
      document.getElementById('gameover_player_1_win').style.color = "#FF0000"
      document.getElementById('gameover_player_2_win').innerHTML = "Winner"
      document.getElementById('gameover_player_2_win').style.color = "#00FF00"
      gameOver()
      sounds.lose.play()
    }
  }

  function gameOver() {
    isGameOver = true
    gameoverShow.style.display = "block"
    document.getElementById('gameover_turn').innerHTML = "Gameover at Turn " + turns
    document.getElementById('gameover_player_1_name').innerHTML = document.getElementById('p1').innerHTML
    document.getElementById('gameover_player_1_name').style.textDecoration = "underline"
    document.getElementById('gameover_player_1_hit').innerHTML = "Hit: " + shotsHit + " shots"
    document.getElementById('gameover_player_1_miss').innerHTML = "Miss: " + shotsMissed + " shots"
    var p1_accuracy = ((shotsHit/selfNumShots)*100).toFixed(1)
    document.getElementById('gameover_player_1_accuracy').innerHTML = "Accuracy: "+ p1_accuracy + "%"
    document.getElementById('gameover_player_1_sunk').innerHTML = "Enemy ships sunk: " + selfShipSunk
    document.getElementById('gameover_player_1_remain').innerHTML = "Ships remaining: " + (5-enemyShipSunk)
    var p1_damage = ((enemyShotsHit/17)*100).toFixed(1)
    document.getElementById('gameover_player_1_damage').innerHTML = "Overall damage received: " + p1_damage + "%"


    document.getElementById('gameover_player_2_name').innerHTML = document.getElementById('p2').innerHTML
    document.getElementById('gameover_player_2_name').style.textDecoration = "underline"
    document.getElementById('gameover_player_2_hit').innerHTML = "Hit: " + enemyShotsHit + " shots"
    document.getElementById('gameover_player_2_miss').innerHTML = "Miss: " + enemyShotsMissed + " shots"
    var p2_accuracy = ((enemyShotsHit/enemyNumShots)*100).toFixed(1)
    document.getElementById('gameover_player_2_accuracy').innerHTML = "Accuracy: "+ p2_accuracy + "%"
    document.getElementById('gameover_player_2_sunk').innerHTML = "Enemy ships sunk: " + enemyShipSunk
    document.getElementById('gameover_player_2_remain').innerHTML = "Ships remaining: " + (5-selfShipSunk)
    var p2_damage = ((shotsHit/17)*100).toFixed(1)
    document.getElementById('gameover_player_2_damage').innerHTML = "Overall damage received: " + p2_damage + "%"

    // Hit color:
    if (shotsHit > enemyShotsHit){
      document.getElementById('gameover_player_1_hit').style.color = "#00FF00"   // Green
      document.getElementById('gameover_player_2_hit').style.color = "#FF0000"   // Red
    }
    else if (shotsHit < enemyShotsHit){
      document.getElementById('gameover_player_1_hit').style.color = "#FF0000"   // Red
      document.getElementById('gameover_player_2_hit').style.color = "#00FF00"   // Green
    }
    else{
      document.getElementById('gameover_player_1_hit').style.color = "#FFFFFF"   // White
      document.getElementById('gameover_player_2_hit').style.color = "#FFFFFF"   // White
    }

    // Miss color:
    if (shotsMissed > enemyShotsMissed){
      document.getElementById('gameover_player_1_miss').style.color = "#FF0000"   // Red
      document.getElementById('gameover_player_2_miss').style.color = "#00FF00"   // Green
    }
    else if (shotsMissed < enemyShotsMissed){
      document.getElementById('gameover_player_1_miss').style.color = "#00FF00"   // Green
      document.getElementById('gameover_player_2_miss').style.color = "#FF0000"   // Red
    }
    else{
      document.getElementById('gameover_player_1_miss').style.color = "#FFFFFF"   // White
      document.getElementById('gameover_player_2_miss').style.color = "#FFFFFF"   // White
    }

    // Accuracy color:
    if (p1_accuracy > p2_accuracy){
      document.getElementById('gameover_player_1_accuracy').style.color = "#00FF00"   // Green
      document.getElementById('gameover_player_2_accuracy').style.color = "#FF0000"   // Red
    }
    else if (p1_accuracy < p2_accuracy){
      document.getElementById('gameover_player_1_accuracy').style.color = "#FF0000"   // Red
      document.getElementById('gameover_player_2_accuracy').style.color = "#00FF00"   // Green
    }
    else{
      document.getElementById('gameover_player_1_accuracy').style.color = "#FFFFFF"   // white
      document.getElementById('gameover_player_2_accuracy').style.color = "#FFFFFF"   // white
    }

    // Sunk ship color:
    if (selfShipSunk > enemyShipSunk){
      document.getElementById('gameover_player_1_sunk').style.color = "#00FF00"   // Green
      document.getElementById('gameover_player_2_sunk').style.color = "#FF0000"   // Red

    }
    else if (selfShipSunk < enemyShipSunk){
      document.getElementById('gameover_player_1_sunk').style.color = "#FF0000"   // Red
      document.getElementById('gameover_player_2_sunk').style.color = "#00FF00"   // Green
    }
    else{
      document.getElementById('gameover_player_1_sunk').style.color = "#FFFFFF"   // white
      document.getElementById('gameover_player_2_sunk').style.color = "#FFFFFF"   // white
    }

    // Remain ship color:
    if ((5-enemyShipSunk) > (5-selfShipSunk)){
      document.getElementById('gameover_player_1_remain').style.color = "#00FF00"   // Green
      document.getElementById('gameover_player_2_remain').style.color = "#FF0000"   // Red
    }
    else if ((5-enemyShipSunk) < (5-selfShipSunk)){
      document.getElementById('gameover_player_1_remain').style.color = "#FF0000"   // Red
      document.getElementById('gameover_player_2_remain').style.color = "#00FF00"   // Green
    }

    // Damage color:
    // WE DRUNK IDK WHY WONT WORK
    console.log(parseInt(p1_damage), parseInt(p2_damage))
    if (parseInt(p1_damage) > parseInt(p2_damage)){
      document.getElementById('gameover_player_1_damage').style.color = "#FF0000"   // Red
      document.getElementById('gameover_player_2_damage').style.color = "#00FF00"   // Green
    }
    else if (parseInt(p1_damage) < parseInt(p2_damage)){
      document.getElementById('gameover_player_1_damage').style.color = "#00FF00"   // Green
      document.getElementById('gameover_player_2_damage').style.color = "#FF0000"   // Red
    }


    
    

    
  
  }
})


