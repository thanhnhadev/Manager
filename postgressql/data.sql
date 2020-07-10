/*
 Navicat Premium Data Transfer

 Source Server         : PostgresSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 110003
 Source Host           : localhost:5432
 Source Catalog        : project-manager
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 110003
 File Encoding         : 65001

 Date: 03/06/2019 19:56:52
*/


-- ----------------------------
-- Sequence structure for assign_tasks__id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."assign_tasks__id_seq";
CREATE SEQUENCE "public"."assign_tasks__id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 32767
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for projects__id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."projects__id_seq";
CREATE SEQUENCE "public"."projects__id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 32767
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for status__id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."status__id_seq";
CREATE SEQUENCE "public"."status__id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 32767
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for tasks__id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."tasks__id_seq";
CREATE SEQUENCE "public"."tasks__id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 32767
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users__id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users__id_seq";
CREATE SEQUENCE "public"."users__id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 32767
START 1
CACHE 1;

-- ----------------------------
-- Table structure for assign_tasks
-- ----------------------------
DROP TABLE IF EXISTS "public"."assign_tasks";
CREATE TABLE "public"."assign_tasks" (
  "_id" int2 NOT NULL DEFAULT nextval('assign_tasks__id_seq'::regclass),
  "_task_id" int4,
  "_uid" int4,
  "_status_id" int4,
  "_logworktime" int4,
  "_isactive" bool DEFAULT true,
  "_createat" timestamptz(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of assign_tasks
-- ----------------------------
INSERT INTO "public"."assign_tasks" VALUES (11, 9, 3, 7, 0, 't', '2019-06-03 00:00:00+07');
INSERT INTO "public"."assign_tasks" VALUES (10, 10, 1, 7, 0, 't', '2019-06-03 00:00:00+07');

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS "public"."projects";
CREATE TABLE "public"."projects" (
  "_id" int2 NOT NULL DEFAULT nextval('projects__id_seq'::regclass),
  "_title" text COLLATE "pg_catalog"."default",
  "_description" text COLLATE "pg_catalog"."default",
  "_isactive" bool DEFAULT true,
  "_createat" timestamptz(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO "public"."projects" VALUES (1, 'CRM', 'Customer relationship management (CRM) is an approach to manage a company''s interaction with current and potential customers. ', 't', '2019-05-29 15:48:31.824075+07');
INSERT INTO "public"."projects" VALUES (2, 'HRM', 'Human resource management (HRM or HR) is the strategic approach to the effective management of people in an organization so that they help the business to gain a competitive advantage', 't', '2019-05-29 15:48:31.824075+07');
INSERT INTO "public"."projects" VALUES (6, 'Production Manager', 'As a production manager, you''ll be involved with the planning, coordination and control of manufacturing processes. You''ll make sure goods and services are produced efficiently and that the correct amount is produced at the right cost and level of quality.', 't', '2019-05-29 16:42:08+07');

-- ----------------------------
-- Table structure for status
-- ----------------------------
DROP TABLE IF EXISTS "public"."status";
CREATE TABLE "public"."status" (
  "_id" int2 NOT NULL DEFAULT nextval('status__id_seq'::regclass),
  "_type" int4 DEFAULT 0,
  "_title" text COLLATE "pg_catalog"."default",
  "_color" text COLLATE "pg_catalog"."default",
  "_description" text COLLATE "pg_catalog"."default",
  "_isactive" bool DEFAULT true,
  "_createat" timestamptz(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of status
-- ----------------------------
INSERT INTO "public"."status" VALUES (2, 0, 'In Process', 'warning', 'Status In Process', 't', '2019-05-29 16:08:14.674229+07');
INSERT INTO "public"."status" VALUES (7, 0, 'Assigned', 'success', 'Status assigned', 't', '2019-06-03 17:51:08.002411+07');
INSERT INTO "public"."status" VALUES (3, 0, 'Unassigned', 'danger', 'Status Unassigned', 't', '2019-05-29 20:26:47.71951+07');
INSERT INTO "public"."status" VALUES (1, 0, 'Done', 'primary', 'Status Done', 't', '2019-05-29 16:08:12.430657+07');

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS "public"."tasks";
CREATE TABLE "public"."tasks" (
  "_id" int2 NOT NULL DEFAULT nextval('tasks__id_seq'::regclass),
  "_project_id" int4,
  "_issuetyperequired" text COLLATE "pg_catalog"."default",
  "_priority" text COLLATE "pg_catalog"."default",
  "_title" text COLLATE "pg_catalog"."default",
  "_description" text COLLATE "pg_catalog"."default",
  "_startdate" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "_enddate" timestamp(6),
  "_isactive" bool DEFAULT true,
  "_createat" timestamptz(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of tasks
-- ----------------------------
INSERT INTO "public"."tasks" VALUES (1, 1, 'Task', 'Medium', 'SMES-794', '[Common] Update Database - Add new fields for Purchase Order, Sales Order, Item Group', '2019-05-30 21:26:00', NULL, 't', '2019-05-30 21:26:23.339937+07');
INSERT INTO "public"."tasks" VALUES (7, 1, 'Task', 'Height', 'SMES-795', '[Inventory Report] Inventory Report - Recalculate figures', '2019-05-31 13:00:00', NULL, 't', '2019-05-30 23:30:04.6239+07');
INSERT INTO "public"."tasks" VALUES (9, 1, 'Task', 'Low', 'SMES-816', '[UAT Sprint 3] - [Bug] - Work Order - Create / Update Work Order - Incorrect End Time', '2019-05-31 16:24:00', NULL, 't', '2019-05-31 16:24:47.950114+07');
INSERT INTO "public"."tasks" VALUES (10, 1, 'Task', 'Low', 'SMES-796', '[Inventory Report] Inventory Report - Display information when hover over columns in column chart', '2019-05-31 16:24:00', NULL, 't', '2019-05-31 16:25:07.504987+07');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "_id" int2 NOT NULL DEFAULT nextval('users__id_seq'::regclass),
  "_uname" text COLLATE "pg_catalog"."default",
  "_pass" text COLLATE "pg_catalog"."default",
  "_isactive" bool DEFAULT true,
  "_createat" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "_displayName" text COLLATE "pg_catalog"."default",
  "_photoURL" text COLLATE "pg_catalog"."default",
  "_email" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES (1, 'chungthanhphuoc', 'thanhphuoc', 't', '2019-05-30 11:50:39.710912+07', 'Chung Thành Phước', 'https://lh3.googleusercontent.com/-Qd51qXX7jcg/VxE9trXO1MI/AAAAAAAAAKo/IqJu9tmqU5oFaiHEjKCEUBfvzvECx4WywCEwYBhgL/w140-h140-p/Guy_Fawkes_Anonymous.png', 'chungthanhphuoc@hotmail.com');
INSERT INTO "public"."users" VALUES (3, 'guest', '123456', 't', '2019-05-30 23:53:09.020106+07', 'Guest', 'https://lh3.googleusercontent.com/-Qd51qXX7jcg/VxE9trXO1MI/AAAAAAAAAKo/IqJu9tmqU5oFaiHEjKCEUBfvzvECx4WywCEwYBhgL/w140-h140-p/Guy_Fawkes_Anonymous.png', 'guest@hotmail.com');

-- ----------------------------
-- Function structure for show_projects
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."show_projects"();
CREATE OR REPLACE FUNCTION "public"."show_projects"()
  RETURNS "pg_catalog"."refcursor" AS $BODY$
	DECLARE
		ref refcursor;                                                     	-- Declare a cursor variable
	BEGIN
		OPEN ref FOR SELECT * FROM projects;   															-- Open a cursor
		RETURN ref;                                                       	-- Return the cursor to the caller
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."assign_tasks__id_seq"
OWNED BY "public"."assign_tasks"."_id";
SELECT setval('"public"."assign_tasks__id_seq"', 12, true);
ALTER SEQUENCE "public"."projects__id_seq"
OWNED BY "public"."projects"."_id";
SELECT setval('"public"."projects__id_seq"', 1018, true);
ALTER SEQUENCE "public"."status__id_seq"
OWNED BY "public"."status"."_id";
SELECT setval('"public"."status__id_seq"', 8, true);
ALTER SEQUENCE "public"."tasks__id_seq"
OWNED BY "public"."tasks"."_id";
SELECT setval('"public"."tasks__id_seq"', 11, true);
ALTER SEQUENCE "public"."users__id_seq"
OWNED BY "public"."users"."_id";
SELECT setval('"public"."users__id_seq"', 4, true);

-- ----------------------------
-- Primary Key structure for table assign_tasks
-- ----------------------------
ALTER TABLE "public"."assign_tasks" ADD CONSTRAINT "assign_tasks_pkey" PRIMARY KEY ("_id");

-- ----------------------------
-- Primary Key structure for table projects
-- ----------------------------
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("_id");

-- ----------------------------
-- Primary Key structure for table status
-- ----------------------------
ALTER TABLE "public"."status" ADD CONSTRAINT "status_pkey" PRIMARY KEY ("_id");

-- ----------------------------
-- Primary Key structure for table tasks
-- ----------------------------
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("_id");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("_id");

-- ----------------------------
-- Foreign Keys structure for table assign_tasks
-- ----------------------------
ALTER TABLE "public"."assign_tasks" ADD CONSTRAINT "assign_tasks__status_id_fkey" FOREIGN KEY ("_status_id") REFERENCES "public"."status" ("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."assign_tasks" ADD CONSTRAINT "assign_tasks__task_id_fkey" FOREIGN KEY ("_task_id") REFERENCES "public"."tasks" ("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."assign_tasks" ADD CONSTRAINT "assign_tasks__uid_fkey" FOREIGN KEY ("_uid") REFERENCES "public"."users" ("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table tasks
-- ----------------------------
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks__project_id_fkey" FOREIGN KEY ("_project_id") REFERENCES "public"."projects" ("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
