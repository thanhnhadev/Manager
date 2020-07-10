import React from "react";
import moment from "moment";
import {
    Button
    , Intent
    , Alignment
    , Classes
    , Card
    , Elevation
    , Tabs
    , Tab
    , Tag
    , Position
    , Tooltip
    , Switch
    , FormGroup
    , InputGroup
    , Dialog
    , Alert
    , NumericInput
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";


class UserAssign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            users: [],
            statusTask: [],
            isOpen: false,
            isOpenDialog: false,
            msg: "",
            keyEdit: null,
            keyDelete: null,
            loading: false,
            loadingEdit: false,
            errorMsg: "",
            isEdit: true,
            isVertical: false,
            isOpenError: false,
            isOpenDel: false,
            loadingSave: false,
            loadingStatus: false,

            _task_id: null,
            _uid: null,
            _status_id: null,
            _logworktime: 0,
            _createat: null,

            /*--Pagging-Search--*/
            disabledFirst: true,
            disabledLast: false,
            disabledNext: false,
            disabledPre: true,
            keywords: "",
            pageNumber: 1,
            pageSize: 20,
            totalCount: 0,
            totalPage: 0
        };
    };

    onGetData = async () => {
        const { pageNumber, pageSize } = this.state;
        let models = {
            keywords: "",
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchAssignTasksJson", models)
            .then((res) => {
                this.setState({
                    data: (res.rows) && res.rows.length !== 0 ? res.rows[0].rows : res.rows,
                    totalCount: res.totalCount,
                    totalPage: res.totalPage,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    };

    onGetUsers = async () => {
        this.setState({ loading: true });
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/users")
            .then((res) => {
                this.setState({
                    users: res,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    };

    onGetStatus = async () => {
        this.setState({ loading: true });
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/statusTasks")
            .then((res) => {
                this.setState({
                    statusTask: res,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    };

    onSearch = async () => {
        const { keywords, pageNumber, pageSize } = this.state;
        let models = {
            keywords,
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchAssignTasksJson", models)
            .then((res) => {
                this.setState({
                    data: (res.rows) && res.rows.length !== 0 ? res.rows[0].rows : res.rows,
                    totalCount: res.totalCount,
                    totalPage: res.totalPage,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    };

    onVerticalTab = () => {
        this.setState({ isVertical: !this.state.isVertical });
    };

    /*--Paging--*/
    onFirstPage = () => {
        const { pageNumber } = this.state;
        if (pageNumber !== 1) {
            this.setState({
                pageNumber: 1,
                disabledFirst: true,
                disabledNext: false,
                disabledPre: true,
                disabledLast: false
            }, () => this.onGetData());
        }
    };

    onLastPage = () => {
        const { totalPage } = this.state;
        this.setState({
            pageNumber: totalPage,
            disabledLast: true,
            disabledNext: true,
            disabledFirst: false,
            disabledPre: false
        }, () => this.onGetData());
    };

    onNextPage = () => {
        const { pageNumber, totalPage } = this.state;
        if (pageNumber >= totalPage) {
            this.setState({
                pageNumber: totalPage,
                disabledNext: true,
                disabledLast: true
            }, () => this.onGetData());
        }
        if (pageNumber < totalPage) {
            this.setState({
                pageNumber: pageNumber + 1,
                disabledPre: false,
                disabledFirst: false
            }, () => this.onGetData());
        }
    };

    onPrePage = () => {
        const { pageNumber } = this.state;
        if (pageNumber <= 0 | pageNumber === 1) {
            this.setState({
                pageNumber: 1,
                disabledPre: true,
                disabledFirst: true
            }, () => this.onGetData());
        } else {
            this.setState({
                pageNumber: pageNumber - 1,
                disabledNext: false,
                disabledLast: false,
                disabledPre: false,
                disabledFirst: false
            }, () => this.onGetData());
        }
    };

    onCheckPaging = () => {
        const { totalCount, pageSize } = this.state;
        if (totalCount <= pageSize) {
            this.setState({
                disabledFirst: true,
                disabledLast: true,
                disabledNext: true,
                disabledPre: true
            });
        }
    };
    /*--End--*/

    handleFilterChange = (evt) => {
        this.setState({ keywords: evt.target.value });
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    handleValueChange = (value) => {
        this.setState({ _logworktime: value })
    };

    handleMoveConfirm = async () => {
        this.setState({ loadingEdit: true });
        await FetchApi.DeleteData(ConfigConnect.host + ":" + ConfigConnect.port + "/assignTasks/" + this.state.keyDelete)
            .then(() => {
                this.setState({
                    loadingEdit: false,
                    isOpenDel: false
                }, () => this.onGetData());
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    };

    onEdit = async (id) => {
        this.setState({ loadingEdit: true });
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/assignTasks/" + id)
            .then((res) => {
                this.setState({
                    keyEdit: res._id,
                    _task_id: res._task_id,
                    _uid: res._uid,
                    _status_id: res._status_id,
                    _logworktime: res._logworktime,
                    _createat: res._createat,
                    loadingEdit: false,
                    isOpenDialog: true
                });
            });
    };

    onAssignTask = async () => {
        const {
            _uid,
            _task_id,
            _status_id,
            _logworktime,
            _createat,
        } = this.state;
        const updateRef = this.state.keyEdit;

        if (updateRef !== null) {
            if (_uid === "" || _uid === null) {
                this.setState({
                    errorMsg: "Please select uid",
                    isOpenError: true
                });
            }
            else if (_task_id === "" || _task_id === null) {
                this.setState({
                    errorMsg: "Task id null",
                    isOpenError: true
                });
            }
            else {
                let models = {
                    _uid: _uid,
                    _task_id: _task_id,
                    _status_id: _status_id,
                    _logworktime: _logworktime,
                    _createat: moment(_createat).format("YYYY-MM-DD")
                };
                this.setState({ loadingSave: true });
                await FetchApi.PutData(ConfigConnect.host + ":" + ConfigConnect.port + "/assignTasks/" + this.state.keyEdit, models)
                    .then((res) => {
                        if (res.status) {
                            this.setState({
                                loadingSave: false,
                                isOpenDialog: false
                            }, () => { this.onGetData(); });
                        } else {
                            this.setState({
                                loadingSave: false,
                                isOpenError: true,
                                errorMsg: res.message
                            });
                        }
                    })
                    .catch((error) => {
                        this.setState({ loadingSave: false });
                        console.error("Error adding document: ", error);
                    });
            }
        } else {
            this.setState({
                errorMsg: "Data Key null",
                isOpenError: true,
                loadingSave: false
            });
        }
    };

    onDelete = (id) => {
        this.setState({
            isOpenDel: true,
            keyDelete: id,
            msg: "Do you want to Unassigned this task ?"
        });
    };


    onChangeStatus = async (id, status_id) => {
        let models = {
            _status_id: status_id
        };
        this.setState({ loadingStatus: true });
        await FetchApi.PutData(ConfigConnect.host + ":" + ConfigConnect.port + "/updateStatusAssignTasks/" + id, models)
            .then((res) => {
                if (res.status) {
                    this.setState({
                        loadingStatus: false,
                    }, () => { this.onGetData(); });
                } else {
                    this.setState({
                        loadingStatus: false
                    });
                }
            })
            .catch((error) => {
                this.setState({ loadingStatus: false });
                console.error("Error adding document: ", error);
            });
    };

    componentDidMount = () => {
        this.onGetData();
        this.onGetUsers();
        this.onGetStatus();
        this.onCheckPaging();
    };


    render = () => {
        const { data, users, statusTask, _uid, _logworktime, msg, isOpenError, isOpenDel, isOpenDialog, loadingEdit, loading, loadingSave, isVertical, errorMsg, pageNumber, totalPage, totalCount, disabledNext, disabledPre, disabledFirst, disabledLast } = this.state;
        return (
            <div className="container-child">
                <div className="item-toolbar">
                    <Button onClick={this.onGetData} loading={loading} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.REFRESH} text="Refresh" className={Classes.BUTTON} />
                </div>

                <div className="item-toolbar">
                    <InputGroup
                        leftIcon={IconNames.SEARCH}
                        onChange={this.handleFilterChange}
                        placeholder="Enter username for search..."
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                this.onSearch();
                            }
                        }}
                        rightElement={
                            <Button onClick={() => this.onSearch()} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.ARROW_RIGHT} className={Classes.BUTTON} />
                        }
                    />
                </div>

                <div className="item-toolbar">
                    <Switch className="switch-control" checked={isVertical} label="Use vertical tabs" onChange={this.onVerticalTab} large />
                </div>

                <div className="container-item">
                    <Tabs
                        id="tabTask"
                        className="tabs-width"
                        defaultSelectedTabId={0}
                        vertical={isVertical}
                    >
                        {
                            data.map((value, _index) => {
                                return (
                                    <Tab id={_index} key={value.uid} className="tab-display" title={value._displayName} panel={
                                        (value.tasks && value.tasks.length !== 0) ?
                                            value.tasks.map((task) => {
                                                return (
                                                    <div key={task._id} className="item">
                                                        <Card className="card-task-custom" style={{ height: "12rem" }} interactive={true} elevation={Elevation.TWO}>
                                                            <h5 className="card-title-h6">
                                                                <Tooltip content="Status" position={Position.BOTTOM}>
                                                                    <Tag className="tag-custom" onRemove={false} round intent={task.statusColor}>
                                                                        {task.status}
                                                                    </Tag>
                                                                </Tooltip>
                                                                <Tooltip content="Issue Type" position={Position.BOTTOM}>
                                                                    <Tag className="tag-custom" onRemove={false} round intent={Intent.PRIMARY}>
                                                                        {task._issuetyperequired}
                                                                    </Tag>
                                                                </Tooltip>
                                                                <Tooltip content="Priority" position={Position.BOTTOM}>
                                                                    <Tag className="tag-custom" onRemove={false} round intent={Intent.WARNING}>
                                                                        {task._priority}
                                                                    </Tag>
                                                                </Tooltip>

                                                                <a href="/">{task._taskTitle}</a>
                                                                <Tooltip content="Estimate" position={Position.BOTTOM}>
                                                                    <Tag className="tag-custom" onRemove={false} round intent={Intent.DANGER} style={{ marginLeft: ".4rem" }}>
                                                                        {task._logworktime} minutes
                                                                    </Tag>
                                                                </Tooltip>
                                                            </h5>
                                                            <div className="card-body-custom">
                                                                <p className="card-content-p block-with-text">{task._taskDescription}</p>
                                                            </div>

                                                            <div className="card-footer">
                                                                <div className="card-footer-item" style={{ marginTop: ".3rem" }}>
                                                                    <Button loading={loadingEdit} onClick={() => this.onEdit(task._id)} alignText={Alignment.CENTER} icon={IconNames.EDIT} style={{ marginRight: ".2rem" }} intent={Intent.WARNING} text="Edit" className={Classes.BUTTON} />
                                                                </div>

                                                                <div className="card-footer-item" style={{ marginTop: ".3rem" }}>
                                                                    <Button loading={loadingEdit} onClick={() => this.onDelete(task._id)} alignText={Alignment.CENTER} icon={IconNames.DELETE} style={{ marginRight: ".2rem" }} intent={Intent.DANGER} text="Unassigned" className={Classes.BUTTON} />
                                                                </div>
                                                            </div>

                                                            <div className="card-footer">
                                                                {
                                                                    statusTask.map((v) => {
                                                                        return (
                                                                            <div className="card-footer-item" key={v._id} style={{ marginTop: ".3rem" }}>
                                                                                <Button onClick={() => this.onChangeStatus(task._id, v._id)} alignText={Alignment.CENTER} style={{ marginRight: ".2rem" }} intent={v._color} text={v._title} className={Classes.BUTTON} />
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </Card>
                                                    </div>
                                                );
                                            })
                                            : null
                                    } />
                                )
                            })
                        }
                        <Tabs.Expander />
                    </Tabs>
                </div>

                <div className="item-toolbar-paging">
                    <Button onClick={() => this.onFirstPage()} disabled={disabledFirst} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.FAST_BACKWARD} className={Classes.BUTTON} style={{ marginRight: ".3rem" }} />
                    <Button onClick={() => this.onPrePage()} disabled={disabledPre} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.STEP_BACKWARD} className={Classes.BUTTON} />
                    <span className="label-itemtoolbar-paging">{pageNumber}/{totalPage}-{totalCount}</span>
                    <Button onClick={() => this.onNextPage()} disabled={disabledNext} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.STEP_FORWARD} className={Classes.BUTTON} style={{ marginRight: ".3rem" }} />
                    <Button onClick={() => this.onLastPage()} disabled={disabledLast} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.FAST_FORWARD} className={Classes.BUTTON} />
                </div>

                <Dialog
                    icon={IconNames.TAG}
                    title="Edit task"
                    autoFocus
                    usePortal
                    isOpen={isOpenDialog}
                    onClose={() => this.setState({ isOpenDialog: false })}
                    isCloseButtonShown
                >
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup className="form-group-custom-0" label="Choose an users">
                            <div className="bp3-select bp3-fill">
                                <select name="_uid" value={_uid} onChange={this.handleChange}>
                                    <option value="">Choose an users...</option>
                                    {
                                        users.map((v) => {
                                            return (<option key={v._id} value={v._id}>{v._displayName}</option>);
                                        })
                                    }
                                </select>
                            </div>
                        </FormGroup>

                        <FormGroup className="form-group-custom-1" label="Estimate time using minutes">
                            <NumericInput
                                fill
                                allowNumericCharactersOnly
                                min={0}
                                placeholder="Enter Estimate time"
                                value={_logworktime}
                                onValueChange={this.handleValueChange} />
                        </FormGroup>
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.onAssignTask} loading={loadingSave} intent={Intent.PRIMARY} >Save</Button>
                            <Button onClick={() => this.setState({ isOpenDialog: false })} loading={loadingSave} intent={Intent.NONE} >Cancel</Button>
                        </div>
                    </div>
                </Dialog>

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

                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Unassigned"
                    icon={IconNames.TRASH}
                    intent={Intent.DANGER}
                    isOpen={isOpenDel}
                    onCancel={() => this.setState({ isOpenDel: false })}
                    onConfirm={this.handleMoveConfirm}
                >
                    <p>{msg}</p>
                </Alert>
            </div>
        );
    };
};
export default UserAssign;