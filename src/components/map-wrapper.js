// @flow

import React, { createRef, Component } from "react";

import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
  leafletContainer: {
    "height": "calc(100vh - 64px)",
    "width": '100%',
    "margin": '0 auto',
  },
});


type State = {
  hasLocation: boolean,
  latlng: {
    lat: number,
    lng: number,
  },
}

class MapWrapper extends Component<{}, State> {
  state = {
    hasLocation: false,
    latlng: {
      lat: 59.95,
      lng: 30.31,
    },
  }

  mapRef = createRef<Map>()

  constructor() {
    super();
  }

  handleClick = () => {
    const map = this.mapRef.current
    if (map != null) {
      map.leafletElement.locate();
    }
    console.log(this.mapRef);
  }

  handleLocationFound = (e: Object) => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
    })
  }

  render() {
    const position = [59.95, 30.31]
    const { classes } = this.props;

    return (
        <Map
          center={this.state.latlng}
          zoom={13}
          className={classes.leafletContainer}
          ref={this.mapRef}
          onClick={this.handleClick}
          onLocationfound={this.handleLocationFound}>
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
    );
  }
}

export default withStyles(useStyles)(MapWrapper);