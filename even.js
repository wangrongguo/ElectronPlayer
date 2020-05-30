const remote = require('electron').remote;
const dialog = remote.dialog;
const ipcMain = remote.ipcMain;
var myPlayer = undefined;
const ipcRenderer = require('electron').ipcRenderer;
const initwh = remote.getCurrentWindow().getContentBounds();
function oncliclFile() {
    var option = {};
    option.title = "打开";
    dialog.showOpenDialog(option).then(result => {
        
        try {
            var videoUrl = result.filePaths[0];
            //播放
            videoPlaying(videoUrl);

        } catch (error) {
            console.log(error)
        }



    }).catch(err => {
        console.log(err)
    });


}

function showFileArea(show) {
    //显示打开文件的按钮
    try {
        let dropArea = document.getElementById('dropArea');
        show ? dropArea.classList.add('hide') : dropArea.classList.remove('hide');
    } catch (error) {
    }
}
function showVideoPlay(show) {
    //显示打开文件的按钮
    try {
        let ev = document.getElementById('example_video_1');
        show ? ev.classList.remove('hide') : ev.classList.add('hide');
    } catch (error) {
    }
}

ipcRenderer.on('data', function (event, message) {
    // console.log('data:', message)
    var videoUrl = message.path[0];
    //播放
    videoPlaying(videoUrl);

});

//最大化最小化监听，接收主线程过来的消息
ipcRenderer.on('max', function (event, message) {
    // console.log('max:', message)
    if (myPlayer != undefined) {
        myPlayer.width(message.width);
        myPlayer.height(message.height);
    }

});

//播放
function videoPlaying(videoUrl) {
    if(videoUrl === undefined){
        return false;
    }
    var v = document.getElementById("pathFile_id");
    v.src = videoUrl;
    //处理路径中的文件格式
    var first = videoUrl.lastIndexOf(".");//取到文件名开始到最后一个点的长度
    var namelength = videoUrl.length;//取到文件名长度
    var fileType = videoUrl.substring(first + 1, namelength);//截取获得后缀名
    console.log(videoUrl);
    console.log(fileType);
    if (fileType.toLowerCase() == 'mp4') {
        v.setAttribute('type', 'video/mp4')
    } else if (fileType.toLowerCase() == 'mkv') {
        v.setAttribute('type', 'video/webm')
    }else if(fileType.toLowerCase() == 'rmvb'){
        //不支持rmvb
        return false;
    }else {
        //默认MP4
        v.setAttribute('type', 'video/mp4')
    }
    var w = initwh.width;
    var h = initwh.height;
    showVideoPlay(true);
    if (myPlayer == undefined) {
        myPlayer = videojs('example_video_1');
        myPlayer.ready(function () {
            myPlayer = this;
            myPlayer.width(w);
            myPlayer.height(h);
            myPlayer.src(videoUrl);
            myPlayer.load(videoUrl);
            myPlayer.play();
            //实时监听时间
            myPlayer.on("timeupdate", function () {
                // console.log('--time---')
                var videoTime = document.getElementById("videoTime");
                videoTime.innerHTML = formatDate(myPlayer.currentTime()) + "/" + formatDate(myPlayer.duration());
            });
            //视频错误监听
            myPlayer.on('error', function (e) {
                console.log(e)
                myPlayer.errorDisplay.close();   //将错误信息不显示
                
            });
        });
    } else {
        myPlayer.width(w);
        myPlayer.height(h);
        myPlayer.src(videoUrl);
        myPlayer.load(videoUrl);
        myPlayer.play();
        
    }


    showFileArea(true);
}

//键盘监听
var vol = 10;  //1代表100%音量，每次增减0.1
var time = 10; //单位秒，每次增减10秒
document.onkeyup = function (event) {//键盘事件

    // console.log("keyCode:" + event.keyCode);
    var e = event || window.event || arguments.callee.caller.arguments[0];
    // console.log("键盘监听：")
    // console.log(e.keyCode)
    //鼠标上下键控制视频音量
    if (e && e.keyCode === 38) {

        // 按 向上键
        var howLoudIsIt = myPlayer.volume();
        howLoudIsIt !== 100 ? myPlayer.volume(howLoudIsIt + vol) : 100;
        return false;

    } else if (e && e.keyCode === 40) {

        // 按 向下键
        var howLoudIsIt = myPlayer.volume();
        howLoudIsIt !== 0 ? myPlayer.volume(howLoudIsIt - vol) : 0;
        return false;

    } else if (e && e.keyCode === 37) {

        // 按 向左键
        var n = myPlayer.currentTime();
        var videoTime = document.getElementById("videoTime");
        videoTime.innerHTML = formatDate(n - time) + "/" + formatDate(myPlayer.duration());
        n !== 0 ? myPlayer.currentTime(n - time) : 1;
        return false;

    } else if (e && e.keyCode === 39) {

        // 按 向右键
        var n = myPlayer.currentTime();
        var videoTime = document.getElementById("videoTime");
        videoTime.innerHTML = formatDate(n + time) + "/" + formatDate(myPlayer.duration());
        n !== 0 ? myPlayer.currentTime(n + time) : 1;
        return false;

    } else if (e && e.keyCode === 32) {

        // 按空格键 判断当前是否暂停
        // console.log(myPlayer.paused())
        // console.log(myPlayer.played())
        if (myPlayer != undefined)
            myPlayer.paused() === true ? myPlayer.play() : myPlayer.pause();
        return false;
    }

};
//时间转化
function formatDate(value) {
    var secondTime = parseInt(value);// 秒
    if(secondTime === 0 || secondTime < 0){
        return "00:00:00";
    }
    var minuteTime = 0;// 分
    var hourTime = 0;// 时
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "" + (parseInt(secondTime) < 10 ? ("0" + parseInt(secondTime)) : parseInt(secondTime));
    if (minuteTime > 0) {
        result = "" + (parseInt(minuteTime) < 10 ? ("0" + parseInt(minuteTime)) : parseInt(minuteTime)) + ":" + result;
    } else {
        result = "00:" + result;
    }
    if (hourTime > 0) {
        result = "" + (parseInt(hourTime) < 10 ? ("0" + parseInt(hourTime)) : parseInt(hourTime)) + ":" + result;
    } else {
        result = "00:" + result;
    }
    return result;
}
