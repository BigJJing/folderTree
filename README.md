# FolderTree
#####  快速使用
- 创建一个 简单的FolderTree 实例

```
<html>
    <head>
        <meta charset="utf-8">
        <title>folder tree</title>
        <link rel="stylesheet" href="src/folderTree.css">
        <style>
            #el {
              width: 400px;
              margin: 30px auto;
            }
        </style>
    </head>
    <body>
        <div id="el"></div>
    </body>
    
    <script src="src/folderTree.js"></script>
    <script>
        var data = [{
            title: '一级菜单 1'
            ,id: 1
            ,children:[{
                title: '二级菜单 1-1'
                ,id: 2
            }
            ,{
                title: '二级菜单 1-2'
                ,id: 3
            }]
        }]
        
        var folderTree = new FolderTree({
            el:"#el",       //绑定元素
            data: data,     //数据
            /*
            ** 回调函数
            */
           //点击title
            click: function(obj){
                console.log(obj.data)
            },
            //删除、编辑等操作
            operate: function(obj){
                console.log(obj)
            },
            //选中/取消选中
            oncheck: function(obj){
                console.log(obj)
            }
        }); 

        var getChecked = function(){
            var checked = folderTree.getChecked()
            console.log(checked)
        }
        
    </script>
</html>
```
- 效果实例
![folderTree_1.1.gif](https://github.com/BigJJing/folderTree/blob/master/doc/example.gif)
<br>

***

##### 基础参数

参数选项|说明|类型|示例值
----|----|----|---
elem | 指向容器选择器 | String| "#el"
data | 数据源 | Array | [详见数据项](/jump/)
showCheckbox | 是否显示复选框 | Boolean |  false
.. | .. | .. | ..

<br>

***

[jump]:jump

##### 数据源属性选项
我们将 data 参数称之为数据源，其内部支持设定以下选项

属性选项|说明|类型|示例值
----|----|----|---
title | 节点标题 | String | "folderName"
id | 节点唯一索引值，用于对指定节点进行各类操作 | String/Number | 10010
children | 子节点 | Array | 与data相同
.. |.. | .. | ..

<br>

***
##### 节点被点击之后的回调
在节点被点击后触发，返回的参数如下：
```
      var folderTree = new FolderTree({
            el:"#el",       //绑定元素
            data: data,     //数据
           //点击title
            click: function(obj){
                console.log(obj.data);  //点击的节点数据
                console.log(obj.elem);  //点击的节点容器
            }
        }); 
```

<br>

***
##### 复选框被点击的回调
点击复选框时触发，返回的参数如下：
```
      var folderTree = new FolderTree({
            el:"#el",              //绑定元素
            data: data,            //数据
            showCheckbox: true,    //显示复选框
            //选中/取消选中
            oncheck: function(obj){
                console.log(obj.isChecked);  //该节点是否被选中
                console.log(obj.data);       //点击的节点数据
                console.log(obj.elem);       //点击的节点容器
            }
       }); 
```

<br>

***
##### 操作节点时的回调
通过 operate 实现函数，对节点进行删改等操作时，返回操作类型及操作节点
```
      var folderTree = new FolderTree({
            el:"#el",              //绑定元素
            data: data,            //数据
            //删除、编辑等操作
            operate: function(obj){
                console.log(obj.type);     //操作类型: edit、del
                console.log(obj.data);     //点击的节点数据
                console.log(obj.elem);     //点击的节点容器
            }
       }); 
```

<br>

***
##### 返回选中的数据
获取通过复选框选中的节点
```
 var folderTree = new FolderTree({
            el:"#el",       //绑定元素
            data: data,     //数据
            showCheckbox: true,  //显示复选框
       }); 
 var checked = folderTree.getChecked()
```
