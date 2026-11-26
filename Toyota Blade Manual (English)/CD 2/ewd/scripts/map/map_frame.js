/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/



var MODE = "FigMap";
var g_titleObj = null;



function getMode()
{
	return MODE;
}



function getTitleObj()
{
	return g_titleObj;
}



function call_runOnLoadProc()
{
	try{

		if( parent.d_selector != null ){
			if( parent.getLoadedFlag() == true ){
				parent.d_selector.showPrintButton( true );
			}
			else{
				parent.d_selector.window.location.assign("../select.html?print=yes");
				parent.setLoadedFlag(true);
			}
		}
		

		var bSuccess = initialize();
		if( bSuccess == false ) return;
		
		loadLocalNavi();
		
		loadMapForInit();
	}
	catch( e ){
		window.alert(e.description);
	}
}


function initialize()
{
	var ewdCode = getURLParam("ewd");
	var ewdType = getURLParam("ewd_type");
	if( ewdCode == null ) return false;
	if( ewdType == null ) return false;
	
	var filePath = "../" + ewdType + "/title.xml";
	var titleList = new TitleList(filePath, ewdType);
	g_titleObj = titleList.getTitleObjByCode(ewdCode);
	if( g_titleObj == null ) return false;
	
	return true;
}





function loadMapForInit()
{
	var paramTable = makeParamTable(window.location.search);
	
	
	var figNo = getURLParam("fig_no")
	var figFilePath = makeFigFilePath(g_titleObj, figNo)
	var figLength = g_titleObj.getFigTextArray().length;
	
	paramTable.put("fig_no",  figNo);
	paramTable.put("figname", figFilePath);
	paramTable.put("fig_len", figLength);
	
	
	if( g_titleObj.getType() == "system" ){
		paramTable.put("connlist","yes");
	}
	else if( g_titleObj.getType() == "relay" ){
		if( g_titleObj.isInner() || g_titleObj.hasInner() )
			paramTable.put("page_select","yes");
	}
	
	if( getURLParam("localnavi") == "no" ){
		paramTable.put("frm_ctrl","close");
	}
	else {
		if( getListLength() == 0 )
			paramTable.put("frm_ctrl","close");
		else
			paramTable.put("frm_ctrl","open");
	}
	
	if( g_titleObj.getType() == "system" ){
		d_map.window.location.assign("../system/sysmap.html" + makeParamString(paramTable));
	}
	else {
		d_map.window.location.assign("../routing/routemap.html" + makeParamString(paramTable));
	}

}


function loadMap(titleObj, figNo, partsCode, partsType)
{
	var paramTable = makeParamTable();
	
	
	var figFilePath = makeFigFilePath(titleObj, figNo)
	var figLength = titleObj.getFigTextArray().length;
	
	paramTable.put("fig_no",  figNo);
	paramTable.put("figname", figFilePath);
	paramTable.put("fig_len", figLength);
	
	
	if( partsCode != null ){
		paramTable.put("code", partsCode.replace(/,/g, "+"));
		paramTable.put("type", partsType);
	}
	
	if( titleObj.getType() == "system" ){
		paramTable.put("connlist","yes");
	}
	else if( titleObj.getType() == "relay" ){
		if( titleObj.isInner() || titleObj.hasInner() )
			paramTable.put("page_select","yes");
	}
	
	if( d_map.d_header.isOpenFrame() ){
		paramTable.put("frm_ctrl","open");
	} else {
		paramTable.put("frm_ctrl","close");
	}
	
	if( titleObj.getType() == "system" ){
		d_map.window.location.assign("../system/sysmap.html" + makeParamString(paramTable));
	}
	else {
		d_map.window.location.assign("../routing/routemap.html" + makeParamString(paramTable));
	}

}


function makeFigFilePath(titleObj, figNo)
{
	return "../" + titleObj.getType() + "/fig/" + titleObj.getFigFileName(figNo);
}







function showConnectList()
{
	var titleObj = getTitleObj();
	if( titleObj.getType() != "system" ) return;
	

	var rootNode = d_map.d_figmap.view.fig.svgRootNode;
	d_map.d_figmap.resetSelectedPartsBlink(rootNode);
	d_map.d_figmap.resetAllParts(rootNode);
	

	var connectPinArray = d_map.d_figmap.getConnectPinArray();
	
	var urlParamString = makeURLParamString( connectPinArray );


	d_partsinfo.window.location.assign("../connector/connect.html" + urlParamString);
	showConnListFrame( true );
}



function makeURLParamString(connectPinArray)
{
	var paramTable = makeParamTable();
	paramTable.put("term", getURLParam("term"));
	
	if( connectPinArray == null ) return makeParamString(paramTable);
	
	var codeArray = new Array();
	var typeArray = new Array();
	var specArray = new Array();
	var pinNoArray = new Array();
	for(var i=0; i < connectPinArray.length; i++){
		codeArray[i]  = connectPinArray[i].ewdItem.code;
		typeArray[i]  = connectPinArray[i].ewdItem.type;
		specArray[i]  = connectPinArray[i].ewdItem.spec;
		pinNoArray[i] = connectPinArray[i].usePin.join(".");
	}
	
	paramTable.put("code", codeArray.join("+"));
	paramTable.put("type", typeArray.join("+"));
	paramTable.put("spec", specArray.join("+"));
	paramTable.put("pin", pinNoArray.join("+"));
	
	return makeParamString(paramTable);
}






function changePage( pageNo )
{
	var titleObj = getTitleObj();
	if( titleObj.getType() != "relay" ) return;
	
	var ewdCode;
	if( pageNo == 1 ){
		ewdCode = titleObj.getObject();
	}
	else if( pageNo == 2 ){
		ewdCode = titleObj.getInner();
	}
	if( ewdCode == null || ewdCode == "" ) return;
	
	var paramTable = makeParamTable();
	paramTable.put("ewd",ewdCode);
	paramTable.put("ewd_type", "relay");
	paramTable.put("code", d_partsinfo.getDispEwdItemCode().replace(/,/g, "+"));
	paramTable.put("type", d_partsinfo.getDispEwdItemType());
	paramTable.put("term", getURLParam("term"));
	
	self.window.location.assign( "../routing/routing.html" + makeParamString(paramTable) );

}
