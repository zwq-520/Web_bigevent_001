// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 上传文件
$('#btnChooseImage').on('click', function () {
    $('#file').click()
})

// 上传文件筐绑定 change 事件
$('#file').on('change', function (e) {
    // 获取到 上传的文件信息
    var filelist = e.target.files
    // 判断文件是否为空
    if (filelist.length === 0) {
        return layui.layer.msg('文件为空')
    }
    // 根据选择的文件创建一个 新的 url地址  然后把它赋值给裁剪区域的路径
    // 拿到文件
    var file = e.target.files[0]
    //  利用 URL.createObjectURL  转为为路径
    var newImgURL = URL.createObjectURL(file)
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
})

// 点击确定 上传文件
$('#btnUpload').on('click', function () {
    //  拿到裁剪区域的图片 转化为base64的 图片（它是一个字符串）
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 发送后台 进行页面渲染
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('上传失败')
            }
            layui.layer.msg('上传成功')
            // 调用全局函数 重新获取数据渲染界面
            window.parent.getUserInfo()
        }

    })
})