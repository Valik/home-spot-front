// @flow

import React, { createRef, Component } from "react";
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { withStyles } from "@material-ui/styles";
import withServices from "../services/service-injection";
import HttpService from "../services/http-service";

declare var ymaps: any;

const useStyles = theme => ({
  mapContainer: {
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
  chatLocations: [],
}

type Props = {
  classes: any,
  httpService: HttpService
}

class MapYandexWrapper extends Component<Props, State> {
  state = {
    hasLocation: false,
    latlng: {
      lat: 59.95,
      lng: 30.31,
    },
    chatLocations: [],
  }

  map = createRef<any>();

  constructor(props) {
    super(props);

    console.log(this.props.httpService);
  }

  componentDidMount() {

    let center = [59.95, 30.31];
    let zoom = 14;

    if (this.map.current) {
      this.map.current.geoObjects.removeAll();
      this.map.current.setCenter(center);
      this.map.current.setZoom(zoom);
      this.setApartmentPlacemark(center);
    } else {
      ymaps.ready(() => {
        this.map.current = new ymaps.Map('map', {
          center: center,
          zoom: zoom,
        });


        this.map.current.behaviors.disable('scrollZoom');

        let searchControl = new ymaps.control.SearchControl({
            options: {
                float: 'right',
                floatIndex: 100,
                fitMaxWidth: true
            }
        });

        searchControl.events.add('resultshow', function () {
          console.log('request: ' + searchControl.getRequestString());

          this.onSearchSubmit({}, searchControl);
        }, this);

        this.map.current.controls.add(searchControl);

        this.setPlacemark(center);
      });
    }
  }

  onSearchSubmit(event, searchControl) {
    console.log('request: ' + searchControl.getRequestString());
  }


  setPlacemark(center){
    let placeMark = new ymaps.Placemark(
      center, {
          balloonContentHeader: "balloonContentHeader",
          balloonContentBody: "balloonContentBody",
          balloonContentFooter: "balloonContentFooter",
          hintContent: "hintContent"
      }, {
        preset: 'islands#greenHomeIcon'
      }
    );

    this.map.current.geoObjects.add(placeMark);
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

  handleLocationFound = (e: Object) => {
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
        <div id="map" className={classes.mapContainer}></div>
    );
  }
}

export default withServices(withStyles(useStyles)(MapYandexWrapper));