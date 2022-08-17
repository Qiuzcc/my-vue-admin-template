const Mock = require('mockjs')

//生成30份随机数据
const data = Mock.mock({
    'items|30': [{
        id: '@id',
        title: '@sentence(10, 20)',
        'status|1': ['published', 'draft', 'deleted'],
        author: '@cname',
        display_time: '@datetime',
        pageviews: '@integer(300, 5000)'
    }]
})

// baseURL在继承之后加
module.exports = [{
    url: '/table/list',
    type: 'get',
    response: () => {
        const items = data.items
        return {
            code: 200,
            data: {
                total: items.length,
                items: items
            }
        }
    }
}]