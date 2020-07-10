const _config = require("../config/configDb");
const pool = _config._pool;

const getPaging = (_request, response) => {
    const { keywords = "", pageNumber = 1, pageSize = 20 } = _request.body;
    const _pageNumber = (pageNumber - 1) * pageSize;
    var _totalCount = 0;
    var _totalPage = 0;

    const _Query = `
                SELECT 
	                 at."_id"
	                ,at."_task_id"
	                ,at."_uid"
	                ,at."_status_id"
	                ,at."_logworktime"
	                ,at."_isactive"
	                ,at."_createat"
	                ,t."_title" as "_taskTitle"
	                ,p."_title" as "_projectTitle"
	                ,u."_displayName" as "_displayName"
	                ,u."_uname" as "uName"
	                ,u."_photoURL" as "_photoURL"
	                ,u."_email" as "_email"
	                ,st."_title" as "status"
	                ,st."_type" as "statusType"
	                ,st."_color" as "statusColor"
                FROM assign_tasks at
                LEFT JOIN tasks t on at."_task_id" = t."_id"
                LEFT JOIN projects p on t."_project_id" = p."_id"
                LEFT JOIN status st on at."_status_id" = st."_id"
                LEFT JOIN users u on at."_uid" = u."_id"
                WHERE t."_title" ILIKE '%${keywords}%'
                ORDER BY at."_createat" DESC
                LIMIT ${pageSize} OFFSET ${_pageNumber}
            `;

    const _QueryPaging = `
                    SELECT
                    (
	                    (SELECT COUNT(1)
	                    FROM assign_tasks at
	                    LEFT JOIN tasks t on at."_task_id" = t."_id"
	                    WHERE t."_title" ILIKE '%%${keywords}%')::INTEGER
                    ) AS TotalCount
                    , 
                    CEILING
                    (
	
	                    (SELECT COUNT(1)
	                    FROM assign_tasks at
	                    LEFT JOIN tasks t on at."_task_id" = t."_id"
	                    WHERE t."_title" ILIKE '%%${keywords}%') / ${pageSize}
                    ) AS TotalPage
            `;

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

const getPagingJsonArray = (_request, response) => {
    const { keywords = "", pageNumber = 1, pageSize = 20 } = _request.body;
    const _pageNumber = (pageNumber - 1) * pageSize;
    var _totalCount = 0;
    var _totalPage = 0;

    const _Query = `
                SELECT array_to_json(array_agg(row_to_json(t))) as "rows"
                FROM (
                    select 
		                 users."_id" as "uid"
                        ,users."_uname" as "_uname"
		                ,users."_displayName" as "_displayName"
		                ,users."_photoURL" as "_photoURL"
		                ,users."_email" as "_email"
		                ,
                    (
                        select array_to_json(array_agg(row_to_json(d)))
                        from (
                        select 
					                at."_id"
					                ,at."_task_id"
					                ,at."_uid"
					                ,at."_status_id"
					                ,at."_logworktime"
					                ,at."_isactive"
					                ,at."_createat"
					                ,t."_title" as "_taskTitle"
                                    ,t."_issuetyperequired" as "_issuetyperequired"
					                ,t."_priority" as "_priority"
					                ,p."_title" as "_projectTitle"
                                    ,t."_description" as "_taskDescription"
                                    ,st."_title" as "status"
					                ,st."_type" as "statusType"
					                ,st."_color" as "statusColor"
                        from assign_tasks at
				                LEFT JOIN tasks t on at."_task_id" = t."_id"
				                LEFT JOIN projects p on t."_project_id" = p."_id"
				                LEFT JOIN status st on at."_status_id" = st."_id"
				                WHERE at."_uid" = users."_id"
                        ) d
                    ) as Tasks
                    FROM users
	                WHERE users."_uname" ILIKE '%${keywords}%' OR users."_email" ILIKE '%${keywords}%' OR users."_displayName" ILIKE '%${keywords}%'
	                ORDER BY users."_uname"
	                LIMIT ${pageSize} OFFSET ${_pageNumber}
                ) t;
            `;

    const _QueryPaging = `
                    SELECT
                    (
	                    (SELECT COUNT(1)
	                    FROM assign_tasks at
	                    LEFT JOIN tasks t on at."_task_id" = t."_id"
	                    WHERE t."_title" ILIKE '%%${keywords}%')::INTEGER
                    ) AS TotalCount
                    , 
                    CEILING
                    (
	
	                    (SELECT COUNT(1)
	                    FROM assign_tasks at
	                    LEFT JOIN tasks t on at."_task_id" = t."_id"
	                    WHERE t."_title" ILIKE '%%${keywords}%') / ${pageSize}
                    ) AS TotalPage
            `;

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

const getAllAssignTask = (_request, response) => {
    const _Query = `
                SELECT 
	                 at."_id"
	                ,at."_task_id"
	                ,at."_uid"
	                ,at."_status_id"
	                ,at."_logworktime"
	                ,at."_isactive"
	                ,at."_createat"
	                ,t."_title" as "_taskTitle"
	                ,p."_title" as "_projectTitle"
	                ,u."_displayName" as "_displayName"
	                ,u."_uname" as "uName"
	                ,u."_photoURL" as "_photoURL"
	                ,u."_email" as "_email"
	                ,st."_title" as "status"
	                ,st."_type" as "statusType"
	                ,st."_color" as "statusColor"
                FROM assign_tasks at
                LEFT JOIN tasks t on at."_task_id" = t."_id"
                LEFT JOIN projects p on t."_project_id" = p."_id"
                LEFT JOIN status st on at."_status_id" = st."_id"
                LEFT JOIN users u on at."_uid" = u."_id"
                ORDER BY at."_createat" DESC
            `;
    pool.query(_Query, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getAssignTaskById = (_request, response) => {
    const id = parseInt(_request.params.id);
    const _Query = `
                SELECT 
	                 at."_id"
	                ,at."_task_id"
	                ,at."_uid"
	                ,at."_status_id"
	                ,at."_logworktime"
	                ,at."_isactive"
	                ,at."_createat"
	                ,t."_title" as "_taskTitle"
	                ,p."_title" as "_projectTitle"
	                ,u."_displayName" as "_displayName"
	                ,u."_uname" as "uName"
	                ,u."_photoURL" as "_photoURL"
	                ,u."_email" as "_email"
	                ,st."_title" as "status"
	                ,st."_type" as "statusType"
	                ,st."_color" as "statusColor"
                FROM assign_tasks at
                LEFT JOIN tasks t on at."_task_id" = t."_id"
                LEFT JOIN projects p on t."_project_id" = p."_id"
                LEFT JOIN status st on at."_status_id" = st."_id"
                LEFT JOIN users u on at."_uid" = u."_id"
                WHERE at."_id" = $1
                ORDER BY at."_createat" DESC
            `;

    pool.query(_Query, [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows && results.rows.length !== 0) {
            response.status(200).json(results.rows[0]);
        }
    });
};

const getAllStatusTask = (_request, response) => {
    const _Query = `SELECT * FROM status WHERE "_type" = 0`;
    pool.query(_Query, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createAssignTask = (_request, response, next) => {
    const { _task_id, _uid, _status_id, _logworktime, _createat } = _request.body;
    let status = false;
    const _QueryCheck = `
            SELECT EXISTS
            (
	            SELECT at."_task_id",at."_uid"
	            FROM assign_tasks at
	            WHERE at."_task_id" = ${_task_id} and at."_uid" = ${_uid}
            )
        `;
    const _QueryInsert = `
            INSERT INTO assign_tasks("_task_id","_uid","_status_id","_logworktime","_createat")
            VALUES($1,$2,$3,$4,$5)
        `;

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
                    pool.query(_QueryInsert,
                        [_task_id, _uid, _status_id, _logworktime, _createat], (error, results) => {
                            if (error) {
                                throw error;
                            }
                            status = true;
                            const result = {
                                command: results.command,
                                rowCount: results.rowCount,
                                status: status,
                                message: "Assign task sucessfully"
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

const updateAssignTask = (_request, response) => {
    const id = parseInt(_request.params.id);
    const { _task_id, _uid, _status_id, _logworktime, _createat } = _request.body;
    let status = false;
    const _QueryCheck = `
            SELECT EXISTS
            (
	            SELECT at."_task_id",at."_uid"
	            FROM assign_tasks at
	            WHERE at."_task_id" = ${_task_id} AND at."_uid" = ${_uid} AND at."_id" != ${id}
            )
        `;

    const _QueryUpdate = `
                UPDATE assign_tasks SET "_task_id" = $1,
                "_uid" = $2,
                "_status_id" = $3,
                "_logworktime" = $4,
                "_createat" = $5
                WHERE "_id" = $6
            `;
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
                    _QueryUpdate,
                    [_task_id, _uid, _status_id, _logworktime, _createat, id],
                    (error, _results) => {
                        if (error) {
                            throw error;
                        }

                        status = true;
                        const result = {
                            command: _results.command,
                            rowCount: _results.rowCount,
                            status: status,
                            message: "Update assign task sucessfully"
                        };

                        response.status(200).json(result);
                    }
                );
            }
        }
    });
};

const updateStatusAssignTask = (_request, response) => {
    const id = parseInt(_request.params.id);
    const { _status_id } = _request.body;
    let status = false;

    const _QueryUpdate = `
                UPDATE assign_tasks SET "_status_id" = $1
                WHERE "_id" = $2
            `;
    pool.query(
        _QueryUpdate,
        [_status_id, id],
        (error, _results) => {
            if (error) {
                throw error;
            }

            status = true;
            const result = {
                command: _results.command,
                rowCount: _results.rowCount,
                status: status,
                message: "Update status assign task sucessfully"
            };

            response.status(200).json(result);
        }
    );
};

const deleteAssignTask = (_request, response) => {
    const id = parseInt(_request.params.id);
    let status = false;
    pool.query("DELETE FROM assign_tasks WHERE _id = $1", [id], (error, _results) => {
        if (error) {
            throw error;
        }

        status = true;
        const result = {
            command: _results.command,
            rowCount: _results.rowCount,
            status: status,
            message: "Delete assign tasks sucessfully"
        };

        response.status(200).json(result);
    });
};

module.exports = {
    getPaging,
    getAllAssignTask,
    getAssignTaskById,
    createAssignTask,
    updateAssignTask,
    deleteAssignTask,
    getPagingJsonArray,
    getAllStatusTask,
    updateStatusAssignTask
};