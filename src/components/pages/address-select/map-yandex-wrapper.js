import React, { createRef, Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/styles";

import withServices from "../../../services/service-injection";

class MapYandexWrapper extends Component {
  static propTypes = {
    classes: PropTypes.object,
    httpService: PropTypes.object,
  }

  state = {
    hasLocation: false,
    latlng: {
      lat: 59.95,
      lng: 30.31,
    },
    chatLocations: [],
  }

  map = createRef();

  constructor(props) {
    super(props);
    
    props.httpService.getChatLocations().then(x => {
      this.setState(state => {
        state.chatLocations = x.data.items;
        return state;
      });
    });
  }

  componentDidMount() {
    const mapParams = {
      center: [59.95, 30.31],
      zoom: 14
    }
    const { ymaps } = window;

    if (this.map.current) {
      this.map.current.geoObjects.removeAll();
      this.map.current.setCenter(mapParams.center);
      this.map.current.setZoom(mapParams.zoom);
      this.setApartmentPlacemark(mapParams.center);
    } else {
      ymaps.ready(() => {
        this.map.current = new ymaps.Map('map', mapParams);
        this.map.current.behaviors.disable('scrollZoom');
        const searchControl = new ymaps.control.SearchControl({
          options: {
            float: 'right',
            floatIndex: 100,
            fitMaxWidth: true
          }
        });

        searchControl.events.add('resultshow', function () {
          this.onSearchSubmit({}, searchControl);
        }, this);

        this.map.current.controls.add(searchControl);

        this.setPlacemark(mapParams.center);
      });
    }
  }


  handleClick = () => {
    const { hasLocation } = this.state;
    const map = this.mapRef.current;

    if (map != null && !hasLocation) {
      map.leafletElement.locate();
    }
  }

  handleLocationFound = () => {
    const { hasLocation } = this.state;

    if (!hasLocation) {
      this.setState({ hasLocation: true });
    }    
  }

  setPlacemark(center){
    const { ymaps } = window;
    const placeMark = new ymaps.Placemark(
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

  onSearchSubmit(event, searchControl) {
    console.log('request: ' + searchControl.getRequestString());
  }

  render() {
    const { classes } = this.props;

    return (
      <div id="map" className={classes.mapContainer}></div>
    );
  }
}

const useStyles = () => ({
  mapContainer: {
    "height": "calc(100vh - 64px)",
    "width": '100%',
    "margin": '0 auto',
  },
});

export default withServices(withStyles(useStyles)(MapYandexWrapper));