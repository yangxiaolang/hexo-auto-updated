const str=`
---
title: 0.0.0.0 & 127.0.0.1 & 本机IP的差别
date: 2022-03-31 14:13:38
updated: 2022-03-31 14:13:38
tags:
  - 计算机网络
  - 部署
---`
console.log(/updated: (.*)\n/g.exec(str))