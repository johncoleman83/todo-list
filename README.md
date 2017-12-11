# Todo List

simple todo list with JS frontend, facebook OAuth, mysql storage, docker

## Demo

https://cecinestpasun.site/todo

## Screen Shot

<img src="https://raw.githubusercontent.com/johncoleman83/todo-list/master/screen-shot.png" width="612" height=auto />

## Description

This is a basic todo app demonstrating some of my full stack skills

## Environment

* __Server__
  * __OS:__ Linux Ubuntu 16.04.3 LTS (xenial)
  * __firewall:__ ufw 0.35
  * __SSL Cert:__ Let's Encrypt [certbot 0.19.0](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)

* __Languages__
  * Python 3.6.3
  * Vanilla Javascript & JQuery
  * HTML
  * __CSS:__ [Materialize](http://materializecss.com/)
    * __icons:__ [fontawesome.io](http://fontawesome.io/)

* __Apps__
  * __web server:__ nginx/1.4.6
  * __application server:__ Flask==0.12.2, Jinja2==2.9.6
  * __web server gateway:__ gunicorn (version 19.7.1)
  * __OAuth:__ [Facebook](https://developers.facebook.com/docs/facebook-login/web)

* __Database__
  * __database:__ mysql Ver 14.14 Distrib 5.7.18
  * __docker dev DB:__ mysql latest

* __style:__
  * __python:__ PEP 8 (v. 1.7.0)
  * __web static:__ [W3C Validator](https://validator.w3.org/)
  * __JavaScript:__ semistandard 11.0.0

## Releases

* __v1:__ [Static Version JQuery JS Python Flask App No Storage](https://github.com/johncoleman83/todo-list/releases/tag/v1)

## usage static

```
$ ./app.py
```

* __v2:__ [Facebook OAuth - MySQL DB Storage Engine - Docker](https://github.com/johncoleman83/todo-list/releases/tag/v2)

## usage OAuth & Docker DB storage

* __(1) Setup Docker development database__

(Facebook Application settings need to be configured with localhost)
  * pull latest docker mysql image from docker hub

```
$ docker pull mysql:latest
```

  * start todo-mysql container

```
$ docker run --name todo-mysql --detach --env MYSQL_ALLOW_EMPTY_PASSWORD='yes' \
	--env MYSQL_DATABASE='todo_dev_db' --publish 3306:3306 mysql:latest
```

  * __Note:__

    * *wait 7 seconds to make sure the container and mysql is ready*
    * *the next 2 commands require mysql server to be installed to execute them*
    * *make note of the* LOCAL_IP *used to bind to the docker container*
      * Linux: `172.17.0.2`
	  * mac OS: `0.0.0.0`

  * verify container was created successfully

```
$ docker ps -a
CONTAINER ID   IMAGE         ...  ...  STATUS           PORTS                    NAMES
51cc1b82aef8   mysql:latest  ...  ...  Up 44 seconds    0.0.0.0:3306->3306/tcp   todo-mysql
```

  * verify database exists

```
$ docker exec [CONTAINER ID] echo 'SHOW DATABASES;' | mysql -h[LOCAL_IP] -uroot
```

* __(2) Configure ENV Variables (Optional)__
  * `APP_HOST`
  * `APP_PORT`
  * `TODO_KEY`
  * `TODO_USER`
  * `TODO_PWD`
  * `TODO_DB_HOST`
  * `TODO_MYSQL_DB`

* __(3) execute todo app backend app server__

```
$ TODO_DB_HOST=[LOCAL_IP] python3 -m web_app.app
```

## Terms of use and Privacy Statement

https://github.com/johncoleman83/todo-list/blob/master/PRIVACY_STATEMENT.md

## License

MIT License
