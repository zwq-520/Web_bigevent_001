$(function () {
    var layer = layui.layer
    // 1 定义提交参数
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,// 默认为1 页码值
        pagesize: 10, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
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
                layer.msg('获取文章列表成功')
                // 根据模板引擎添加渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
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


})