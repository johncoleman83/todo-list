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
    echo "Usage:"
    echo "\$ sudo ./init-mysql-docker-db-container.bash"
    echo "  docker often requires root privileges. If you still wish to"
    echo "  continue, then please enter 'Y'. Or anything else to quit"
    echo ""
    read -p "Continue ? " -n 1 -r CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
	echo "...Goodbye"
	[[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
    fi
fi

if [[ ! "$(docker ps -aq --filter name=todo-mysql | wc -c)" == 0 ]]; then
    C="$(docker ps -aq --filter name=todo-mysql)"
    echo ""
    echo "there is already a database setup, please run"
    echo "\$ docker kill $C"
    echo "\$ docker rm $C"
    echo ""
    [[ "$0" = "${BASH_SOURCE[0]}" ]] && exit 1 || return 1
fi


echo ""
# pull docker mysql:latest image
# docker pull mysql:latest

# run the mysql database with root pw 'root'
echo "docker run image..."
docker run --name todo-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -d mysql:latest
echo "please wait..."
sleep 4

# save container name for future use
MYSQL_CONTAINER="$(docker ps -aq --filter name=todo-mysql)"
echo "the new todo-mysql container is: $MYSQL_CONTAINER"
echo "please wait..."
sleep 4

# cp init script to docker container
#docker cp ./create-todo-db.sql "$MYSQL_CONTAINER":/home/create-todo-db.sql
#sleep 3
# verify copy
#echo "copying mysql database init .sql file to docker container..."
#docker exec "$MYSQL_CONTAINER" ls -la /home
#sleep 3

# verify connection with mysql in container
VERIFICATION="$(docker exec $MYSQL_CONTAINER echo 'SHOW DATABASES;' | mysql -h172.17.0.2 -uroot)"
if [[ ! "$(echo $VERIFICATION | grep 'ERROR' | wc -c)" == 0 ]]; then
    echo ""
    echo "there seems to be a problem connecting to mysql db"
    echo "please wait"
    sleep 6
fi

# DROP DATABASE IF EXISTS todo_dev_db;
docker exec "$MYSQL_CONTAINER" echo "DROP DATABASE IF EXISTS todo_dev_db;" \
    | mysql -h172.17.0.2 -uroot

# initialize mysql DB with todo application settings
echo "initializing todo application database..."
docker exec "$MYSQL_CONTAINER" echo "CREATE DATABASE IF NOT EXISTS todo_dev_db;" \
    | mysql -h172.17.0.2 -uroot

echo "verifying database todo_dev_db..."
VERIFICATION_TWO="$(docker exec $MYSQL_CONTAINER echo 'SHOW DATABASES;' | mysql -h172.17.0.2 -uroot)"

if [[ "$(echo $VERIFICATION_TWO | grep 'todo_dev_db' | wc -c)" == 0 ]]; then
    echo ""
    echo "there seems to be a problem!"
    [[ "$0" = "${BASH_SOURCE[0]}" ]] && exit 1 || return 1
else
    echo ""
    echo "$VERIFICATION_TWO"
    echo "success!!"
fi
