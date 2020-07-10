import React from "react";
import moment from "moment";
import {
    Button
    , Intent
    , Alignment
    , Classes
    , Alert
    , InputGroup
    , Dialog
    , FormGroup
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";

import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

/*--Import-Components-- */
import TaskDrawer from "./TaskDrawer";

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.TaskDrawer = React.createRef();
        this.state = {
            data: [],
            users: [],
            isOpen: false,
            isOpenDialog: false,
            msg: "",
            keyEdit: null,
            keyDelete: null,
            dataSrc: null,
            loading: false,
            loadingEdit: false,
            titleDrawer: "Add new task",
            isEdit: true,
            loadingSave: false,

            _task_id: null,
            _uid: null,
            _status: 7,

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
        }
    };

    onGetData = async () => {
        const { pageNumber, pageSize } = this.state;
        let models = {
            keywords: "",
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchTasks", models)
            .then((res) => {
                this.setState({
                    data: res.rows,
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

    onOpenDrawer = () => {
        this.setState({ titleDrawer: "Add new task", isEdit: true });
        this.TaskDrawer.current.handleOpen();
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

    onRefresh = () => {
        this.onGetData();
    };

    onSearch = async () => {
        const { keywords, pageNumber, pageSize } = this.state;
        let models = {
            keywords,
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchTasks", models)
            .then((res) => {
                this.setState({
                    data: res.rows,
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

    onDelete = (id) => {
        this.setState({
            isOpen: true,
            keyDelete: id,
            msg: "Do you want to delete ?"
        });
    };

    onEdit = async (id) => {
        this.setState({ loadingEdit: true });
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/tasks/" + id)
            .then((res) => {
                this.setState({
                    keyEdit: res._id,
                    dataSrc: res,
                    loadingEdit: false,
                    isEdit: false,
                    titleDrawer: "Edit task"
                }, () => {
                    this.TaskDrawer.current.onEdit();
                });
            });
    };

    onAssign = (id) => {
        this.setState({
            _task_id: id,
            isOpenDialog: true
        });
    };

    onAssignTask = async () => {
        const {
            _uid,
            _task_id,
            _status
        } = this.state;
        const updateRef = _task_id;

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
                    _status_id: _status,
                    _logworktime: 0,
                    _createat: moment().format("YYYY-MM-DD")
                };
                this.setState({ loadingSave: true });
                await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/assignTasks/", models)
                    .then((res) => {
                        if (res.status) {
                            this.setState({
                                loadingSave: false,
                                isOpenDialog: false
                            }, () => { this.props.history.push("/assign"); });
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

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    handleMoveConfirm = async () => {
        this.setState({ loadingEdit: true });
        await FetchApi.DeleteData(ConfigConnect.host + ":" + ConfigConnect.port + "/tasks/" + this.state.keyDelete)
            .then(() => {
                this.setState({
                    loadingEdit: false,
                    isOpen: false
                }, () => this.onGetData());
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Error removing document: ", error);
            });
    };

    handleFilterChange = (evt) => {
        this.setState({ keywords: evt.target.value });
    };


    componentDidMount = () => {
        this.onGetData();
        this.onGetUsers();
        this.onCheckPaging();
    };

    render = () => {
        const { data, loading, users, isOpenDialog, isOpenError, errorMsg, loadingSave, loadingEdit, isOpen, msg, pageNumber, totalPage, totalCount, disabledNext, disabledPre, disabledFirst, disabledLast } = this.state;
        return (
            <div className="container-child">
                <div className="item-toolbar">
                    <Button onClick={this.onOpenDrawer} alignText={Alignment.CENTER} intent={Intent.PRIMARY} icon={IconNames.ADD} text="Add Task" className={Classes.BUTTON} />
                </div>

                <div className="item-toolbar">
                    <Button onClick={this.onRefresh} loading={loading} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.REFRESH} text="Refresh" className={Classes.BUTTON} />
                </div>

                <div className="item-toolbar">
                    <InputGroup
                        leftIcon={IconNames.SEARCH}
                        onChange={this.handleFilterChange}
                        placeholder="Enter task name for search..."
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

                <div className="container-item">
                    <table className="table-width bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Issue Type</th>
                                <th>Priority</th>
                                <th>Task name</th>
                                <th>Description</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="cell-table-center">{value._projectTitle}</td>
                                            <td className="cell-table-center">{value._issuetyperequired}</td>
                                            <td className="cell-table-center">{value._priority}</td>
                                            <td className="cell-table-center">{value._title}</td>
                                            <td className="cell-table-normal">{value._description}</td>
                                            <td className="cell-table-center">
                                                {moment(value._startdate).format("DD-MM-YYYY HH:mm A")}
                                            </td>
                                            <td className="cell-table-center">
                                                {value._enddate === null ? "-" : moment(value._enddate).format("DD-MM-YYYY HH:mm A")}
                                            </td>
                                            <td className="cell-table-center">
                                                <div className="item-toolbar">
                                                    <Button onClick={() => this.onEdit(value._id)} loading={loadingEdit} alignText={Alignment.CENTER} style={{ marginRight: ".3rem" }} intent={Intent.SUCCESS} text="Edit" className={Classes.BUTTON} />

                                                    <Button onClick={() => this.onDelete(value._id)} loading={loadingEdit} alignText={Alignment.CENTER} style={{ marginRight: ".3rem" }} intent={Intent.DANGER} text="Delete" className={Classes.BUTTON} />

                                                    <Button onClick={() => this.onAssign(value._id)} loading={loadingEdit} alignText={Alignment.CENTER} intent={Intent.WARNING} text="Assign" className={Classes.BUTTON} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="item-toolbar-paging">
                    <Button onClick={() => this.onFirstPage()} disabled={disabledFirst} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.FAST_BACKWARD} className={Classes.BUTTON} style={{ marginRight: ".3rem" }} />
                    <Button onClick={() => this.onPrePage()} disabled={disabledPre} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.STEP_BACKWARD} className={Classes.BUTTON} />
                    <span className="label-itemtoolbar-paging">{pageNumber}/{totalPage}-{totalCount}</span>
                    <Button onClick={() => this.onNextPage()} disabled={disabledNext} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.STEP_FORWARD} className={Classes.BUTTON} style={{ marginRight: ".3rem" }} />
                    <Button onClick={() => this.onLastPage()} disabled={disabledLast} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.FAST_FORWARD} className={Classes.BUTTON} />
                </div>

                <TaskDrawer ref={this.TaskDrawer} {...this.props} renderInputValue={this.onRefresh} isEdit={this.state.isEdit} titleDrawer={this.state.titleDrawer} dataKey={this.state.keyEdit} dataSrc={this.state.dataSrc} />

                <Dialog
                    icon={IconNames.TAG}
                    title="Assign task"
                    autoFocus
                    usePortal
                    isOpen={isOpenDialog}
                    onClose={() => this.setState({ isOpenDialog: false })}
                    isCloseButtonShown
                >
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup className="form-group-custom-0">
                            <div className="bp3-select bp3-fill">
                                <select name="_uid" onChange={this.handleChange}>
                                    <option value="">Choose an users...</option>
                                    {
                                        users.map((v) => {
                                            return (<option key={v._id} value={v._id}>{v._displayName}</option>);
                                        })
                                    }
                                </select>
                            </div>
                        </FormGroup>
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.onAssignTask} loading={loadingSave} intent={Intent.PRIMARY} >Assign</Button>
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
                    confirmButtonText="Delete"
                    icon={IconNames.TRASH}
                    intent={Intent.DANGER}
                    isOpen={isOpen}
                    onCancel={() => this.setState({ isOpen: false })}
                    onConfirm={this.handleMoveConfirm}
                >
                    <p>{msg}</p>
                </Alert>
            </div >
        );
    };
}
export default Task;