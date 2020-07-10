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
import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import moment from "moment";

import "../StyleSheet/Common.css";
import firebase from "../Config/Firebase";

import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

class TaskDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection("task");
        this.db = firebase.firestore();
        this.state = {
            loading: false,
            isOpen: false,
            isOpenError: false,
            errorMsg: "",
            titleDrawer: "Add new task",

            items: [],
            dataKey: null,
            title: "",
            projectRef: "",
            issueTypeRequired: "",
            priority: "",
            startDate: moment(new Date()).toDate(),
            endDate: null,
            description: ""
        };
    }

    resetText = () => {
        this.setState({
            title: "",
            projectRef: "",
            issueTypeRequired: "",
            priority: "",
            startDate: moment(new Date()).toDate(),
            endDate: null,
            description: "",
        });
    };

    onGetProject = async () => {
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/projects")
            .then((res) => {
                this.setState({
                    items: res,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    }

    onSetData = () => {
        let isEdit = this.props.isEdit;
        if (isEdit) {
            this.onSubmit();
        } else {
            this.onUpdate();
        }
    };

    onSubmit = async () => {
        const {
            title,
            projectRef,
            issueTypeRequired,
            priority,
            startDate,
            endDate,
            description
        } = this.state;

        if (title === "" || title === null) {
            this.setState({
                errorMsg: "Please enter the task name",
                isOpenError: true
            });
        }
        else if (projectRef === "" || projectRef === null) {
            this.setState({
                errorMsg: "Please select the project",
                isOpenError: true
            });
        }
        else if (issueTypeRequired === "" || issueTypeRequired === null) {
            this.setState({
                errorMsg: "Please select the issue type",
                isOpenError: true
            });
        }
        else if (priority === "" || priority === null) {
            this.setState({
                errorMsg: "Please select the priority",
                isOpenError: true
            });
        }
        else if (startDate === "" || startDate === null) {
            this.setState({
                errorMsg: "Please select the startDate",
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
                _project_id: projectRef,
                _issuetyperequired: issueTypeRequired,
                _priority: priority,
                _startdate: moment(startDate).format("YYYY-MM-DD HH:mm"),
                _enddate: endDate === null ? null : moment(endDate).format("YYYY-MM-DD HH:mm"),
                _description: description,
            };
            this.setState({ loading: true });
            await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/tasks", models)
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
        const {
            title,
            projectRef,
            issueTypeRequired,
            priority,
            startDate,
            endDate,
            description
        } = this.state;
        const updateRef = this.state.dataKey;

        if (updateRef !== null) {
            if (title === "" || title === null) {
                this.setState({
                    errorMsg: "Please enter the task name",
                    isOpenError: true
                });
            }
            else if (projectRef === "" || projectRef === null) {
                this.setState({
                    errorMsg: "Please select the project",
                    isOpenError: true
                });
            }
            else if (issueTypeRequired === "" || issueTypeRequired === null) {
                this.setState({
                    errorMsg: "Please select the issue type",
                    isOpenError: true
                });
            }
            else if (priority === "" || priority === null) {
                this.setState({
                    errorMsg: "Please select the priority",
                    isOpenError: true
                });
            }
            else if (startDate === "" || startDate === null) {
                this.setState({
                    errorMsg: "Please select the startDate",
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
                    _project_id: projectRef,
                    _issuetyperequired: issueTypeRequired,
                    _priority: priority,
                    _startdate: moment(startDate).format("YYYY-MM-DD HH:mm"),
                    _enddate: endDate === null ? null : moment(endDate).format("YYYY-MM-DD HH:mm"),
                    _description: description,
                };
                this.setState({ loading: true });
                await FetchApi.PutData(ConfigConnect.host + ":" + ConfigConnect.port + "/tasks/" + this.state.dataKey, models)
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
        this.setState({ isOpen: false, titleDrawer: "Add new task" });
        this.resetText();
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    handleStartDateChange = (date) => {
        this.setState({ startDate: date });
    };

    handleEndDateChange = (date) => {
        this.setState({ endDate: date });
    };

    onEdit = () => {
        let dataKey = this.props.dataKey;
        let dataSrc = this.props.dataSrc;
        let titleDrawer = this.props.titleDrawer;

        this.setState({
            dataKey: dataKey,
            title: dataSrc._title,
            issueTypeRequired: dataSrc._issuetyperequired,
            priority: dataSrc._priority,
            description: dataSrc._description,
            projectRef: dataSrc._project_id,
            startDate: moment(dataSrc._startdate).toDate(),
            endDate: dataSrc._enddate === null ? null : moment(dataSrc._enddate).toDate(),
            titleDrawer: titleDrawer
        }, () => {
            this.handleOpen();
        });
    };

    componentDidMount = () => {
        this.onGetProject();
    };

    render = () => {
        const { items, startDate, endDate, issueTypeRequired, priority, projectRef, isOpen, isOpenError, errorMsg, loading, titleDrawer, title, description } = this.state;
        return (
            <Drawer
                icon={IconNames.TAG}
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
                            <div className="bp3-select bp3-fill">
                                <select name="projectRef" value={projectRef} onChange={this.handleChange}>
                                    <option value="">Choose an projects...</option>
                                    {
                                        items.map((v) => {
                                            return (<option key={v._id} value={v._id}>{v._title}</option>);
                                        })
                                    }
                                </select>
                            </div>
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <div className="bp3-select bp3-fill">
                                <select name="issueTypeRequired" value={issueTypeRequired} onChange={this.handleChange}>
                                    <option value="">Choose Issue Type...</option>
                                    <option value="Task">Task</option>
                                    <option value="Bug">Bug</option>
                                </select>
                            </div>
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <div className="bp3-select bp3-fill">
                                <select name="priority" value={priority} onChange={this.handleChange}>
                                    <option value="">Choose Priority...</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Height">Height</option>
                                </select>
                            </div>
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <InputGroup name="title" autoComplete="off" value={title} onChange={this.handleChange} placeholder="Please enter the task name" />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1" label="Start date">
                            <DateInput
                                placeholder={"YYYY-MM-DD HH:mm"}
                                timePrecision={TimePrecision.MINUTE}
                                popoverProps={{ position: Position.BOTTOM }}
                                defaultValue={new Date()}
                                parseDate={str => new Date(str)}
                                formatDate={date => moment(date).format("YYYY-MM-DD HH:mm")}
                                onChange={this.handleStartDateChange}
                                value={startDate}
                                showActionsBar
                            />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1" label="End date">
                            <DateInput
                                placeholder={"YYYY-MM-DD HH:mm"}
                                timePrecision={TimePrecision.MINUTE}
                                popoverProps={{ position: Position.BOTTOM }}
                                parseDate={str => new Date(str)}
                                formatDate={date => moment(date).format("YYYY-MM-DD HH:mm")}
                                onChange={this.handleEndDateChange}
                                value={endDate}
                                showActionsBar
                            />
                        </FormGroup>

                        <FormGroup className="form-group-custom-1">
                            <TextArea className="text-area-height" value={description} growVertically large fill name="description" onChange={this.handleChange} placeholder="Please enter the description" />
                        </FormGroup>
                    </div>
                </div>
                <div className={Classes.DRAWER_FOOTER} style={{ textAlign: "right" }}>
                    {
                        !this.props.isEdit ? <Button onClick={() => this.onSubmit()} loading={loading} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.DUPLICATE} text="Clone task" className={Classes.BUTTON} style={{ marginRight: ".3rem" }} /> : null
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
export default TaskDrawer;
