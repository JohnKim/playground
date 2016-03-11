

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
