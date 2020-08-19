$(function () {
    // 1 获取用户信息
    getUserInfo()

    // 2 退出关闭功能
    var layer = layui.layer
    $('#btnLogout').on("click", function () {
        // 增加退出信息提示框
        layer.confirm('是否确定退出？', { icon: 3, title: '提示' }, function (index) {
            // 2.1 清楚本地存储
            localStorage.removeItem('token')
            // 2.2 跳转页面到登录
            location.href = '/login.html'
            // 关闭弹出的警示框
            layer.close(index);
        });
    })
})

// 获取用户信息 （定义为全局函数 后面还要使用）
function getUserInfo() {
    // 发送ajax
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 设置头信息  用于验证
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 渲染用户信息到页面 定义一个函数 
            renderAvatar(res.data)
        },
        // 拦截客户自己输入地址进行跳转主页
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         //  清楚本地存储
        //         localStorage.removeItem('token')
        //         //  跳转页面到登录
        //         location.href = '/login.html'
        //     }
        // }

    })

}


//  渲染用户信息函数
function renderAvatar(user) {
    //  欢迎 渲染 
    // 获取一下用户 输入内容  昵称有限 用户名其次
    var name = user.nickname || user.username
    // 更改欢迎的 内容
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需求设置头像
    if (user.user_pic !== null) {
        // 有图片上传 渲染图片
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有图片 渲染文字
        $('.layui-nav-img').hide()
        // 拿到同户名或者头像的第一个字符 并且改为大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}   