const util = {}

//获取某个对象在数组中的索引值
util.objectIndexInArray = (array, item, param) => {
    let index = -1
    for (let i in array) {
        if (array[i][param] === item[param]) {
            index = i
            break
        }
    }
    return index
}

/**
 * 检测数据是不是除了symbol外的原始数据
 * @param value
 * @returns {boolean}
 */
util.isStatic = (value) => {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value === null
    )
}

/**
 * 检测数据是不是原始数据
 * @param value
 * @returns {boolean|*}
 */
util.isPrimitive = (value) => {
    return util.isStatic(value) || typeof value === 'symbol'
}

/**
 * 判断数据是不是引用类型的数据 (例如： arrays, functions, objects, regexes, new Number(0),以及 new String(''))
 * @param value
 * @returns {boolean}
 */
util.isObject = (value) => {
    let type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

/**
 * 检查 value 是否是 类对象。 如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"
 * @param value
 * @returns {boolean}
 */
util.isObjectLike = (value) => {
    return value != null && typeof value == 'object';
}

/**
 * 检查 value 是不是函数
 * @param value
 * @returns {boolean}
 */
util.isFunction = (value) => {
    return Object.prototype.toString.call(value) === '[object Function]'
}

/**
 * 获取数据类型，返回结果为 Number、String、Object、Array等
 * @param value
 * @returns {string}
 */
util.getRawType = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * 判断数据是不是Object类型的数据
 * @param obj
 * @returns {boolean}
 */
util.isPlainObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 判断数据是不是数组类型的数据
 * @param arr
 * @returns {boolean}
 */
util.isArray = (arr) => {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * 判断数据是不是正则对象
 * @param value
 * @returns {boolean}
 */
util.isRegExp = (value) => {
    return Object.prototype.toString.call(value) === '[object RegExp]'
}

/**
 * 判断数据是不是时间对象
 * @param value
 * @returns {boolean}
 */
util.isDate = (value) => {
    return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * 判断 value 是不是浏览器内置函数
 * @param value
 * @returns {boolean}
 */
util.isNative = (value) => {
    return typeof value === 'function' && /native code/.test(value.toString())
}

/**
 * 检查 value 是否为有效的类数组长度
 * @param value
 * @returns {boolean}
 */
util.isLength = (value) => {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
}

/**
 * 检查 value 是否是类数组
 * @param value
 * @returns {boolean|*}
 */
util.isArrayLike = (value) => {
    return value != null && util.isLength(value.length) && !util.isFunction(value);
}

/**
 * 判断数据是否为空
 */
util.isEmpty = function (value) {
    if (value == null) {
        return true;
    }
    if (util.isArrayLike(value)) {
        return !value.length;
    } else if (util.isPlainObject(value)) {
        for (let key in value) {
            if (util.hasOwnProperty.call(value, key)) {
                return false;
            }
        }
        return true;
    }
    return false;
};

/**
 * 记忆函数：缓存函数的运算结果
 * @param fn
 * @returns {function(*=): *}
 */
util.cached = (fn) => {
    let cache = Object.create(null);
    return function cachedFn(str) {
        let hit = cache[str];
        return hit || (cache[str] = fn(str))
    }
}

/**
 * 横线转驼峰命名
 * @param str
 * @returns {*}
 */
util.camelize = (str) => {
    let camelizeRE = /-(\w)/g;
    return str.replace(camelizeRE, function (_, c) {
        return c ? c.toUpperCase() : '';
    })
}

/**
 * 驼峰命名转横线命名：拆分字符串，使用 - 相连，并且转换为小写
 * @param str
 * @returns {string}
 */
util.hyphenate = (str) => {
    let hyphenateRE = /\B([A-Z])/g;
    return str.replace(hyphenateRE, '-$1').toLowerCase()
}

/**
 * 字符串首位大写
 * @param str
 * @returns {string}
 */
util.capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将属性混合到目标对象中
 * @param to
 * @param _from
 * @returns {*}
 */
util.extend = (to, _from) => {
    for (let key in _from) {
        to[key] = _from[key];
    }
    return to
}

/**
 * 获取浏览器信息
 * @returns {{type: string, version: number}}
 */
util.getExplorerInfo = () => {
    let t = navigator.userAgent.toLowerCase();
    return 0 <= t.indexOf("msie") ? { //ie < 11
        type: "IE",
        version: Number(t.match(/msie ([\d]+)/)[1])
    } : !!t.match(/trident\/.+?rv:(([\d.]+))/) ? { // ie 11
        type: "IE",
        version: 11
    } : 0 <= t.indexOf("edge") ? {
        type: "Edge",
        version: Number(t.match(/edge\/([\d]+)/)[1])
    } : 0 <= t.indexOf("firefox") ? {
        type: "Firefox",
        version: Number(t.match(/firefox\/([\d]+)/)[1])
    } : 0 <= t.indexOf("chrome") ? {
        type: "Chrome",
        version: Number(t.match(/chrome\/([\d]+)/)[1])
    } : 0 <= t.indexOf("opera") ? {
        type: "Opera",
        version: Number(t.match(/opera.([\d]+)/)[1])
    } : 0 <= t.indexOf("Safari") ? {
        type: "Safari",
        version: Number(t.match(/version\/([\d]+)/)[1])
    } : {
        type: t,
        version: -1
    }
}

/**
 * 检测是否为PC端浏览器模式
 * @returns {boolean}
 */
util.isPCBroswer = () => {
    let e = navigator.userAgent.toLowerCase()
        , t = "ipad" == e.match(/ipad/i)
        , i = "iphone" == e.match(/iphone/i)
        , r = "midp" == e.match(/midp/i)
        , n = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i)
        , a = "ucweb" == e.match(/ucweb/i)
        , o = "android" == e.match(/android/i)
        , s = "windows ce" == e.match(/windows ce/i)
        , l = "windows mobile" == e.match(/windows mobile/i);
    return !(t || i || r || n || a || o || s || l)
}

/**
 * 获取url参数，返回一个对象
 * @returns {any}
 */
util.getUrlParam = () => {
    let url = document.location.toString();
    let arrObj = url.split("?");
    let params = Object.create(null)
    if (arrObj.length > 1) {
        arrObj = arrObj[1].split("&");
        arrObj.forEach(item => {
            item = item.split("=");
            params[item[0]] = item[1]
        })
    }
    return params;
}

/**
 * 全屏
 */
util.toFullScreen = () => {
    let elem = document.body;
    elem.webkitRequestFullScreen
        ? elem.webkitRequestFullScreen()
        : elem.mozRequestFullScreen
            ? elem.mozRequestFullScreen()
            : elem.msRequestFullscreen
                ? elem.msRequestFullscreen()
                : elem.requestFullScreen
                    ? elem.requestFullScreen()
                    : alert("浏览器不支持全屏");
}

/**
 * 退出全屏
 */
util.exitFullscreen = () => {
    let elem = parent.document;
    elem.webkitCancelFullScreen
        ? elem.webkitCancelFullScreen()
        : elem.mozCancelFullScreen
            ? elem.mozCancelFullScreen()
            : elem.cancelFullScreen
                ? elem.cancelFullScreen()
                : elem.msExitFullscreen
                    ? elem.msExitFullscreen()
                    : elem.exitFullscreen
                        ? elem.exitFullscreen()
                        : alert("切换失败,可尝试Esc退出");
}

/**
 * 根据客户端宽度适配单位大小
 * @param res
 * @returns {number}
 */
util.adaptiveUnit = (res) => {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}

/**
 * 根据日期获取年龄
 * @param birthday 2020-06-05
 * @returns {array} [years, months, days]
 */
util.getAge = (birthday) => {
    birthday = birthday.split('-')
    // 新建日期对象
    let date = new Date();
    // 今天日期，数组，同 birthday
    let today = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
    ];
    // 分别计算年月日差值
    let age = today.map((value, index) => {
        return value - birthday[index];
    });
    // 当天数为负数时，月减 1，天数加上月总天数
    if (age[2] < 0) {
        // 简单获取上个月总天数的方法，不会错
        let lastMonth = new Date(today[0], today[1], 0);
        age[1]--;
        age[2] += lastMonth.getDate();
    }
    // 当月数为负数时，年减 1，月数加上 12
    if (age[1] < 0) {
        age[0]--;
        age[1] += 12;
    }
    return age;
}

util.getDateTime = () => {
    var date = new Date();

    var year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
    var month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
    var day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)

    var hours = date.getHours(); //小时 ,返回 Date 对象的小时 (0 ~ 23)
    var minutes = date.getMinutes(); //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
    var seconds = date.getSeconds(); //秒 ,返回 Date 对象的秒数 (0 ~ 59)   

    //获取当前系统时间  
    var currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    // alert(currentDate);

    //修改月份格式
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    //修改日期格式
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }

    //修改小时格式
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }

    //修改分钟格式
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }

    //修改秒格式
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }

    //获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
    var currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    return currentFormatDate;
}

export default util
