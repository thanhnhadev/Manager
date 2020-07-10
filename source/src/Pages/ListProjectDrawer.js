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
    , TextArea
    , Alert
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

class ListProjectDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpen: false,
            isOpenError: false,
            errorMsg: "",
            titleDrawer: "Add new project",

            dataKey: null,
            title: "",
            description: ""
        };
    }

    resetText = () => {
        this.setState({ title: "", description: "" });
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
        const { title, description } = this.state;

        if (title === "" || title === null) {
            this.setState({
                errorMsg: "Please enter the project name",
                isOpenError: true
            });
        }
        else if (description === "" || description === null) {
            this.setState({
                errorMsg: "Please enter the description",
                isOpenError: true
            });
        }
        else {
            let models = {
                _title: title,
                _description: description,
            };
            this.setState({ loading: true });
            await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/projects", models)
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
        const { title, description } = this.state;
        const updateRef = this.state.dataKey;

        if (updateRef !== null) {
            if (title === "" || title === null) {
                this.setState({
                    errorMsg: "Please enter the project name",
                    isOpenError: true
                });
            }
            else if (description === "" || description === null) {
                this.setState({
                    errorMsg: "Please enter the description",
                    isOpenError: true
                });
            }
            else {
                let models = {
                    _title: title,
                    _description: description,
                };
                this.setState({ loading: true });
                await FetchApi.PutData(ConfigConnect.host + ":" + ConfigConnect.port + "/projects/" + this.state.dataKey, models)
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
        this.setState({ isOpen: false, titleDrawer: "Add new project" });
        this.resetText();
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    onEdit = () => {
        let dataKey = this.props.dataKey;
        let dataSrc = this.props.dataSrc;
        let titleDrawer = this.props.titleDrawer;

        this.setState({
            dataKey: dataKey,
            title: dataSrc._title,
            description: dataSrc._description,
            titleDrawer: titleDrawer
        }, () => {
            this.handleOpen();
        });
    };

    render = () => {
        const { isOpen, isOpenError, errorMsg, loading, titleDrawer, title, description } = this.state;
        return (
            <Drawer
                icon={IconNames.PROJECTS}
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
                            <InputGroup name="title" autoComplete="off" value={title} onChange={this.handleChange} placeholder="Please enter the project name" />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <TextArea className="text-area-height" value={description} growVertically large fill name="description" onChange={this.handleChange} placeholder="Please enter the description" />
                        </FormGroup>
                    </div>
                </div>
                <div className={Classes.DRAWER_FOOTER} style={{ textAlign: "right" }}>
                    {
                        !this.props.isEdit ? <Button onClick={() => this.onSubmit()} loading={loading} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.DUPLICATE} text="Clone project" className={Classes.BUTTON} style={{ marginRight: ".3rem" }} /> : null
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
export default ListProjectDrawer;
