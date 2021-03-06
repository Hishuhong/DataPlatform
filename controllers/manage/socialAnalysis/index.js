/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 圈子数据
 */

var api = require("../../../base/api"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/socialAnalysis/groupOne",
        modelName : ["Group"],
        platform : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupOne(data);
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        rows: [
            ["new_group_count", "new_group_user_count", "new_group_user_rate",
            "accumulated_group_all_count", "accumulated_group_user_all_count",
            "user_join_group_rate"]
        ],
        cols: [
            [{
                caption: "新增圈子数",
                type: "number"
            }, {
                caption: "新增入圈用户数",
                type: "number"
            }, {
                caption: "新增入圈用户率", // = 新增入圈用户数 / 注册用户数
                type: "string"
            }, {
                caption: "累计圈子数",
                type: "number"
            }, {
                caption: "累计入圈用户数",
                type: "number"
            }, {
                caption: "用户入圈率", // = 累计入圈用户数 / 注册用户数
                type: "string"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupTwo",
        modelName : [ "GroupDataTendency" ],
        platform : false,
        level_select : true,
        level_select_name : "group_type",
        level_select_url : "/api/socialAnalysisCategories",
        fixedParams(query, filter_key, req, cb) {
            if(query.group_type === undefined) {
                query.group_type = "all";
            }
            cb(null, query);
        },
        filter(data, filter_key, dates) {
            return filter.groupTwo(data, dates);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupThree",
        modelName : [ "GroupDataDistribution", "SocialCategory" ],
        platform : false,
        orderParams : {
            pid : ""
        },
        fixedParams(query, filter_key, req, cb) {
            var group_type = [];
            req.models.SocialCategory.find({
                pid : ""
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.group_type = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'group_count',
                    value: '圈子数'
                }, {
                    key: 'DAU',
                    value: 'DAU'
                }]
            }
        ],
        filter(data, filter_key, dates) {
            return filter.groupThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupFour",
        modelName : [ "GroupDataDistribution", "SocialCategory" ],
        platform : false,
        orderParams : {},
        fixedParams(query, filter_key, req, cb) {
            var filter_key = filter_key || "-1",
                group_type = [];
            req.models.SocialCategory.find({
                pid : filter_key
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.group_type = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        selectFilter(req, cb) {
            var filter_select = {
                title: '一级分类',
                filter_key: 'filter_key',
                groups: []
            };
            req.models.SocialCategory.find({
                pid : ""
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        var obj = {
                            key : key.id,
                            value : key.name,
                            cell : {
                                title: '圈子类型',
                                filter_key: 'filter_key2',
                                groups: [{
                                    key: 'group_count',
                                    value: '圈子数'
                                }, {
                                    key: 'DAU',
                                    value: 'DAU'
                                }]
                            }
                        };
                        filter_select.groups.push(obj);
                    }
                    cb(null,[filter_select]);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [],
        filter(data, filter_key, dates, filter_key2) {
            return filter.groupFour(data, filter_key, filter_key2);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/groupFive",
        modelName : [ "GroupDataTop", "SocialCategory" ],
        platform : false,
        showDayUnit : true,
        paging : true,
        order : ["-DAU", "accumulated_group_user_all_count"],
        orderParams : {},
        date_picker_data: 1,
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.groupFive(data, page);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "id", "group_name", "group_type", "new_group_user_count",
            "new_group_topic_count", "DAU", "accumulated_group_user_all_count",
            "rate" ]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "圈子名称",
                type: "string"
            }, {
                caption: "圈子归属分类",
                type: "string"
            }, {
                caption: "圈子新增成员数",
                type: "number"
            }, {
                caption: "圈子新增话题数",
                type: "number"
            }, {
                caption: "圈子参与用户数",
                type: "number"
            }, {
                caption: "圈子成员数", // （发布/回复）任意行为用户去重后数量 / 圈子成员数
                type: "number"
            },{
                caption: "圈子参与度", // （发布/回复）任意行为用户去重后数量 / 圈子成员数
                type: "string"
            }]
        ]
    });

    Router = new help(Router, {
        router : "/socialAnalysis/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "新增圈子数",
                help : "新增圈子的数量"
            },{
                name : "新增入圈用户数",
                help : "首次加入圈子的用户去重"
            },{
                name : "新增用户入圈率",
                help : "新增入圈用户数/当天新增注册用户数"
            },{
                name : "累计圈子数",
                help : "圈子总数"
            },{
                name : "累计入圈用户数",
                help : "入圈用户数去重"
            },{
                name : "用户入圈率",
                help : "累计入圈用户数/注册用户数"
            },{
                name : "新增话题数",
                help : "圈子新增的话题数"
            },{
                name : "DAU",
                help : "（发布话题/回复）任一一个行为的用户去重"
            },{
                name : "被分享圈子数",
                help : "被分享的圈子数去重"
            },{
                name : "圈子名称",
                help : "圈子的名称"
            },{
                name : "圈子归属分类",
                help : "圈子归属的二级分类"
            },{
                name : "圈子新增成员数",
                help : "圈子新增成员数"
            },{
                name : "圈子新增话题数",
                help : "本期圈子的新增话题数"
            },{
                name : "圈子参与度【%】（排名字段）",
                help : "（发布话题/回复）任一一个行为的用户去重/圈子成员数"
            },
        ]
    });

    return Router;
};