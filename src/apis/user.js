import request from "@/utils/request";

// 对登录api进行编写
export const doLogin = (user) => {
    return request.post("/user/login", {
        //这里是后端需要account字符，也就是用户名
        account: user.username,
        password: user.pass
    })
}
// 退出登录请求方法
export const logout = () => {
    return request.post('/user/logout');
}

//创建用户接口
export const createUser = ({ username, password, permission }) => {
    return request.post('/permission/createUser', {
        account: username,
        password,
        role_id: permission
    })
}
//获取用户接口
export const userList = () => {
    return request({
        url: '/user/list?type=new',
        method: 'get'
    })
}

// 获取用户详情接口
// 通过token来判断用户角色，所以必须要在登录之后调用
export const userInfo = () => {
    return request({
        url: '/user/info',
        method: 'get'
    })
}
