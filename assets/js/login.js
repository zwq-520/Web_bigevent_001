// 入口函数 
$(function () {
    // 点击注册  登录界面隐藏 注册界面显示
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击注册  注册界面隐藏 登录界面显示
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
})