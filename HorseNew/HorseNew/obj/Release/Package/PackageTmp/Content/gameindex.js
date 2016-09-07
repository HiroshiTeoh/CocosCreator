 //提醒框
 function myFunction() {
     var x = document.getElementById("code").value;
        if (x == "" || isNaN(x)) {
            alert("输入字符不合法请重新输入");
        }
    }

   
  
  //时间

    var timer = (function () {
        return function (json) {
            if (json.currentTime) {
                var now = new Date();
                var year = now.getFullYear(); //返回年份（4位数字）
                var month = now.getMonth() + 1; //返回月份（0-11，所以+1）
                var day = now.getDate(); //返回某天（1-31）
                var h = now.getHours(); //返回小时（0-23）
                var m = now.getMinutes(); //返回分钟（0-59）
                var s = now.getSeconds(); //返回秒数（0-59）
                //补O
                m = m < 10 ? '0' + m : m;
                s = s < 10 ? '0' + s : s;
                var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                document.getElementById(json.objId).innerHTML = year + '年' + month + '月' + day + '日' + weekday[now.getDay()] + ' ' + h + ':' + m + ':' + s;
                setTimeout(function () { timer(json) }, 1000);
            } else {
                var endtime = new Date(json.endtime); //结束时间
                var nowtime = new Date(); //当前时间
                var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000); //计算差的秒数
                //一天24小时 一小时60分钟 一分钟60秒
                d = parseInt(lefttime / 3600 / 24);
                h = parseInt((lefttime / 3600) % 24);
                m = parseInt((lefttime / 60) % 60);
                s = parseInt(lefttime % 60);
                document.getElementById(json.objId).innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
                if (lefttime > 0) { setTimeout(function () { timer(json) }, 1000); }
            }
        }
    })()

    window.onload = function () {
        timer({
            currentTime: true,
            objId: 'thisTime'
        })
        timer({
            objId: 'countDown',
            endtime: "2016/9/1,18:00"
        })
    }

