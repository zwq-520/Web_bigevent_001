$(function () {

    // 1 获取数据 并且渲染表格
    initArtCileList()
    function initArtCileList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // 模板引擎 是 调用的是对象 使用的是 属性
                var htmlStr = template('tpl-table', res)
                //   添加到 对应结构位置
                $('#tbody').html(htmlStr)
            }
        })
    }

    var layer = layui.layer
    var form = layui.form
    // 2 点击添加按钮 弹出弹出层 并且渲染到弹出层
    var indexadd = null
    $('#btnAddCate').on('click', function () {
        //  layui 中的 弹出层框架
        // layer.open 的返回值 是一个索引 用于下面关闭弹出层
        indexadd = layer.open({
            // 根据type 属性做 改变
            type: 1,
            // 根据area: ['500px', '300px']
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        })
    })

    //  3,通过 事件委托 给动态生成的 form表单进行绑定提交表单事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("添加分类失败")
                }
                //  再次渲染表单页面
                initArtCileList()
                layer.msg('添加分类成功')
                //  关闭 提示框 根据layer.open  返回的索引   框架的方法
                layer.close(indexadd)
            }
        })
    })

    // 4,通过事件委托 给编辑功能绑定点击事件
    var indexEdit = null
    $('#tbody').on('click', '#btn_edit', function () {
        // layer.open 的返回值 是一个索引 用于下面关闭弹出层
        indexEdit = layer.open({
            // 根据type 属性做 改变
            type: 1,
            // 根据area: ['500px', '300px']
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        })

        // 4.1,为编辑按钮绑定 `data-id` 自定义属性 
        // 根据对应id获取数据 然后填充到表单
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                //  把数据填充到表单中 表单加  form.val() 
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过事件委托 修改提交功能 表单提交
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败！')
                }
                layer.msg('修改文章分类成功！')
                // 关闭弹出框
                layer.close(indexEdit)
                // 重新渲染页面
                initArtCileList()
            }
        })
    })

    // 通过事件委托 删除提交功能    根据id进行删除  
    $('body').on('click', '#btn_delete', function () {
        // 拿到点击的 id
        var id = $(this).attr('data-id')
        // 弹出提示框  
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求 进行删除操作
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除不成功")
                    }
                    layer.msg("删除成功")
                    initArtCileList()
                }
            })
            // 关闭弹出框的
            layer.close(index);
        });
    })

})