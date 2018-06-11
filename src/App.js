import React, { Component } from 'react';
import io from 'socket.io-client';
import _ from 'underscore';
import './App.css';
import Grid from './Grid';
import SkinCss from './skinCss';
import SkinSelector from './skinSelector';
import generateShips from './ships';
import SeamlessLoop from './js/seamlessloop.js';

const serverConnection = {ip: 'localhost', port: '4004'};
const endpoint = 'http://'+ serverConnection.ip +':'+ serverConnection.port;
const socket = io(endpoint);

class App extends Component {
  constructor() {
    super();

    this.state = {
      usersOnline: 0,
      userName: null,
      opponentName: null,
      inGame: false,
      ships: generateShips(),
      skins: [],
      currentSkin: null,
      currentX: null,
      currentY: null,
      bombs: [],
      turn: null,
      socketId: null,
      config: null,
      backgroundLoop: null,
      backgroundLoopLoaded: false,
      backgroundLoopPlaying: false,
      fx_welcome: null,
      fx_background: null,
      fx_start: null,
      fx_bomb: null,
      fx_hit: null,
      fx_miss: null,
      fx_win: null
    }
    this.defaultUserName = "Poseidon";
    this.defaultOpponentName = "Warlord";
  }

  isMyTurn(id) {
    return socket.id === id;
  }

  initSkin() {
    var that = this;

    var skin = this.currentSkin();
    this.setSkinCss();

    var backgroundLoop = new SeamlessLoop();
    backgroundLoop.addUri('../skins/'+this.state.currentSkin+'/'+skin.sounds.background, parseInt(skin.sounds.backgroundLength), "background");
    backgroundLoop.callback( function() {
      that.setState({backgroundLoopLoaded:true});
    });
    this.setState({backgroundLoop:backgroundLoop});

    this.fx_welcome = new Audio('../skins/'+this.state.currentSkin+'/'+'/welcome.ogg');
    this.fx_start = new Audio('../skins/'+this.state.currentSkin+'/'+'/start.ogg');
    this.fx_bomb = new Audio('../skins/'+this.state.currentSkin+'/'+'/bomb.ogg');
    this.fx_hit = new Audio('../skins/'+this.state.currentSkin+'/'+'/hit.ogg');
    this.fx_miss = new Audio('../skins/'+this.state.currentSkin+'/'+'/miss.ogg');
    this.fx_win = new Audio('../skins/'+this.state.currentSkin+'/'+'/win.ogg');

    this.fx_welcome.volume = 0.1;
    this.fx_start.volume = 0.1;
    this.fx_bomb.volume = 0.1;
    this.fx_hit.volume = 0.05;
    this.fx_miss.volume = 0.06;
    this.fx_win.volume = 0.1;
  }

  setSkinCss() {
    var skin = this.currentSkin();
    var style = document.createElement('style');
    style.type = 'text/css';
    var skinStyle = 'body{color:'+ skin.graphics.color+'}';
    if(style.styleSheet){
        style.styleSheet.cssText = skinStyle;
    }else{
        style.appendChild(document.createTextNode(skinStyle));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  componentDidMount() {
    var that = this;

    socket.on('connect', () => {
      this.setState({socketId: socket.id});
    });
    socket.on('online', data => {
      this.setState({
        usersOnline: data.usersOnline,
        config: data.config,
        skins: data.skins,
        currentSkin: data.config.default_skin
      }, function() {
        that.initSkin();
      });
    });
    socket.on('startGame', (opponentName,startsGame) => {
      this.fx_start.play();
      if (opponentName === this.defaultUserName) {
          opponentName = this.defaultOpponentName;
      }
      this.setState({opponentName: opponentName, turn: startsGame});
    });
    socket.on('bomb_result', result => {
      setTimeout(() => {
        this.playHitOrMiss(result.result)
        let _bombs = this.state.bombs;
        _bombs.push({x: result.x,y: result.y, result:result.result, socketId: result.socketId});
        this.setState({bombs: _bombs, turn: this.isMyTurn(result.game.turn)});
      }, 2000);
    });
  }

  playHitOrMiss(result) {
    if (result === 'miss') {
      this.fx_miss.play();
    } else {
      this.fx_hit.play();
    }
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
    if (this.state.usersOnline < 2) { alert('NOt enough users');  return false; }
    this.setState({inGame: true});
    socket.emit('joinGame');
  }

  bomb = (x,y) => {
    this.fx_bomb.play();
    if (this.state.turn === false) { return false; }
    this.state.currentX = x;
    this.state.currentY = y;
    socket.emit('bomb', x, y);
  }

  whoseTurn() {
    return this.state.turn == true ? <div>my turn</div> : <div>waiting for opponent</div>;
  }

  currentSkin() {
    var that = this;
    return _.find(this.state.skins, function(skin) { return skin.name === that.state.currentSkin });
  }

  backgroundImage() {
    if (this.state.config === null) { return ''}
    return '../skins/'+this.state.currentSkin+'/'+this.currentSkin().graphics.background;
  }

  startStopBackground = (event) => {
    if (this.state.backgroundLoopPlaying === false) {
      this.state.backgroundLoop.start('background');
      this.setState({backgroundLoopPlaying:true});
    } else {
      this.state.backgroundLoop.stop('background');
      this.setState({backgroundLoopPlaying:false});
    }
  }

  skinChange = (target) => {
    var that = this;
    this.setState({currentSkin:target.value}, function() {
      that.initSkin();
    });
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

    var _skin = this.currentSkin();
    if (_skin) {
      var SkinCssModule = <SkinCss skin={_skin} />
    } else {
      var SkinCssModule = '';
    }

    if (this.state.backgroundLoopLoaded === true) {
      var text = this.state.backgroundLoopPlaying === true ? 'Pause background loop' : 'Play background loop'; 
      var playBackground = <div onClick={this.startStopBackground} className="playBackground">{text}</div>;
    } else {
      var playBackground = '';
    }

    return (
      <div className="scene" style={{backgroundImage: 'url('+this.backgroundImage()+')'}}>

        {SkinCssModule}

        <div className="statusbar">
          {this.whoseTurn()}<div className="right">Online: {this.state.usersOnline}</div>
          <SkinSelector skinChange={this.skinChange} skins={this.state.skins} currentSkin={this.state.currentSkin} />
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

        {playBackground}
      </div>
    );

  }
}

export default App;
