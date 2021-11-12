var isCalled = $("#myplugin_main").length > 0;
var searchLang = "All";
var searchSlider = null;
var searchNameConditionList = [];
var searchLevelConditionList = [];

if(isCalled){
    alert("你已經開啟了 Hiroba Plugin， 請F5重開頁面。");
} else {
    if (window.location.href.indexOf("score_list") > 0) {
        callOtherJsFile("https://hiroba-plugin.github.io/js/rSlider.min.js");
        callOtherCssFile("https://hiroba-plugin.github.io/css/rSlider.min.css");
        setuploadingBar();
        resetTabList();
        // fetchcall();
        addUseCount();
        createMainArea();
        scoreListFilter();
        searching();
    }
}

function callOtherJsFile(url){
    javascript:var scriptElm = document.createElement('script'); scriptElm.type = 'text/javascript'; scriptElm.src = url; document.head.appendChild(scriptElm);
}
function callOtherCssFile(url){
    javascript:var scriptElm = document.createElement('link'); scriptElm.type = 'text/css'; scriptElm.rel ="stylesheet"; scriptElm.href = url; document.head.appendChild(scriptElm);
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
    $("#myplugin_search_bar").remove();
    var buttonsHtml = "<div id='myplugin_search_bar' style='display: grid;grid-template-columns: 25% 72%;position: fixed;bottom: 0;z-index: 1;background: #FF7F00;padding: 4px;width: 292px;'>"+
    "<select name='searchLang' id='searchLang'>" +
    "<option value='All'>全部</option>" +
    "<option value='jp'>日文</option>" +
    "<option value='en'>英文</option>" +
    "</select>" +
    "<input id='searchInput' placeholder='請輸入歌名 Please type song name' style='width:100%; margin:4px; border-radius: 4px;'type='text'>";
    buttonsHtml += "</div>";

    $('#myplugin_main').append(buttonsHtml);

    $('#searchLang').on('change', function() {
       searchLang= this.value;
    });
    
    $("#myplugin_search_bar input").keyup(function(){
        searchNameConditionList = [];
        let searchText = $(this).val();
        if(searchText != ""){
            $(".contentBox").each(function( index){
                var searchCondition = true;
                switch(searchLang){
                    case "All":
                        searchCondition = $(this).find("div").find(".jp").html().toUpperCase().indexOf(searchText.toUpperCase()) >= 0 ||
                        $(this).find("div").find(".en").html().toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
                    break;
                    case "jp":
                        searchCondition = $(this).find("div").find(".jp").html().toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
                    break;
                    case "en":
                        searchCondition = $(this).find("div").find(".en").html().toUpperCase().indexOf(searchText.toUpperCase()) >= 0;

                    break;
                }
                searchNameConditionList.push(searchCondition);
                
            });
        } else {
            $(".contentBox").each(function( index){
                $(this).show();
            });
        }
        searchFunction();
    });
}
function searchFunction(){
    $(".contentBox").each(function( i,v){
        console.log(searchNameConditionList[i] , searchLevelConditionList[i])
        let searchInput = $("#searchInput").val();
        if((searchInput == '' && searchLevelConditionList[i]) || (searchNameConditionList[i] && searchLevelConditionList[i])){
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function filterLevel(){
    $("#myplugin_filter_bar").remove();
    var buttonsHtml = "<div id='myplugin_filter_bar' style='position: fixed;bottom: 0;z-index: 1;background: #FF7F00;padding: 4px;width: 292px;margin-bottom:43px;height:50px;'>";
    buttonsHtml += '<div class="slider-container">';
    buttonsHtml += '<input type="text" id="searchSlider" class="slider" style="display: none;">';
    buttonsHtml += '</div>';
	
	buttonsHtml += "</div>";
    $('#myplugin_main').append(buttonsHtml);
	
	searchSlider = new rSlider({
		target: '#searchSlider',
		values: {min: 1, max: 10},
		step: 1,
		range: true,
		set: [1, 10],
		scale: true,
		labels: false,
		onChange: function (vals) {
            searchLevelConditionList = [];
			var valsArr = vals.split(',');
			console.log(valsArr);
			$(".contentBox").each(function( index,v){
				var level =  $(v).find(".levelShow").find(".buttonList").find("li:nth-child(4)").attr("data-level");
				if( parseInt(level) < parseInt(valsArr[0]) || parseInt(level) > parseInt(valsArr[1]) ){
                    searchLevelConditionList.push(false);
				} else {
                    searchLevelConditionList.push(true);
                }
            });
            searchFunction();
		}
    });

    document.addEventListener('searchSlider',function(e){
        console.log(123);
    },false);
}

function scoreListFilter(){
    $("#myplugin_main").html("");

    var countDonderFull = 0;
    var countGold = 0;
    var countSilver = 0;
    var countPlayed = 0;
    var countNone = 0;
    
    var buttonsHtml = "<div id='myplugin_crown_buttons'  style='display: grid;grid-template-columns: 50% 50% ;'>";
    buttonsHtml += "<button name='crown_filter' data-crown='all' style='margin:4px;padding:8px 12px;'>全部</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='donderfull' style='margin:4px;padding:8px 12px;'>全良</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='gold' style='margin:4px;padding:8px 12px;'>全接</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='silver' style='margin:4px;padding:8px 12px;'>合格</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='played' style='margin:4px;padding:8px 12px;'>不合格</button>";
    buttonsHtml += "<button name='crown_filter' data-crown='none' style='margin:4px;padding:8px 12px;'>未遊玩</button>";
    buttonsHtml += "</div>";
    $('#myplugin_main').append(buttonsHtml);

    $('[name="crown_filter"]').click(function(){
        crownFilter($(this).data('crown'));
        searchSlider.setValues(1, 10);
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
        $("#searchInput").val("");
        $(".contentBox").each(function( index){
            $(this).show();
            if(crown != "all" && crownList[index].crown != crown){
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
        // contentType : 'application/json; charset=utf-8', // 要送到server的資料型態

        success: function(result)
        {
            if(result["success"] == true){

                $("#tabList").html(result["tabList"]);
                $("#songList").html(result["songList"]);
                $(".selectTab a").removeAttr("href"); 
                changeSongList();
                changeSongListFunction(1);
            } else if(result["success"] == false){
                resetTabList();
            }
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
    // console.log("changeSongList");

    $(".selectTab").click(function(){
        changeSongListFunction($(this).data("id"));
    });
}
function changeSongListFunction(genre){
    // console.log("clicked");
    $.ajax({url:'https://hkitguy.info/TaikoScore/useCount/test',
        data: { taiko_ban: getToken(), genre: genre, token: getCookie("_token_v2") },
        type: 'POST',
        async: true, 
        cache: true, 
        dataType: "json",
        success: function(result)
        {
            // console.log(result);
            $("#songList").html(result["songList"]);
            $songDataList = result["songData"];
            scoreListFilter();
            $("#loading").remove();
            $("#tab-genre" + genre + "> li").each(function(i,v){
                
                let songId = $(v).find(".buttonArea .buttonList li:nth-child(4) a").attr("href");
                let isUra = $(v).find(".songNameArea").hasClass("ura");
                songId = songId.split("?")[1];
                songId = songId.split("&")[0];
                songId = songId.split("=")[1];
                
                $(v).attr("data-songId",songId);
                
                var resultObject = search(isUra, songId, $songDataList);
                if(resultObject != null){

                    addLevelLayout(isUra, v, resultObject);
                    $(v).find(".songNameArea").append('<span style="color:#ffffff" class="songName songNameFontnamco en">'+ resultObject.song_name_en +'</span>');
                    
                    $(".songNameArea .songName:nth-child(1)").each(function(i,v){
                        $(this).addClass("jp");
                    });
                    $(v).find(".songNameArea").css("display","inline-grid");
                }
                    
            });
            searching();
            filterLevel();
        }    
    });
}

function addLevelLayout(isUra, v,resultObject){
    if(isUra == 1){
        var html = "";
        html += "<div class='buttonArea levelSelect levelShow'>";
        html += "<ul class='buttonList'>";
        html += "<li>";
        html += "</li>";
        html += "<li>";
        html += "</li>";
        html += "<li>";
        html += "</li>";
        html += "<li data-level='"+resultObject.level_4+"' class='songNameFontjpop' style='color:white;'>";
        html += "★x"+resultObject.level_4;
        html += "</li>";
        html += "<ul>";
        html += "</div>";
    } else {

        var html = "";
        html += "<div class='buttonArea levelSelect levelShow'>";
        html += "<ul class='buttonList'>";
        html += "<li data-level='"+resultObject.level_1+"'  class='songNameFontjpop' style='color:white;'>";
        html += "★x"+resultObject.level_1;
        html += "</li>";
        html += "<li data-level='"+resultObject.level_2+"'  class='songNameFontjpop' style='color:white;'>";
        html += "★x"+resultObject.level_2;
        html += "</li>";
        html += "<li data-level='"+resultObject.level_3+"'  class='songNameFontjpop' style='color:white;'>";
        html += "★x"+resultObject.level_3;
        html += "</li>";
        html += "<li data-level='"+resultObject.level_4+"'  class='songNameFontjpop' style='color:white;'>";
        html += "★x"+resultObject.level_4;
        html += "</li>";
        html += "<ul>";
        html += "</div>";
    }


    $(v).append(html);
}

function search(isUra, nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        //console.log(myArray[i].song_id, nameKey,myArray[i].is_ura);
        if (myArray[i].song_id === nameKey) {
            
            if(isUra == 1){
                return myArray[i+1];
            } else {
                return myArray[i];
            }
        } else {
        }
    }
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