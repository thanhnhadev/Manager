import React from "react";
import { Route, Switch } from "react-router-dom";

/*--Import-component-- */
import Login from "../Pages/Login";
import Register from "../Pages/Register";
class LayoutLogin extends React.Component {
    render = () => {
        return (
            <Switch>
                <Route path="/auth/login" component={Login} />
                <Route path="/auth/register" component={Register} />
            </Switch>
        );
    };
}
export default LayoutLogin;
