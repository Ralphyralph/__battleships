import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import Grid from './Grid';


const serverConnetion = {ip: '192.168.1.2', port: '4004'};
const endpoint = 'http://' + serverConnetion.ip + ':' + serverConnetion.port;
const socket = io(endpoint);

class App extends Component {
  constructor() {
    super()
    

    this.state = {
      online: 0,
      userName: null
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
  }

  onSubmitUser = () => (event) => {
    var userName = event.target.userName.value.trim();
    if (userName === "") {
      userName = "Poseidon";  // Default user name
      this.setState({userName:userName});
    } else {
      this.setState({userName:userName});
    };
    socket.emit('newUser', userName);
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
    

    return (
      <div>
        <div>
          <p>Player: {this.state.userName}</p>
          <p>Online: {this.state.online}</p>
          <button>Join Game</button>
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
