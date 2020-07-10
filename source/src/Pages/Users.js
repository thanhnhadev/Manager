import React from "react";
import moment from "moment";
import {
    Button
    , Intent
    , Alignment
    , Classes
    , InputGroup
    , Alert
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";

import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

/*--Import-Components-- */
import UsersDrawer from "./UsersDrawer";

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.UsersDrawer = React.createRef();
        this.state = {
            data: [],
            loading: false,
            isOpen: false,
            msg: "",
            keyEdit: null,
            keyDelete: null,
            dataSrc: null,
            loadingEdit: false,
            titleDrawer: "Add new user",
            isEdit: true,

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

    onOpenDrawer = () => {
        this.setState({ titleDrawer: "Add new user", isEdit: true });
        this.UsersDrawer.current.handleOpen();
    };

    onDelete = (id) => {
        this.setState({
            isOpen: true,
            keyDelete: id,
            msg: "Do you want to delete ?"
        });
    };

    handleMoveConfirm = async () => {
        this.setState({ loadingEdit: true });
        await FetchApi.DeleteData(ConfigConnect.host + ":" + ConfigConnect.port + "/users/" + this.state.keyDelete)
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

    onEdit = async (id) => {
        this.setState({ loadingEdit: true });
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/users/" + id)
            .then((res) => {
                this.setState({
                    keyEdit: res._id,
                    dataSrc: res,
                    loadingEdit: false,
                    isEdit: false,
                    titleDrawer: "Edit user"
                }, () => {
                    this.UsersDrawer.current.onEdit();
                });
            });
    };

    onGetData = async () => {
        const { pageNumber, pageSize } = this.state;
        let models = {
            keywords: "",
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchUsers", models)
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

    onRefresh = () => {
        this.onGetData();
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

    onSearch = async () => {
        const { keywords, pageNumber, pageSize } = this.state;
        let models = {
            keywords,
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchUsers", models)
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

    handleFilterChange = (evt) => {
        this.setState({ keywords: evt.target.value });
    };

    componentDidMount = () => {
        this.onGetData();
        this.onCheckPaging();
    };

    render = () => {
        const { data, loading, loadingEdit, isOpen, msg, pageNumber, totalPage, totalCount, disabledNext, disabledPre, disabledFirst, disabledLast } = this.state;
        return (
            <div className="container-child">
                <div className="item-toolbar">
                    <Button onClick={this.onOpenDrawer} alignText={Alignment.CENTER} intent={Intent.PRIMARY} icon={IconNames.ADD} text="Add user" className={Classes.BUTTON} />
                </div>

                <div className="item-toolbar">
                    <Button onClick={this.onRefresh} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.REFRESH} text="Refresh" className={Classes.BUTTON} />
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

                <div className="container-item">
                    <table className="table-width bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive">
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>UserName</th>
                                <th>Email</th>
                                <th>Display Name</th>
                                <th>Photo Url</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="cell-table-center">{value._id}</td>
                                            <td className="cell-table-center">{value._uname}</td>
                                            <td className="cell-table-center">{value._email}</td>
                                            <td className="cell-table-center">{value._displayName}</td>
                                            <td className="cell-table-center">
                                                <img src={value._photoURL} className="avatar" alt={value._uname} />
                                            </td>
                                            <td className="cell-table-center">
                                                {moment(value._createat).format("DD-MM-YYYY HH:mm A")}
                                            </td>
                                            <td className="cell-table-center">
                                                <div className="item-toolbar">
                                                    <Button onClick={() => this.onEdit(value._id)} loading={loadingEdit} alignText={Alignment.CENTER} style={{ marginRight: ".3rem" }} intent={Intent.SUCCESS} text="Edit" className={Classes.BUTTON} />

                                                    <Button onClick={() => this.onDelete(value._id)} loading={loadingEdit} alignText={Alignment.CENTER} style={{ marginRight: ".3rem" }} intent={Intent.DANGER} text="Delete" className={Classes.BUTTON} />
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

                <UsersDrawer ref={this.UsersDrawer} {...this.props} renderInputValue={this.onRefresh} isEdit={this.state.isEdit} titleDrawer={this.state.titleDrawer} dataKey={this.state.keyEdit} dataSrc={this.state.dataSrc} />

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
            </div>
        );
    };
};
export default Users;