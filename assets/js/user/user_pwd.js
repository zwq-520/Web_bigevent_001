$(function () {
    // 定义密码校验规则
    var form = layui.form
    form.verify({
        // 所有密码遵循的
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        //  新旧密码不能相同的验证
        samepwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },

        // 确认密码 验证
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "新密码两次输入不一样"
            }
        }
    })

    // 表单修改密码提交
    $('.layui-form').on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('更改密码成功')
                $('.layui-form')[0].reset()
            }
        })
    })
})