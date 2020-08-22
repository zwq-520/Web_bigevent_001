$(function () {
    var layer = layui.layer
    var form = layui.form
    //  1，发表文章的 类别选择功能
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 利用模板字符创进行添加
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要发起 form.render 进行渲染
                form.render()
            }
        })
    }

    // 2，初始化富文本编辑器
    initEditor()

    // 3. 初始化图片裁剪器
    var $image = $('#image')

    // 3.1. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.2. 初始化裁剪区域
    $image.cropper(options)

    // 4 为选择封面按钮 触发上传文件行为
    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click()
    })

    // 5 为文件上传框 绑定change事件 把选择的文件上传到界面
    $('#coverfile').on('change', function (e) {
        // 拿到用户上传的文件
        var file = e.target.files[0]
        if (file.length === 0) {
            return
        }
        //根据用户上传图片 转换为 url地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6 确认 发布文章的状态
    // 定义一个变量 
    var state;
    $('#btnSave1').on('click', function () {
        state = '已发布'
    })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7 表单提交 
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 用 formDate  收集数据  把当前的表单传进去
        var fd = new FormData(this)
        // 把状态信息  添加进去 键值对 的形式
        fd.append('state', state)
        // 把照片信息添加进去    利用插件得语法
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                // 上面的方法就是把图片信息转换为  一个变量 
                // 这个参数就是 照片信息 传进去
                fd.append('cover_img', blob)
                // console.log(...fd);
                //  发送ajax 请求
                pubListArtcile(fd)
            })
    })
    // 8 发送ajax 的函数
    function pubListArtcile(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // jq 发起上传文件 必须增加两个属性 
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 发布成功后跳转到 文章列表界面
                location.href = '/article/art_list.html'
            }
        })
    }
})