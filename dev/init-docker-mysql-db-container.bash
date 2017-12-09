#!/usr/bin/env bash
#
# this file initializes a docker container with a mysql DB
# used for the todo application

if [[ "$(which docker | wc -c)" == 0 ]]; then
    echo ""
    echo "docker does not appear to be installed"
    echo "please install docker or manually execute these commands"
    echo ""
    [[ "$0" = "${BASH_SOURCE[0]}" ]] && exit 1 || return 1
fi

if [ "$(id -u)" != "0" ]; then
    echo ""
    echo "Usage: sudo ./init-mysql-docker-db-container.bash"
    echo "  docker often requires root privileges. If you still wish to"
    echo "  continue, then please enter 'Y'. Or anything else to quit"
    echo ""
    read -p "Continue ? " -n 1 -r CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
	echo "...Goodbye"
	[[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
    fi
fi

echo ""
# pull docker mysql:latest image
# docker pull mysql:latest

# run the mysql database with root pw 'root'
echo "docker run image..."
docker run --name todo-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -d mysql:latest
sleep 3

# save container name for future use
MYSQL_CONTAINER="$(docker ps -aq --filter name=todo-mysql)"
echo "the new todo-mysql container: $MYSQL_CONTAINER"

# cp init script to docker container
docker cp dev/todo-db-init.sql $MYSQL_CONTAINER:/home/todo-db-init.sql

# verify copy
echo "copying mysql database init .sql file to docker container..."
docker exec $MYSQL_CONTAINER ls -la /home
sleep 2

# initialize mysql DB with todo application settings
echo "initializing todo application database..."
docker exec $MYSQL_CONTAINER cat /home/todo-db-init.sql | mysql -h172.17.0.2 -uroot
sleep 2

docker exec $MYSQL_CONTAINER echo "SHOW DATABASES;" | mysql -h172.17.0.2 -uroot
