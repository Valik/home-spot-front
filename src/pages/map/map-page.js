import React, { Component } from "react";

import TopBar from "../../components/app-bar"
import MapWrapper from "../../components/map-wrapper"
import MapYandexWrapper from "../../components/map-yandex-wrapper"

import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
});

class MapPage extends Component {

  constructor() {
    super();
  }

  render() {

    const position = [59.95, 30.31]

    const { classes } = this.props;
    return (

      <React.Fragment>
        <TopBar></TopBar>
        <MapYandexWrapper />
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(MapPage);