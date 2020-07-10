import React from "react";
import {
    Button
    , Intent
    , Alignment
    , Classes
    , Card
    , Elevation
    , InputGroup
    , Alert
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "../StyleSheet/Common.css";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";

/*--Import-Components-- */
import ListProjectDrawer from "./ListProjectDrawer";

class ListProject extends React.Component {
    constructor(props) {
        super(props);
        this.ListProjectDrawer = React.createRef();

        this.state = {
            data: [],
            isOpen: false,
            msg: "",
            keyEdit: null,
            keyDelete: null,
            dataSrc: null,
            loading: false,
            loadingEdit: false,
            titleDrawer: "Add new project",
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
    onGetData = async () => {
        const { pageNumber, pageSize } = this.state;
        let models = {
            keywords: "",
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchProjects", models)
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

    onOpenDrawer = () => {
        this.setState({ titleDrawer: "Add new project", isEdit: true });
        this.ListProjectDrawer.current.handleOpen();
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
        // var result = 1559309651 - parseInt(new Date().getTime() / 1000);
        // console.log(result);
    };

    onSearch = async () => {
        const { keywords, pageNumber, pageSize } = this.state;
        let models = {
            keywords,
            pageNumber,
            pageSize
        };
        this.setState({ loading: true });
        await FetchApi.PostData(ConfigConnect.host + ":" + ConfigConnect.port + "/searchProjects", models)
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
        await FetchApi.GetData(ConfigConnect.host + ":" + ConfigConnect.port + "/projects/" + id)
            .then((res) => {
                this.setState({
                    keyEdit: res._id,
                    dataSrc: res,
                    loadingEdit: false,
                    isEdit: false,
                    titleDrawer: "Edit project"
                }, () => {
                    this.ListProjectDrawer.current.onEdit();
                });
            });
    };

    handleMoveConfirm = async () => {
        this.setState({ loadingEdit: true });
        await FetchApi.DeleteData(ConfigConnect.host + ":" + ConfigConnect.port + "/projects/" + this.state.keyDelete)
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
        this.onCheckPaging();
    };

    render = () => {
        const { data, loading, loadingEdit, isOpen, msg, pageNumber, totalPage, totalCount, disabledNext, disabledPre, disabledFirst, disabledLast } = this.state;
        return (
            <div className="container-child">
                <div className="item-toolbar">
                    <Button onClick={this.onOpenDrawer} alignText={Alignment.CENTER} intent={Intent.PRIMARY} icon={IconNames.ADD} text="Add Project" className={Classes.BUTTON} />
                </div>

                <div className="item-toolbar">
                    <Button onClick={this.onRefresh} loading={loading} alignText={Alignment.CENTER} intent={Intent.SUCCESS} icon={IconNames.REFRESH} text="Refresh" className={Classes.BUTTON} />
                </div>

                <div className="item-toolbar">
                    <InputGroup
                        leftIcon={IconNames.SEARCH}
                        onChange={this.handleFilterChange}
                        placeholder="Enter project name for search..."
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
                    {
                        data.map((value) => {
                            return (
                                <div key={value._id} className="item">
                                    <Card className="card-custom" interactive={true} elevation={Elevation.TWO}>
                                        <h5 className="card-title-h5"><a href="/">{value._title}</a></h5>
                                        <div className="card-body-custom">
                                            <p className="card-content-p block-with-text">{value._description}</p>
                                        </div>

                                        <Button alignText={Alignment.CENTER} style={{ marginRight: ".2rem" }} intent={Intent.PRIMARY} icon={IconNames.EYE_ON} text="View project" className={Classes.BUTTON} />
                                        <Button loading={loadingEdit} onClick={() => this.onEdit(value._id)} alignText={Alignment.CENTER} style={{ marginRight: ".2rem" }} intent={Intent.WARNING} icon={IconNames.EDIT} text="Edit project" className={Classes.BUTTON} />
                                        <Button onClick={() => this.onDelete(value._id)} alignText={Alignment.CENTER} intent={Intent.DANGER} icon={IconNames.DELETE} text="Delete project" className={Classes.BUTTON} />
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="item-toolbar-paging">
                    <Button onClick={() => this.onFirstPage()} disabled={disabledFirst} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.FAST_BACKWARD} className={Classes.BUTTON} style={{ marginRight: ".3rem" }} />
                    <Button onClick={() => this.onPrePage()} disabled={disabledPre} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.STEP_BACKWARD} className={Classes.BUTTON} />
                    <span className="label-itemtoolbar-paging">{pageNumber}/{totalPage}-{totalCount}</span>
                    <Button onClick={() => this.onNextPage()} disabled={disabledNext} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.STEP_FORWARD} className={Classes.BUTTON} style={{ marginRight: ".3rem" }} />
                    <Button onClick={() => this.onLastPage()} disabled={disabledLast} loading={loading} alignText={Alignment.CENTER} intent={Intent.NONE} icon={IconNames.FAST_FORWARD} className={Classes.BUTTON} />
                </div>

                <ListProjectDrawer ref={this.ListProjectDrawer} {...this.props} renderInputValue={this.onRefresh} isEdit={this.state.isEdit} titleDrawer={this.state.titleDrawer} dataKey={this.state.keyEdit} dataSrc={this.state.dataSrc} />

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
}
export default ListProject;
