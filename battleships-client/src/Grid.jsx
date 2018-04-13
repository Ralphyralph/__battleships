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
                row.push(<Cell key={"col_"+j} x={j} y={i} status={status} />);
            }
            grid.push(<tr key={"row_"+i}>{row}</tr>);
        }
        console.log(grid);
        return grid;
    }

    cellStatus(x, y) {
        for (var i = 0; i < this.props.ships.length; i++) {
            for (var j = 0; j < this.props.ships[i].length; j++) {
                if (this.props.ships[i][j].x === x && this.props.ships[i][j].y === y) {
                    return "ship";
                }
            }
        }
        return "empty";
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
            <td className={this.props.status}></td>
        );
    }
}

export default Grid;