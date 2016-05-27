/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    config = require("../../utils/config.json"),
    util = require("../../utils");

module.exports = {
    platformOrderOne(data) {
        var source = data.data,
            orderSource = data.orderData,
            oneOne = 0,
            oneTwo = 0,
            oneThree = 0,
            oneFour = 0,
            oneFive = 0,
            one = [],
            two = [],
            three = [],
            objOne = {
                name: "返利订单",
                order_count: 0,
                rebate_order_amount_count: 0,
                participate_seller_count: 0,
                participate_user_count: 0,
                productSku_num: 0
            },
            objTwo = {
                rebate_order_count: 0,
                rebate_order_amount_count: 0,
                rebate_order_amount_actual_count: 0,
                rebate_amount_count: 0
            },
            objThree = {
                name: "返利订单",
                spu_count: 0,
                total_spu_num: 0,
                sku_count: 0,
                total_sku_num: 0,
                refund_user_count: 0,
                total_user_num: 0,
                refund_goods_amount_count: 0,
                total_amount: 0,
                refund_goods_amount_actual_count: 0,
                total_amount_actual: 0
            };
        for (var key of source) {
            oneOne += key.total_order_num;
            oneTwo += key.total_order_amount;
            oneThree += key.total_shop_num;
            oneFour += key.participate_user_count;
            oneFive += key.total_product_sku_num;
            objOne.order_count += key.order_count;
            objOne.rebate_order_amount_count += key.rebate_order_amount_count;
            objOne.participate_seller_count += key.participate_seller_count;
            objOne.participate_user_count += key.participate_user_count;
            objOne.productSku_num += key.productSku_num;
            objTwo.rebate_order_count += key.rebate_order_count;
            objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
            objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
            objTwo.rebate_amount_count += key.rebate_amount_count;
        }
        for (var key of orderSource) {
            objThree.spu_count += key.spu_count;
            objThree.sku_count += key.sku_count;
            objThree.refund_user_count += key.refund_user_count;
            objThree.refund_goods_amount_count += key.refund_goods_amount_count;
            objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
            objThree.total_spu_num += key.total_spu_num;
            objThree.total_sku_num += key.total_sku_num;
            objThree.total_user_num += key.total_user_num;
            objThree.total_amount += key.total_amount;
            objThree.total_amount_actual += key.total_amount_actual;
        }
        objOne.rebate_order_amount_count = Math.round(objOne.rebate_order_amount_count);
        one.push(objOne);
        one.push({
            name: "总占比",
            order_count: util.toFixed(objOne.order_count, oneOne),
            rebate_order_amount_count: util.toFixed(objOne.rebate_order_amount_count, oneTwo),
            participate_seller_count: util.toFixed(objOne.participate_seller_count, oneThree),
            participate_user_count: util.toFixed(objOne.participate_user_count, oneFour),
            productSku_num: util.toFixed(objOne.productSku_num, oneFive)
        });
        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
        two.push(objTwo);
        three.push(objThree);
        three.push({
            name: "返利退货订单占比",
            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
        });
        return util.toTable([one, two, three], data.rows, data.cols);
    },
    platformOrderTwe(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            //array = {
            //    1 : "平台基础返利",
            //    2 : "平台促销返利",
            //    5 : "邀请商家入驻返利",
            //    6 : "单项单级返利"
            //},
            array = [ {
                key : "单项单级返利",
                value : "6"
            },{
                key : "平台基础返利",
                value : "1"
            },{
                key : "平台促销返利",
                value : "2"
            },{
                key : "邀请商家入驻返利",
                value : "5"
            } ],
            newData = {},
            map = {};
        map[filter_key + "_0"] = array[0].key;
        map[filter_key + "_1"] = array[1].key;
        map[filter_key + "_2"] = array[2].key;
        map[filter_key + "_3"] = array[3].key;
        for (var date of dates) {
            var obj = {};
            obj[filter_key + "_0"] = 0;
            obj[filter_key + "_1"] = 0;
            obj[filter_key + "_2"] = 0;
            obj[filter_key + "_3"] = 0;
            for (var key of source) {
                if (date === util.getDate(key.date)) {
                    for (var i = 0; i < array.length; i++) {
                        if (key.user_party === array[i].value) {
                            obj[filter_key + "_" + i] += key[filter_key];
                        }
                    }
                }
            }
            newData[date] = obj;
        }
        return [{
            type: type,
            map: map,
            config: {
                stack: false
            },
            data: newData
        }];
    },
    platformOrderThree(data, filter_key) {
        var source = data.data,
            typePie = "pie",
            typeBar = "bar",
            mapPie = {},
            mapBar = {},
            newDataPie = {},
            newDataBar = {},
            filter_name = {
                goods_sku_count: "商品件数",
                goods_amount_count: "商品总金额",
                rebate_amount_count: "返利到账金额"
            },
            XPie = config.level,
            XBar = config.grade;
        for (var level of XPie) {
            var obj = {};
            obj.value = 0;
            for (var key of source) {
                if (level.value === key.grade) {
                    obj.value += key[filter_key];
                }
            }
            newDataPie[level.key] = obj;
        }
        for (var level of XPie) {
            var obj = {};
            for (var i = 0; i < XBar.length; i++) {
                obj[i] = 0;
            }
            for (var key of source) {
                if (key.grade === level.value) {
                    for (var i = 0; i < XBar.length; i++) {
                        if (key.level === XBar[i].value) {
                            obj[i] += key[filter_key];
                        }
                    }
                }
            }
            newDataBar[level.key] = obj;
        }
        for (var i = 0; i < XBar.length; i++) {
            mapBar[i] = XBar[i].key;
        }
        mapPie.value = filter_name[filter_key];
        return [{
            type: typePie,
            map: mapPie,
            data: newDataPie,
            config: {
                stack: false
            }
        }, {
            type: typeBar,
            map: mapBar,
            data: newDataBar,
            config: {
                stack: true
            }
        }]
    },
    platformOrderFour(data, filter_key) {
        var source = data.data,
            newData = {},
            map = {},
            typePie = "pie",
            typeBar = "bar",
            filter_name = {
                goods_sku_count: "商品件数",
                goods_amount_count: "商品总金额",
                rebate_amount_count: "返利到账金额"
            },
            XData = [ {
                key : "单项单级返利",
                value : "6"
            },{
                key : "平台基础返利",
                value : "1"
            },{
                key : "平台促销返利",
                value : "2"
            },{
                key : "邀请商家入驻返利",
                value : "5"
            } ];
        for (var x of XData) {
            var obj = {
                value: 0
            };
            for (var key of source) {
                if (x.value === key.user_party) {
                    obj.value += key[filter_key];
                }
            }
            newData[x.key] = obj;
        }
        map.value = filter_name[filter_key];
        return [{
            type: typePie,
            map: map,
            data: newData,
            config: {
                stack: false
            }
        }, {
            type: typeBar,
            map: map,
            data: newData,
            config: {
                stack: false
            }
        }]
    },
    platformOrderFive(data, page) {
        var source = data.data,
            count = data.dataCount,
            page = page || 1,
            user_party = config.user_party,
            correlate_flow = config.correlate_flow;
        source.forEach((key, value) => {
            key.id = (page - 1) * 10 + value + 1;
            key.user_party = user_party[key.user_party];
            key.correlate_flow = correlate_flow[key.correlate_flow];
            key.order_rate = key.new_order_count + "/" + key.order_all_count;
            key.price_rate = key.new_order_amount + "/" + key.order_all_amount;
        });
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};
