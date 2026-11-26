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
var g_sysRefs;

var g_selectedPinNoOfFigArray;




function call_runOnLoadProc()
{
	try{

		if( self.window.dialogArguments != null ){
			if( self.dialogArguments[0] == "print" ){
				g_selectedPinNoOfFigArray = self.dialogArguments[3];
				document.body.innerHTML = self.dialogArguments[2];
				document.all("div_header").innerHTML = self.dialogArguments[1];
				return;
			}
		}
		

		g_ewdPartsList = new EwdPartsList("parts.xml");
		g_systemTitleList = new TitleList("../system/title.xml", "system");
		g_routingTitleList = new TitleList("../routing/title.xml", "routing");
		g_relayTitleList = new TitleList("../relay/title.xml", "relay");
		
		g_ewdRefs = new EwdRefs("ewdrefs.xml");
		g_sysRefs = new SysRefs("sysrefs.xml");
		
		

		g_templateXslDoc = loadXML("../../styles/connector/partsRefsHtml.xsl");
		
		

		var ewdItemCode = getURLParam("code");
		var ewdItemType = getURLParam("type");
		if( ewdItemCode != null ){
			ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
			showPartsInfo( ewdItemCode, ewdItemType );
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



function call_runOnClickLink(mapCode, mapType, partsCode, partsType)
{
	try{
		if( self.window.dialogArguments != null ) return;
		
		var titleObj = getTitleObj(mapCode, mapType);
		var codeListArray = makeCodeListArray(titleObj);
		var figNoArray = searchFigNoArray(partsCode, partsType, codeListArray);
		
		var paramTable = makeParamTable();
		paramTable.put("fig_no", figNoArray[0]);
		paramTable.put("term", getURLParam("term"));
		paramTable.put("ewd", mapCode);
		paramTable.put("ewd_type", mapType);
		paramTable.put("code", partsCode);
		paramTable.put("type", partsType);
		

		var path = "";
		if( mapType == "system" ){
			path = "../system/system.html";
		}
		else {
			path = "../routing/routing.html";
		}
		
		parent.window.location.assign( path + makeParamString(paramTable) );
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickPartCheck(index)
{
	try{
		if( self.window.dialogArguments != null ) return;
		
		var paramTable = makeParamTable();
		paramTable.put("parts", document.all("parts_namecode_" + index).value);
		paramTable.put("term", getURLParam("term"));
		

		openCompCheck(makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnClickChangeDisplayedLink(index)
{
	try{
		if( self.window.dialogArguments != null ) return;
		
		var partsCode = document.all("parts_id_" + index).innerHTML;
		var partsType = document.all("parts_type_" + index).value;
		var partsSpec = document.all("parts_spec_" + index).innerHTML;
		var ewdParts = g_ewdPartsList.getItem( partsCode, partsType, partsSpec );
		if( ewdParts == null ) return;
		
		if (document.all("optAllPin_" + index).checked) {
			showSystemLinkAll(ewdParts, index);
		}
		else if(document.all("optSelectedPin_" + index).checked) {
			showSystemLinkFromSelectedPin(ewdParts, index);
		}
	}
	catch( e ){
		window.alert(e.description);
	}
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




function showPartsInfo( partsCode, partsType )
{

	

	var ewdPartsArray = new Array();
	var codeArray = partsCode.split(",");
	for( var i=0; i < codeArray.length; i++ ){
		var tmpArray = g_ewdPartsList.getItemArray( codeArray[i], partsType );
		ewdPartsArray = ewdPartsArray.concat(tmpArray);
	}
	

	var html = makeBodyHTML( ewdPartsArray.length );
	document.body.innerHTML = html;
	

	var errObjArray = new Array();
	for(var i=0; i < ewdPartsArray.length; i++ ){
		try{
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
	var root = xmlDoc.createElement("PartsRef");
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
	document.all("parts_name_" + nIndex).innerHTML = ewdParts.getName();
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
	
	
	
	document.all("optAllPin_" + nIndex).checked = true;
	
	

	setLinkInfo( nIndex, ewdParts.getCode(), ewdParts.getType() );
}




function setLinkInfo(nIndex, ewdItemCode, ewdItemType)
{
	var refsParts = g_ewdRefs.makeRefsPartsObj( ewdItemCode, ewdItemType );
	
	

	var systemTitleObjArray = refsParts.getTitleObjArray("System", g_systemTitleList);
	var toSystemCircuit = makeHtmlAtLinkToDiagram( systemTitleObjArray, ewdItemCode, ewdItemType );
	
	document.all("to_systemcircuit_" + nIndex).innerHTML = toSystemCircuit;
	
	
	

	var routingTitleObjArray = refsParts.getTitleObjArray("Routing", g_routingTitleList );
	var toWiringRouting = makeHtmlAtLinkToDiagram( routingTitleObjArray, ewdItemCode, ewdItemType );
	
	var relayTitleObjArray = refsParts.getTitleObjArray("Relay", g_relayTitleList );
	var toRelayLocation = makeHtmlAtLinkToDiagram( relayTitleObjArray, ewdItemCode, ewdItemType );
	
	document.all("to_wiringrouting_" + nIndex).innerHTML = toWiringRouting + toRelayLocation;
}





function makeHtmlAtLinkToDiagram( titleObjArray, partsCode, partsType )
{
	var retHTML = "";
	
	for(var i=0; i < titleObjArray.length; i++ ){
		if( titleObjArray[i].isInTerm(getURLParam("term")) == false ) continue;
		var mapCode   = titleObjArray[i].getCode();
		var mapType = titleObjArray[i].getType();
		var mapName = titleObjArray[i].getName();
		
		retHTML += "<div class='text-link'><span id='" + mapType + "_" + i + "'";
		retHTML += " class='text'";
		retHTML += " onMouseOver='call_runOnMouseOver(false)'";
		retHTML += " onMouseOut='call_runOnMouseOut()'";
		retHTML += " onClick=\"call_runOnClickLink('" + mapCode + "','" + mapType + "','" + partsCode + "','" + partsType + "')\">";
		retHTML += mapName + "</span></div>\r\n";
	}
	
	return retHTML;
}




function loadFigData( figFileName, nIndex )
{
	var embedNode = document.embeds[nIndex];
	if( figFileName != null && figFileName != ""){
		embedNode.setAttribute("width", "150");
		embedNode.setAttribute("height", "150");
		embedNode.setAttribute("src", "fig/" + figFileName);
	}
	else {
		document.all("tblFig_" + nIndex).style.display = "none";
	}
}



function showSystemLinkAll( ewdParts, nIndex )
{
	titleObjArray = g_sysRefs.makeTitleObjArray( ewdParts, g_systemTitleList );
	
	var toSystemCircuit = makeHtmlAtLinkToDiagram( titleObjArray, ewdParts.getCode(), ewdParts.getType() );
	document.all("to_systemcircuit_" + nIndex).innerHTML = toSystemCircuit;
}



function showSystemLinkFromSelectedPin( ewdParts, nIndex )
{
	var svgDoc = __svgDoc(document.embeds[nIndex]);
	var pinNoArray = getSelectedPinNoArray(svgDoc);
	
	titleObjArray = g_sysRefs.makeTitleObjArrayByPinNoArray( ewdParts, pinNoArray, g_systemTitleList );
	
	var toSystemCircuit = makeHtmlAtLinkToDiagram( titleObjArray, ewdParts.getCode(), ewdParts.getType() );
	document.all("to_systemcircuit_" + nIndex).innerHTML = toSystemCircuit;
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
	if( g_selectedPinNoOfFigArray == null ) return;
	
	var svgDoc = svgFig.svgRootNode.getOwnerDocument();
	embedIndex = getEmbedIndexBySvgDoc( svgDoc );
	if( embedIndex == -1 ) return;
	
	selectPinNoByPinNoArray( svgDoc, g_selectedPinNoOfFigArray[embedIndex] );
}
