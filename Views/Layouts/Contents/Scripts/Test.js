    var MoviesList = [];
function GetMoviesList(){
    $.ajax({
    type: 'POST',
    async: false,
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
    Option : 'GetMoviesList'
    },
    success: function (response){
        MoviesList = $.parseJSON(response);
    }
    }); 
}
function init (){
    
    GetMoviesList();
    // console.log(MoviesList);
    
    var f = AVMedia.Play('src=http://192.168.0.121/vod/mvs/M00001/1917.mp4');

}
//setTimeout(init, 300);