import React from "react";
import "../StyleSheet/Common.css";

import { Button, Classes, Dialog, Intent, FormGroup, InputGroup, Alert } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";


import ConfigToken from "../Config/ConfigToken";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uName: "",
            pass: "",
            isOpenError: false,
            loading: false,
            errorMsg: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.checkLogin();
    }

    checkLogin = async () => {
        let models = {
            token: window.localStorage.getItem(ConfigToken.token)
        };
        await FetchApi.PostDataUnAuthorize(ConfigConnect.host + ":" + ConfigConnect.port + "/verify-token", models)
            .then((res) => {
                if (res) {
                    if (res.status) {
                        this.props.history.push("/");
                    }
                }
            })
            .catch((error) => {
                console.log("Error removing document: ", error);
            });
    };

    onLogin = async () => {
        const { uName, pass } = this.state;

        if ((uName === "" || uName === null) && (pass === "" || pass === null)) {
            this.setState({
                isOpenError: true,
                errorMsg: "Please enter the username or password"
            });
        } else {
            let models = {
                _uName: uName,
                _pass: pass
            };
            this.setState({ loading: true });
            await FetchApi.PostDataUnAuthorize(ConfigConnect.host + ":" + ConfigConnect.port + "/sign-in", models)
                .then((res) => {
                    if (res.status) {
                        // User is signed in.
                        window.localStorage.setItem(ConfigToken.token, res.token);
                        this.props.history.push("/");
                    } else {
                        this.setState({
                            isOpenError: true,
                            loading: false,
                            errorMsg: res.message
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
        }
    };

    onRegister = () => {
        this.props.history.push("/auth/register");
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    render = () => {
        const { errorMsg, isOpenError, loading } = this.state;
        return (
            <Dialog
                icon="info-sign"
                title="Login"
                autoFocus
                usePortal
                isOpen
                isCloseButtonShown={false}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup className="form-group-custom-0">
                        <InputGroup onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                this.onLogin();
                            }
                        }} leftIcon={IconNames.USER} autoComplete="off" id="uName" name="uName" onChange={this.handleChange} placeholder="Please enter the username" />
                    </FormGroup>

                    <FormGroup className="form-group-custom-1">
                        <InputGroup onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                this.onLogin();
                            }
                        }} leftIcon={IconNames.LOCK} autoComplete="off" id="pass" name="pass" type="password" onChange={this.handleChange} placeholder="Please enter the password" />
                    </FormGroup>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.onRegister}>Register</Button>

                        <Button onClick={this.onLogin} loading={loading} intent={Intent.PRIMARY} >Login</Button>
                    </div>
                </div>


                <Alert
                    icon={IconNames.ERROR}
                    confirmButtonText="Ok"
                    isOpen={isOpenError}
                    onClose={() => this.setState({ isOpenError: false })}
                >
                    <p>
                        {errorMsg}
                    </p>
                </Alert>
            </Dialog>
        );
    };
};
export default Login;