const getters = {
    sidebar:state=>state.app.sidebar,
    device:state=>state.app.device,

    // 以下为硬编码，添加user.js部分后需要修改
    avatar:()=>'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name:()=>'admin',
    token:()=>'admin-token'
}

export default getters