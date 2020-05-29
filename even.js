const remote = require('electron').remote;
const dialog = remote.dialog;
const ipcMain = remote.ipcMain;
const myPlayer = videojs('example_video_1');
const ipcRenderer = require('electron').ipcRenderer;

function oncliclFile() {
    console.log("------------------------")
    // var path = dialog.showOpenDialog({ properties: [ 'openFile' ]});
    console.log();
    // console.log(path.PromiseValue)
    var option = {};
    option.title = "打开";
    dialog.showOpenDialog(option).then(result => {
        console.log(result)
        // console.log(result[0].filePaths)
        console.log(result.filePaths)
        try {
            var videoUrl = result.filePaths;
            if(myPlayer ==undefined){
                myPlayer = videojs('example_video_1');
            }else{
                var v = document.getElementById("pathFile_id");
                v.src = videoUrl;
                var w = document.body.clientWidth;
                var h = document.body.clientHeight;
                myPlayer.width(w);
                myPlayer.height(h);
                myPlayer.src(videoUrl);
                myPlayer.load(videoUrl);
                myPlayer.play();
            }
            
            
        } catch (error) {
            console.log(error)
        }
        
        
            
    }).catch(err => {
        console.log(err)
    });


}

ipcRenderer.on('data', function (event, message) {
    console.log('data:', message)
    var videoUrl = message.path[0];
    if(myPlayer ==undefined){
        myPlayer = videojs('example_video_1');
    }else{
        var v = document.getElementById("pathFile_id");
        v.src = videoUrl;
        var w = document.body.clientWidth;
        var h = document.body.clientHeight;
        myPlayer.width(w);
        myPlayer.height(h);
        myPlayer.src(videoUrl);
        myPlayer.load(videoUrl);
        myPlayer.play();
    }

});

//最大化最小化监听，接收主线程过来的消息
ipcRenderer.on('max', function (event, message) {
    console.log('max:', message)
        myPlayer.width(message.width);
        myPlayer.height(message.height);
});


//键盘监听
var vol = 10;  //1代表100%音量，每次增减0.1
var time = 10; //单位秒，每次增减10秒
document.onkeyup = function (event) {//键盘事件

    console.log("keyCode:" + event.keyCode);
    var e = event || window.event || arguments.callee.caller.arguments[0];
    console.log("键盘监听：")
    console.log(e.keyCode)
    //鼠标上下键控制视频音量
    if (e && e.keyCode === 38) {
       
        // 按 向上键
        var howLoudIsIt = myPlayer.volume();
        howLoudIsIt !== 100 ? myPlayer.volume(howLoudIsIt + vol) : 100;
        return false;

    } else if (e && e.keyCode === 40) {

        // 按 向下键
        var howLoudIsIt = myPlayer.volume();
        howLoudIsIt !== 0 ? myPlayer.volume(howLoudIsIt - vol) : 0;
        return false;

    } else if (e && e.keyCode === 37) {

        // 按 向左键
        var n = myPlayer.currentTime();
        n !== 0 ? myPlayer.currentTime(n-time) : 1;
        return false;

    } else if (e && e.keyCode === 39) {

        // 按 向右键
        var n = myPlayer.currentTime();
        n !== 0 ? myPlayer.currentTime(n+time) : 1;
        return false;

    } else if (e && e.keyCode === 32) {

        // 按空格键 判断当前是否暂停
        console.log(myPlayer.paused())
        console.log(myPlayer.played())
        
        myPlayer.paused() === true ? myPlayer.play() : myPlayer.pause();
        return false;
    }

};