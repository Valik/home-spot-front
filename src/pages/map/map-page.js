import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from 'react-router-dom';
import TopBar from "../../components/app-bar"
import { GoogleMap } from "react-google-maps"

class MapPage extends Component {
  constructor() {
    super();
    this.state = {
      seo_title: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    return (
      <div>
        <TopBar />
      </div>
    );
  }
}

export default MapPage;