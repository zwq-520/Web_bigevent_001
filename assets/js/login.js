// 入口函数 
$(function () {
    // 1. 点击注册  登录界面隐藏 注册界面显示
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 2. 点击注册  注册界面隐藏 登录界面显示
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 3. 自定义校验密码规则
    // 获取 layui.form 中的 form对象
    var form = layui.form
    var layer = layui.layer
    // 定义 登录密码规则
    form.verify({
        pwd: [
            /^[\S]{6,16}$/, "密码必须6到16位，且不能出现空格"
        ],
        // 自定义一个 确认密码验证的判断
        // 通过形参拿到确认密码框的内容 然后和密码框进行对比
        repwd: function (value) {
            // 拿到 密码框的内容  通过属性选择器
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次输入密码不一致"
            }
        }
    })

    // 4. 发起注册页面的  表单提交submit事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 调到登录 手动调用点击事件
                $('#link_login').click()
                // 清除表单内容
                $('#form_reg')[0].reset()
            }
        })
    })

    // 5. 登录界面请求  
    $('#form_login').submit(function (e) {
        e.preventDefault()
        // 发起ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                // 存储 res.token 用于后面的权限接口使用
                localStorage.setItem('token', res.token)
                // 界面提交后进行跳转
                location.href = "/index.html"
            }
        })
    })




})