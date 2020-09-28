import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Auth from "./Auth";

export default class AuthRouter extends React.PureComponent{
  render() {
    return (
      <Switch>
        <Route path="/login">
          <Auth type={'login'}/>
        </Route>
        <Route path="/register">
          <Auth/>
        </Route>
        <Route path="/">
          <Redirect to={'/login'}/>
        </Route>
      </Switch>
    );
  }
}