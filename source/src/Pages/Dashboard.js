import React from "react";
import {
    Button
    , Intent
    , Alignment
    , Classes
    , Card
    , Elevation
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: []
        };
    }

    onGetData = async () => {
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/projects")
            .then((res) => {
                this.setState({
                    boards: res
                });
            });
    };

    componentDidMount = () => {
        this.onGetData();
    };


    render = () => {
        const { boards } = this.state;
        return (
            <div className="container">
                {
                    boards.map((value, _index) => {
                        return (
                            <div key={value._id} className="item">
                                <Card className="card-custom" interactive={true} elevation={Elevation.TWO}>
                                    <h5 className="card-title-h5"><a href="/">{value._title}</a></h5>
                                    <div className="card-body-custom">
                                        <p className="card-content-p block-with-text">{value._description}</p>
                                    </div>

                                    <Button alignText={Alignment.CENTER} intent={Intent.PRIMARY} icon={IconNames.EYE_ON} text="View project" className={Classes.BUTTON} />
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
        );
    };
};
export default Dashboard;
