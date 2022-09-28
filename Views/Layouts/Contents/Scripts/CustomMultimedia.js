var sourceController    = '/BBINCO/Admin/Core/Querys/',
    sourceTvController  = '/BBINCO/AMANVARI_TEST/Core/Controllers/',
    sourceImages        = '/BBINCO/Admin/Views/Assets/img/serverImages/';
$(function() {
    var videosList              = getInfoFromServer('getVideos'),
        audiosList              = getInfoFromServer('getAudios'),
        videoContent            = document.getElementById('videoContent'),
        device                  = getDevice(),
        mediaType               = getInfoFromServer('getMediaType');  
        if (mediaType[0]['MediaType'] === 'images') {
            playImages(device, audiosList);
            mediaTypeToPlay = 'images';
        }else if (mediaType[0]['MediaType'] === 'videos'){
            playMultimedia(device, videosList, 0);
            mediaTypeToPlay = 'videos';
        }     
});
function getInfoFromServer(option) {
    var aux = null;
    switch (option) {
        case 'getVideos':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp + sourceController+'Videos.php',
                data: { 
                    Option    : 'getVideosList',
                }, 
                async: false,
                success: function (response) {
                    VideosList  = $.parseJSON(response);
                    aux         = VideosList;
                }
              });
        break;
        case 'getAudios':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'Audios.php',
                data: { 
                    Option    : 'getAudiosList',
                }, 
                async: false,
                success: function (response) {
                    AudiosList  = $.parseJSON(response);
                    aux         = AudiosList;
                }
              });
        break;
        case 'getImages':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'Images.php',
                data: { 
                    Option    : 'getImagesList',
                }, 
                async: false,
                success: function (response) {
                    ImagesList  = $.parseJSON(response);
                    aux         = ImagesList;
                }
              });
        break;
        case 'getMediaType':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceTvController+'PY.php',
                data: { 
                    Option    : 'GetMediaType',
                }, 
                async: false,
                success: function (response) {
                    mediaType  = $.parseJSON(response);
                    aux         = mediaType;
                }
              });
        break;
        case 'getImageInterval':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceTvController+'PY.php',
                data: { 
                    Option    : 'GetImageInterval',
                }, 
                async: false,
                success: function (response) {
                    imageInterval  = $.parseJSON(response);
                    aux             = imageInterval;
                }
              });
        break;
        case 'getDigitalVideos':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'VideosChannel.php',
                data: { 
                    Option    : 'getVideosList',
                }, 
                async: false,
                success: function (response) {
                    DigitalVideosList  = $.parseJSON(response);
                    aux         = DigitalVideosList;
                }
              });
        break;
        case 'getDigitalAudios':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'Audios.php',
                data: { 
                    Option    : 'getAudiosList',
                }, 
                async: false,
                success: function (response) {
                    AudiosList  = $.parseJSON(response);
                    aux         = AudiosList;
                }
              });
        break;
        case 'getDigitalImages':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'ImagesChannel.php',
                data: { 
                    Option    : 'getImagesList',
                }, 
                async: false,
                success: function (response) {
                    ImagesList  = $.parseJSON(response);
                    aux         = ImagesList;
                }
              });
        break;
        case 'getDigitalMediaType':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceTVController+'PY.php',
                data: { 
                    Option    : 'GetDigitalMediaType',
                }, 
                async: false,
                success: function (response) {
                    mediaType  = $.parseJSON(response);
                    aux         = mediaType;
                }
              });
        break;
        case 'getDigitalImageInterval':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceTVController+'PY.php',
                data: { 
                    Option    : 'GetDigitalImageInterval',
                }, 
                async: false,
                success: function (response) {
                    imageInterval  = $.parseJSON(response);
                    aux             = imageInterval;
                }
              });
        break;
    }
    return aux;
}
function playMultimedia(device, videosList, position) {
    var videoName           = videosList[position]['VIDEO'].split('/'),
        videoName           = videoName[9],
        videoSource         = '/BBINCO/Admin/Views/Assets/Videos/',
        serverVideoSource   = 'http://10.0.3.241/',
        source              = serverVideoSource+videoSource+videoName;
    switch (device) {
        case 'amino':
            // Guarda la estadistica
                StopVideo();
            // Reproduce el video
                AVMedia.Play('src='+ source);
                Debug('video: '+ source);
            // Maximiza el video en caso de que no este en pantalla completa
                MaximizeTV();
        break;
        case 'explorador':
            var videoContent        = document.getElementById('videoContent');
                videoContent.style.display = 'inline';
                videosListLenght    = videosList.length-1;
                position            = 0;
                videoName           = videosList[position]['VIDEO'].split('/');
                videoName           = videoName[9];
                videoSource         = '/BBINCO/Admin/Views/Assets/Videos/';
                serverVideoSource   = 'http://201.116.203.114';
                source              = serverVideoSource+videoSource+videoName;
                videoContent.src    = source;
                $("#videoContent").on('ended', function(){
                  if ( videosListLenght== position){
                    position  = 0;
                    videosList  = getInfoFromServer('getVideos');
                    videosListLenght    = (videosList.length)-1;
                  }else{
                    position = position+1;
                  }
                  videoName           = videosList[position]['VIDEO'].split('/');
                  videoName           = videoName[9];
                  source              = serverVideoSource+videoSource+videoName;
                  videoContent.src    = source;
                });
        break;
        case 'kamai':
            ENTONE.video.cleanupAll();
            Debug('Source= '+source);
            // Variables kamai
            var Video   = new ENTONE.video(1,0);
                Video.setPltvBuffer(7200);
                Video.open(source);
                Video.play(1);
                Video.setVideoCallback(HandleVideo);
    
        break;
        case 'samsung':
            Debug('-------------------------------->PlayMultimedia');
            StopVideo();
            try {
                Player.open(source);
                Debug('playvideo open: '+source); 
                Player.prepareAsync(function() {
                    Player.play();
                });
                MaximizeTV();
            } catch (error) {
                Debug('PlayVideo > Error name = '+ error.name + ', Error message = ' + error.message);
            }

        break;
    }
}
function playAudio(device, audiosList, position){
    var audioName           = audiosList[position]['AUDIO'].split('/');
        audioName           = audioName[9];
    var audioSource         = 'BBINCO/Admin/Views/Assets/Audio/',
        serverAudioSource   = 'http://201.116.203.114/',
        source              = serverAudioSource+audioSource+audioName;                 
    switch (device) {
        case 'amino':
        // Guarda la estadistica
            StopVideo();
        // Reproduce el video
            AVMedia.Play('src='+ source);
            Debug('Audio: '+source);
        // Maximiza el video en caso de que no este en pantalla completa
            MaximizeTV();
        break;
        case 'explorador':
            alert('ests en el explorador');
        break;
        case 'kamai':
            ENTONE.video.cleanupAll();
            Debug('Source= '+source);
            // Variables kamai
            var Video   = new ENTONE.video(1,0);
                Video.setPltvBuffer(7200);
                Video.open(source);
                Video.play(1);
                Video.setVideoCallback(HandleVideo);
        break;
        case 'samsung':
            StopVideo();
            try {
                Player.open(source);
                Debug('playvideo open: '+source); 
                Player.prepareAsync(function() {
                    Player.play();
                });
                MaximizeTV();
            } catch (error) {
                Debug('PlayVideo > Error name = '+ error.name + ', Error message = ' + error.message);
            }
        break;
    }
}
function playImages(device,audiosList) {
    switch (device) {
        case 'amino':
            var imagesList          = getInfoFromServer('getImages'),
                imagesListLength    = imagesList.length-1; 
                interval            = getInfoFromServer('getImageInterval'),
                interval            = interval[0]['Interval'],
                imageContent        = document.getElementById('imageContent'),
                imageContent.style.display = 'inline';
                position            = 1;
            var max = 10000;
            var min = 1;
            var  x = makeid(5);
            var imageName = imagesList[0]['IMG'].split('/'),
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath+'?t='+x;   
                Debug(imagePath+'?t='+x);
            playAudio('amino', audiosList, 0);
            setInterval(function () {
                if (position === imagesListLength) {
                    position = 0;
                    imagesList          = getInfoFromServer('getImages');
                    imagesListLength    = imagesList.length-1; 
                    interval            = getInfoFromServer('getImageInterval');
                    interval            = interval[0]['Interval'];
                }else{
                    position = position+1;
                }
                x = makeid(5);
                imageName = imagesList[position]['IMG'].split('/');
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath+'?t='+x;
                Debug(imagePath+'?t='+x);
            },interval*1000);
        break;
        case 'explorador':
            var imagesList          = getInfoFromServer('getImages'),
                imagesListLength    = imagesList.length-1; 
                interval            = getInfoFromServer('getImageInterval'),
                interval            = interval[0]['Interval'],
                imageContent        = document.getElementById('imageContent'),
                imageContent.style.display = 'inline';
                position            = 1;
            var imageName = imagesList[0]['IMG'].split('/'),
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath;
            setInterval(function () {
                if (position === imagesListLength) {
                    position = 0;
                    imagesList          = getInfoFromServer('getImages');
                    imagesListLength    = imagesList.length-1; 
                    interval            = getInfoFromServer('getImageInterval');
                    interval            = interval[0]['Interval'];
                }else{
                    position = position+1;
                }
                imageName = imagesList[position]['IMG'].split('/');
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath;
            },interval*1000);
        break;
        case  'kamai':
            var imagesList          = getInfoFromServer('getImages'),
                imagesListLength    = imagesList.length-1; 
                interval            = getInfoFromServer('getImageInterval'),
                interval            = interval[0]['Interval'],
                imageContent        = document.getElementById('imageContent'),
                imageContent.style.display = 'block';
                position            = 1;
            var max = 10000;
            var min = 1;
            var  x = makeid(5);
            var imageName = imagesList[0]['IMG'].split('/'),
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath+'?t='+x;   
                Debug(imagePath+'?t='+x);
             playAudio('kamai', audiosList, 0);
            setInterval(function () {
                if (position === imagesListLength) {
                    position = 0;
                    imagesList          = getInfoFromServer('getImages');
                    imagesListLength    = imagesList.length-1; 
                    interval            = getInfoFromServer('getImageInterval');
                    interval            = interval[0]['Interval'];
                }else{
                    position = position+1;
                }
                x = makeid(5);
                imageName = imagesList[position]['IMG'].split('/');
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath+'?t='+x;
                Debug(imagePath+'?t='+x);
            },interval*1000);
        break;
        case 'samsung':
            var imagesList          = getInfoFromServer('getImages'),
                imagesListLength    = imagesList.length-1, 
                interval            = getInfoFromServer('getImageInterval'),
                interval            = interval[0]['Interval'],
                imageContent        = document.getElementById('imageContent');
                imageContent.style.display = 'block';
                position            = 1;
            var max = 10000;
            var min = 1;
            var  x = makeid(5);
            var imageName = imagesList[0]['IMG'].split('/'),
                imagePath = sourceImages+imageName[10];
                imageContent.src = 'http://' + ServerIp + imagePath+'?t='+x;   
                Debug(imagePath+'?t='+x);
            // playAudio('samsung', audiosList, 0);
            setInterval(function () {
                if (position === imagesListLength) {
                    position = 0;
                    imagesList          = getInfoFromServer('getImages');
                    imagesListLength    = imagesList.length-1; 
                    interval            = getInfoFromServer('getImageInterval');
                    interval            = interval[0]['Interval'];
                }else{
                    position = position+1;
                }
                x = makeid(5);
                imageName = imagesList[position]['IMG'].split('/');
                imagePath = sourceImages+imageName[10];
                imageContent.src = 'http://' + ServerIp + imagePath+'?t='+x;
                Debug(imagePath+'?t='+x);
            },interval*1000);
        break;
    }
}
//Utilidades
function getDevice(){
    var device = 'explorador';
    if (typeof(ASTB) !== 'undefined') {
        device = 'amino';
    } else if (typeof(ENTONE) !== 'undefined') {
        device = 'kamai';
    } else if (typeof(gSTB) !== 'undefined'){
        device = 'infomir';
    } else if (window.tizen !== undefined) {
        device = 'samsung';
    }
    return device;
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
