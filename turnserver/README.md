

빌드하기 위해 필요한 라이브버리 설치


```shell
cd
yum -y install openssl openssl-devel sqlite sqlite-devel libevent libevent-devel
yum -y install make gcc
```
빌드 및 설치

```shell
wget http://turnserver.open-sys.org/downloads/v4.5.0.3/turnserver-4.5.0.3.tar.gz
tar xzf turnserver-4.5.0.3.tar.gz
cd turnserver-4.5.0.3
./configure
make
make install
```

설정파일 작성

```shell
# cp /usr/local/etc/turnserver.conf.default /usr/local/etc/turnserver.conf
# vi /usr/local/etc/turnserver.conf
```

설정파일 중 변경해야 하는 부분

```shell
* listening-port=80
* tls-listening-port=443
* listening-ip=xxx.xx.x.xx … 서버IP
* relay-ip=xxx.xx.x.xx … 서버IP
* external-ip=xx.xx.xx.xx … 서버IP
* lt-cred-mech … long-term credentials mechanism
* userdb=/usr/local/var/db/turndb …  로컬 환경에 맞게 수정
* realm=example.com …
* cert=/usr/local/etc/turn_server_cert.pem …
* pkey=/usr/local/etc/turn_server_pkey.pem …
```

서버인증서는 Let's Encrypt 에서 생성한다.

```shell
# cp /etc/letsencrypt/live/turn.example.com/fullchain.pem /usr/local/etc/turn_server_cert.pem
# cp /etc/letsencrypt/live/turn.example.com/privkey.pem /usr/local/etc/turn_server_pkey.pem
```

사용자 추가 ( https://github.com/coturn/coturn/wiki/CoturnConfig 를 참조. )

```Shell
# export PATH=$PATH:/usr/local/bin
# turnadmin -a -u ninefingers -p youhavetoberealistic -r iccube.info
```

기본적으로 sqlite 에서 실행되며, 아래 명령어로 확인한다.

```Shell
# sqlite3 /usr/local/var/db/turndb "SELECT * FROM turnusers_lt"
```

서버 시작 - 수동으로 시작하는 경우

```Shell
# /usr/local/bin/turnserver -v -c /usr/local/etc/turnserver.conf
```

자동 실행되도록 설정

/etc/init.d/turnserver

```Shell
#!/bin/bash
### BEGIN INIT INFO
# Provides:          STUN/TURN
# Required-Start:    $local_fs $network $remote_fs
# Should-Start:
# Required-Stop:     $local_fs $network $remote_fs
# Should-Stop:
# Default-Start:     3 4 5
# Default-Stop:      0 1 2 6
# Short-Description: a TURN relay server
# Description:       a TURN relay server implementation.
### END INIT INFO

. /etc/init.d/functions

PID_FILE="/var/run/turnserver.pid"

case $1 in

  start)
        echo -n "Starting turnserver "

        LOCAL=$(/usr/bin/curl -s http://169.254.169.254/latest/meta-data/local-ipv4)
        EXTERNAL=$(/usr/bin/curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

        /bin/sed -i "s/^relay-ip=[0-9.]*/relay-ip=${LOCAL}/" /usr/local/etc/turnserver.conf
        /bin/sed -i "s/^listening-ip=[0-9.]*/listening-ip=${LOCAL}/" /usr/local/etc/turnserver.conf
        /bin/sed -i "s/^external-ip=[0-9.]*/external-ip=${EXTERNAL}/" /usr/local/etc/turnserver.conf

        /usr/local/bin/turnserver --daemon --pidfile "$PID_FILE" -c /usr/local/etc/turnserver.conf > /dev/null
        RETVAL=$?
        if [ $RETVAL = 0 ]; then
            echo_success
        else
            echo_failure
        fi
        echo
        ;;
  stop)
        echo -n "Shutting down turnserver "
        killproc -p "$PID_FILE" turnserver
        RETVAL=$?
        echo
        ;;
  status)
        status -p "$PID_FILE" turnserver
        RETVAL=$?
        ;;
  *)
        echo "Usage: $(basename "$0") { start | stop | status }"
        ;;
esac

exit $RETVAL
```

아래와 같이 실행 가능함.

```Shell
# chmod +x /etc/init.d/turnserver
# chkconfig --add turnserver
```
