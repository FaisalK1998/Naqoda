import React, {Component} from 'react';
import {AStar} from '../algorithms/aStar';
import './PathfindingVisualizer.css';

/**
 * This class extends React component and forms the basis for the grid.
 * It specifies values for the number of rows and columns as well as
 * other required states
 */
export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        //Declare grid states
        this.state = {
        grid: [],
        START_NODE_ROW: 5,
        FINISH_NODE_ROW: 5,
        START_NODE_COL: 5,
        FINISH_NODE_COL: 8,
        mouseIsPressed: false,
        ROW_COUNT: 25,
        COLUMN_COUNT: 35,
        MOBILE_ROW_COUNT: 10,
        MOBILE_COLUMN_COUNT: 10,
        isRunning: false,
        isStartNode: false,
        isFinishNode: false,
        isWallNode: false,
        currRow: 0,
        currCol: 0,
        isDesktopView: true,
    };

        /**
         * The three main mouse event handlers
         */
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.toggleIsRunning = this.toggleIsRunning.bind(this);
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({grid});
    }

    toggleIsRunning() {
        this.setState({isRunning: !this.state.isRunning});
    }

    /**
     * This method allows the user to toggle between different views
     * Small/Large grid 
     */
    toggleView() {
        //Checks if the program is running
        if (!this.state.isRunning) {
            //If running, clear the Grid and Walls
            this.clearGrid();
            this.clearWalls();
            const isDesktopView = !this.state.isDesktopView;
            let grid;
            //If DesktopView is active then it shows the larger grid
            if (isDesktopView) {
                grid = this.getInitialGrid(
                this.state.ROW_COUNT,
                this.state.COLUMN_COUNT,
                );
                this.setState({isDesktopView, grid});
            //Else show the smaller grid
            } else {
                if (
                this.state.START_NODE_ROW > this.state.MOBILE_ROW_COUNT ||
                this.state.FINISH_NODE_ROW > this.state.MOBILE_ROW_COUNT ||
                this.state.START_NODE_COL > this.state.MOBILE_COLUMN_COUNT ||
                this.state.FINISH_NODE_COL > this.state.MOBILE_COLUMN_COUNT
                ) {
                //Alert prints on screen if the nodes are outwith the boundaries
                alert('Start & Finish Nodes Must Be within 10 Rows x 10 Columns');
                } else {
                grid = this.getInitialGrid(
                    this.state.MOBILE_ROW_COUNT,
                    this.state.MOBILE_COLUMN_COUNT,
                );
                this.setState({isDesktopView, grid});
                }
            }
        }
    }

    /**
     *  Set up the Initial Grid
     */


    /**
     * @param {*} rowCount Gets row value
     * @param {*} colCount Gets column value
     * @returns initialGrid
     */
    getInitialGrid = (
        rowCount = this.state.ROW_COUNT,
        colCount = this.state.COLUMN_COUNT,
        ) => {
            const initialGrid = [];
            for (let row = 0; row < rowCount; row++) {
            const currentRow = [];
            for (let col = 0; col < colCount; col++) {
                currentRow.push(this.createNode(row, col));
            }
            initialGrid.push(currentRow);
            }
            return initialGrid;
        };
    /**
     * Create Node method
     * @param {*} row 
     * @param {*} col 
     * @returns new node
     */    
    createNode = (row, col) => {
        return {
        row,
        col,
        isStart:
            row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
        isFinish:
            row === this.state.FINISH_NODE_ROW &&
            col === this.state.FINISH_NODE_COL,
        distance: Infinity,
        distanceToFinishNode:
            Math.abs(this.state.FINISH_NODE_ROW - row) +
            Math.abs(this.state.FINISH_NODE_COL - col),
        isVisited: false,
        isWall: false,
        previousNode: null,
        isNode: true,
        };
    };

    /**
     * Control Mouse Events
     */

    /**
     * This method handles the event of when the mouse is moved down
     * @param {*} row 
     * @param {*} col 
     */
    handleMouseDown(row, col) {
        //Checks if the program is running 
        if (!this.state.isRunning) {
            //If running, check if the grid is clear
            if (this.isGridClear()) {
                //Gets the start node element
                if (document.getElementById(`node-${row}-${col}`).className === 'node node-start') {
                    this.setState({
                        mouseIsPressed: true,
                        isStartNode: true,
                        currRow: row,
                        currCol: col,
                    });
                //Gets the finish node element
                } else if (document.getElementById(`node-${row}-${col}`).className === 'node node-finish') {
                    this.setState({
                        mouseIsPressed: true,
                        isFinishNode: true,
                        currRow: row,
                        currCol: col,
                    });
                } else {
                    //Gets new grid with wall toggled
                    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                    this.setState({
                        grid: newGrid,
                        mouseIsPressed: true,
                        isWallNode: true,
                        currRow: row,
                        currCol: col,
                    });
                }
            } else {
                //Clear the grid
                this.clearGrid();
            }
        }
    }

    /**
     * This method checks if the Grid is cleared
     * @returns true if cleared
     */
    isGridClear() {
        for (const row of this.state.grid) {
            //Gets the node row and column via its ID
            for (const node of row) {const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`,).className;
                if (
                    nodeClassName === 'node node-visited' ||
                    nodeClassName === 'node node-shortest-path'
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * This method handles the mouse event for setting start and finish nodes
     * @param {*} row 
     * @param {*} col 
     */
    handleMouseEnter(row, col) {
        //Checks if the program is running
        if (!this.state.isRunning) {
            //Check if the mouse has been pressed, if so, get the row and column ID's
            if (this.state.mouseIsPressed) {const nodeClassName = document.getElementById(`node-${row}-${col}`).className;
                if (this.state.isStartNode) {
                    if (nodeClassName !== 'node node-wall') {
                        const prevStartNode = this.state.grid[this.state.currRow][
                        this.state.currCol
                        ];
                        prevStartNode.isStart = false;
                        document.getElementById(
                        `node-${this.state.currRow}-${this.state.currCol}`,
                        ).className = 'node';
            
                        this.setState({currRow: row, currCol: col});
                        const currStartNode = this.state.grid[row][col];
                        currStartNode.isStart = true;
                        document.getElementById(`node-${row}-${col}`).className =
                        'node node-start';
                    }
                    //Sets the start node row and column
                    this.setState({START_NODE_ROW: row, START_NODE_COL: col});
                } else if (this.state.isFinishNode) {
                    if (nodeClassName !== 'node node-wall') {
                        const prevFinishNode = this.state.grid[this.state.currRow][
                        this.state.currCol
                        ];
                        prevFinishNode.isFinish = false;
                        document.getElementById(
                        `node-${this.state.currRow}-${this.state.currCol}`,
                        ).className = 'node';
            
                        this.setState({currRow: row, currCol: col});
                        const currFinishNode = this.state.grid[row][col];
                        currFinishNode.isFinish = true;
                        document.getElementById(`node-${row}-${col}`).className =
                        'node node-finish';
                    }
                    //Sets the finish node row and column
                    this.setState({FINISH_NODE_ROW: row, FINISH_NODE_COL: col});
                } else if (this.state.isWallNode) {
                    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                    this.setState({grid: newGrid});
                }
            }
        }
    }
    
    /**
     * This method handles the event of when the mouse is moved up
     * @param {*} row 
     * @param {*} col 
     */
    handleMouseUp(row, col) {
        //Checks if the program is running
        if (!this.state.isRunning) {
            //Sets the boolean property to false
            this.setState({mouseIsPressed: false});
            //Checks if their is a start node
            if (this.state.isStartNode) {
                const isStartNode = !this.state.isStartNode;
                this.setState({isStartNode, START_NODE_ROW: row, START_NODE_COL: col});
            //Checks if their is a finish node
            } else if (this.state.isFinishNode) {
                const isFinishNode = !this.state.isFinishNode;
                this.setState({isFinishNode, FINISH_NODE_ROW: row, FINISH_NODE_COL: col,
                });
            }
          this.getInitialGrid();
        }
    }
    
    /**
     * This method handles the event of when the mouse has left the element
     */
    handleMouseLeave() {
        //Checks if their is a start node
        if (this.state.isStartNode) {
            const isStartNode = !this.state.isStartNode;
            this.setState({isStartNode, mouseIsPressed: false});
        //Checks if their is a finish node    
        } else if (this.state.isFinishNode) {
            const isFinishNode = !this.state.isFinishNode;
            this.setState({isFinishNode, mouseIsPressed: false});
        //Checks if their is wall nodes    
        } else if (this.state.isWallNode) {
            const isWallNode = !this.state.isWallNode;
            this.setState({isWallNode, mouseIsPressed: false});
            this.getInitialGrid();
        }
    }