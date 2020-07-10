"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 1337;
const queryProject = require("./queries/queriesProjects");
const queryUsers = require("./queries/queriesUsers");
const queriesTasks = require("./queries/queriesTasks");
const queriesAssignTasks = require("./queries/queriesAssignTasks");
const checkAuth = require("./auth/check-auth");

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.all('*', (_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get("/", (_request, response) => {
    response.json({ info: "Node.js, Express, and Postgres API" });
});

/*---Project---*/
app.get("/projects", checkAuth, queryProject.getAllProject);
app.post("/searchProjects", checkAuth, queryProject.getPaging);
app.get("/projects/:id", checkAuth, queryProject.getProjectById);
app.post("/projects", checkAuth, queryProject.createProject);
app.put("/projects/:id", checkAuth, queryProject.updateProject);
app.delete("/projects/:id", checkAuth, queryProject.deleteProject);
/*---Users---*/
app.get("/users", checkAuth, queryUsers.getAllUsers);
app.post("/searchUsers", checkAuth, queryUsers.getPaging);
app.get("/users/:id", checkAuth, queryUsers.getUsersById);
app.post("/users", checkAuth, queryUsers.createUsers);
app.post("/registerUsers", queryUsers.createUsers);
app.put("/users/:id", checkAuth, queryUsers.updateUsers);
app.put("/updateUserInfo/:id", checkAuth, queryUsers.updateUserInfoUsers);
app.delete("/users/:id", checkAuth, queryUsers.deleteUsers);
/*---Tasks---*/
app.get("/tasks", checkAuth, queriesTasks.getAllTasks);
app.post("/searchTasks", checkAuth, queriesTasks.getPaging);
app.get("/tasks/:id", checkAuth, queriesTasks.getTasksById);
app.post("/tasks", checkAuth, queriesTasks.createTasks);
app.put("/tasks/:id", checkAuth, queriesTasks.updateTasks);
app.delete("/tasks/:id", checkAuth, queriesTasks.deleteTasks);
/*---Assign-Tasks---*/
app.get("/assignTasks", queriesAssignTasks.getAllAssignTask);
app.get("/statusTasks", queriesAssignTasks.getAllStatusTask);
app.post("/searchAssignTasks", queriesAssignTasks.getPaging);
app.post("/searchAssignTasksJson", queriesAssignTasks.getPagingJsonArray);
app.get("/assignTasks/:id", queriesAssignTasks.getAssignTaskById);
app.post("/assignTasks", queriesAssignTasks.createAssignTask);
app.put("/assignTasks/:id", queriesAssignTasks.updateAssignTask);
app.put("/updateStatusAssignTasks/:id", queriesAssignTasks.updateStatusAssignTask);
app.delete("/assignTasks/:id", queriesAssignTasks.deleteAssignTask);
/*---Authorize---*/
app.post("/sign-in", queryUsers.loginUsers);
app.post("/verify-token", queryUsers.verifyToken);
app.post("/sign-out", queryUsers.signOut);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});