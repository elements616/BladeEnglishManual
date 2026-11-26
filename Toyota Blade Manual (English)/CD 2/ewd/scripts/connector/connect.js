/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/


var g_templateXslDoc;

var g_ewdPartsList;
var g_routingTitleList;
var g_relayTitleList;

var g_ewdRefs;



var g_selectedPinNoOfFigArray;




function call_runOnLoadProc()
{

	
	try{

		g_ewdPartsList = new EwdPartsList("parts.xml");
		g_routingTitleList = new TitleList("../routing/title.xml", "routing");
		g_relayTitleList = new TitleList("../relay/title.xml", "relay");
		
		g_ewdRefs = new EwdRefs("ewdrefs.xml");
		
		g_selectedPinNoOfFigArray = makeSelectedPinNoOfFigArray(getURLParam("pin"));
		
		

		g_templateXslDoc = loadXML("../../styles/connector/connectHtml.xsl");
		
		

		var ewdItemCode = getURLParam("code");
		var ewdItemType = getURLParam("type");
		var ewdItemSpec = getURLParam("spec");
		if( ewdItemSpec == null ) ewdItemSpec = "";
		if( ewdItemCode == null || ewdItemCode == "" ) return;
		showConnectList( ewdItemCode.split("+"), ewdItemType.split("+"), ewdItemSpec.split("+") );
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



function call_runOnMouseOver(){
	try{
		var obj = window.event.srcElement;
		obj.className = "text_hover_other";
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

function call_runOnClickLink(ewdID, ewdType, code, type)
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term", getURLParam("term"));
		paramTable.put("ewd", ewdID);
		paramTable.put("ewd_type", ewdType);
		paramTable.put("code", code);
		paramTable.put("type", type);
		
		openNewEWD( "../index.html", paramTable );
	}
	catch( e ){
		window.alert(e.description);
	}
}



function showConnectList(codeArray, typeArray, specArray)
{

	var ewdPartsArray = new Array();
	for(var i=0; i < codeArray.length; i++){
		var tmpParts = g_ewdPartsList.getItem(codeArray[i], typeArray[i], specArray[i]);
		ewdPartsArray[ewdPartsArray.length] = tmpParts;
	}
	

	var html = makeBodyHTML( ewdPartsArray.length );
	document.body.innerHTML = html;
	
	var errObjArray = new Array();
	for( var i=0; i < ewdPartsArray.length; i++ ){
		try{
			setInformation( ewdPartsArray[i], i );
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
	var root = xmlDoc.createElement("Connect");
	xmlDoc.appendChild(root);
	for(var i=0; i < length; i++){
		var element = xmlDoc.createElement("ID");
		element.text = i;
		root.appendChild(element);
	}
	
	return xmlDoc.transformNode(g_templateXslDoc);
}


function setInformation( ewdParts, nIndex )
{
	if (ewdParts == null) return;
	
	document.all("parts_name_" + nIndex).innerHTML = ewdParts.getName();
	document.all("parts_id_" + nIndex).innerHTML = ewdParts.getCode();
	document.all("parts_no_" + nIndex).innerHTML = ewdParts.getNo();
	document.all("parts_color_" + nIndex).innerHTML = ewdParts.getColor();
	document.all("parts_spec_" + nIndex).innerHTML = ewdParts.getSpec();
	document.all("parts_repair_" + nIndex).innerHTML = ewdParts.getRepair();
	document.all("parts_type_" + nIndex).value = ewdParts.getType();
	document.all("parts_namecode_" + nIndex).value = ewdParts.getNameCode();
	
	var figFileName = ewdParts.getFigFileName();
	loadFigData( figFileName , nIndex);
	
	

	if (ewdParts.getNameCode() != "" && ewdParts.getNameCode() != null)
		document.all("single_" + nIndex).style.display = "inline";
	else
		document.all("single_" + nIndex).style.display = "none";
	
	

	setLinkInfo( nIndex, ewdParts.getCode(), ewdParts.getType() );
}



function setLinkInfo(nIndex, ewdItemCode, ewdItemType)
{
	var refsObj = g_ewdRefs.makeRefsPartsObj( ewdItemCode, ewdItemType );
	
	

	var routingTitleObjArray = refsObj.getTitleObjArray("Routing", g_routingTitleList );
	var toWiringRouting = makeHtmlAtLinkToDiagram( routingTitleObjArray, ewdItemCode, ewdItemType );
	
	var relayTitleObjArray = refsObj.getTitleObjArray("Relay", g_relayTitleList );
	var toRelayLocation = makeHtmlAtLinkToDiagram( relayTitleObjArray, ewdItemCode, ewdItemType );
	
	document.all("to_wiringrouting_" + nIndex).innerHTML = toWiringRouting + toRelayLocation;
}





function makeHtmlAtLinkToDiagram( titleObjArray, code, type )
{
	var retHTML = "";
	
	for(var i=0; i < titleObjArray.length; i++ ){
		if( titleObjArray[i].isInTerm(getURLParam("term")) == false ) continue;
		var mapCode = titleObjArray[i].getCode();
		var mapType = titleObjArray[i].getType();
		var mapName = titleObjArray[i].getName();
		
		retHTML += "<div class='text-link'><span id='" + mapType + "_" + i + "'";
		retHTML += " class='text'";
		retHTML += " onMouseOver='call_runOnMouseOver()'";
		retHTML += " onMouseOut='call_runOnMouseOut()'";
		retHTML += " onClick=\"call_runOnClickLink('" + mapCode + "','" + mapType + "','" + code + "','" + type + "')\">";
		retHTML += mapName + "</span></div>\r\n";
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


function makeSelectedPinNoOfFigArray( pinNoString )
{
	if( pinNoString == null || pinNoString == "" ) return null;
	
	var retArray = new Array();
	
	var pinNoOfFigArray = pinNoString.split("+");
	
	for( var i=0; i < pinNoOfFigArray.length; i++ ){
		retArray[i] = pinNoOfFigArray[i].split(".");
	}
	
	return retArray;
}



function getEmbedIndexBySvgDoc( svgDoc )
{
	var retIndex = -1;
	

	for (var i=0; i < document.embeds.length; i++){
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
	
	

	if( g_selectedPinNoOfFigArray == null ) return;
	
	var svgDoc = svgFig.svgRootNode.getOwnerDocument();
	embedIndex = getEmbedIndexBySvgDoc( svgDoc );
	if( embedIndex == -1 ) return;
	selectPinNoByPinNoArray( svgDoc, g_selectedPinNoOfFigArray[embedIndex] );
}




function showPartsInfo(code, type)
{

	
	var titleObj = parent.getTitleObj();
	
	var paramTable = makeParamTable();
	paramTable.put("code",code);
	paramTable.put("type",type);
	paramTable.put("ewd", titleObj.getCode());
	paramTable.put("ewd_type", titleObj.getType());
	paramTable.put("term", getURLParam("term"));
	
	window.location.assign(new URL("../connector/pinfo.html" + makeParamString(paramTable), document.baseURI).href);
	
	parent.showConnListFrame( false );
}



function resetPartsInfo()
{
	var titleObj = parent.getTitleObj();
	
	var paramTable = makeParamTable();
	paramTable.put("ewd", titleObj.getCode());
	paramTable.put("ewd_type", titleObj.getType());
	paramTable.put("term", getURLParam("term"));
	
	window.location.assign(new URL("../connector/pinfo.html" + makeParamString(paramTable), document.baseURI).href);
	
	parent.showConnListFrame( false );
}
