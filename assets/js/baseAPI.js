// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
var baseURL = 'http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function (options) {
    // 1，在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 2  配置统一的 配置头信息 
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 3 拦截 自动输入地址进行跳转  控制访问权限
    // 不论成功还是失败，最终都会调用 complete 回调函数
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            //  清楚本地存储
            localStorage.removeItem('token')
            //  跳转页面到登录
            location.href = '/login.html'
        }
    }

})