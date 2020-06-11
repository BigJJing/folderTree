(function(window){

    function FolderTree(options){
        this.config = this.extend(this.config,options);
        this.render();
    }

    //字符常量
    var ICON_SPREAD = 'folder-tree-stretch-btn',
        ICON_CHECK = "icon-zhengque",
        OPERATE_OPTIONS = 'folder-tree-btn-group',
        FOLDER_VIEW = 'folder-tree',
        ENTRY_VIEW = 'folder-tree-entry',
        PACK_VIEW = 'folder-tree-pack',
        EDIT_INPUT = 'folder-tree-edit-input',
        EDIT_CHECKBOX = 'tree-form-checkbox',
        EDIT_CHECKBOX_CHECKED = 'tree-form-checkbox-checked',
        ITEM_TITLE = 'tree-title';
        

    
    FolderTree.prototype = {
        //默认配置
        config: {
            data: [],   //数据
            selected:[],
            showCheckbox: false
        },
        //主体渲染
        render: function(){ 
            var config = this.config;
            var el = document.querySelector(config.el);
            var temp = document.createElement('div');
            temp.className = "folder-tree";
            this.tree(temp,config.data);

            el.appendChild(temp);
        },
        //渲染文件树
        tree: function(parent,data){
            var that = this;
            for(let i = 0; i < data.length; i++){
                let node = that.folder(data[i]);   
                
                //递归添加子文件树
                if(data[i].children && data[i].children.length > 0){
                    let set = document.createElement('div');
                    set.className = "folder-tree-pack";
                    node.appendChild(set);
                    that.tree(set,data[i].children)
                } 
                parent.appendChild(node);
                //添加title点击事件
                that.open(data[i], node);
                //添加复选框监听
                that.check(data[i], node);
                //添加节点展开监听
                if(data[i].children && data[i].children.length > 0){
                    that.spread(data[i], node); 
                }
                //添加操作展开监听
                that.operate(data[i], node);
            }
        },
        //渲染文件夹
        folder: function(data){
            let node = document.createElement("div");
            let html = '';
            node.className = "folder-tree-set";
            html += '<div class="folder-tree-entry">';
            html += '<div class="folder-tree-main" data-id="'+ data.id +'">';
            /*伸缩按钮 */

            if(data.children && data.children.length > 0){
                html += '<span class="folder-tree-stretch-btn tree-icon-click">';
                html += '<i class="iconfont icon-tianjia"></i>';
                html += '</span>';
            }
            else{
                html += '<span class="folder-tree-stretch-btn folder-tree-stretch-not">';
                html += '</span>';
            }
            /*复选框 */
            if(this.config.showCheckbox){
                html += '<div class="tree-form-checkbox">';
                html += '<i class="iconfont"></i>';
                html += '</div>';
            }
            else{
                html += '<div class="tree-form-checkbox tree-form-checkbox-none">';
                html += '<i class="iconfont"></i>';
                html += '</div>';
            }
            /*文件夹名 */
            html += '<span class="tree-title">' + data.title + '</span>';
            html += '<input type="text" value="'+ data.title +'" class="folder-tree-edit-input folder-tree-none">'
            /*隐藏的功能 */
            html += '<div class="folder-tree-btn-group">';
            html += '<i data-type="edit" class="folder-tree-edit-btn iconfont icon-bianji"></i>';
            html += '<i data-type="del" class="folder-tree-delete-btn iconfont icon-shanchu"></i>';
            html += '</div></div></div>';
            node.innerHTML = html;
            return node;
        },
        open: function(data, setNode){
            let options = this.config,
                title = setNode.querySelector('.' + ITEM_TITLE);
            title.addEventListener('click',function(e){
                options.click({
                    elem: setNode,
                    data: data
                })
            })
        },
        check: function(data, setNode){
            let that = this,
                options = that.config,
                checkbox = setNode.querySelector('.' + EDIT_CHECKBOX);
            checkbox.addEventListener('click',function(e){
                let isChecked = false;   //该节点是否被选中
                let target = e.target.nodeName === "I" ? e.target.parentNode : e.target;
                if(target.className.indexOf(EDIT_CHECKBOX_CHECKED) !== -1){
                    isChecked = true;
                }   
                //选中或取消选中所有的子节点
                
                var updateCheckStatus = function(setElem,data){
                    let checkElem = setElem.querySelector("." + EDIT_CHECKBOX);
                    let icon = checkElem.querySelector('i');
                    //修改状态为checked
                    if(!isChecked && checkElem.className.indexOf(EDIT_CHECKBOX_CHECKED) === -1){                    
                        checkElem.className += " " + EDIT_CHECKBOX_CHECKED;
                        icon.className += " " + ICON_CHECK;
                        //保存已选的数据
                        options.selected.push(data);
                    }
                    //修改状态为unchecked
                    if(isChecked && checkElem.className.indexOf(EDIT_CHECKBOX_CHECKED) !== -1){
                        checkElem.className = checkElem.className.replace(" "+ EDIT_CHECKBOX_CHECKED,"");
                        icon.className = icon.className.replace(" " + ICON_CHECK,"");
                        //取消已选的数据
                        for(let i = 0; i < options.selected.length;i++){
                            if(options.selected[i].id === data.id){
                                options.selected.splice(i,1);
                            }
                        }
                    }
                    let packNode = setElem.querySelector('.folder-tree-pack');
                    if(data.children && data.children.length > 0){
                        for(let i = 0; i < data.children.length; i++){
                            updateCheckStatus(packNode.children[i],data.children[i])
                        }
                    }
                }
                updateCheckStatus(setNode,data);
                options.oncheck({
                    isChecked: !isChecked,
                    data: data,
                    elem: setNode
                })
            })
        },
        //展开节点
        spread: function(data, setNode){
            let options = this.config,
                spreadIcon = setNode.querySelector('.' + ICON_SPREAD),
                packNode = setNode.querySelector('.' + PACK_VIEW);
            spreadIcon.addEventListener('click',function(e){
                let iconNode = null;
                if(e.target.nodeName === "I"){
                    iconNode = e.target;
                }
                else if(e.target.nodeName === "SPAN"){
                    iconNode = e.target.children[0];
                }
                //只对有子树的元素进行监听
                if(packNode){
                    //子菜单未打开
                    if(packNode.className.indexOf("folder-tree-pack-open") === -1){
                        packNode.className += " folder-tree-pack-open";
                        //packNode.style.height = packNode.offsetHeight;
                        iconNode.className = iconNode.className.replace(/icon-tianjia/g, "icon-jian");
                    }
                    else{
                        packNode.className = packNode.className.replace(/folder-tree-pack-open/g,"");
                        iconNode.className = iconNode.className.replace(/icon-jian/g, "icon-tianjia");
                        
                    }
                }
            })
        },
        //附加功能
        operate: function(data, setNode){
            let options = this.config,
                operates = setNode.querySelector('.' + OPERATE_OPTIONS).children;

            let returnObj = {
                data: data,
                type: '',
                elem: setNode
            };
            for(let i = 0; i < operates.length; i++){
                operates[i].addEventListener('click',function(e){
                    //删除事件
                    let target = e.target,
                        type = target.dataset.type;
                    if(type == 'del'){
                        returnObj.type = 'del';
                        setNode.parentNode.removeChild(setNode);
                        //触发回调
                        options.operate && options.operate(returnObj)
                    }
                    else if(type == 'edit'){
                        let editInput = setNode.querySelector('.'+EDIT_INPUT);
                        let editTitle = setNode.querySelector('.' + ITEM_TITLE);
                        returnObj.type = 'edit';
                        editTitle.innerHTML = "";
                        //创建edit input
                        editInput.className = editInput.className.replace(/ folder-tree-none/g, '');
                        editInput.select();
                        let removeInput = function(e){
                            if(e.type === "blur" || (e.keyCode && e.keyCode === 13)){
                                editInput.className += " folder-tree-none";
                                data.title = editInput.value;
                                editTitle.innerHTML = editInput.value;
                                editInput.removeEventListener('blur', removeInput);
                                //触发回调
                                returnObj.data = data;
                                options.operate && options.operate(returnObj)
                            }
                        }
                        //添加失去焦点时的监听
                        editInput.addEventListener('blur', removeInput);
                        editInput.addEventListener('keyup', removeInput)
                    }
                })
            }
        },
        //获取选中的节点
        getChecked: function(){
            return this.config.selected;
        },
        //开启复选框
        showCheck: function(){
            if(this.config.showCheckbox){
                return false;
            }
            let checks = document.querySelectorAll('.tree-form-checkbox');
            for(let i = 0; i < checks.length; i++){
                checks[i].className = checks[i].className.replace(' tree-form-checkbox-none','')
            }
            this.config.showCheckbox = true;
            
        },
        //关闭复选框
        hideCheck: function(){
            if(!this.config.showCheckbox){
                return false;
            }
            let checks = document.querySelectorAll('.tree-form-checkbox');
            for(let i = 0; i < checks.length; i++){
                checks[i].className += ' tree-form-checkbox-none';
            }
            this.config.showCheckbox = false;
            this.clearSelected();
        },
        //取消选中所有复选框
        clearSelected: function(){
            let config = this.config;
            let container = document.querySelector(config.el).children[0];
            let setNodes = container.children;
            var updateCheckStatus = function(setNode){
                let checkElem = setNode.querySelector("." + EDIT_CHECKBOX);
                let icon = checkElem.querySelector('i');
                //修改状态为unchecked
                if(checkElem.className.indexOf(EDIT_CHECKBOX_CHECKED) !== -1){
                    checkElem.className = checkElem.className.replace(" "+ EDIT_CHECKBOX_CHECKED,"");
                    icon.className = icon.className.replace(" " + ICON_CHECK,"");
                }
                //判断是否有子元素
                if(setNode && setNode.children.length > 1 && setNode.children[1].className.indexOf(PACK_VIEW) > -1){
                    let nodes = setNode.children[1].children;
                    for(let i = 0; i < nodes.length; i++){
                        updateCheckStatus(nodes[i]);
                    }
                }
            }
            for(let i = 0; i < setNodes.length; i++){
                updateCheckStatus(setNodes[i]);
            }
            config.selected = [];
        },
        /*
        ** 操作节点
        */
        //找到对应的id数据
        getDataById: function(id){
            var that = this;
            var value;
            //遍历节点
            let eachNodes = function(data){
                for(let i = 0; i < data.length; i++){
                    if(data[i].id === id){
                        value = data[i];
                    }
                    if(data[i].children && data[i].children.length > 0 && !value){
                        eachNodes(data[i].children)
                    }
                }
            }   
           eachNodes(that.config.data);
           return value;     
        },
        /*
        **附加工具
        */
        //合并对象
        extend: function(...obj){
            let object = {};
            for(let i = 0; i < obj.length; i++){
               if(Object.prototype.toString.call(obj[i]) == "[object Object]"){
                   for(let k in obj[i]){
                       object[k] = obj[i][k]
                   }
               }
            }
            return object
        }
    }
    window.FolderTree = FolderTree
}(window))