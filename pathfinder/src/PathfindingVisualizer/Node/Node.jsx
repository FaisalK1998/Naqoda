//Necessary Imports
import React, {Component} from 'react';
import './Node.css';

/**
 * The Node class renders the following data when called, 
 * it should examine this.props and return React elements
 */
export default class Node extends Component {
    render() {
        const {
        col,
        isFinish,
        isStart,
        isWall,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        row,
        } = this.props;
        
        /**
         * The conditional (ternary) operator is the only JavaScript operator that takes three operands: 
         * a condition followed by a question mark (?), then an expression to execute if the condition is truthy followed by a colon (:), 
         * and finally the expression to execute if the condition is falsy. 
         * This operator is frequently used as a shortcut for the if statement.
         */
        const extraClassName = isFinish
        ? 'node-finish'
        : isStart
        ? 'node-start'
        : isWall
        ? 'node-wall'
        : '';
        
        //Returns the following data in a table
        return (
        <td
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}>
        </td>
        );
    }
}
