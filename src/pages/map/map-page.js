import React, { Component } from "react";

import ReactDOM from "react-dom";
import { withRouter } from 'react-router-dom';
import TopBar from "../../components/app-bar"

import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
  leafletContainer: {
    "height": "calc(100vh - 64px)",
    "width": '100%',
    "margin": '0 auto',
  },
});

class MapPage extends Component {
  constructor() {
    super();

    this.state = {
      prop1: ""
    };
  }

  render() {

    const position = [51.505, -0.09]

    const { classes } = this.props;
    return (

      <React.Fragment>
        <TopBar></TopBar>
        <Map center={position} zoom={13} className={classes.leafletContainer}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <span>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </span>
              </Popup>
            </Marker>
        </Map>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(MapPage);