const jwt = require("jsonwebtoken");
const _config = require("../config/configDb");
const _configToken = require("../config/configToken");
const pool = _config._pool;

const jwtSerect = _configToken.TokenConfig.jwtSerect;
const jwtExpiresIn = _configToken.TokenConfig.jwtExpiresIn;

const getPaging = (_request, response) => {
    const { keywords = "", pageNumber = 1, pageSize = 20 } = _request.body;
    const _pageNumber = (pageNumber - 1) * pageSize;
    var _totalCount = 0;
    var _totalPage = 0;
    const _Query = "SELECT * FROM users WHERE _uname ILIKE '%" + keywords + "%'  ORDER BY _id LIMIT " + pageSize + " OFFSET " + _pageNumber;
    const _QueryPaging = "SELECT (SELECT COUNT(1) FROM users WHERE _uname ILIKE '%" + keywords + "%') ::INTEGER AS TotalCount ,CEILING((SELECT COUNT(1) FROM users WHERE _uname ILIKE '%" + keywords + "%') / " + pageSize + ") AS TotalPage";

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

const getAllUsers = (_request, response) => {
    pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUsersById = (_request, response) => {
    const id = parseInt(_request.params.id);
    pool.query("SELECT * FROM users where _id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            response.status(200).json(results.rows[0]);
        }
    });
};

const createUsers = (_request, response) => {
    const { _uName, _pass, _displayName, _photoURL, _email } = _request.body;
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM users WHERE \"_uname\" = '" + _uName + "')";
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
                    message: "User already exists"
                };
                response.status(200).json(result);
            } else {
                pool.query("INSERT INTO users (_uName, _pass, \"_displayName\", \"_photoURL\", _email) VALUES ($1, $2, $3, $4, $5)"
                    , [_uName, _pass, _displayName, _photoURL, _email], (error, results) => {
                        if (error) {
                            throw error;
                        }
                        status = true;
                        const result = {
                            command: results.command,
                            rowCount: results.rowCount,
                            status: status,
                            message: "Add Users sucessfully"
                        };
                        response.status(200).json(result);
                    });
            }
        }
    });
};

const updateUsers = (_request, response) => {
    const id = parseInt(_request.params.id);
    const { _uName, _pass, _displayName, _photoURL, _email } = _request.body;
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM users WHERE \"_uname\" = '" + _uName + "' AND _id != '" + id + "')";
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
                    message: "User already exists"
                };
                response.status(200).json(result);
            } else {
                pool.query(
                    `UPDATE users SET _uName = $1
                        , _pass = $2 
                        , \"_displayName\" = $3
                        , \"_photoURL\" = $4
                        , _email = $5
                     WHERE _id = $6`,
                    [_uName, _pass, _displayName, _photoURL, _email, id],
                    (error, _results) => {
                        if (error) {
                            throw error;
                        }

                        status = true;
                        const result = {
                            command: _results.command,
                            rowCount: _results.rowCount,
                            status: status,
                            message: "Update Users sucessfully"
                        };
                        response.status(200).json(result);
                    }
                );
            }
        }
    });
};

const updateUserInfoUsers = (_request, response) => {
    const id = parseInt(_request.params.id);
    const { _uName, _displayName, _photoURL } = _request.body;
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM users WHERE \"_uname\" = '" + _uName + "' AND _id != '" + id + "')";
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
                    message: "User already exists"
                };
                response.status(200).json(result);
            } else {
                pool.query(
                    `UPDATE users SET \"_displayName\" = $1
                        , \"_photoURL\" = $2
                     WHERE _id = $3`,
                    [_displayName, _photoURL, id],
                    (error, _results) => {
                        if (error) {
                            throw error;
                        }

                        status = true;
                        const result = {
                            command: _results.command,
                            rowCount: _results.rowCount,
                            status: status,
                            message: "Update Users sucessfully"
                        };
                        response.status(200).json(result);
                    }
                );
            }
        }
    });
};

const deleteUsers = (_request, response) => {
    const id = parseInt(_request.params.id);
    let status = false;
    pool.query("DELETE FROM users WHERE _id = $1", [id], (error, _results) => {
        if (error) {
            throw error;
        }

        status = true;
        const result = {
            command: _results.command,
            rowCount: _results.rowCount,
            status: status,
            message: "Delete Users sucessfully"
        };

        response.status(200).json(result);
    });
};

const loginUsers = (_request, response) => {
    const { _uName, _pass } = _request.body;
    let status = false;
    const _QueryCheck = "SELECT EXISTS (SELECT * FROM users WHERE \"_uname\" = '" + _uName + "' And \"_pass\" = '" + _pass + "')";
    const _QueryGet = "SELECT * FROM users WHERE \"_uname\" = '" + _uName + "' And \"_pass\" = '" + _pass + "'";
    pool.query(_QueryCheck, (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            var isExists = results.rows[0].exists;
            if (isExists) {
                status = true;
                pool.query(_QueryGet, (error, results) => {
                    if (error) {
                        throw error;
                    }
                    if (results.rows && results.rows.length !== 0) {
                        var userInfo = results.rows[0];
                        const payload = {
                            _id: userInfo._id,
                            _uname: userInfo._uname,
                            _displayName: userInfo._displayName,
                            _photoURL: userInfo._photoURL,
                            _email: userInfo._email,
                            status: status
                        };

                        const token = jwt.sign(payload, jwtSerect, {
                            expiresIn: jwtExpiresIn
                        });
                        const result = {
                            command: results.command,
                            rowCount: results.rowCount,
                            status: status,
                            message: "Login successfully",
                            token: token
                        };
                        response.status(200).json(result);
                    }
                });
                //Using cookie
                //response.cookie("token", token, { httpOnly: true }).sendStatus(200);
            } else {
                const result = {
                    command: results.command,
                    rowCount: results.rowCount,
                    status: status,
                    message: "Incorrect username or password"
                };
                response.status(401).json(result);
            }
        }
    });
};

const verifyToken = (_request, response) => {
    const { token } = _request.body;

    jwt.verify(token, jwtSerect, (err, decoded) => {
        if (err) {
            const result = {
                name: err.name,
                message: err.message,
                expiredAt: err.expiredAt,
                status: false
            };
            response.status(401).json(result);
        } else {
            response.status(200).json(decoded);
        }
    });
};

const signOut = (_request, response) => {
    jwt.verify(_request.body.token, jwtSerect, (err, decoded) => {
        if (err) {
            const result = {
                name: err.name,
                message: err.message,
                expiredAt: err.expiredAt,
                status: false
            };
            response.status(401).json(result);
        } else {
            response.status(200).json(decoded);
        }
    });
};

module.exports = {
    getAllUsers,
    getPaging,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers,
    loginUsers,
    verifyToken,
    updateUserInfoUsers,
    signOut
};