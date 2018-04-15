import React, { Component } from 'react';
import './App.css';


const cols = 10;
const rows = 10;

class Grid extends Component {
    printGrid() {
        var grid = [];
        for (var i = 0; i < rows; i++) {
            var row = [];
            for (var j = 0; j < cols; j++) {
                var status = this.cellStatus(i, j);
                row.push(
                    <Cell key={"col_"+j} x={j} y={i} 
                    status={status} emitBomb={this.props.emitBomb} 
                    bombResult={this.props.bombResult}/>
                );
            }
            grid.push(<tr key={"row_"+i}>{row}</tr>);
        }
        console.log(grid);
        return grid;
    }

    cellStatus(x, y) {
        if (this.props.id === "player") {
            for (var i = 0; i < this.props.ships.length; i++) {
                for (var j = 0; j < this.props.ships[i].length; j++) {
                    if (this.props.ships[i][j].x === x && this.props.ships[i][j].y === y) {
                        return "ship";
                    }
                }
            }
            return "empty";
        }
    }

    render() {
        return (
            <table className="grid">
            <tbody className={this.props.id}>{this.printGrid()}</tbody>
            </table>
        );
    }
}

class Cell extends Component {

    constructor() {
        super()

        this.state = {
            bomb: null
        }
    }

    onBomb = () => (event) => {
        // console.log(this.props.bombResult);
        // this.setState({bomb: this.props.bombResult});
        // console.log(this.state.bomb);

        this.setState({bomb: "miss"});

        this.props.emitBomb(this.props.x, this.props.y);

        // return this.setState({bomb: "miss"});

        // if (this.props.status === "ship") {
        //     this.setState({bomb: "hit"});
        // } else {
        //     this.setState({bomb: "miss"});
        //     this.props.emitBomb();
        //     console.log(this.props);

        // }   
    }

    render() {
        return (
            <td onClick={this.onBomb()} className={this.props.status +" "+ this.state.bomb}></td>
        );
    }
}

export default Grid;