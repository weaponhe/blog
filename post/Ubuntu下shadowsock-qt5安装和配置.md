## 安装
根据[wiki](https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation)上的说明，安装的方法比较简单
```
sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5
```

## 全局代理

#### 节点配置
一般情况下使用全局代理就行了，所以只记录配置全局代理的方法。
首先启动shadowsock-qt5客户端，输入提供商的节点信息，完成配置。

![](https://ws1.sinaimg.cn/large/67aa4ed6jw1famz9itkdoj20950eeab6.jpg)

连接服务器：

![](https://ws3.sinaimg.cn/large/67aa4ed6gw1famz5cuf82j20q00e4wg0.jpg)

#### 网络代理
在系统设置中选择网络，选择手动代理，输入上一步节点配置时设置的本地地址何本地端口：

![](https://ws3.sinaimg.cn/large/67aa4ed6jw1famzao0ggrj20o00e0dhk.jpg)