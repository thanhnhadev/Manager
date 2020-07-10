import React from "react";
import { Route } from "react-router-dom";

/*--Import-component-- */
import Root from "../Pages/Root";
import ListProject from "../Pages/ListProject";
import Dashboard from "../Pages/Dashboard";
import Task from "../Pages/Task";
import Users from "../Pages/Users";
import UserAssign from "../Pages/UserAssign";

class LayoutDash extends React.Component {
    render = () => {
        return (
            <div>
                <Route path="/" component={Root} />
                <Route path="/dash" component={Dashboard} />
                <Route path="/projects" component={ListProject} />
                <Route path="/task" component={Task} />
                <Route path="/users" component={Users} />
                <Route path="/assign" component={UserAssign} />
            </div>
        );
    };
}
export default LayoutDash;
