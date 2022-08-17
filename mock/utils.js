/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url){
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
    if (!search) {
        return {}
    }
    const obj = {}
    const searchArr = search.split('&')
    searchArr.forEach(item=>{
        var index = item.indexOf('=')
        if(index!==-1){
            var key = item.slice(0,index)
            var value = item.slice(index+1)
            obj[key] = value
        }
    })
    return obj
}

module.exports =  {
    param2Obj
}