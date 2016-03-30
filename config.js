/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 全站统一配置
 */
var dataOverview = require("./controllers/dataOverview");

module.exports = {
    siteName: '美信数据平台',
    pageTitle:'',
    js: [],
    limit: [{
        "dataOverview": {
            name: "数据概览",
            id: 2,
            display: true,
            className: "fa fa-dashboard fa-fw",
            href: "#",
            path: [dataOverview()]
        }
    }, {
        "userManagement": {
            name: "用户管理",
            id: 0,
            display: false,
            className: "fa fa-user fa-fw",
            href: "#",
            path: []
        }
    }, {
        "userAnalysis": {
            name: "用户分析",
            id: 3,
            display: false,
            className: "fa fa-bar-chart-o fa-fw",
            href: "#",
            path: []
        }
    }, {
        "retainedAnalysis": {
            name: "留存分析",
            id: 4,
            display: false,
            className: "fa fa-th-list fa-fw",
            href: "/retainedAnalysis",
            path: []
        }
    }, {
        "channelAnalysis": {
            name: "渠道分析",
            id: 5,
            display: false,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: []
        }
    },{
        "useAnalysis": {
            name: "使用分析",
            id: 6,
            display: false,
            className: "fa fa-th fa-fw",
            href: "#",
            path: []
        }
    }, {
        "terminal": {
            name: "终端属性",
            id: 8,
            display: false,
            className: "fa fa-tablet fa-fw",
            href: "#",
            path: []
        }
    }, {
        "share": {
            name: "分享数据",
            id: 9,
            display: false,
            className: "fa fa-external-link fa-fw",
            href: "#",
            path: []
        }
    }, {
        "information": {
            name: "消息推送",
            id: 10,
            display: false,
            className: "fa fa-sign-in fa-fw",
            href: "/",
            path: []
        }
    }, {
        "search": {
            name: "搜索转化",
            id: 11,
            display: false,
            className: "fa fa-gear",
            href: "/",
            path: []
        }
    }, {
        "topic": {
            name: "群组话题",
            id: 12,
            display: false,
            className: "fa fa-github-square fa-fw",
            href: "/",
            path: []
        }
    }, {
        "achievements": {
            name: "销售业绩",
            id: 13,
            display: false,
            className: "fa fa-flag-checkered fa-fw",
            href: "#",
            path: []
        }
    }, {
        "marketingAnalysis": {
            name: "营销分析",
            id: 14,
            display: false,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: []
        }
    }, {
        "platformRebate": {
            name: "平台返利汇总",
            id: 15,
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: []
        }
    }]
};