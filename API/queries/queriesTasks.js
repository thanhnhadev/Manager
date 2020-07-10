const _config = require("../config/configDb");
const pool = _config._pool;

const getPaging = (_request, response) => {
    const { keywords = "", pageNumber = 1, pageSize = 20 } = _request.body;
    const _pageNumber = (pageNumber - 1) * pageSize;
    var _totalCount = 0;
    var _totalPage = 0;
    var _Query = "SELECT t.*,p.\"_title\" as \"_projectTitle\" FROM tasks t \n";
    _Query += "LEFT JOIN projects p on t.\"_project_id\" = p.\"_id\" \n";
    _Query += " WHERE t._id NOT IN (SELECT at._task_id  FROM assign_tasks at) AND t._title ILIKE '%" + keywords + "%'  ORDER BY t._id LIMIT " + pageSize + " OFFSET " + _pageNumber;
    const _QueryPaging = "SELECT (SELECT COUNT(1) FROM tasks WHERE tasks._id NOT IN (SELECT at._task_id  FROM assign_tasks at) AND _title ILIKE '%" + keywords + "%') ::INTEGER AS TotalCount ,CEILING((SELECT COUNT(1) FROM tasks WHERE tasks._id NOT IN (SELECT at._task_id  FROM assign_tasks at) AND _title ILIKE '%" + keywords + "%') / " + pageSize + ") AS TotalPage";


    pool.query(_QueryPaging, (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            _totalCount = results.rows[0].totalcount;
            _totalPage = results.rows[0].totalpage;
        }
        pool.query(_Query, (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json({
                totalPage: _totalPage === 0 ? 1 : _totalPage,
                totalCount: _totalCount === 0 ? 1 : _totalCount,
                rows: results.rows
            });
        });
    });
};

const getAllTasks = (_request, response) => {
    pool.query("SELECT * FROM tasks;", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getTasksById = (_request, response) => {
    const id = parseInt(_request.params.id);
    pool.query("SELECT * FROM tasks where _id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            response.status(200).json(results.rows[0]);
        }
    });
};

const createTasks = (_request, response, next) => {
    var { _title, _project_id, _issuetyperequired, _priority, _startdate, _enddate, _description } = _request.body;
    if (_enddate === null || _enddate === "" || _enddate === "null") { _enddate = null; }

    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM tasks WHERE \"_project_id\" = '" + _project_id + "' AND \"_title\" = '" + _title + "')";

    pool.query(_QueryCheck, (error, results) => {
        try {
            if (error) {
                response.status(error.code).json(error.message);
                next(error.message);
            }
            if (results.rows && results.rows.length !== 0) {
                var isExists = results.rows[0].exists;
                if (isExists) {
                    const result = {
                        command: results.command,
                        rowCount: results.rowCount,
                        status: status,
                        message: "Task name already exists"
                    };
                    response.status(200).json(result);
                } else {
                    pool.query("INSERT INTO tasks (_title, _project_id, _issuetyperequired, _priority, _startdate, _enddate, _description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                        [_title, _project_id, _issuetyperequired, _priority, _startdate, _enddate, _description], (error, results) => {
                            if (error) {
                                throw error;
                            }
                            status = true;
                            const result = {
                                command: results.command,
                                rowCount: results.rowCount,
                                status: status,
                                message: "Add task sucessfully"
                            };
                            response.status(200).json(result);
                        });
                }
            }
        }
        catch (ex) {
            next(ex);
        }
    });
};

const updateTasks = (_request, response) => {
    const id = parseInt(_request.params.id);
    var { _title, _project_id, _issuetyperequired, _priority, _startdate, _enddate, _description } = _request.body;
    if (_enddate === null || _enddate === "" || _enddate === "null") { _enddate = null; }
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM tasks WHERE \"_project_id\" = '" + _project_id + "' AND \"_title\" = '" + _title + "' AND _id != '" + id + "')";
    pool.query(_QueryCheck, (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            var isExists = results.rows[0].exists;
            if (isExists) {
                const result = {
                    command: results.command,
                    rowCount: results.rowCount,
                    status: status,
                    message: "Project name already exists"
                };
                response.status(200).json(result);
            } else {
                pool.query(
                    `UPDATE tasks SET _title = $1
                    , _project_id = $2
                    , _issuetyperequired = $3
                    , _priority = $4
                    , _startdate = $5 
                    , _enddate = $6
                    , _description = $7 
                     WHERE _id = $8`,
                    [_title, _project_id, _issuetyperequired, _priority, _startdate, _enddate, _description, id],
                    (error, _results) => {
                        if (error) {
                            throw error;
                        }

                        status = true;
                        const result = {
                            command: _results.command,
                            rowCount: _results.rowCount,
                            status: status,
                            message: "Update task sucessfully"
                        };

                        response.status(200).json(result);
                    }
                );
            }
        }
    });
};

const deleteTasks = (_request, response) => {
    const id = parseInt(_request.params.id);
    let status = false;
    pool.query("DELETE FROM tasks WHERE _id = $1", [id], (error, _results) => {
        if (error) {
            throw error;
        }

        status = true;
        const result = {
            command: _results.command,
            rowCount: _results.rowCount,
            status: status,
            message: "Delete tasks sucessfully"
        };

        response.status(200).json(result);
    });
};

module.exports = {
    getPaging,
    getAllTasks,
    getTasksById,
    createTasks,
    updateTasks,
    deleteTasks
};