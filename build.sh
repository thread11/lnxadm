#!/bin/bash

set -e

printf "\n-- $(date) -- Starting --\n"

[ -d build ] && rm -rf build
mkdir -p build/html
mkdir -p build/log

printf "\n-- $(date) -- Building --\n"

# (cd lnxadm_web && yarn build)
cp -ar lnxadm_web/build/* build/html/

# apt-get install glibc-static
# yum install glibc-static
(cd lnxadm_api && go build -ldflags="-s -w -linkmode=external -extldflags=-static")
cp -a lnxadm_api/lnxadm build/
cp -a lnxadm_api/data build/
(cd build/data && bash init_db_with_sqlite.sh)

tar czf lnxadm.tar.gz build --transform s/^build/lnxadm/

printf "\n-- $(date) -- Finished --\n"
