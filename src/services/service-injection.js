// @flow

import React, { Component } from "react";
import HttpService from "./http-service";

export default function withServices (WrappedComponent: any) {
  class WithInjectedServices extends Component<any> {
    render () {

      const httpService = new HttpService();
    
      return (
        <WrappedComponent
          {...this.props}
          httpService={httpService}
        />
      );
    }
  }
  return WithInjectedServices;
}