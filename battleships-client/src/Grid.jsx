import React, { Component } from 'react';
import './App.css';


const cols = 10;
const rows = 10;

class Grid extends Component {

    constructor() {
        super();

        
    }

    printGrid() {
        var grid = [];
        for (var i=0; i < rows; i++) {
            var row = [];
            for (var j=0; j < cols; j++) {
                //var status = this.cellStatus(i,j);  //status={status}
                row.push(<Cell key={(i/10)+j} x={j} y={i} />);
            }
            grid.push(<tr key={"row_"+i}>{row}</tr>);
        }
        return grid;
    }

    render() {
        return (
            <table className="grid">
            <tbody>{this.printGrid()}</tbody>
            </table>
        );
    }
}

class Cell extends Component {

    onMouseOverCell() {
        var x = this.props.x,
            y = this.props.y;
    }

    render() {
        return (
            <td onMouseOver={this.onMouseOverCell}></td>
        );
    }
}

export default Grid;