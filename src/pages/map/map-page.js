// @flow

import React, { Component } from "react";

import TopBar from "../../components/app-bar"
import MapWrapper from "../../components/map-wrapper"

import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
});

class MapPage extends Component {
  constructor() {
    super();

    this.state = {
      prop1: ""
    };
  }

  render() {

    const position = [59.95, 30.31]

    const { classes } = this.props;
    return (

      <React.Fragment>
        <TopBar></TopBar>
        <MapWrapper />
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(MapPage);