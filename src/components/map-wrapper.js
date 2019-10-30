import React, { createRef, Component } from "react";
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { withStyles } from "@material-ui/styles";
import withServices from "../services/service-injection";
import HttpService from "../services/http-service";

const useStyles = theme => ({
  leafletContainer: {
    "height": "calc(100vh - 64px)",
    "width": '100%',
    "margin": '0 auto',
  },
});

class MapWrapper extends Component {
  state = {
    hasLocation: false,
    latlng: {
      lat: 59.95,
      lng: 30.31,
    },
    chatLocations: [],
  }

  mapRef = createRef()

  constructor(props) {
    super(props);

    console.log(this.props.httpService);
  }

  componentWillMount(){
      console.log("componentWillMount()");

      this.props.httpService.getChatLocations().then(x => {
        this.setState(state => {
            state.chatLocations = x.data.items;
            return state;
        });
      });
  }

  handleClick = () => {
    const map = this.mapRef.current
    if (map != null && !this.state.hasLocation) {
      map.leafletElement.locate();
    }
    console.log(this.mapRef);
  }

  handleLocationFound = (e) => {
    if (!this.state.hasLocation) {
      this.setState(state => {
          state.hasLocation = true;
          return state;
      });
    }    
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
            {
              this.state.chatLocations.map(x => 
                <Marker key={x.latitude + x.longitude} position={[x.latitude, x.longitude]}>
                  <Popup>
                    <span>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </span>
                  </Popup>
                </Marker>
              )
            }
        </Map>
    );
  }
}

export default withServices(withStyles(useStyles)(MapWrapper));