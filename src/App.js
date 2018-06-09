import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import Grid from './Grid';
import generateShips from './ships';

const serverConnection = {ip: 'localhost', port: '4004'};
const endpoint = 'http://'+ serverConnection.ip +':'+ serverConnection.port;
const socket = io(endpoint);

class App extends Component {
  constructor() {
    super()

    this.state = {
      online: 0,
      userName: null,
      opponentName: null,
      inGame: false,
      ships: generateShips(),
      currentX: null,
      currentY: null,
      bombs: [],
      turn: null,
      socketId: null
    }
    this.defaultUserName = "Poseidon";
    this.defaultOpponentName = "Warlord";
  }

  isMyTurn(id) {
    console.log(socket.id === id);
    return socket.id === id;
  }

  componentDidMount() {
    socket.on('connect', () => {
      this.setState({socketId: socket.id});
    });
    socket.on('online', users => {
      this.setState({online: users});
    });
    socket.on('startGame', (opponentName,startsGame) => {
      if (opponentName === this.defaultUserName) {
          opponentName = this.defaultOpponentName;
      }
      this.setState({opponentName: opponentName, turn: startsGame});
    });
    socket.on('bomb_result', result => {
      console.log('bomb_result',result);
      let _bombs = this.state.bombs;
      _bombs.push({x: result.x,y: result.y, result:result.result, socketId: result.socketId});
      this.setState({bombs: _bombs, turn: this.isMyTurn(result.game.turn)});
    });
  }

  onSubmitUser = () => (event) => {
    var userName = event.target.userName.value.trim();
    if (userName === "") {
      userName = this.defaultUserName;
      this.setState({userName:userName});
    } else {
      this.setState({userName:userName});
    };
    socket.emit('newUser', {userName:userName, ships:this.state.ships});
  }

  onJoinGame = () => (event) => {
    this.setState({inGame: true});
    socket.emit('joinGame');
  }

  bomb = (x,y) => {
    if (this.state.turn === false) { return false; }
    this.state.currentX = x;
    this.state.currentY = y;
    socket.emit('bomb', x, y);
  }

  whoseTurn() {
    return this.state.turn == true ? <div>my turn</div> : <div>waiting for opponent</div>;
  }

  render() {
    if (this.state.userName === null) {
      return (
        <form onSubmit={this.onSubmitUser()} className="userName">
          <div className="statusbar">
            <div>
              <label>Enter username</label>
            </div>
            <div>
              <input type="text" name="userName" />
            </div>
            <div>
              <button type="submit">Start</button>
            </div>
          </div>
        </form>
      );     
    }
    if (this.state.inGame === false) {
      var joinGame = <div><button onClick={this.onJoinGame(this.state.inGame)}>Join Game</button></div>
    }
    if (this.state.inGame === true && this.state.opponentName === null) {
      var waitingForGame = <div>Waiting for another player...</div>
    }
    if (this.state.opponentName !== null) {
      var opponent = <div>Opponent: {this.state.opponentName}</div>
    }

    return (
      <div>

        <div className="statusbar">
          {this.whoseTurn()}<div className="right">Online: {this.state.online}</div>
        </div>

        <div className="statusbar">
          <div>Player: {this.state.userName}</div>
          {opponent}
          {waitingForGame}
          {joinGame}
        </div>
        
        <div>
          <Grid id="player" ships={this.state.ships} socketId={this.state.socketId} />
          <Grid id="enemy" turn={this.state.turn} bomb={this.bomb} bombs={this.state.bombs} socketId={this.state.socketId} /> 
        </div>
      </div>
    );

  }
}

export default App;
