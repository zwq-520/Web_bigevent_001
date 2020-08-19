$(function () {
    // 1 自定义表单验证
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间"
            }
        }
    })

    // 2 进行用户渲染 
    var layer = layui.layer
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: "/my/userinfo",
            success: function (res) {
                // console.log(res);
                // 进行校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后 进行渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3 表单重置功能
    $('#btnReset').on('click', function (e) {
        // 阻止重置按钮的 默认行为
        e.preventDefault()
        // 重新渲染获取表单内容
        initUserInfo()
    })

    // 4 提交修改功能  整个表单提交 事件
    $(".layui-form").on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('提交修改成功')
                // 调用父框架的全局方法 进行重新渲染头像信息
                window.parent.getUserInfo()
            }
        })
    })





})