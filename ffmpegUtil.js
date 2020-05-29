const ffmpeg = require('ffmpeg');
module.exports = class FFMPEGOperation {
    constructor() {
        
    }
    //获取视频时长
    getVideoTotalDuration(videoPath) {
        const process = new ffmpeg(videoPath)
        return process.then(function (video) {
            console.log(video)
            console.log('getVideoTotalDuration,seconds:' + video.metadata.duration.seconds)
            return video.metadata.duration.seconds || 0
        }, function (err) {
            console.log('getVideoTotalDuration,err:' + err.message)
            return -1
        })
    }
    //获取视频缩略图
    getVideoSceenshots(videoPath, outPutPath, frameRate, frameCount){
        const process = new ffmpeg(videoPath);
        return process.then(function (video) {
            video.fnExtractFrameToJPG(outPutPath, {
                frame_rate : frameRate,
                number : frameCount,
                file_name : 'my_frame_%t_%s'
            }, function (error, files) {
                if (!error)
                    console.log('Frames: ' + files)
            })
        }, function (err) {
            console.log('Error: ' + err)
        })
    }
    //拆分视频
    splitVideo(videoPath, startTime, duration, outVideoPath){
        const    process = new ffmpeg(videoPath)
        return process.then(function (video) {
            video
            .setVideoStartTime(startTime)
            .setVideoDuration(duration)
            .save(outVideoPath, function (error, file) {
                if (!error){
                    console.log('Video file: ' + file)
                 }
            })
        }, function (err) {
            console.log('Error: ' + err)
        })
    }
}