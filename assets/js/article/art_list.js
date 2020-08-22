$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 1 定义提交参数
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,// 默认为1 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义时间格式过滤器
    template.defaults.imports.dataFormat = function (time) {
        var date = new Date(time)
        var y = date.getFullYear()
        var m = padZero(date.getMonth() + 1)
        var d = padZero(date.getDate())

        var hh = padZero(date.getHours())
        var mm = padZero(date.getMinutes())
        var ss = padZero(date.getSeconds())

        return y + "-" + m + '-' + d + '   ' + hh + ':' + mm + ':' + ss

    }

    // 补零函数
    function padZero(n) {
        return n > 10 ? n : '0' + n
    }

    //  获取数据 然后在渲染
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                // 根据模板引擎添加渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })

    }

    // 筛选去分类功能渲染操作
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用layui里面 的 form.ender 方法 通知layui渲染
                form.render()
            }
        })
    }


    // 筛选绑定提交 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数 q中 对象赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新筛选条件 渲染表格
        initTable()
    })

    //  定义一个分页区域

    function renderPage(num) {
        // console.log(num);
        laypage.render({
            elem: 'test1',
            count: num,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 拿到当前点击的页数 赋值给q里面  然后调用渲染页面  重新渲染
                q.pagenum = obj.curr
                // 给q.pagesize 赋值 obj.limit
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章的功能 
    $('body').on('click', '.btn-delete', function () {
        // 根据id进行删除
        var id = $(this).attr('data-id')
        // 提示信息 
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //发送 后台请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    // 再次删除后渲染界面的时候 要判断一下 界面还有内容吗 都删除之后 要
                    // 页数 要进行减一  但是当页数 为1 的时候 就不在减了
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    initTable()
                }
            })

            layer.close(index);
        });
    })

})