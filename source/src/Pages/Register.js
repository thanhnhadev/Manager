import React from "react";
import "../StyleSheet/Common.css";

import { Button, Classes, Dialog, Intent, FormGroup, InputGroup, Alert } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import ConfigToken from "../Config/ConfigToken";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

class Register extends React.Component {
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
    }

    onLogin = () => {
        this.props.history.push("/auth/login");
    };

    onLogout = () => {
        window.localStorage.removeItem(ConfigToken.token);
        this.onGoToPage("/auth/login");
    };

    onRegister = async () => {
        const { uName, pass } = this.state;
        if ((uName === "" || uName === null) && (pass === "" || pass === null)) {
            this.setState({
                isOpenError: true,
                errorMsg: "Please enter the username or password"
            });
        } else {
            let models = {
                _uName: uName
                , _pass: pass
            };
            this.setState({ loading: true });
            await FetchApi.PostDataUnAuthorize(ConfigConnect.host + ":" + ConfigConnect.port + "/registerUsers", models)
                .then((res) => {
                    if (res.status) {
                        this.setState({
                            isOpenError: true,
                            errorMsg: "Register user sucess",
                            loading: false,
                            uName: "",
                            pass: ""
                        }, () => this.onLogout());
                    } else {
                        this.setState({
                            loading: false,
                            isOpenError: true,
                            errorMsg: res.message
                        });
                    }
                })
                .catch((error) => {
                    this.setState({
                        isOpenError: true,
                        loading: false,
                        errorMsg: error
                    });
                });
        }
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    render = () => {
        const { errorMsg, isOpenError, loading } = this.state;
        return (
            <Dialog
                icon={IconNames.USER}
                title="Register"
                autoFocus
                usePortal
                isOpen
                isCloseButtonShown={false}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup className="form-group-custom-0">
                        <InputGroup leftIcon={IconNames.USER} autoComplete="off" id="uName" name="uName" onChange={this.handleChange} placeholder="Please enter the username" />
                    </FormGroup>

                    <FormGroup className="form-group-custom-1">
                        <InputGroup leftIcon={IconNames.LOCK} autoComplete="off" id="pass" name="pass" type="password" onChange={this.handleChange} placeholder="Please enter the password" />
                    </FormGroup>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.onLogin}>Login</Button>
                        <Button onClick={this.onRegister} loading={loading} intent={Intent.PRIMARY} >Register</Button>
                    </div>
                </div>


                <Alert
                    icon={IconNames.ERROR}
                    confirmButtonText="Ok"
                    isOpen={isOpenError}
                    onClose={() => this.setState({ isOpenError: false })}
                >
                    <p>{errorMsg}</p>
                </Alert>
            </Dialog>
        );
    };
}

export default Register;