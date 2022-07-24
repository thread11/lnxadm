#!/bin/bash

set -x
set -e

mysql -h127.0.0.1 -utest -p123 -e "DROP DATABASE IF EXISTS lnxadm"
mysql -h127.0.0.1 -utest -p123 -e "CREATE DATABASE lnxadm"

mysql -h127.0.0.1 -utest -p123 lnxadm <./mysql/init_ddl.sql
mysql -h127.0.0.1 -utest -p123 lnxadm <./mysql/init_dml.sql
