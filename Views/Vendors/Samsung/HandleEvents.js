$(document).ready(function() {
var videosListServer    = getInfoFromServer('getVideos'),
    videosListLenght    = (videosListServer.length)-1,
    multimediaPosition  = 0;

var audiosListServer    = getInfoFromServer('getAudios'),
    audiosListLenght    = (audiosListServer.length)-1,
    audiosPosition      = 0;


/*------NEW DIGITAL CHANNEL---------------*/
var videosDigitalListServer    = getInfoFromServer('getDigitalVideos'),
    videosDigitalListLenght    = (videosDigitalListServer.length)-1,
    multimediaDigitalPosition  = 0;


var audiosDigitalListServer    = getInfoFromServer('getDigitalAudios'),
    audiosDigitalListLenght    = (audiosDigitalListServer.length)-1,
    audiosDigitalPosition      = 0;
/*----------------------------------------*/

/*------WEATHER CHANNEL---------------*/
var audiosWeatherListServer    = getInfoFromServer('getWeatherAudio'),
    audiosWeatherListLenght    = (audiosWeatherListServer.length)-1,
    audiosWeatherPosition      = 0;
/*----------------------------------------*/   
});

var listener = {
    onbufferingstart: function() {
        Debug('Buffering start.');
        EventString = 'BUFFERING_START';
        clearTimeout(Checker);
    },
    onbufferingcomplete: function() {
        Debug('............................ Buffering complete. > start: ' +Executing);
        if(Executing === false){
            UpdateQuickInfoDevice();
            EventString = 'STATUS_PLAYING';
        }
    },
    onstreamcompleted: function() {
        Debug('Stream Completed > end');
        EventString = 'CONNECTION_STOPPED';

        if(CurrentModule === 'Tv'){
            //SetDigitalChannel();
            if (digitalMediaTypeToPlay != null) {
                if (digitalMediaTypeToPlay === 'videos') {
                    if (multimediaDigitalPosition === videosDigitalListLenght) {
                        multimediaDigitalPosition  = 0;
                        videosDigitalListServer    = getInfoFromServer('getDigitalVideos');
                        videosDigitalListLenght    = (videosDigitalListServer.length)-1;
                    }else{
                        multimediaDigitalPosition = multimediaDigitalPosition+1;
                    }
                    Debug('Position= '+multimediaDigitalPosition);
                    Debug('mediaType: '+mediaTypeToPlay);
                    playMultimedia('samsung', videosDigitalListServer, multimediaDigitalPosition);
                }else if(digitalMediaTypeToPlay === 'images'){
                    if (audiosDigitalPosition === audiosDigitalListLenght) {
                        audiosDigitalPosition  = 0;
                        audiosDigitalListServer    = getInfoFromServer('getDigitalAudios');
                        audiosDigitalListLenght    = (audiosDigitalListServer.length)-1;
                    }else{
                        audiosDigitalPosition = audiosDigitalPosition+1;
                    }
                    Debug('Position= '+audiosDigitalPosition);
                    Debug('mediaType: '+digitalMediaTypeToPlay);
                    playAudio('samsung', audiosDigitalListServer, audiosDigitalPosition);
                }
            }else if (playingWeatherChannel != null) {
                if (audiosWeatherPosition === audiosWeatherListLenght) {
                    audiosWeatherPosition  = 0;
                    audiosWeatherListServer    = getInfoFromServer('getWeatherAudio');
                    audiosWeatherListLenght    = (audiosWeatherListServer.length)-1;
                }else{
                    audiosWeatherPosition = audiosWeatherPosition+1;
                }
                Debug('Position= '+audiosWeatherPosition);
                // Debug('mediaType: '+digitalMediaTypeToPlay);
                playWeatherAudio('samsung', audiosWeatherListServer, audiosWeatherPosition);
            }
        }
        if(typeof(LoopVideo) !== 'undefined'){
            if(LoopVideo === true){
                LoopMedia();
            }
        }
        if(Executing === false){
            UpdateQuickInfoDevice();
        }
    },
    onerror: function(eventType) {
        Debug('event type error : ' + eventType);
        EventString = 'STATUS_ERROR_STREAM';
    },
    onevent: function(eventType, eventData) {
        EventString = eventType;
        Debug('event type: ' + eventType + ', data: ' + eventData);
    }
};

