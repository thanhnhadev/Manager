const _config = require("../config/configDb");
const pool = _config._pool;


const getPaging = (_request, response) => {
    const { keywords = "", pageNumber = 1, pageSize = 20 } = _request.body;
    const _pageNumber = (pageNumber - 1) * pageSize;
    var _totalCount = 0;
    var _totalPage = 0;
    const _Query = "SELECT * FROM projects WHERE _title ILIKE '%" + keywords + "%'  ORDER BY _id LIMIT " + pageSize + " OFFSET " + _pageNumber;
    const _QueryPaging = "SELECT (SELECT COUNT(1) FROM projects WHERE _title ILIKE '%" + keywords + "%') ::INTEGER AS TotalCount ,CEILING((SELECT COUNT(1) FROM projects WHERE _title ILIKE '%" + keywords + "%') / " + pageSize + ") AS TotalPage";

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

const getAllProject = (_request, response) => {
    pool.query("SELECT * FROM projects;", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getProjectById = (_request, response) => {
    const id = parseInt(_request.params.id);
    pool.query("SELECT * FROM projects where _id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            response.status(200).json(results.rows[0]);
        }
    });
};

const createProject = (_request, response, next) => {
    const { _title, _description } = _request.body;
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM projects WHERE \"_title\" = '" + _title + "')";
    
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
                        message: "Project name already exists"
                    };
                    response.status(200).json(result);
                } else {
                    pool.query("INSERT INTO projects (_title, _description) VALUES ($1, $2)", [_title, _description], (error, results) => {
                        if (error) {
                            throw error;
                        }
                        status = true;
                        const result = {
                            command: results.command,
                            rowCount: results.rowCount,
                            status: status,
                            message: "Add project sucessfully"
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

const updateProject = (_request, response) => {
    const id = parseInt(_request.params.id);
    const { _title, _description } = _request.body;
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM projects WHERE \"_title\" = '" + _title + "' AND _id != '" + id + "')";
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
                    "UPDATE projects SET _title = $1, _description = $2 WHERE _id = $3",
                    [_title, _description, id],
                    (error, _results) => {
                        if (error) {
                            throw error;
                        }

                        status = true;
                        const result = {
                            command: _results.command,
                            rowCount: _results.rowCount,
                            status: status,
                            message: "Update project sucessfully"
                        };

                        response.status(200).json(result);
                    }
                );
            }
        }
    });
};

const deleteProject = (_request, response) => {
    const id = parseInt(_request.params.id);
    let status = false;
    pool.query("DELETE FROM projects WHERE _id = $1", [id], (error, _results) => {
        if (error) {
            throw error;
        }

        status = true;
        const result = {
            command: _results.command,
            rowCount: _results.rowCount,
            status: status,
            message: "Delete project sucessfully"
        };

        response.status(200).json(result);
    });
};

module.exports = {
    getAllProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getPaging
};