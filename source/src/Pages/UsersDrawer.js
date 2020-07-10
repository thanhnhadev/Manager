import React from "react";
import {
    Button
    , Intent
    , Alignment
    , Classes
    , Drawer
    , Position
    , FormGroup
    , InputGroup
    , Alert
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";
import firebase from "../Config/Firebase";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

class UsersDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection("projects");
        this.state = {
            loading: false,
            isOpen: false,
            isOpenError: false,
            errorMsg: "",
            titleDrawer: "Add new user",

            dataKey: null,
            uName: "",
            pass: "",
            displayName: "",
            photoURL: "",
            email: ""
        };
    }

    resetText = () => {
        this.setState({
            dataKey: null,
            uName: "",
            pass: "",
            displayName: "",
            photoURL: "",
            email: ""
        });
    };

    onSetData = () => {
        let isEdit = this.props.isEdit;
        if (isEdit) {
            this.onSubmit();
        } else {
            this.onUpdate();
        }
    };

    onSubmit = async () => {
        const { uName, pass, displayName, photoURL, email } = this.state;

        if (uName === "" || uName === null) {
            this.setState({
                errorMsg: "Please enter the username",
                isOpenError: true
            });
        }
        else if (pass === "" || pass === null) {
            this.setState({
                errorMsg: "Please enter the password",
                isOpenError: true
            });
        }
        else if (displayName === "" || displayName === null) {
            this.setState({
                errorMsg: "Please enter the display name",
                isOpenError: true
            });
        }
        else if (email === "" || email === null) {
            this.setState({
                errorMsg: "Please enter the email",
                isOpenError: true
            });
        }
        else {
            let models = {
                _uName: uName
                , _pass: pass
                , _displayName: displayName
                , _photoURL: photoURL
                , _email: email
            };
            this.setState({ loading: true });
            await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/users", models)
                .then((res) => {
                    if (res.status) {
                        this.setState({
                            loading: false,
                            isOpen: false
                        }, () => { this.resetText(); this.props.renderInputValue(); });
                    } else {
                        this.setState({
                            loading: false,
                            isOpenError: true,
                            errorMsg: res.message
                        });
                    }
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.error("Error adding document: ", error);
                });
        }
    };

    onUpdate = async () => {
        const { uName, pass, displayName, photoURL, email } = this.state;
        const updateRef = this.state.dataKey;

        if (updateRef !== null) {
            if (uName === "" || uName === null) {
                this.setState({
                    errorMsg: "Please enter the username",
                    isOpenError: true
                });
            }
            else if (pass === "" || pass === null) {
                this.setState({
                    errorMsg: "Please enter the password",
                    isOpenError: true
                });
            }
            else if (displayName === "" || displayName === null) {
                this.setState({
                    errorMsg: "Please enter the display name",
                    isOpenError: true
                });
            }
            else if (email === "" || email === null) {
                this.setState({
                    errorMsg: "Please enter the email",
                    isOpenError: true
                });
            }
            else {
                let models = {
                    _uName: uName
                    , _pass: pass
                    , _displayName: displayName
                    , _photoURL: photoURL
                    , _email: email
                };
                this.setState({ loading: true });
                await FetchApi.PutData(ConfigConnect.host + ":" + ConfigConnect.port + "/users/" + this.state.dataKey, models)
                    .then((res) => {
                        if (res.status) {
                            this.setState({
                                loading: false,
                                isOpen: false
                            }, () => { this.resetText(); this.props.renderInputValue(); });
                        } else {
                            this.setState({
                                loading: false,
                                isOpenError: true,
                                errorMsg: res.message
                            });
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                        console.error("Error adding document: ", error);
                    });
            }
        } else {
            this.setState({
                errorMsg: "Data Key null",
                isOpenError: true,
                loading: false
            });
        }
    };

    handleOpen = () => {
        this.setState({ isOpen: true });
    };

    handleClose = () => {
        this.setState({ isOpen: false, titleDrawer: "Add new user" });
        this.resetText();
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
        console.log(evt.target.name);
    };

    onEdit = () => {
        let dataKey = this.props.dataKey;
        let dataSrc = this.props.dataSrc;
        let titleDrawer = this.props.titleDrawer;
        this.setState({
            dataKey: dataKey,
            uName: dataSrc._uname,
            pass: dataSrc._pass,
            displayName: dataSrc._displayName,
            photoURL: dataSrc._photoURL,
            email: dataSrc._email,
            titleDrawer: titleDrawer
        }, () => {
            this.handleOpen();
        });
    };

    render = () => {
        const { isOpen, isOpenError, errorMsg, loading, titleDrawer, uName, pass, displayName, photoURL, email } = this.state;
        return (
            <Drawer
                icon={IconNames.USER}
                onClose={this.handleClose}
                title={titleDrawer}
                canOutsideClickClose={false}
                isOpen={isOpen}
                position={Position.RIGHT}
                size={Drawer.SIZE_SMALL}
            >
                <div className={Classes.DRAWER_BODY}>
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup className="form-group-custom-0">
                            <InputGroup name="uName" autoComplete="off" value={uName} onChange={this.handleChange} placeholder="Please enter the username" />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <InputGroup name="pass" autoComplete="off" type="password" value={pass} onChange={this.handleChange} placeholder="Please enter the password" />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <InputGroup name="displayName" autoComplete="off" value={displayName} onChange={this.handleChange} placeholder="Please enter the display name" />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <InputGroup name="photoURL" autoComplete="off" value={photoURL} onChange={this.handleChange} placeholder="Please enter the photo url" />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <InputGroup name="email" autoComplete="off" value={email} onChange={this.handleChange} placeholder="Please enter the email" />
                        </FormGroup>
                    </div>
                </div>
                <div className={Classes.DRAWER_FOOTER} style={{ textAlign: "right" }}>
                    {
                        !this.props.isEdit ? <Button onClick={() => this.onSubmit()} loading={loading} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.DUPLICATE} text="Clone user" className={Classes.BUTTON} style={{ marginRight: ".3rem" }} /> : null
                    }
                    <Button onClick={() => this.onSetData()} loading={loading} alignText={Alignment.CENTER} intent={Intent.PRIMARY} icon={IconNames.FLOPPY_DISK} text="Save" className={Classes.BUTTON} />
                </div>


                <Alert
                    icon={IconNames.INFO_SIGN}
                    confirmButtonText="Ok"
                    isOpen={isOpenError}
                    onClose={() => this.setState({ isOpenError: false })}
                >
                    <p>
                        {errorMsg}
                    </p>
                </Alert>
            </Drawer>
        );
    };
};
export default UsersDrawer;
