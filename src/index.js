import React from "react";
import ReactDOM from "react-dom";
//import { createBrowserHistory } from "history";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
//import registerServiceWorker from "./registerServiceWorker";
// core components
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

import "assets/css/dgs-dashboard.css?v=1.8.0";

//const hist = createBrowserHistory();

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/admin" component={Admin} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
//registerServiceWorker();
