/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/


var g_templateXslDoc;

var g_ewdPartsList;
var g_systemTitleList;
var g_routingTitleList;
var g_relayTitleList;

var g_ewdRefs;

var g_titleObj = null;

function call_runOnLoadProc()
{
	try{

		var bSuccess = initialize();
		if( bSuccess == false ) return;
		
		

		g_templateXslDoc = loadXML("../../styles/connector/partsInfoHtml.xsl");
		
		

		var ewdItemCode = getURLParam("code");
		var ewdItemType = getURLParam("type");
		if( ewdItemCode != null && ewdItemType != null ){
			ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
			showPartsInfo( ewdItemCode, ewdItemType );
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnResizeProc()
{
	try{
		for( var i=0; i < document.embeds.length; i++ ){
			var embedNode = document.embeds[i];
			var svgDoc = __svgDoc(embedNode);
			if( svgDoc.rootElement == null ) continue;
			var svgWidth = svgDoc.rootElement.getAttribute("width");
			var svgHeight = svgDoc.rootElement.getAttribute("height");
			fitToWindow( embedNode, svgWidth, svgHeight );
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnMouseOver( fOther ){
	try{
		var obj = window.event.srcElement;
		if( fOther == true )
			obj.className = "text_hover_other";
		else
			obj.className = "text_hover";
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnMouseOut(){
	try{
		var obj = window.event.srcElement;
		obj.className = "text";
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickLink(ewdCode, ewdType, partsCode, partsType, fOther)
{
	try{
		var titleObj = getTitleObj(ewdCode, ewdType);
		var codeListArray = makeCodeListArray(titleObj);
		var figNoArray = searchFigNoArray(partsCode, partsType, codeListArray);
		
		var paramTable = makeParamTable();
		paramTable.put("fig_no", figNoArray[0]);
		paramTable.put("term", getURLParam("term"));
		paramTable.put("ewd", ewdCode);
		paramTable.put("ewd_type", ewdType);
		paramTable.put("code", partsCode);
		paramTable.put("type", partsType);
		if( ewdCode == partsCode ){
			paramTable.put("code", "" );
			paramTable.put("type", "" );
		}
		

		var path = "";
		if( ewdType == "system" ){
			path = "../system/system.html";
		}
		else {
			path = "../routing/routing.html";
		}
		
		if( fOther )
			openNewEWD( "../index.html", paramTable );
		else
			parent.window.location.assign(path + makeParamString(paramTable) );
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickPartCheck(index)
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("parts", document.all("parts_namecode_" + index).value);
		paramTable.put("term", getURLParam("term"));
		

		openCompCheck(makeParamString(paramTable));

	}
	catch( e ){
		window.alert(e.description);
	}
}




function call_runOnClickFuse( index )
{
	try{
		var id = document.all("parts_id_" + index).innerHTML;
		var paramTable = makeParamTable();
		paramTable.put("loads", "ps");
		paramTable.put("loads_sort", "capacity");
		paramTable.put("loads_scroll", id);
		paramTable.put("term", getURLParam("term"));
		
		var destURL = "../loads/matrix.html" + makeParamString(paramTable);
		var winStyle = makeWinStyleString();
		
		window.open( destURL, "_blank", winStyle );
	}
	catch( e ){
		window.alert(e.description);
	}
}



function resetPartsInfo()
{
	var html = makeBodyHTML( 1 );
	document.body.innerHTML = html;
	
	document.all("fig_view_0").style.display = "none";
	document.all("single_0" ).style.display = "none";
	document.all("fuse_0").style.display = "none";
}



function getTitleObj(mapCode, mapType)
{
	var titleObj;
	switch(mapType) {
		case "system":
		titleObj = g_systemTitleList.getTitleObjByCode(mapCode);		break;
		
		case "routing":
		titleObj = g_routingTitleList.getTitleObjByCode(mapCode);		break;
		
		case "relay":
		titleObj = g_relayTitleList.getTitleObjByCode(mapCode);		break;
	}
	
	return titleObj;
}





function initialize()
{
	g_ewdPartsList = new EwdPartsList("parts.xml");
	if( g_ewdPartsList == null ) return false;
	g_systemTitleList = new TitleList("../system/title.xml", "system");
	if( g_systemTitleList == null ) return false;
	g_routingTitleList = new TitleList("../routing/title.xml", "routing");
	if( g_routingTitleList == null ) return false;
	g_relayTitleList = new TitleList("../relay/title.xml", "relay");
	if( g_relayTitleList == null ) return false;
	
	g_ewdRefs = new EwdRefs("ewdrefs.xml");
	
	
	var ewdCode = getURLParam("ewd");
	var ewdType = getURLParam("ewd_type");
	switch( ewdType ){
		case "system":
		g_titleObj = g_systemTitleList.getTitleObjByCode( ewdCode );	break;
		
		case "routing":
		g_titleObj = g_routingTitleList.getTitleObjByCode( ewdCode );	break;
		
		case "relay":
		g_titleObj = g_relayTitleList.getTitleObjByCode( ewdCode );	break;
	}
	if( g_titleObj == null ) return false;
	
	
	return true;
}




function showPartsInfo( ewdItemCode, ewdItemType )
{

	

	var ewdPartsArray = new Array();
	var codeArray = ewdItemCode.split(",");
	var fRelay = false;
	if( ewdItemType == "conn" || ewdItemType == "w2w" || ewdItemType == "gp" || ewdItemType == "jbc" ){
		for( var i=0; i < codeArray.length; i++ ){
			var tmpArray = g_ewdPartsList.getItemArray( codeArray[i], ewdItemType );
			ewdPartsArray = ewdPartsArray.concat(tmpArray);
		}
	}
	else if( ewdItemType == "jb" || ewdItemType == "rb" || ewdItemType == "r" || ewdItemType == "relay"){
		fRelay = true;
		for( var i=0; i < codeArray.length; i++ ){
			var tmpTitleObj = g_relayTitleList.getTitleObjByCode(codeArray[i]);
			ewdPartsArray[ewdPartsArray.length] = tmpTitleObj;
		}
	}
	

	var html = makeBodyHTML( ewdPartsArray.length );
	document.body.innerHTML = html;
	

	var errObjArray = new Array();
	for(var i=0; i < ewdPartsArray.length; i++ ){
		try{
			if( fRelay )
				setPartsInfoForRelay( ewdPartsArray[i], i );
			else 
				setPartsInfo( ewdPartsArray[i], i );
		}
		catch(e){
			errObjArray[errObjArray.length] = e;
		}
	}
	

	for(var i=0; i < errObjArray.length; i++ ){
		window.alert("showPartsInfo Error:\r\n" + errObjArray[i].description);
	}
}




function makeBodyHTML( length )
{
	var xmlDoc = createDOM();
	var root = xmlDoc.createElement("PartsInfo");
	xmlDoc.appendChild(root);
	for(var i=0; i < length; i++){
		var element = xmlDoc.createElement("ID");
		element.text = i;
		root.appendChild(element);
	}
	
	return xmlDoc.transformNode(g_templateXslDoc);
}




function setPartsInfo( ewdParts, nIndex )
{
	if (ewdParts == null) return;
	
	document.all("parts_type_" + nIndex).value = ewdParts.getType();
	document.all("parts_namecode_" + nIndex).value = ewdParts.getNameCode();
	document.all("parts_id_" + nIndex).innerHTML = ewdParts.getCode();
	document.all("parts_no_" + nIndex).innerHTML = ewdParts.getNo();
	document.all("parts_color_" + nIndex).innerHTML = ewdParts.getColor();
	document.all("parts_spec_" + nIndex).innerHTML = ewdParts.getSpec();
	document.all("parts_repair_" + nIndex).innerHTML = ewdParts.getRepair();
	
	
	var figFileName = ewdParts.getFigFileName();
	loadFigData( figFileName , nIndex);
	
	

	if (ewdParts.getNameCode() != "" && ewdParts.getNameCode() != null)
		document.all("single_" + nIndex).style.display = "inline";
	else
		document.all("single_" + nIndex).style.display = "none";
	
	
	document.all("fuse_" + nIndex).style.display = "none";
	
	setLinkInfo( nIndex, ewdParts.getCode(), ewdParts.getType() );
}




function setPartsInfoForRelay( titleObj, nIndex )
{
	if (titleObj == null) return;
	
	
	document.all("parts_id_" + nIndex).innerHTML = titleObj.getCode();
	document.all("parts_no_" + nIndex).innerHTML = "-";
	document.all("parts_color_" + nIndex).innerHTML = "-";
	document.all("parts_spec_" + nIndex).innerHTML = "-";
	document.all("parts_repair_" + nIndex).innerHTML = "-";
	
	
	loadFigData( null , nIndex);
	
	document.all("single_" + nIndex).style.display = "none";
	
	document.all("fuse_" + nIndex).style.display = "inline";
	
	setLinkInfo( nIndex, titleObj.getCode(), "relay" );
}



function setLinkInfo(nIndex, ewdItemCode, ewdItemType)
{
	var refsParts = g_ewdRefs.makeRefsPartsObj( ewdItemCode, ewdItemType );
	
	

	var linkToSystemObj = document.all("to_systemcircuit_" + nIndex);
	var toSystemCircuit;
	if( !(ewdItemType == "jbc" && g_titleObj.getType() == "relay") ){
		var systemTitleObjArray = refsParts.getTitleObjArray("System", g_systemTitleList);
		toSystemCircuit = makeHtmlAtLinkToDiagram( systemTitleObjArray, ewdItemCode, ewdItemType );
	}
	else
	{
		var ewdItemTypeForJBC = "relay";
		var ewdItemCodeForJBC;
		if( g_titleObj.isInner() ){
			ewdItemCodeForJBC = g_titleObj.getObject();
		} else {
			ewdItemCodeForJBC = g_titleObj.getCode();
		}
		var refsPartsForJBC = g_ewdRefs.makeRefsPartsObj( ewdItemCodeForJBC, ewdItemTypeForJBC );
		var systemTitleObjArray = refsPartsForJBC.getTitleObjArray("System", g_systemTitleList);
		toSystemCircuit = makeHtmlAtLinkToDiagram( systemTitleObjArray, ewdItemCodeForJBC, ewdItemTypeForJBC );
	}
	linkToSystemObj.innerHTML = toSystemCircuit;
	
	
	

	var linkToRoutingObj = document.all("to_wiringrouting_" + nIndex);
	var routingTitleObjArray = refsParts.getTitleObjArray("Routing", g_routingTitleList);
	var toWiringRouting = makeHtmlAtLinkToDiagram( routingTitleObjArray, ewdItemCode, ewdItemType );
	var relayTitleObjArray = refsParts.getTitleObjArray("Relay", g_relayTitleList);
	if( ewdItemType == "relay" ){
		relayTitleObjArray[relayTitleObjArray.length] = g_relayTitleList.getTitleObjByCode(ewdItemCode);
	}
	var toRelayLocation = makeHtmlAtLinkToDiagram( relayTitleObjArray, ewdItemCode, ewdItemType );
	linkToRoutingObj.innerHTML = toWiringRouting + toRelayLocation;
	
	
	
	
	

	var linkToSystemBlockObj = document.all("system_block_" + nIndex);
	var linkToRoutingBlockObj = document.all("routing_block_" + nIndex);
	
	switch( g_titleObj.getType() ){
		case "system":
		linkToRoutingBlockObj.style.display = "block";
		break;
		
		case "routing":
		linkToSystemBlockObj.style.display = "block";
		if( ewdItemType == "relay" || ewdItemType == "jbc")
			linkToRoutingBlockObj.style.display = "block";
		break;
		
		case "relay":
		linkToSystemBlockObj.style.display = "block";
		linkToRoutingBlockObj.style.display = "block";
		break;
	}
}







function makeHtmlAtLinkToDiagram( titleObjArray, partsCode, partsType )
{
	var retHTML = "";
	
	var fOther = ( g_titleObj.getType() != "relay" );
	
	for(var i=0; i < titleObjArray.length; i++ ){
		if( titleObjArray[i].isInTerm(getURLParam("term")) == false ) continue;
		var ewdCode = titleObjArray[i].getCode();
		var ewdType = titleObjArray[i].getType();
		var ewdName = titleObjArray[i].getName();
		
		retHTML += "<div class='text-link'><span id='" + ewdType + "_" + i + "'";
		retHTML += " class='text'";
		retHTML += " onMouseOver='call_runOnMouseOver(" + fOther + ")'";
		retHTML += " onMouseOut='call_runOnMouseOut()'";
		retHTML += " onClick=\"call_runOnClickLink('" + ewdCode + "','" + ewdType + "','" + partsCode + "','" + partsType + "'," + fOther +")\">";
		retHTML += ewdName + "</span></div>\r\n";
	}
	
	return retHTML;
}



function loadFigData( figFileName, nIndex )
{
	var embedNode = document.embeds[nIndex];
	if( figFileName != null && figFileName != ""){
		embedNode.setAttribute("src", "fig/" + figFileName);
	}
	else {
		document.all("fig_view_" + nIndex).style.display = "none";
	}
}




function getEmbedIndexBySvgDoc( svgDoc )
{
	var retIndex = -1;
	

	for (var i=0; i < document.embeds.length; i++){
		if( document.embeds[i] == null ) continue;
		if( svgDoc == __svgDoc(document.embeds[i]) ){
			retIndex = i;
			break;
		}
	}
	
	return retIndex;
}



function fitToWindow( embedNode, svgWidth, svgHeight )
{
	if( embedNode == null )	return;
	
	var maxSize =  document.body.clientWidth-(13+25);
	svgWidth = parseInt(svgWidth);
	svgHeight = parseInt(svgHeight);

	if(svgWidth > svgHeight){
		var width = maxSize;
		var height = svgHeight * (width/svgWidth);
	}
	else{
		var height = maxSize;
		var width = svgWidth * (height/svgHeight);
	}
	
	embedNode.setAttribute( "width" , width );
	embedNode.setAttribute( "height" , height );
}



function zoomFig( svgDoc )
{


	var index = getEmbedIndexBySvgDoc(svgDoc);
	if(index == -1)return;
	var embedNode = document.embeds[index];
	
	var scale = svgDoc.rootElement.currentScale;
	
	var width =  embedNode.getAttribute( "width" );
	var height = embedNode.getAttribute( "height");

	width = width * scale;
	height = height * scale;
	
	embedNode.setAttribute( "width" , width );
	embedNode.setAttribute( "height" , height );

	svgDoc.rootElement.currentScale = 1;

	svgDoc.rootElement.getCurrentTranslate().setX(0);
	svgDoc.rootElement.getCurrentTranslate().setY(0);
}



function sendOnloadMsg(svgFig)
{
	var svgDoc = svgFig.svgRootNode.getOwnerDocument();
	var embedNode = document.embeds[ getEmbedIndexBySvgDoc(svgDoc) ];
	
	fitToWindow(embedNode, svgFig.width, svgFig.height)
}




function getDispEwdItemCode()
{
	var codeArray = new Array();
	
	var destObj;
	for( var i=0; ; i++ ){
		destObj = document.all("parts_id_" + i);
		if( destObj == null ) break;
		codeArray[i] = destObj.innerHTML;
	}
	
	return codeArray.join(",");
}



function getDispEwdItemType()
{
	var partsType = "";
	var destObj = document.all("parts_type_0");
	if( destObj != null ){
		partsType = destObj.value;
	}
	
	return partsType;
}
