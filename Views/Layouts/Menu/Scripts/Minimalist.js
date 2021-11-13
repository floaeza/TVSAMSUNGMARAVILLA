// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Enero 2020
 * @Tipo: Controla el menu
 */


window.history.forward(1);
var MenuListNodes   = document.getElementsByClassName('MenuList');
//MenuSelected    = document.getElementById('MenuSelected'),
//BackgroundsNodes = '';
var ImagesUrl   = ServerSource+'Media/Menu/',
FormatDate      = '',
FormatHour      = '',
MenuList        = '',
MenuIndex       = 0,
IndexM = null;

function SetMenuList(){
    MenuList = null;
    $.ajax({
        type: 'POST',
        cache: false,
        url: ServerSource + 'Core/Controllers/Menu.php',
        data: { 
            Option : 'GetModules',
            ProjectId: '1'
            //ProjectId: Device['Services']['ProjectId']
        },
        success: function (response){
            MenuList = $.parseJSON(response);
            SetMenuInfo();
        }
    });
   
    
}
SetMenuList();
GetWeather();
//SetMenuInfo()

function SetMenuInfo(){
    ((MenuIndex - 1) >= 0)?MenuListNodes[0].textContent = MenuList[MenuIndex-1].Name : MenuListNodes[0].textContent = MenuList[MenuList.length -1].Name;
    MenuListNodes[1].textContent = MenuList[MenuIndex].Name;
    ((MenuIndex + 1) <= (MenuList.length-1))?MenuListNodes[2].textContent = MenuList[MenuIndex+1].Name : MenuListNodes[2].textContent = MenuList[0].Name;
}
/*******************************************************************************
* MOVIMIENTOS FLECHAS EPG
*******************************************************************************/

function MenuOk(){
    if(MenuList[MenuIndex].Url !== 'menu.php'){
        //Page, ModuleId, ChangeModule
        GoPage(MenuList[MenuIndex].Url, MenuList[MenuIndex].Id, MenuList[MenuIndex].Name);
    }
}

function MenuRight(){
    //MenuSelect('RIGHT');
    MenuIndex++;
    if(MenuIndex > MenuList.length - 1){
        MenuIndex = 0;
    }
    SetMenuInfo();
}

function MenuLeft(){
    //MenuSelect('LEFT');
    MenuIndex--;
    if(MenuIndex < 0){
        MenuIndex = MenuList.length - 1;
    }
    SetMenuInfo();
}

function MenuDown(){

}

function MenuUp(){

}