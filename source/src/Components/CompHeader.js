import React from "react";
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Position,
    Tooltip,
    Popover,
    Menu,
    MenuItem,
    MenuDivider,
    FormGroup,
    InputGroup,
    PopoverInteractionKind,
    Alert
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import ConfigToken from "../Config/ConfigToken";
import ConfigConnect from "../Config/ConfigAPI";
import FetchApi from "../Network/Network";


class CompHeader extends React.Component {
    constructor(props) {
        super(props);
        this.checkLogin();
        this.state = {
            isOpenError: false,
            loading: false,
            errorMsg: "",
            uid: null,
            displayName: "loading...",
            photoUrl: "loading...",
            email: "loading..."
        }
    };

    checkLogin = async () => {
        let models = {
            token: window.localStorage.getItem(ConfigToken.token)
        };
        await FetchApi.PostDataUnAuthorize(ConfigConnect.host + ":" + ConfigConnect.port + "/verify-token", models)
            .then((res) => {
                if (res) {
                    if (!res.status) {
                        this.onGoToPage("/auth/login");
                    } else {
                        this.setState({
                            uid: res._id,
                            displayName: res._displayName,
                            email: res._email,
                            photoUrl: res._photoURL,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("Error removing document: ", error);
            });
    };

    onGoToPage = (url) => {
        this.props.history.push(url);
    };

    onLogout = () => {
        window.localStorage.removeItem(ConfigToken.token);
        this.onGoToPage("/auth/login");
    };

    onUpdateProfile = async () => {
        const { displayName, photoUrl, uid } = this.state;
        if ((displayName === "loading..." || displayName === null || displayName === "")) {
            this.setState({
                isOpenError: true,
                errorMsg: "Please enter the display name"
            });
        } else {
            let models = {
                _displayName: displayName,
                _photoURL: photoUrl
            };
            this.setState({ loading: true });
            await FetchApi.PutData(ConfigConnect.host + ":" + ConfigConnect.port + "/updateUserInfo/" + uid, models)
                .then((res) => {
                    if (res) {
                        if (res.status) {
                            this.setState({
                                loading: false,
                                isOpenError: true,
                                errorMsg: "Update profile successfully"
                            }, () => this.checkLogin());
                        } else {
                            this.setState({
                                loading: false,
                                isOpenError: true,
                                errorMsg: res.message
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.log("Error removing document: ", error);
                });
        }
    };

    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    render = () => {
        const { displayName, email, photoUrl, isOpenError, errorMsg, loading } = this.state;
        let renderFormUpdateProfile = (
            <div className="popover-content-custom">
                <FormGroup className="form-group-custom-0">
                    <InputGroup leftIcon={IconNames.USER} fill autoComplete="off" name="displayName" value={displayName} onChange={this.handleChange} placeholder="Please enter the display name" />
                </FormGroup>

                <FormGroup className="form-group-custom-1">
                    <InputGroup leftIcon={IconNames.ENVELOPE} disabled fill autoComplete="off" name="email" value={email} onChange={this.handleChange} placeholder="Please enter the email" />
                </FormGroup>

                <FormGroup className="form-group-custom-1">
                    <InputGroup leftIcon={IconNames.IMAGE_ROTATE_LEFT} fill autoComplete="off" name="photoUrl" value={photoUrl} onChange={this.handleChange} placeholder="Please enter the photo Url" />
                </FormGroup>



                <FormGroup className="form-group-custom-1">
                    <Button onClick={this.onUpdateProfile} loading={loading} className={Classes.MINIMAL} fill icon={IconNames.FLOPPY_DISK} text="Save change" />
                </FormGroup>
            </div>
        );
        return (
            <Navbar className="bp3-dark" fixedToTop>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Project Manager</NavbarHeading>
                    <NavbarDivider />
                </NavbarGroup>

                <NavbarGroup align={Alignment.LEFT}>
                    <Button onClick={() => this.onGoToPage("/dash")} className={Classes.MINIMAL} icon={IconNames.HOME} text="Home" />
                    <NavbarDivider />
                    <Popover content=
                        {
                            <Menu>
                                <MenuItem onClick={() => this.onGoToPage("/projects")} icon={IconNames.LIST} text="List projects" />
                            </Menu>
                        } position={Position.BOTTOM} interactionKind={PopoverInteractionKind.CLICK}>
                        <Button className={Classes.MINIMAL} icon={IconNames.PROJECTS} text="Project" />
                    </Popover>
                    <NavbarDivider />
                    <Popover content=
                        {
                            <Menu>
                                <MenuItem onClick={() => this.onGoToPage("/task")} icon={IconNames.LIST} text="List Task" />
                                <MenuDivider />
                                <MenuItem onClick={() => this.onGoToPage("/assign")} icon={IconNames.GRID_VIEW} text="Assign" />
                            </Menu>
                        } position={Position.BOTTOM} interactionKind={PopoverInteractionKind.CLICK}>
                        <Button className={Classes.MINIMAL} icon={IconNames.TAG} text="Task" />
                    </Popover>
                    <NavbarDivider />
                    <Popover content=
                        {
                            <Menu>
                                <MenuItem onClick={() => this.onGoToPage("/users")} icon={IconNames.LIST} text="List Users" />
                            </Menu>
                        } position={Position.BOTTOM} interactionKind={PopoverInteractionKind.CLICK}>
                        <Button className={Classes.MINIMAL} icon={IconNames.USER} text="Users" />
                    </Popover>
                </NavbarGroup>

                <NavbarGroup align={Alignment.RIGHT}>
                    <Popover
                        popoverClassName="popover-main"
                        inheritDarkTheme={false} position={Position.BOTTOM}
                        interactionKind={PopoverInteractionKind.CLICK}
                        content={renderFormUpdateProfile}>
                        {
                            (photoUrl === null | photoUrl === "") ? <Button className={Classes.MINIMAL} icon={IconNames.USER} text={displayName} />
                                :
                                <Button className={Classes.MINIMAL}>
                                    <img className="avatar-header" src={photoUrl} alt={email} />
                                    <span>{displayName}</span>
                                </Button>
                        }
                    </Popover>

                    <NavbarDivider />
                    <Tooltip content="Notifications" position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} icon={IconNames.NOTIFICATIONS} />
                    </Tooltip>
                    <NavbarDivider />
                    <Popover content=
                        {
                            <Menu>
                                <MenuItem onClick={this.onLogout} icon={IconNames.LOG_OUT} text="Logout" />
                            </Menu>
                        } position={Position.BOTTOM} interactionKind={PopoverInteractionKind.CLICK}>
                        <Tooltip content="Settings" position={Position.BOTTOM}>
                            <Button className={Classes.MINIMAL} icon={IconNames.COG} />
                        </Tooltip>
                    </Popover>
                </NavbarGroup>

                <Alert
                    icon={IconNames.ERROR}
                    confirmButtonText="Ok"
                    isOpen={isOpenError}
                    onClose={() => this.setState({ isOpenError: false })}
                >
                    <p>{errorMsg}</p>
                </Alert>
            </Navbar>
        );
    };
};
export default CompHeader;
