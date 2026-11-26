/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/

var DISP_NAME = "name";
var DISP_CODE = "code";

var PARTS_XML_NAME = "parts.xml";
var PARTS_XML_CODE = "partscode.xml";

var g_dispMode;

var g_ewdPartsList;




function call_runOnLoadProc()
{

	try{
		var sort = getURLParam("parts_sort");
		var search_key = getURLParam("search_key");
		var search_mode = getURLParam("search_mode");
		var ewdItemCode = getURLParam("code");
		

		if( search_key == null ){
			if( sort == "code" )
				self.window.location.assign("partslist_code.html" + window.location.search );
			else
				self.window.location.assign("partslist_name.html" + window.location.search );
			return;
		}
		

		if( sort == "code" ){
			g_dispMode = DISP_CODE;
			g_ewdPartsList = new EwdPartsList(PARTS_XML_CODE);
		}
		else {
			g_dispMode = DISP_NAME;
			g_ewdPartsList = new EwdPartsList(PARTS_XML_NAME);
		}
		showList(search_key);
		
		

		if( ewdItemCode != null ){
			ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
			targetObj = searchItemObjByCode(ewdItemCode);
			if( targetObj != null ){
				setItemColor(targetObj);
				targetObj.scrollIntoView();
			}
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnLoadProcForNameList()
{
	try{
		var ewdItemCode = getURLParam("code");
		
		g_dispMode = DISP_NAME;
		g_ewdPartsList = new EwdPartsList(PARTS_XML_NAME);
		

		if( ewdItemCode != null ){
			ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
			targetObj = searchItemObjByCode(ewdItemCode);
			if( targetObj != null ){
				setItemColor(targetObj);
				targetObj.scrollIntoView();
			}
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnLoadProcForCodeList()
{
	try{
		var ewdItemCode = getURLParam("code");
		
		g_dispMode = DISP_CODE;
		g_ewdPartsList = new EwdPartsList(PARTS_XML_CODE);
		

		if( ewdItemCode != null ){
			ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
			targetObj = searchItemObjByCode(ewdItemCode);
			if( targetObj != null ){
				setItemColor(targetObj);
				targetObj.scrollIntoView();
			}
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
		resetItemStyle();
		setSelectedItemStyle(obj);
		
		var code = getCodeFromID(obj.id);
		var type = getTypeFromID(obj.id);
		parent.d_info.showPartsInfo( code, type );
	}
	catch( e ){
		window.alert(e.description);
	}
}





function showList(key)
{

	
	var fFilter = false;
	
	var partsList = new PartsList();
	if( g_dispMode == DISP_NAME ){
		partsList.makePartsArrayForName(g_ewdPartsList.ewdPartsArray, key, fFilter);
	} else {
		partsList.makePartsArrayForCode(g_ewdPartsList.ewdPartsArray, key, fFilter);
	}
	
	
	if( partsList.partsArray.length == 0 ){
		document.body.innerHTML = "Not found";
		return;
	}
	
	

	document.body.innerHTML = makeHtmlByPartsArray( partsList );
}




function makeHtmlByPartsArray( partsList )
{
	var retHTML = "";
	
	if( partsList == null ) return retHTML;
	
	for( var i=0; i < partsList.partsArray.length; i++ ){
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



function searchItemObjByCode( code )
{
	code = code.split(",")[0];
	
	var destObjList = document.all.tags("div");
	for( var i=0; i < destObjList.length; i++ ){
		var idArray = destObjList(i).id.split(",");
		for( var j=0; j < idArray.length; j++ ){
			if( code == idArray[j] ){
				return destObjList(i);
			}
		}
	}
	
	return null;
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
