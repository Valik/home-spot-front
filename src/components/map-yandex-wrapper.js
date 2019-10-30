import React, { createRef, Component } from "react";
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import { withStyles } from "@material-ui/styles";
import withServices from "../services/service-injection";
import HttpService from "../services/http-service";
import { Subject } from 'rxjs';

const useStyles = theme => ({
  mapContainer: {
    "height": "calc(100vh - 64px)",
    "width": '100%',
    "margin": '0 auto',
  },
});

class MapYandexWrapper extends Component {
  state = {
    latlng: {
      lat: 59.95,
      lng: 30.31,
    },
    chatLocations: [],
    newChatPlacemark: null,
    newChatAttributes: null,
  }

  map;
  mapSubject = new Subject();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.map) {
      return;
    }

    let center = [59.95, 30.31];
    let zoom = 14;

    ymaps.ready(() => {
      this.map = new ymaps.Map('map', {
        center: center,
        zoom: zoom,
        controls: []
      });

      this.map.events.add('click', (e) => { this.setChatPlacemark(e.get('coords')); });

      let searchControl = new ymaps.control.SearchControl({
          options: {
              float: 'right',
              floatIndex: 100,
              fitMaxWidth: true,
              noPopup: true,
              noPlacemark: true,
              searchControlMaxWidth: [30, 72, 500],
          }
      });

      searchControl.events.add('resultselect', function (e) {
        this.onResultSelect(e, searchControl);
      }, this);

      this.map.controls.add(searchControl);

      ymaps.geolocation.get({
          mapStateAutoApply: true,
          autoReverseGeocode: true
      })
      .then((result) => {
        this.map.geoObjects.add(result.geoObjects);
        this.map.setCenter(result.geoObjects.position);
        this.map.setZoom(zoom);
      });

      this.mapSubject.next(this.map);
    });
  }

  onResultSelect(event, searchControl) {
    let index = searchControl.getSelectedIndex();
    let results = searchControl.getResultsArray();

    if (results.length) {
      let selectedLocation =  results[index];
      this.setChatPlacemark(selectedLocation.geometry.getCoordinates());
    }
  }

  componentWillMount() {
    this.mapSubject.subscribe(() => {
      this.props.httpService.getChatLocations().then(x => {       
        for (let i = 0; i < x.data.items.length; i++) {
          let chat = x.data.items[i];

          let placemark = new ymaps.Placemark([chat.latitude, chat.longitude], {
            iconCaption: chat.address,
            balloonContentHeader: 'Существующий чат',
            balloonContentBody: `<p>${chat.address}</p> ` +
                                '<button>Перейти в чат</button>',
          }, {
              preset: 'islands#redDotIcon',
              draggable: false
          });

          this.map.geoObjects.add(placemark);
          this.state.chatLocations.push({
            placemark: placemark,
            chatDetails: chat
          });
        }
      });
    });
  }

  setChatPlacemark = (coords) => {
    if (this.state.newChatPlacemark) {
      this.state.newChatPlacemark.geometry.setCoordinates(coords);
      this.getAddress(coords);
      return;
    }

    this.state.newChatPlacemark = this.createPlacemark(coords);
    this.map.geoObjects.add(this.state.newChatPlacemark);

    // Слушаем событие окончания перетаскивания на метке.
    this.state.newChatPlacemark.events.add('dragend', () => {
        this.getAddress(this.state.newChatPlacemark.geometry.getCoordinates());
    });

    this.getAddress(coords);
  }

  createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
        iconCaption: 'поиск...'
    }, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true
    });
  }

  // Определяем адрес по координатам (обратное геокодирование).
  getAddress(coords) {
    this.state.newChatPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords, {
      kind: "house"
    }).then((res) => {
        var firstGeoObject = res.geoObjects.get(0);

        if (!firstGeoObject) {
          this.state.newChatPlacemark.properties.set({
            iconCaption: "Адрес не найден.",
            balloonContent: "Адрес не найден. Выберите другую точку"
          });
          this.state.newChatAttributes = null;
          return;
        }

        let address = firstGeoObject.getAddressLine();
        let coordinates = firstGeoObject.geometry.getCoordinates();

        let existedChat = this.state.chatLocations.find(x => x.chatDetails.address == address);

        if (existedChat) {
          existedChat.placemark.balloon.open();
          this.map.geoObjects.remove(this.state.newChatPlacemark);
          this.state.newChatPlacemark = null;
        } else {
          this.state.newChatPlacemark.geometry.setCoordinates(coordinates);
          this.state.newChatPlacemark.properties
              .set({
                iconCaption: address,
                balloonContentHeader: 'Создать чат',
                balloonContentBody: `<p>${address}</p> ` +
                                      '<button>Создать в чат</button>',
              });
  
          this.state.newChatPlacemark.balloon.open();
        }
        //this.map.setCenter(coordinates);
    });
  }

  render() {
    const { classes } = this.props;

    return (
        <div id="map" className={classes.mapContainer}></div>
    );
  }
}

export default withServices(withStyles(useStyles)(MapYandexWrapper));