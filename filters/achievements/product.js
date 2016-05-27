/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */
var util = require("../../utils");

module.exports = {
    productOne(data) {
        var source = data.data,
            count = data.dataCount,
            newData = {
                one : 0,
                two : 0,
                three : 0,
                four : 0,
                five : 0,
                six : 0,
                seven : 0
            };
        for(var key of source) {
            newData.one += key.product_acc_uv;
            newData.two += key.product_acc_pv;
            newData.three += Math.round(key.product_acc_avg_time);
            newData.four += key.product_scan;
            newData.five += key.products_cars;
            newData.six += key.products_order;
            newData.seven += key.products_pay;
        }
        return util.toTable([[newData]], data.rows, data.cols, [count]);
    },
    productTwo(data, filter_key, dates) {
        var source = data.data,
            type = "line",
            filter_name = {
                products_scan : "浏览商品数",
                products_cars : "加购商品数",
                products_pay : "支付商品",
                products_order : "下单商品"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var date of dates) {
            newData[date] = {
                value : 0
            };
        }
        for(var key of source) {
            newData[util.getDate(key.date)].value += key.value;
        }
        return [{
            map : map,
            type : type,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }]
    },
    productThree(data, dates) {
        var source = data.data,
            obj = {},
            newData = [];
        dates.sort((a, b) => {
            return new Date(b) - new Date(a);
        });
        for(var date of dates) {
            obj[date] = {
                products_scan : 0,
                products_order : 0,
                products_pay : 0,
                products_return : 0,
                products_fee : 0,
                refund_fee : 0
            };
        }
        for(var key of source) {
            var date = util.getDate(key.date);
            obj[date][key.key_type] += key.value;
        }
        for(var date of dates) {
            newData.push({
                one : date,
                two : obj[date].products_scan,
                three : obj[date].products_order,
                four : obj[date].products_pay,
                five : obj[date].products_return,
                six : obj[date].products_fee.toFixed(2),
                seven : obj[date].refund_fee.toFixed(2)
            })
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    productFour(data) {
        var source = data.data,
            newData = [],
            access_num_total = 0,
            access_users_total = 0,
            length = source.length,
            top = length > 100 ? 100 : length;
        source.sort((a, b) => {
            return b.access_num - a.access_num;
        });
        for(var key of source) {
            access_num_total += key.access_num;
            access_users_total += key.access_users;
        }
        for(var i = 0; i < top; i++) {
            source[i].top = i + 1;
            source[i].access_num_rate = util.toFixed(source[i].access_num, access_num_total);
            source[i].access_users_rate = util.toFixed(source[i].access_users, access_users_total);
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    productFive(data) {
        var source = data.data,
            newData = [],
            order_price_total = 0,
            length = source.length,
            top = length > 100 ? 100 : length;
        source.sort((a, b) => {
            return b.order_price - a.order_price;
        });
        for(var key of source) {
            order_price_total += key.order_price;
        }
        for(var i = 0; i < top; i++) {
            source[i].top = i + 1;
            source[i].order_price = source[i].order_price.toFixed(2);
            source[i].order_price_rate = util.toFixed(source[i].order_price, order_price_total);
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};