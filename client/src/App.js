import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import Grid from './Grid';


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
      ships: [],
      currentX: null,
      currentY: null,
      bombs: [],
      turn: null
    }
    this.defaultUserName = "Poseidon";
    this.defaultOpponentName = "War lord";
  }

  componentDidMount() {
    socket.on('connect', () => {
      console.log("Connected to server\nSocket ID:", socket.id,)
      console.log(socket);
    });
    socket.on('online', users => {
      this.setState({online: users});
    });
    socket.on('ships', ships => {
      this.setState({ships: ships});
    });
    socket.on('startGame', (opponentName,startsGame) => {
      if (opponentName === this.defaultUserName) {
          opponentName = this.defaultOpponentName;
      }
      this.setState({opponentName: opponentName, turn: startsGame});
    });

    socket.on('bomb_result', result => {
      this.state.bombs.push({
        x: this.state.currentX,
        y: this.state.currentY,result:result});
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
    socket.emit('newUser', userName);
  }

  onJoinGame = () => (event) => {
    this.setState({inGame: true});
    socket.emit('joinGame');
  }

  emitBomb = (x,y) => {
    if (this.state.turn === false) { return false; }
    this.setState({currentX: x});
    this.setState({currentY: y});
    socket.emit('bomb', x, y);
  }

  myTurn() {
    return this.state.turn === true ? <div>my turn</div> : <div>waiting for opponent</div>;
  }

  render() {
    if (this.state.userName === null) {
      return (
        <form onSubmit={this.onSubmitUser()} className="userName">
          <label>Enter username</label>
          <input type="text" name="userName" />
          <button type="submit">Start</button>
        </form>
      );     
    }
    if (this.state.inGame === false) {
      var joinGame = <button onClick={this.onJoinGame(this.state.inGame)}>Join Game</button>
    }
    if (this.state.inGame === true && this.state.opponentName === null) {
      var waitingForGame = <p>Waiting for another player...</p>
    }
    if (this.state.opponentName !== null) {
      var opponent = <p>Opponent: {this.state.opponentName}</p>
    }

    return (
      <div>
        <div>
          {this.myTurn()}
          <p>Player: {this.state.userName}</p>
          <div>{opponent}</div>
          <div>{waitingForGame}</div>
          <p>Online: {this.state.online}</p>
          <div>{joinGame}</div>
        </div>
        <div>
          <Grid id="player" ships={this.state.ships} />
          <Grid id="enemy" turn={this.state.turn} emitBomb={this.emitBomb} bombs={this.state.bombs} />
        </div>
      </div>
    );

  }//bombResult={}
}

export default App;
