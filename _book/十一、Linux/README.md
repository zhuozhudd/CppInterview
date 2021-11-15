## 十一、Linux

### 你用过的 Linux 常用命令有哪些？（按重要先后顺序排列）

#### Part1. 常用部分

##### 1 - chmod 权限

Linux系统中一切都是文件。Linux使用不同的字符来区分不同的文件：

| 普通文件 | 目录文件 | 链接文件 | 块设备文件 | 字符设备文件 | 管道文件 |
| :------: | :------: | :------: | :--------: | :----------: | :------: |
|    -     |    d     |    l     |     b      |      c       |    p     |

其中最常用的是普通文件和目录文件，其操作有：

![image-20210926105417660](https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210926105417660.png)

每个文件都有所属的所有者和所有组，并规定了文件的所有者、所有组以及其他人对文件的 **可读（r）、可写（w）、可执行（x）**权限。所以文件的读、写、执行权限可以简写为rwx，也可以用数字4、2、1来表示。文件所有者，所示组及其他用户权限之间无关联

![image-20210926105445692](https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210926105445692.png)

文件权限的数字表示法基于字符（rwx）的权限计算而来，其目的是简化权限的表示方式。例如，若某个文件的权限为7，则代表可读、可写、可执行（4+2+1）；若权限为6，则代表可读、可写（4+2）。

举例说明：现在有这样一个文件，其所有者拥有可读、可写、可执行的权限，其文件所属组拥有可读、可写的权限；其他人只有可读的权限。那么，这个文件的权限就是rwxrw-r--，数字法表示即为764。

![image-20210926105654176](https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210926105654176.png)



![image-20210926110048765](https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210926110048765.png)

最左边，开头d代表是目录文件，-代表是普通文件，之后是权限，例如 server文件，-rwxr-xr-x 为 普通文件（-）、所有者可读可写可执行（rwx）、所属主可读可执行、其他用户可读可执行。后面的数字是文件个数 ，第一个root是所属主，第二个root是所属组，然后是文件大小，日期

对server执行 chmod 777 后，权限变成rwxrwxrwx

![image-20210926110436330](https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210926110436330.png)

如果对一个目录赋权要加 -R，递归执行，如对 freecplus目录执行赋权，即 `chmod -R 777 freecplus`

还有采取另一种方式，格式为` chmod [ugoa…][[±=][rwxX]…] file..` ,

- u 表示该档案的拥有者，g 表示与该档案的拥有者属于同一个群体(group)者，o 表示其他以外的人，a 表示这三者皆是。
- +表示增加权限、- 表示取消权限、= 表示唯一设定权限。
- r 表示可读取，w 表示可写入，x 表示可执行，

![image-20210926111502264](https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210926111502264.png)

- 创建一个普通文件szzsleep，权限为rw-r--r--
- 用a+x，即所有者、所有组、其他人都添加 x 执行权限，变成 rwxr-xr-x
- 再用o-x，将其他用户的 x 执行权限删除

##### 2 - grep 搜索内容

grep (global search regular expression(RE) and print out the line,全面搜索正则表达式并把行打印出来)是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。

格式： **grep "内容" 文件名** 

内容和文件名均可写作正则表达式

```shell
grep 'test' d*　　# 显示所有以d开头的文件中包含 test的行

grep ‘test' aa bb cc 　　 # 显示在aa，bb，cc文件中包含test的行

grep ‘[a-z]\{5\}' aa 　　# 显示所有包含每行字符串至少有5个连续小写字符的字符串的行

grep magic /usr/src　　# 显示/usr/src目录下的文件(不含子目录)包含magic的行

grep -r magic /usr/src　　# 显示/usr/src目录下的文件(包含子目录)包含magic的行

grep -v test *test*  # 反向查找， 查找文件名中包含test 的文件中但不包含test的行
```

##### 3 - find 搜索文件

格式：**find 目录名 -name 文件名 -print**

- 目录名：待搜索的目录，搜索文件的时候，除了这个目录名，还包括它的各级子目录。
- 文件名：待搜索的文件名匹配的规则。

```shell
find /tmp -name *.c -print  # 从/tmp目录开始搜索，把全部的*.c文件显示出来

find . -name *.c -print # 从当前工作目录开始搜索，把全部的*.c文件显示出来
```



##### 4. cat、more、tail 显示文本文件内容

`cat 文件名`：cat命令一次显示整个文件的内容

`more 文件名`：more命令分页显示文件的内容，按空格键显示下一页，按b键显上一页，按q键退出。

`tail -f 文件名`：tail -f用于显示文本文件的最后几行，如果文件的内容有增加，就实时的刷新。对程序员来说，tail -f极其重要，可以动态显示后台服务程序的日志，用于调试和跟踪程序的运行。



#### Part2. 网络（按重要顺序排序）

|                     常用命令                     |           作用           |
| :----------------------------------------------: | :----------------------: |
|                   **ifconfig**                   |   **查看网络接口属性**   |
|                     ip addr                      |        查看ip地址        |
| ipconfig eh0 192.168.1.1 netmask 255.255.255.255 |        配置ip地址        |
|                   **netstat**                    | **查看各种网络相关信息** |
|                  netstat -lntp                   |     查看所有监听端口     |
|                  netstat -antp                   |  查看已经建立的TCP连接   |
|                  netstat -lutp                   |  查看TCP/UDP的状态信息   |
|                     route -n                     |        查看路由表        |

#### Part3. 进程管理与系统命令

|         常用命令         |               作用                |
| :----------------------: | :-------------------------------: |
|          ps -ef          |           查看所有进程            |
| ps -ef \|grep expression |  用正则表达式过滤出所需要的进程   |
|       kill -s name       |         kill指定名称进程          |
|       kill -s pid        |         kill指定pid的进程         |
|           top            |         实时显示进程状态          |
|         iostate          |      查看io读写/cpu使用情况       |
|       sar -u 1 10        | 查询cpu使用情况（1秒1次，共10次） |
|       sar -d 1 10        |           查询磁盘性能            |



#### Part4. 系统服务

|          常用命令           |     作用     |
| :-------------------------: | :----------: |
| systemctl  status  <服务名> | 查看某个服务 |
|  systemctl  start <服务名>  | 启动某个服务 |
|  systemctl   stop <服务名>  | 终止某个服务 |
| systemctl  restart <服务名> | 重启某个服务 |
| systemctl  enable <服务名>  |  开启自启动  |
| systemctl  disable <服务名> |  关闭自启动  |
|      chkconfig --list       | 列出系统服务 |

使用systemctl命令 配置防火墙的过程如下

**查看防火墙的命令：**

- 1）查看防火墙的版本。firewall-cmd --version
- 2）查看firewall的状态。firewall-cmd --state
- 3）查看firewall服务状态（普通用户可执行）。systemctl status firewalld
- 4）查看防火墙全部的信息。firewall-cmd --list-all
- 5）查看防火墙已开通的端口。firewall-cmd --list-port
- 6）查看防火墙已开通的服务。firewall-cmd --list-service
- 7）查看全部的服务列表（普通用户可执行）。firewall-cmd --get-services
- 8）查看防火墙服务是否开机启动。 systemctl is-enabled firewalld

**配置防火墙的命令：**

- 1）启动、重启、关闭防火墙服务。
  - systemctl start firewalld \# 启动
  - systemctl restart firewalld \# 重启
  - systemctl stop firewalld \# 关闭 

- 2）开放、移去某个端口。
  - firewall-cmd --zone=public --add-port=80/tcp --permanent \# 开放80端口
  - firewall-cmd --zone=public --remove-port=80/tcp --permanent \# 移去80端口

- 3）开放、移去范围端口。
  - firewall-cmd --zone=public --add-port=5000-5500/tcp --permanent \# 开放5000-5500之间的端口
  - firewall-cmd --zone=public --remove-port=5000-5500/tcp --permanent \# 移去5000-5500之间的端口

- 4）开放、移去服务。
  - firewall-cmd --zone=public --add-service=ftp --permanent \# 开放ftp服务
  - firewall-cmd --zone=public --remove-service=ftp --permanent \# 移去http服务

- 5）重新加载防火墙配置（修改配置后要重新加载防火墙配置或重启防火墙服务）。
  - firewall-cmd --reload

- 6）设置开机时启用、禁用防火墙服务。
  - systemctl enable firewalld \# 启用服务
  - systemctl disable firewalld \# 禁用服务



### 你用过的 Linux 常用命令有哪些？（按重要先后顺序排列）

- 首先是一些文件和目录操作的命令，比如：
  - cd 、pwd、 ls、
  - 创建 touch 、mkdir，删除 rm、移动或重命名 rm，复制cp
  - cat、more、tail 查看文件内容
  - 还有一些重要的命令，如chmod 权限管理、grep 搜索内容、find 搜索文件
- 还有一些和网络相关的命令
  - ipconfig 查看网络接口属性，配置ip地址
  - netstat 查看各种网络相关信息
  - route 查看路由
  - ping
- 进程管理的常用命令有：
  - ps -ef 查看所有进程信息
  - kill 杀死进程
- 系统方面常用的有：
  - top 可以动态显示cpu、内存、进程等情况
  - iostat 可以查看io读写/cpu使用情况
  - sar 查询cpu、磁盘使用情况
  - env 可以查看环境变量
  - date 显示日期
- 还有一些服务的常用命令
  - systemctl 管理服务
  - firewall-cmd 防火墙
  - vsftpd 文件传输
- 一些软件安装管理的
  - rpm、yum、dpkg、apt-get用于安装管理软件
  - 解压缩有：
    - tar -xvf xxx.tar 解压tar包
    - zip、unzip
    - gzip与gunzip