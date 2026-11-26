/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/


var g_titleObj;

var g_partsList;
var g_codeListArray;

function call_runOnLoadProc()
{

	
	try{
		var mapCode = getURLParam("ewd");
		var mapType = getURLParam("ewd_type");
		

		try{
			g_titleObj = parent.getTitleObj();
			g_codeListArray = parent.g_codeListArray;
			g_partsList = parent.g_partsList;
		}
		catch(e){
			confirm("plist.js : parent is null : " + mapCode + ", " + mapType);
			g_titleObj = makeTitleObj(mapCode, mapType);
			g_codeListArray = makeCodeListArray( g_titleObj );
			g_partsList = makePartsList( g_titleObj, g_codeListArray );
		}
		

		showPartsList();
		

		var ewdItemCode = getURLParam("code");
		var ewdItemType = getURLParam("type");
		if( ewdItemCode != null ){
			ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
			setSelectedItemStyleByCode(ewdItemCode, ewdItemType);
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}

function call_runOnMouseOver(){
	try{
		var obj = window.event.srcElement;
		if( obj.className == "menu_active" ) return;
		obj.className = "menu_hover";
	}
	catch( e ){
		window.alert(e.description);
	}
}

function call_runOnMouseOut(){
	try{
		var obj = window.event.srcElement;
		if( obj.className == "menu_active" ) return;
		obj.className = "menu";
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnClickItem()
{
	try{
		var obj = window.event.srcElement;
		var code = getCodeFromID(obj.id);
		var type = getTypeFromID(obj.id);
		

		try{
			selectSvgSymbol(code, type);
		}
		catch(e){
			window.alert(e.description);
			return;
		}
		

		resetItemStyle();
		setSelectedItemStyle(obj);
		

		(function (get, args) { var call = function () { var p = get(); if (!p || typeof p.showPartsInfo !== 'function' || !p.document || p.document.readyState !== 'complete') return false; p.showPartsInfo.apply(p, args); return true; }; if (!call()) { var n = 0, t = setInterval(function () { if (call() || ++n > 50) clearInterval(t); }, 100); } })(function () { return parent.d_partsinfo; }, [code, type]);
	}
	catch( e ){
		window.alert(e.description);
	}
}




function selectSvgSymbol(code, type)
{

	if( existEwdItem(code, type) ){
		parent.d_map.d_figmap.drawSymbol(code, type, false);
	}
	else {
		var figNoArray = new Array();
		var codeArray = code.split(",");
		for( var i=0; i < codeArray.length; i++ ){

			var tmpFigNoArray = searchFigNoArray(codeArray[i], type, g_codeListArray);
			figNoArray = figNoArray.concat(tmpFigNoArray);
		}

		figNoArray = figNoArray.sort();
		

		parent.loadMap(g_titleObj, figNoArray[0], code, type);
	}
}





function existEwdItem(code, type)
{
	var figNo = parent.d_map.d_figctrl.getCurFigNo();
	if( figNo == null ) figNo = 1;
	var figIndex = figNo - 1;
	var codeList = g_codeListArray[figIndex];
	
	var codeArray = code.split(",");
	for(var i=0; i < codeArray.length; i++){
		if( codeList.isContain(codeArray[i], type) ){
			return true;
		}
	}
	
	return false;
}




function getListObj( ewdItemCode, ewdItemType )
{
	ewdItemCode = ewdItemCode.split(",")[0];
	ewdItemType = adjustType(ewdItemType)
	
	var objs = document.all.tags("div");
	for( var i=0; i < objs.length; i++ ){
		var tmpType = adjustType( getTypeFromID(objs(i).id) );
		if( tmpType != ewdItemType ) continue;
		
		var tmpCodeArray = getCodeFromID(objs(i).id).split(",");
		for( var j=0; j < tmpCodeArray.length; j++ ){
			if( tmpCodeArray[j] == ewdItemCode )
				return objs(i);
		}
	}
	
	return null;
}



function setSelectedItemStyleByCode( ewdItemCode, ewdItemType )
{
	var destObj = getListObj( ewdItemCode, ewdItemType );
	if( destObj == null ) return;
	
	setSelectedItemStyle( destObj );
	destObj.scrollIntoView();
}

function setSelectedItemStyle( destObj )
{
	if( destObj != null )
		destObj.className = "menu_active";
}

function resetItemStyle()
{
	var obj = document.all.tags("div");
	
	for(var i=0; i < obj.length; i++ ){
		if( obj(i).className != "menu" )
			obj(i).className = "menu";
	}
}


function showPartsList()
{

	var dataList = makeHTML( g_partsList );
	document.body.innerHTML = dataList;
}



function makeTitleObj(mapCode, mapType)
{
	var titleList;
	switch(mapType) {
		case "system":
		titleList = new TitleList("../system/title.xml", "system");		break;
		
		case "routing":
		titleList = new TitleList("../routing/title.xml", "routing");		break;
		
		case "relay":
		titleList = new TitleList("../relay/title.xml", "relay");		break;
	}
	var titleObj = titleList.getTitleObjByCode(mapCode);
	
	return titleObj;
}



function makeHTML( partsList )
{
	var retHTML = "";
	for(var i=0; i < partsList.partsArray.length; i++ ){
		var name = partsList.partsArray[i].name;
		var id = partsList.partsArray[i].makeID();
		
		retHTML += "<table cellspacing='0' cellpadding='0' class='partslist'>";
		retHTML += "<tr><td width='10' height='10'><img src='../../icon/b_icon0.png' width='10' height='100%' /></td>";
		retHTML += "<td width='100%'>";
		retHTML += "<div id='" + id + "' class='menu'";
		retHTML += " onMouseOver='call_runOnMouseOver()' onMouseOut='call_runOnMouseOut()'";
		retHTML += " onClick='call_runOnClickItem()'>" + name + "</div>";
		retHTML += "</td></tr></table>";
	}
	
	return retHTML;
}
