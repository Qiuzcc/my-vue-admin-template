const getters = {
    sidebar:state=>state.app.sidebar,
    device:state=>state.app.device,
    avatar:state=>state.user.avatar,
    name:state=>state.user.name,
    token:state=>state.user.token
}

export default getters