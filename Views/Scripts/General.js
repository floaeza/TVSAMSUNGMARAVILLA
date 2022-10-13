// @ts-nocheck
/******************************************************************************
 * @Objetivo: Funciones generales, envio de estadisticas y clima
 * @CreadoPor: Tania Maldonado
 * @Fecha: Noviembre 2019
 *******************************************************************************/

    var SM_StartDateModule     = new Date(),
        SM_FormatStartDate     = '',
        SM_EndDateModule       = '',
        SM_FormatEndDate       = '',
        SM_StartDateModuleMM   = '',
        SM_EndDateModuleMM     = '',
        SM_MinSeconds          = 10000, // 30 segundos
        SM_DifferenceInSec     = '';
        
    var FormatStartDate     = '',
        EndDateModule       = '',
        FormatEndDate       = '',
        StartDateModuleMM   = '',
        EndDateModuleMM     = '',
        MinSeconds          = 90000, // 30 segundos
        MaxSeconds          = 18000000, // 420 minutos | 7 horas
        DifferenceInSec     = '';

    var MM_StartDateMovie      = new Date(),
        MM_FormatStartDate    = '',
        MM_EndDateMovie       = '',
        MM_FormatEndDate      = '',
        MM_StartDateMovieMM   = '',
        MM_EndDateMovieMM     = '',
        MM_MinSeconds         = 600000, // 30 minutos
        MM_DifferenceInSec    = '',
        xhr;
    var ObjectWeather =[];
    var mediaTypeToPlay         = null,
        digitalMediaTypeToPlay  = null,
        PlayingChannel          = null,
        PlayDigita              = null,
        imageDLLInterval        = null,
        playingWeatherChannel   = null;
    var sourceController    = '/BBINCO/Admin/Core/Querys/',
        sourceTvController  = '/BBINCO/TV_VPL/Core/Controllers/',
        sourceImages        = '/BBINCO/Admin/Views/Assets/img/channelImages/';

        window.localStorage;

function GoPage(Page, ModuleId, ChangeModule){
    //alert('Pagina: '+ Page+'Module Id: '+ ModuleId+'CangeModule: '+ChangeModule);
    ////Debug(ModuleId + "  " + OnScreen + "  " + ChannelPosition);
    //updateDataModule(ModuleId);

    ////Debug('GoPage ---> '+Page);
    
    //if(CurrentModule === 'Tv' && StartDateChannel !== ''){
    if(CurrentModule === 'Tv'){
        //Debug('TVCLOSE & SETCHANNELSTATISTICS');
        StopVideo();
        TvClose();
        //SetChannelStatistics();
    }
        if (window.tizen !== undefined) {

            //Debug('Window.tizen !== undefined');
            var PageH = Page.replace('php','html');
            
            //Debug('GoPageHTML ---> '+PageH);
            
            localStorage.setItem('Module', ChangeModule);
            localStorage.setItem('Id', ModuleId);

            location.replace(PageH);
            //window.location.href = PageH;
            
        } else {
            if(typeof(ASTB) !== 'undefined'){
                location.href= Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule;
            }else{
                window.location.href = Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule;
            }
        }
    }
//}
    
function SetChannelStatistics(){ 
        FormatStartDate     = getDate(StartDateChannel);
        EndDateModule       = new Date();
        FormatEndDate       = getDate(EndDateModule);
        StartDateModuleMM   = StartDateChannel.getTime();
        EndDateModuleMM     = EndDateModule.getTime();
        DifferenceInSec     = EndDateModuleMM - StartDateModuleMM;
        //alert("Start: " + StartDateModuleMM + " End: " + EndDateModuleMM+ " Diferencia: "+DifferenceInSec);
    /* Valida si el tiempo de vista del modulo esta en un rango de tiempo coherente */
    if(DifferenceInSec > MinSeconds && DifferenceInSec < MaxSeconds){
        
        var ChannelName    = ChannelsJson[ChannelPosition].NAME,
            ChannelStation = ChannelsJson[ChannelPosition].STTN;
    
        xhr = $.ajax({
            cache: false,
            type: 'POST',
            url: ServerSource + 'Core/Controllers/Statistics.php',
            data: {
                Option: 'Channels',
                MacAddress: MacAddress,
                ChannelName: ChannelName,
                StationNumber: ChannelStation,
                LocationId: Device['LocationId'],
                StartTime: FormatStartDate,
                EndTime: FormatEndDate
            }
        });
        xhr = null;
    }
}
        
function SetModuleStatistics(){ 
        SM_FormatStartDate     = getDate(SM_StartDateModule);
        SM_EndDateModule       = new Date();
        SM_FormatEndDate       = getDate(SM_EndDateModule);
        SM_StartDateModuleMM   = SM_StartDateModule.getTime();
        SM_EndDateModuleMM     = SM_EndDateModule.getTime();
        SM_DifferenceInSec     = SM_EndDateModuleMM - SM_StartDateModuleMM;

    /* Valida si el tiempo de vista del modulo esta en un rango de tiempo coherente */
    if(Math.abs(SM_DifferenceInSec) > SM_MinSeconds){

        xhr = $.ajax({
            cache: false,
            type: 'POST',
            url: ServerSource + 'Core/Controllers/Statistics.php',
            data: {
                Option: 'Modules',
                CurrentModule: CurrentModule,
                MacAddress: MacAddress,
                LocationId: Device['LocationId'],
                StartTime: SM_FormatStartDate,
                EndTime: SM_FormatEndDate
            }
        });
        xhr = null;
    }
}
function updateDataModule(Module){
    //alert(Module);
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: './././Core/Controllers/DevicesStatus.php',
        data: { 
            Option : 'updateDataModules',
            MacAddress : MacAddress,
            LastModule: parseInt(Module)
        }
    });
    xhr = null;
}
function SetMoviesStatistics(){
    MM_FormatStartDate    = getDate(MM_StartDateMovie);
    MM_EndDateMovie       = new Date();
    MM_FormatEndDate      = getDate(MM_EndDateMovie);
    MM_StartDateMovieMM   = MM_StartDateMovie.getTime();
    MM_EndDateMovieMM     = MM_EndDateMovie.getTime();
    MM_DifferenceInSec    = MM_EndDateMovieMM - MM_StartDateMovieMM; 

    /* Valida si el tiempo de vista del modulo esta en un rango de tiempo coherente */
    if(Math.abs(MM_DifferenceInSec) > MM_MinSeconds){
        xhr = $.ajax({
            cache: false,
            type: 'POST',
            url: ServerSource + 'Core/Controllers/Statistics.php',
            data: {
                Option: 'Movies',
                CurrentMovie: CurrentMovie,
                MacAddress: MacAddress,
                LocationId: Device['LocationId'],
                StartTime: MM_FormatStartDate,
                EndTime: MM_FormatEndDate
            }
        });
        xhr = null;
    }
}

    
// Funciones genericas

/* */

function ShowStars(StarsText){
    var Index = 0,
        StarsNumber = 0,
        Icons = ' ';

    if(StarsText !== null){

        if(StarsNumber > 1){
            for(Index = 0; Index < StarsNumber; Index++){
                Icons += "<i class='fa fa-star'></i>";
            }
        } else if(StarsNumber === 0){
            //Do nothing
        } else  {
            for(Index = 0; Index < StarsText.length; Index++){
                Icons += "<i class='fa fa-star'></i>";
            }
        }
    }

    return Icons;
}

function getDate(seDate){
    rDate = seDate.getFullYear() + '-' + twoDigits((seDate.getMonth()+1)) + '-' + twoDigits(seDate.getDate()) + ' ' + twoDigits(seDate.getHours()) + ':' + twoDigits(seDate.getMinutes()) + ':' + twoDigits(seDate.getSeconds());
    return rDate;
}

function twoDigits(d) {
    if(0 <= d && d < 10) return '0' + d.toString();
    if(-10 < d && d < 0) return '-0' + (-1*d).toString();
    return d.toString();
}

/* Suma dias a una fecha */ 
function AddDays(days) {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
}

function AddDaysFormat(days){
    var nowPlusOneDay = moment().add(days, 'days');
    var nowPlusOneDayStr = nowPlusOneDay.format('MMM, DD');
    return nowPlusOneDayStr;
}
    
/*
 * Funcion utilizada para obtener la hora actual en le cliente
 *                      ¡¡¡ OJO !!!
 * Este metodo solo es funcional para la EPG, ya que devielve la hora
 * en funcion de cada 30 min. Es decir, si son las 14:15 devolvera 14:00,
 * so son las 14:45 devolvera 14:30 y asi...
 */
function GetCurrentHour(){

    var GDate = new Date();
    var CurrentHour = GDate.getHours(),
        CurrentMinute = '';
        
    //alert(GDate.getHours());
    if(GDate.getMinutes() > 30){
        CurrentMinute = '30';
    }else{
        CurrentMinute =  '00';
    }
    if(CurrentHour < 10){
        CurrentHour = '0'+CurrentHour;
    }
    var Hour = CurrentHour+':'+CurrentMinute;
    GDate = null;
    CurrentMinute = null;
    CurrentHour = null;
    return Hour;
}
    
/*
 * Funcion de busqueda del indice de la hora actual dentro del arreglo de horas
 * Parametros:
 * hour: La hora actual al momento de consultar
 */
function FindCurrentHour(hour){
    var Result = 0,
        i = 0;
    for(i = 0; i < Hours.length; i++){
        if(Hours[i][0] === hour){
            Result = i;
            i = Hours.length;
        }
    }
    return Result;
}

/*
 * Funcion para comparar horas dentro de la EPG. Esta funcion se encarga de validar
 * si Hour1 es mayor o menor que Hour2.
 * Parametros:
 * Hour1: Hora inicial a comparar
 * Hour2: Hora final a comparar
 * Retornos:
 * Los valores a retornar pueden ser >, < ó =; Los cuales se utilizaran como indicadores
 * para hacer comparaciones.
 */
function CompareHours(Hour1, Hour2){

    //console.log('CompareHours -----------> Recibiendo Hour1= '+Hour1+ ' Hour2= ' +Hour2);
    
    
    var Result = '',
        Minut1 = Hour1.split(':')[1],
        Hours1 = Hour1.split(':')[0],
        Minut2 = Hour2.split(':')[1],
        Hours2 = Hour2.split(':')[0];

        Minut1 = parseInt(Minut1,10);
        Hours1 = parseInt(Hour1,10);
        Minut2 = parseInt(Minut2,10);
        Hours2 = parseInt(Hour2,10);
        
        //console.log(Hours1+' - '+Minut1);
        //console.log(Hours2+' - '+Minut2);
    if(Minut1 >= 25 && Minut1 <=29){
        Minut1 = 30;
    }
        
    if(Minut1 >= 55 && Minut1 <=59){
        Minut1 = 60;
    }

    
    ////Debug('CompareHours -----------> Hora1: '+Hour1.substr(0,2)+' Minuto1: '+Hour1.substr(3,2)+' Hora2: '+Hour2.substr(0,2)+' Minuto2: '+Hour2.substr(3,2));
    if(Hours1 > Hours2){
        //console.log('CompareHours -----------> if(Hours1 > Hours2) '+Hours1+ ' > ' +Hours2);
        Result = '>';
    }else if(Hours1 < Hours2){
        //console.log('CompareHours -----------> else if(Hours1 < Hours2) '+Hours1+ ' < ' +Hours2);
        Result = '<';
    }else if(Hours1 == Hours2 && Minut1 > Minut2){
        //console.log('CompareHours -----------> else if(Hours1 == Hours2 && Minut1 > Minut2) '+Hours1+':'+Minut1+ ' > ' +Hours2+':'+Minut2);
        Result = '>';
    }else if(Hours1 == Hours2 && Minut1 < Minut2){
        //console.log('CompareHours -----------> else if(Hours1 == Hours2 && Minut1 < Minut2) '+Hours1+':'+Minut1+ ' < ' +Hours2+':'+Minut2);
        Result = '<';
    }else if(Hours1 == Hours2 && Minut1 == Minut2){
        //console.log('CompareHours -----------> else if(Hours1 == Hours2 && Minut1 == Minut2) '+Hours1+':'+Minut1+ ' = ' +Hours2+':'+Minut2);
        Result = '=';
    }
    //console.log('Result '+ Result);

    Minut1 = null;
    Hours1 = null;
    Minut2 = null;
    Hours2 = null;

    return Result;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/* Funcion utilizada para dar formato de 12 hrs a las horas de la EPGv*/
function FormatHours(Hour){
    var Minute = Hour.substr(3,2), Hour = parseInt(Hour.substr(0,2), 10), ActualHour = '';
    if(Hour >= 12){
        if(Hour > 12){
            ActualHour = (Hour-12)+':'+Minute+' pm';
        }else{
            ActualHour = Hour+':'+Minute+' pm';
        }
    }else{
        if(Hour === 0){
            Hour = 12;
        }
        ActualHour = Hour+':'+Minute+' am';
    }
    Minute = Hour = null;
    return ActualHour;
}

function TimeConvert(n) {
    var num = n,
        hours = (num / 60),
        rhours = Math.floor(hours),
        minutes = (hours - rhours) * 60,
        rminutes = Math.round(minutes);

    if(num !== ''){
        if(n > 60){
            return rhours + ' hrs ' + rminutes + ' min';
        } else {
            return num + ' min';
        }
    } else {
        return '';
    }
}

function SecondsToTime(time) {
        var hr = ~~(time / 3600),
            min = ~~((time % 3600) / 60),
            sec = time % 60,
            sec_min = '',
            hrs = 0;
    
        if (hr > 0) {
            sec_min += '' + hrs + 'h ' + (min < 10 ? '0' : '');
        }
        sec_min += '' + min + ':' + (sec < 10 ? '0' : '');
        sec_min += '' + sec;
        return sec_min+ ' min';
}
    
///**/

function secondsToString(seconds) {
    var hour = Math.floor(seconds / 3600);
    hour = (hour < 10)? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    return hour + ' h ' + minute + ' min';
}


function Time12to24(time12h){
    var time     = time12h.split(' '),
        modifier = time[1],
        times    = time[0].split(':'),
        hours    = times[0],
        minutes  = times[1].split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'pm') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return hours+':'+minutes;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function ConvertToHourEpoch(time24){

    var times    = time24.split(':'),
        Hours    = times[0],
        Minutes  = times[1];

    var HourNumber = parseInt(Hours);
        
        HourNumber -= Math.abs(17);
        
    return pad(HourNumber,2)+''+Minutes;
}

    
function GetWeather(){
    xhr = $.ajax({
        cache: false,
        type: 'GET',
        url: ServerSource + 'Core/Controllers/Weather.php',
        success: function (response) {
            ObjectWeather = JSON.parse(response);
            SetIcon();
        }
    });
    xhr = null;
    
}

function SetIcon(){
    if(CurrentModule === 'Menu'){
        var skycons = new Skycons({
            'color': '#fff'
        });
    } else {
        var skycons = new Skycons({
            'color': '#EEB462'
        });
    }

    skycons.add('WeatherIcon', ObjectWeather.Icon);
    $('#WeatherSummary').text(ObjectWeather.Summary);
    $('#WeatherFarenheit').html(String(Math.round(ObjectWeather.Temperature)));
    $('#WeatherCelsius').html(String(toCelsius(ObjectWeather.Temperature)));
}
   
function toCelsius(f) {
    var x = (5/9) * (f-32);
    return Math.round(x);
}

var ErrorLoadGuide = 1;

function SetLog(LogNumber){
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: ServerSource + 'Core/Controllers/Log.php',
        data: { 
            MacAddress : MacAddress,
            LogNumber : LogNumber,
            CurrentModule: CurrentModule
        }
    });
    xhr = null;
}
/*--------------New Digital Channel--------------*/
function getInfoFromServer(option) { 
    var aux = null;
    switch (option) {
        case 'getVideos':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'Videos.php',
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
                url: 'http://' + ServerIp +sourceController+'DigitalAudios.php',
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
                url: 'http://' + ServerIp +sourceTvController+'PY.php',
                data: { 
                    Option    : 'GetDigitalMediaType',
                }, 
                async: false,
                success: function (response) {
                    DmediaType  = $.parseJSON(response);
                    aux         = DmediaType;
                }
              });
        break;
        case 'getDigitalImageInterval':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceTvController+'PY.php',
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
        case 'getWeatherForecast':
            $.ajax({
                type: "GET",
                url: 'http://' + ServerIp +sourceController+'weatherForecast.php',
                async: false,
                success: function (response) {
                    VideosList  = $.parseJSON(response);
                    aux         = VideosList;
                }
            });
        break;
        case 'getWeatherAudio':
            $.ajax({
                type: "POST",
                url: 'http://' + ServerIp +sourceController+'WeatherAudios.php',
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
    }
    return aux;
}
function getDevice(){
    var device = 'explorador';
    if (typeof(ASTB) !== 'undefined') {
        device = 'amino';
    } else if (typeof(ENTONE) !== 'undefined') {
        device = 'kamai';
    } else if (typeof(gSTB) !== 'undefined'){
        device = 'infomir';
    }  else if (window.tizen !== undefined) {
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
function playMultimedia(device, videosList, position) {
    var videoName           = videosList[position]['VIDEO'].split('/'),
        videoName           = videoName[9],
        videoSource         = '/BBINCO/Admin/Views/Assets/DigitalChannelVideos/', 
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
            var videoContent        = document.getElementById('digitalVideoContent');
                videoContent.style.display = 'inline';
                videosListLenght    = videosList.length-1;
                position            = 0;
                videoName           = videosList[position]['VIDEO'].split('/');
                videoName           = videoName[9];
                videoSource         = '/BBINCO/Admin/Views/Assets/DigitalChannelVideos/';
                serverVideoSource   = 'http://172.16.0.103/';
                source              = serverVideoSource+videoSource+videoName;
                videoContent.src    = source;
                $("#digitalVideoContent").on('ended', function(){
                  if ( videosListLenght== position){
                    position  = 0;
                    videosList  = getInfoFromServer('getDigitalVideos');
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
            PlayVideo(source);
        break;
    }
}
function changeImageFromDigitalChannel() {
    var imagesList                  = getInfoFromServer('getDigitalImages'),
        imageContent                = document.getElementById('ImageDigitalChannel'),
        imagesListLength            = imagesList.length-1, 
        interval                    = getInfoFromServer('getDigitalImageInterval'),
        interval                    = interval[0]['Interval'];
        if (positionDigitalChannelImage === imagesListLength) {
            positionDigitalChannelImage = 0;
            // imagesList          = getInfoFromServer('getDigitalImages');
            // imagesListLength    = imagesList.length-1; 
            // interval            = getInfoFromServer('getDigitalImageInterval');
            // interval            = interval[0]['Interval'];
        }else{
            positionDigitalChannelImage = positionDigitalChannelImage+1;
        }
        var x                           = makeid(5);
            imageName                   = imagesList[positionDigitalChannelImage]['IMG'].split('/');
            imagePath                   = sourceImages+imageName[10];
            imageContent.src            = 'http://' + ServerIp + imagePath+'?t='+x;
        // x = makeid(5);
        // imageName = imagesList[position]['IMG'].split('/');
        // imagePath = sourceImages+imageName[10];
        // imageContent.src = imagePath+'?t='+x;
        console.log('Image: '+imagePath+'?t='+x);
        imageDLLInterval = setTimeout(function(){
            changeImageFromDigitalChannel();
        }, interval*1000);
}
function playImages(device,audiosList) {
    switch (device) {
        case 'amino':
            var   imageContent                = document.getElementById('ImageDigitalChannel');
                  imageContent.style.display  = 'inline';
            // var imagesList                  = getInfoFromServer('getDigitalImages'),
            //     imagesListLength            = imagesList.length-1; 
            //     interval                    = getInfoFromServer('getDigitalImageInterval'),
            //     interval                    = interval[0]['Interval'],
            //     imageContent                = document.getElementById('ImageDigitalChannel'),
            //     imageContent.style.display  = 'inline';
            //     position                    = 0;
            // var  x                          = makeid(5);
            //      imageName = imagesList[position]['IMG'].split('/');
            //      imagePath = sourceImages+imageName[10];
            //      imageContent.src = imagePath+'?t='+x;
            // Debug('Image: '+imagePath+'?t='+x);
            // imageDLLInterval = setInterval(function () {
            //     if (position === imagesListLength) {
            //         position = 0;
            //         imagesList          = getInfoFromServer('getDigitalImages');
            //         imagesListLength    = imagesList.length-1; 
            //         interval            = getInfoFromServer('getDigitalImageInterval');
            //         interval            = interval[0]['Interval'];
            //     }else{
             
            //         position = position+1;
            //     }
            //     x = makeid(5);
            //     imageName = imagesList[position]['IMG'].split('/');
            //     imagePath = sourceImages+imageName[10];
            //     imageContent.src = imagePath+'?t='+x;
            //     Debug('Image: '+imagePath+'?t='+x);
            // },interval*1000);
            changeImageFromDigitalChannel();
            setTimeout(function(){
                playAudio('amino', audiosList, 0);
            },1500);  
        break;
        case 'explorador':
            var   imageContent                = document.getElementById('ImageDigitalChannel');
                  imageContent.style.display  = 'inline';
            changeImageFromDigitalChannel();
            // var imagesList                  = getInfoFromServer('getDigitalImages'),
            //     imagesListLength            = imagesList.length-1; 
            //     interval                    = getInfoFromServer('getDigitalImageInterval'),
            //     interval                    = interval[0]['Interval'],
            //     imageContent                = document.getElementById('ImageDigitalChannel'),
            //     imageContent.style.display  = 'inline';
            //     position                    = 0;
            // var  x                          = makeid(5);
            //      imageName = imagesList[position]['IMG'].split('/');
            //      imagePath = sourceImages+imageName[10];
            //      imageContent.src = imagePath+'?t='+x;
            // console.log('Image: '+imagePath+'?t='+x);
            // imageDLLInterval = setInterval(function () {
            //     if (position === imagesListLength) {
            //         position = 0;
            //         imagesList          = getInfoFromServer('getDigitalImages');
            //         imagesListLength    = imagesList.length-1; 
            //         interval            = getInfoFromServer('getDigitalImageInterval');
            //         interval            = interval[0]['Interval'];
            //     }else{
            //         position = position+1;
            //     }
            //     x = makeid(5);
            //     imageName = imagesList[position]['IMG'].split('/');
            //     imagePath = sourceImages+imageName[10];
            //     imageContent.src = imagePath+'?t='+x;
            //     console.log('Image: '+imagePath+'?t='+x);               
            // },interval*1000);
        break;
        case  'kamai':
            var imagesList                  = getInfoFromServer('getDigitalImages'),
                imagesListLength            = imagesList.length-1; 
                interval                    = getInfoFromServer('getDigitalImageInterval'),
                interval                    = interval[0]['Interval'],
                imageContent                = document.getElementById('ImageDigitalChannel'),
                imageContent.style.display  = 'inline';
                position                    = 0;
            var  x                          = makeid(5);
                 imageName = imagesList[position]['IMG'].split('/');
                 imagePath = sourceImages+imageName[10];
                 imageContent.src = imagePath+'?t='+x;
            Debug('Image: '+imagePath+'?t='+x);
            imageDLLInterval = setInterval(function () {
                if (position === imagesListLength) {
                    position = 0;
                    imagesList          = getInfoFromServer('getDigitalImages');
                    imagesListLength    = imagesList.length-1; 
                    interval            = getInfoFromServer('getDigitalImageInterval');
                    interval            = interval[0]['Interval'];
                }else{
             

                    position = position+1;
                }
                x = makeid(5);
                imageName = imagesList[position]['IMG'].split('/');
                imagePath = sourceImages+imageName[10];
                imageContent.src = imagePath+'?t='+x;
                Debug('Image: '+imagePath+'?t='+x);
            },interval*1000);
            setTimeout(function(){
                playAudio('kamai', audiosList, 0);
            },1500); 
        break;
        case 'samsung':
            var   imageContent                = document.getElementById('ImageDigitalChannel');
                  imageContent.style.display  = 'inline';
            // var imagesList                  = getInfoFromServer('getDigitalImages'),
            //     imagesListLength            = imagesList.length-1; 
            //     interval                    = getInfoFromServer('getDigitalImageInterval'),
            //     interval                    = interval[0]['Interval'],
            //     imageContent                = document.getElementById('ImageDigitalChannel'),
            //     imageContent.style.display  = 'inline';
            //     position                    = 0;
            // var  x                          = makeid(5);
            //      imageName = imagesList[position]['IMG'].split('/');
            //      imagePath = sourceImages+imageName[10];
            //      imageContent.src = imagePath+'?t='+x;
            // Debug('Image: '+imagePath+'?t='+x);
            // imageDLLInterval = setInterval(function () {
            //     if (position === imagesListLength) {
            //         position = 0;
            //         imagesList          = getInfoFromServer('getDigitalImages');
            //         imagesListLength    = imagesList.length-1; 
            //         interval            = getInfoFromServer('getDigitalImageInterval');
            //         interval            = interval[0]['Interval'];
            //     }else{
            
            //         position = position+1;
            //     }
            //     x = makeid(5);
            //     imageName = imagesList[position]['IMG'].split('/');
            //     imagePath = sourceImages+imageName[10];
            //     imageContent.src = imagePath+'?t='+x;
            //     Debug('Image: '+imagePath+'?t='+x);
            // },interval*1000);
            changeImageFromDigitalChannel();
            setTimeout(function(){
                playAudio('samsung', audiosList, 0);
            },1500);  
        break;
    }
}
function playAudio(device, audiosList, position){
    var audioName           = audiosList[position]['AUDIO'].split('/');
        audioName           = audioName[9];
    var audioSource         = 'BBINCO/Admin/Views/Assets/DigitalAudio/',
        serverAudioSource   = 'http://10.0.3.241/',
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
function newDigitalChannel(){
    $(function() {
        PlayingChannel = true;
        PlayDigita     = false;
        var  videosList                      = getInfoFromServer('getDigitalVideos');                        
        var  audiosList                      = getInfoFromServer('getDigitalAudios');
        var  device                          = getDevice();
        var  digitalMediaType                = getInfoFromServer('getDigitalMediaType'); 
            if (digitalMediaType[0]['digitalMediaType'] === 'images') {
                playImages(device, audiosList);
                digitalMediaTypeToPlay = 'images';
            }else if (digitalMediaType[0]['digitalMediaType'] === 'videos'){
                playMultimedia(device, videosList, 0);
                digitalMediaTypeToPlay = 'videos';
            } 
            ShowInfo();
    });  
}
function cleanVideoImage(){
    var imageContent                = document.getElementById('ImageDigitalChannel');
        imageContent.src            = '';      
        imageContent.style.display  = 'none';
    var weatherContent               = document.getElementById('weatherChannel');
        weatherContent.style.display = 'none';
    Debug('Interval: '+imageDLLInterval);
    if (imageDLLInterval != null) {
        if (imageDLLInterval[0] != undefined) {
            var aux = imageDLLInterval[0]['Interval'];
            console.log(imageDLLInterval[0]);
            clearInterval(aux);
            imageDLLInterval = null;
        }else {
            clearInterval(imageDLLInterval);
            imageDLLInterval = null;
        }
    }
    console.log(playingWeatherChannel);
    if (playingWeatherChannel != null) {
        // clearInterval(playingWeatherChannel);
        clearTimeout(playingWeatherChannel);
        playingWeatherChannel = null;
    }
}
/*-----------------------------------------------*/

/*--------------Weather Channel------------------*/
function playWeatherAudio(device, audiosList, position){
    var audioName           = audiosList[position]['AUDIO'].split('/');
        audioName           = audioName[9];
    var audioSource         = 'BBINCO/Admin/Views/Assets/AudioWeatherChannel/',
        serverAudioSource   = 'http://10.0.3.241/',
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
    }
}
function refreshWeatherInfo(){
        var actualMinute                        = actualDate.getMinutes();
            actualDate                          = new Date();
            weatherHourTitle.innerHTML          = formatAMPM(actualDate);
            weatherInfo                         = getInfoFromServer('getWeatherForecast');
            weatherTemperatureToday.innerHTML   = weatherInfo[0]['temp']+' C°';
            weatherReport.innerHTML             = weatherInfo[0]['weather'];
            rainInfo.innerHTML                  = weatherInfo[0]['precip']+' %';
            wetInfo.innerHTML                   = weatherInfo[0]['dewpt']+' %';
            weatherIconToday.src                = ServerSource+'Media/WeatherChannel/'+getWeatherIcon(weatherInfo[0]['weatherCode']);
            // console.log('refrescado: '+formatAMPM(actualDate));
            Debug('refrescado: '+formatAMPM(actualDate));
            playingWeatherChannel = setTimeout(function(){
                refreshWeatherInfo();
            }, 60000);

}
function weatherChannel(){
    $(function() {
        var  deviceAux                       = getDevice();
        var  audiosList                      = getInfoFromServer('getWeatherAudio');
             if (deviceAux == 'explorador') {
                var video = document.getElementById("digitalVideoContent");
                    video.pause();
                    video.currentTime = 0;
                    video.style.display = 'none';
             }
            digitalMediaTypeToPlay = null;
            StopVideo();
            // playWeatherAudio(deviceAux, audiosList,0);
            weatherContent.style.display        = 'inline';
            PlayingChannel                      = true;
            PlayDigita                          = false;
            refreshWeatherInfo();
            ShowInfo();
    }); 
}
function getWeatherIcon(code){
    var weatherIconArray= [
        {
            "200": "heavyRain.png",
            "201": "heavyRain.png",
            "202": "heavyRain.png",
            "230": "heavyRain.png",
            "231": "heavyRain.png",	
            "232": "heavyRain.png",	
            "233": "heavyRain.png",	
            "300": "heavyRain.png",	
            "301": "heavyRain.png",	
            "302": "heavyRain.png",	
            "500": "heavyRain.png",	
            "501": "heavyRain.png",	
            "502": "heavyRain.png",	
            "511": "heavyRain.png",	
            "520": "heavyRain.png",	
            "521": "heavyRain.png",	
            "522": "heavyRain.png",	
            "600": "heavyRain.png",	
            "601": "heavyRain.png",	
            "602": "heavyRain.png",	
            "610": "heavyRain.png",	
            "611": "ventoso.png",	
            "612": "ventoso.png",	
            "621": "heavyRain.png",	
            "622": "heavyRain.png",	
            "623": "heavyRain.png",	
            "700": "cloudy.png",	
            "711": "cloudy.png",	
            "721": "cloudy.png",	
            "731": "cloudy.png",	
            "741": "cloudy.png",	
            "751": "cloudy.png",	
            "800": "sunny.png",	
            "801": "sunny.png",	
            "802": "nublado.png",	
            "803": "nublado.png",	
            "804": "superNublado.png",	
            "900": "heavyRain.png",
        }
    ]
    return weatherIconArray[0][code];
}
function fillWeatherIcons(){
    var aux = actualDate.getDay();
    for (var index = 0; index < forecastDaysTitleChildren.length; index++) {
        if (aux >= days.length-1) {
            aux = 0;
        }else{
            aux= aux+1;
        }
        forecastDaysTitleChildren[index].innerHTML  = days[aux].substring(0, 3);
    var imgIcon                                     = forecastDaysIconChildren[index].querySelectorAll('img');
        imgIcon[0].src                              = ServerSource+'Media/WeatherChannel/'+getWeatherIcon(weatherInfo[index]['weatherCode']); 
    var maxAndMinTemperature                        = forecastDaysTemperatureChildren[index].querySelectorAll('span');
        maxAndMinTemperature[0].innerHTML           = weatherInfo[index]['max_temp']+' C°';
        maxAndMinTemperature[1].innerHTML           = weatherInfo[index]['min_temp']+' C°';
    var realFeelContainer                           = forecastDaysRealFeelChildren[index].querySelectorAll('div');
    var realFeelSpan                                = realFeelContainer[1].querySelectorAll('span');
        realFeelSpan[0].innerHTML                   = weatherInfo[index]['app_max_temp'];
    }
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  
/*-----------------------------------------------*/