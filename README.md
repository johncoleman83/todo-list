# Todo List

simple todo list

## Demo

https://cecinestpasun.site/todo (coming soon!)

## Description

This is a basic todo app demonstrating some of my full stack skills

## Environment

* __OS:__ Linux Ubuntu 16.04.3 LTS (xenial)
* __firewall:__ ufw 0.35
* __SSL Cert:__ Let's Encrypt [certbot 0.19.0](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)
* __languages:__
  * Python 3.6.3
  * Vanilla Javascript
  * HTML
  * __CSS:__ [Materialize](http://materializecss.com/)
  * __icons:__ [fontawesome.io](http://fontawesome.io/)
* __web server:__ nginx/1.4.6
* __application server:__ Flask==0.12.2, Jinja2==2.9.6
* __web server gateway:__ gunicorn (version 19.7.1)
* __OAuth:__ [Facebook](https://developers.facebook.com/docs/facebook-login/web)
* __database:__ mysql Ver 14.14 Distrib 5.7.18
* __style:__
  * __python:__ PEP 8 (v. 1.7.0)
  * __web static:__ [W3C Validator](https://validator.w3.org/)
  * __JavaScript:__ semistandard 11.0.0

## Releases

* __v1:__ [Static Version JQuery JS Python Flask App No Storage](https://github.com/johncoleman83/todo-list/releases/tag/v1)

  ### usage static

```
$ ./app.py
```

* __v2:__ [Facebook OAuth with MySQL DB Storage Engine](https://github.com/johncoleman83/todo-list/releases/tag/v2)

  ### usage OAuth DB storage

```
$ python3 -m web_app.app
```

## Development

#### Setup Docker

```
$ docker pull mysql:latest
$ docker run --name todo-mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:latest
$ export MYSQL_CONTAINER=$(docker ps -aq --filter name=todo-mysql)
$ docker cp dev/todo-db-init.sql $MYSQL_CONTAINER:/home/todo-db-init.sql
$ docker exec $MYSQL_CONTAINER ls -la /home
$ docker exec $MYSQL_CONTAINER cat /home/todo-db-init.sql | mysql -h172.17.0.2 -uroot -p
$ docker run -it --link todo-mysql:mysql --rm mysql sh -c \
  'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" \
  -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"'
```

## License

MIT License
