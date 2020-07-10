import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route } from "react-router-dom";

import "./App.css";

/*--Import-component-- */
import LayoutDash from "./Layouts/LayoutDash";
import LayoutLogin from "./Layouts/LayoutLogin";

const history = createBrowserHistory();

class App extends React.Component {
  render = () => {
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" component={LayoutDash} />
          <Route path="/dash" component={LayoutDash} />
          <Route path="/projects" component={LayoutDash} />
          <Route path="/task" component={LayoutDash} />
          <Route path="/users" component={LayoutDash} />
          <Route path="/Assign" component={LayoutDash} />

          {/* Layout-Login */}
          <Route path="/auth" component={LayoutLogin} />
        </div>
      </Router>
    );
  };
};
export default App;