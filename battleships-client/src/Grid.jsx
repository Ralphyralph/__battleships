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
                row.push(<Cell key={"col_"+j} x={j} y={i} />);
            }
            grid.push(<tr key={"row_"+i}>{row}</tr>);
        }
        //console.log(grid);
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

    render() {
        return (
            <td></td>
        );
    }
}

export default Grid;