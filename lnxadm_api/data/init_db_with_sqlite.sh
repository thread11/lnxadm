#!/bin/bash

set -x
set -e

[ -f ./lnxadm.db ] && rm ./lnxadm.db

sqlite3 ./lnxadm.db <./sqlite/init_ddl.sql
sqlite3 ./lnxadm.db <./sqlite/init_dml.sql
