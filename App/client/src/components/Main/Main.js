import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import styles from './Main.module.scss';
import Feed from "../Feed/Feed";
import UserPage from "../UserPage/UserPage";
import Statistics from "../Statistics/Statistics";

export default class Main extends React.PureComponent {
  render() {
    return(
      <div className={styles.container}>
        <Switch>
          <Route path="/feed" >
            <div style={{ marginTop: '2rem' }}>
              <Feed/>
            </div>
          </Route>
          <Route path="/users/:userId" >
            <UserPage/>
          </Route>
          <Route path="/statistics" >
            <Statistics/>
          </Route>
          <Route path="/" >
            <Redirect to={'/feed'}/>
          </Route>
        </Switch>
      </div>
    );
  }
}