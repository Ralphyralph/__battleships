import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import Grid from './Grid';


const serverConnetion = {ip: '192.168.1.2', port: '4004'};
const endpoint = 'http://'+ serverConnetion.ip +':'+ serverConnetion.port;
const socket = io(endpoint);

class App extends Component {
  constructor() {
    super()
    
    this.defaultUserName = "Poseidon";
    this.defaultOpponentName = "War lord";

    this.state = {
      online: 0,
      userName: null,
      opponentName: null,
      inGame: false,
    }
  }

  componentDidMount() {
    socket.on('connect', () => {
      console.log("Connected to server\nSocket ID:", socket.id,)
      console.log(socket);
    });
    socket.on('online', users => {
      this.setState({online: users});
    });
    socket.on('opponentName', (opponentName) => {
      if (opponentName === this.defaultUserName) {
          opponentName = this.defaultOpponentName;
      }
      this.setState({opponentName: opponentName});
    })
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
          <p>Player: {this.state.userName}</p>
          <div>{opponent}</div>
          <div>{waitingForGame}</div>
          <p>Online: {this.state.online}</p>
          <div>{joinGame}</div>
        </div>
        <div>
          <Grid _id="Player" />
          <Grid _id="Enemy" />
        </div>
      </div>
    );

  }
}

export default App;
