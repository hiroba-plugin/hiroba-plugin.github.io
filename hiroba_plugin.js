if (window.location.href.indexOf("score_list") > 0) {
    setuploadingBar();
    resetTabList();
    // fetchcall();
    addUseCount();
    createMainArea();
    scoreListFilter();
    searching();
}
function setuploadingBar(){
     

    // $.ajaxSetup({ cache: false });
    let html = "<div id='loading' style='z-index:1;width:100%;height:100%;background:#000A;text-align:center;position: fixed;top: 0;'><img src='https://hkitguy.info/TaikoScore/public/storage/images/gifs/loading_hiroba01.gif' width='240' style='transform:translate(0, 60%);' ></img></div>"
    $("body").append(html);
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
    $("#myplugin_main").html("");

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
     $.ajax({url:'https://hkitguy.info/TaikoScore/useCount/resetTab',
        data: { taiko_ban: getToken(), token: getCookie("_token_v2") },
        type: 'POST',
        dataType: "json",
        // async: true, 
        // cache: true, 
        success: function(result)
        {
            $("#tabList").html(result["tabList"]);
            $("#songList").html(result["songList"]);
            $(".selectTab a").removeAttr("href"); 
            changeSongList();
            $("#loading").remove();
        },

        error:function (xhr, ajaxOptions, thrownError) {
            alert(JSON.stringify(xhr) + ' ' + getToken() + ' ' +  getCookie("_token_v2"));
            $("#loading").remove();
        }
    });
}
function fetchcall() {
    // (B1) GET FORM DATA
    var data = new URLSearchParams();
    data.append('taiko_ban', getToken());
    data.append('token', getCookie("_token_v2"));
   
    // (B2) FETCH
    fetch("https://hkitguy.info/TaikoScore/useCount/resetTab", {
      method: 'post',
      body: data
    })
    .then(function(response) {
        return response.json();
    })
    .then(function (result) {
        console.log( result);

        $("#tabList").html(result["tabList"]);
        $("#songList").html(result["songList"]);
        $(".selectTab a").removeAttr("href"); 
        changeSongList();
        $("#loading").remove();
    })
    .catch(function (error) {
        alert(JSON.stringify(error));
    });
    return false;
  }

function changeSongList(){
    console.log("changeSongList");

    $(".selectTab").click(function(){
        console.log("clicked");
        let genre = $(this).data("id");
        $.ajax({url:'https://hkitguy.info/TaikoScore/useCount/test',
            data: { taiko_ban: getToken(), genre: genre, token: getCookie("_token_v2") },
            type: 'POST',
            async: true, 
            cache: true, 
            dataType: "json",
            success: function(result)
            {
                console.log(result);
                $("#songList").html(result["songList"]);
                scoreListFilter();
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