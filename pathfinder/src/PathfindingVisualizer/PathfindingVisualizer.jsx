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