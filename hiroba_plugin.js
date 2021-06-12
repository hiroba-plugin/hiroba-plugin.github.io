if (window.location.href.indexOf("score_list") > 0) {
    resetTabList();
    changeSongList();

    addUseCount();
    createMainArea();
    scoreListFilter();
    searching();
}
function getToken(){
    var taiko_ban = $(".scoretabArea").find(".scoretab").find("a").attr("href");
    taiko_ban = taiko_ban.split("?")[1];
    taiko_ban = taiko_ban.split("&")[1];
    taiko_ban = taiko_ban.split("=")[1];

    return taiko_ban;
}
function addUseCount(){
    let device = navigator.userAgent;
    $.ajax({url:'https://hkitguy.info/TaikoScore/useCount/add',
        data: { taiko_ban: getToken(), device: device },
        type: 'POST',
        success: function(result)
        {
            console.log(result);
        }   
    });         
}

function createMainArea(){
    let html = "<div id='myplugin_main'></div>";
    $(".tabList:nth-child(1)").after(html);
}

function searching(){
    var buttonsHtml = "<div id='myplugin_search_bar' style='position: fixed;bottom: 0;z-index: 1;background: #FF7F00;padding: 4px;width: 292px;'><input placeholder='請輸入歌名 Please type song name' style='width:278px; margin:4px; border-radius: 4px;'type='text'";
    buttonsHtml += "</div>";
    $('#myplugin_main').append(buttonsHtml);
    
    $("#myplugin_search_bar input").keyup(function(){
        let searchText = $(this).val();
        console.log(searchText);
        if(searchText != ""){
            $(".contentBox").each(function( index){
                if($(this).find("div").find("span").html().toUpperCase().indexOf(searchText.toUpperCase()) >= 0){
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $(".contentBox").each(function( index){
                $(this).show();
            });
        }
    });
}
function scoreListFilter(){
    var countDonderFull = 0;
    var countGold = 0;
    var countSilver = 0;
    var countPlayed = 0;
    var countNone = 0;
    
    var buttonsHtml = "<div id='myplugin_crown_buttons'  style='display: grid;grid-template-columns: 50% 50% ;'>";
    buttonsHtml += "<button name='crown_filter' data-crown='donderfull' style='margin:4px;padding:8px 12px;'>全良</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='gold' style='margin:4px;padding:8px 12px;'>全接</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='silver' style='margin:4px;padding:8px 12px;'>合格</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='played' style='margin:4px;padding:8px 12px;'>不合格</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='none' style='margin:4px;padding:8px 12px;'>未遊玩</button>";
    buttonsHtml += "</div>";
    $('#myplugin_main').append(buttonsHtml);

    $('[name="crown_filter"]').click(function(){
        crownFilter($(this).data('crown'));
        console.log($(this).data('crown'));
    });


    var songNameList = [];
    var crownList =[];

    $( ".songName").each(function( index){
        songNameList.push($(this).html());
    });

    $( ".buttonList li:nth-child(4) a img" ).each(function( index ) {
        let img = $(this).attr('src');
        var crownStatus = "";
        if(img.indexOf("donderfull") > 0){
            crownStatus = "donderfull";
            countDonderFull ++;
        } else if(img.indexOf("gold") > 0){
            crownStatus = "gold";
            countGold ++;
        } else if(img.indexOf("silver") > 0){
            crownStatus = "silver";
            countSilver ++;
        } else if(img.indexOf("played") > 0){
            crownStatus = "played";
            countPlayed ++;
        } else if(img.indexOf("none") > 0){
            crownStatus = "none";
            countNone ++;
        }
        crownList.push({'songName':songNameList[index],'crown':crownStatus});
    });

    $( '[name="crown_filter"]' ).each(function( index ) {
        switch($(this).data('crown')){
            case "donderfull":
                $(this).append('('+ countDonderFull + ')');
                break;
            case "gold":
                $(this).append('('+ countGold + ')');
                break;
            case "silver":
                $(this).append('('+ countSilver + ')');
                break;
            case "played":
                $(this).append('('+ countPlayed + ')');
                break;
            case "none":
                $(this).append('('+ countNone + ')');
                break;
        }
    });
    let remainingHtml = "<div style='color:#ffffff;margin:10px'>你還有" + (countSilver + countPlayed + countNone) + "金冠未拿取</div>";

    $('#myplugin_main').append(remainingHtml);

    function crownFilter(crown){
        $(".contentBox").each(function( index){
            $(this).show();
            if(crownList[index].crown != crown){
                $(this).hide();
            }
        });
    }
}
function resetTabList(){
    console.log("re" ,  window.location.href );
     $.ajax({url:'https://hkitguy.info/TaikoScore/useCount/resetTab',
        data: { token: getCookie("_token_v2"), url: window.location.href },
        type: 'POST',
        dataType: "json",
        success: function(result)
        {
            console.log(result);
            $("#tabList").html(result["tabList"]);
            $("#songList").html(result["songList"]);
            $(".selectTab a").removeAttr("href"); 
        }   
    });
}

function changeSongList(){
    console.log("changeSongList");

    $(".selectTab").click(function(){
        let genre = $(this).data("id");
        $.ajax({url:'https://hkitguy.info/TaikoScore/useCount/test',
            data: { taiko_ban: getToken(), genre: genre, token: getCookie("_token_v2") },
            type: 'POST',
            dataType: "json",
            success: function(result)
            {
                console.log(result);
                $("#songList").html(result["songList"]);
            }    
        });
    });
}


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}