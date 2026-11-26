/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/












function TitleList( path , type )
{

	this.type = type;
	this.xmlDoc = null;
	this.titleArray = null;
	
	
	

	this.xmlDoc = loadXML( path );
	
	switch( type ){
		case "system":
		this.titleArray = this.makeSystemTitleArray();		break;
		
		case "routing":
		this.titleArray = this.makeRoutingTitleArray();		break;
		
		case "relay":
		this.titleArray = this.makeRelayTitleArray();		break;
	}
}




TitleList.prototype.filteringByTerm = function ( term )
{
	if( term == null ) return;
	var filteredArray = new Array();
	
	var titleArray = this.titleArray;
	for( var i=0; i < titleArray.length; i++ ){
		if( titleArray[i].isInTerm(term) ){
			filteredArray[filteredArray.length] = titleArray[i];
		}
	}
	
	this.titleArray = filteredArray;
}





TitleList.prototype.getExistScCodeArray = function ()
{
	var scArray = new Array();
	
	for( var i=0; i < this.titleArray.length; i++ ){
		var code = this.titleArray[i].getSC();
		var bFound = false;
		for(var j=0; j < scArray.length; j++ ){
			if( scArray[j] == code ){
				bFound = true;
				break;
			}
		}
		if( bFound == false ){
			scArray[scArray.length] = code;
		}
	}
	
	return scArray;
}





TitleList.prototype.makeRoutingGroupCodeArray = function ()
{
	var groupCodeArray = new Array();
	
	for(var i=0; i < this.titleArray.length; i++ ){
		var groupCode = this.titleArray[i].getGroupCode();
		var bFound = false;
		for( var j=0; j < groupCodeArray.length; j++ ){
			if( groupCodeArray[j] == groupCode ){
				bFound = true;
				break;
			}
		}
		if( bFound == false ){
			groupCodeArray[groupCodeArray.length] = groupCode;
		}
	}
	
	return groupCodeArray;
}




TitleList.prototype.getSystemTitleArrayBySC = function ( sc )
{
	if( sc == null ) return this.titleArray;
	
	var retArray = new Array();
	
	for( var i=0; i < this.titleArray.length; i++ ){
		if( this.titleArray[i].getSC() == sc ){
			retArray[retArray.length] = this.titleArray[i];
		}
	}
	
	return retArray;
}




TitleList.prototype.makeSystemTitleArray = function ()
{
	var tagName = "System";
	
	var nodeList = this.xmlDoc.getElementsByTagName(tagName);
	var systemTitleArray = new Array(nodeList.length);
	for(var i=0; i < nodeList.length; i++ ){
		systemTitleArray[i] = new SystemTitle( nodeList.item(i) );
	}
	
	return systemTitleArray;
}





TitleList.prototype.makeRoutingTitleArray = function ()
{
	var tagName = "Routing";
	
	var nodeList = this.xmlDoc.getElementsByTagName(tagName);
	var routingTitleArray = new Array(nodeList.length);
	for(var i=0; i < nodeList.length; i++ ){
		routingTitleArray[i] = new RoutingTitle( nodeList.item(i) );
	}
	
	return routingTitleArray;
}





TitleList.prototype.makeRelayTitleArray = function ()
{
	var tagName = "Relay";
	
	var nodeList = this.xmlDoc.getElementsByTagName(tagName);
	var relayTitleArray = new Array(nodeList.length);
	for(var i=0; i < nodeList.length; i++ ){
		relayTitleArray[i] = new RelayTitle( nodeList.item(i) );
	}
	
	return relayTitleArray;
}




TitleList.prototype.getTitleArray = function ()
{
	return this.titleArray;
}




TitleList.prototype.getTitleObjByCode = function ( code )
{
	if( code == null ) return null;
	
	var titleObj = null;
	for( var i=0; i < this.titleArray.length; i++ ){
		if( this.titleArray[i].getCode() == code ){
			titleObj = this.titleArray[i];
			break;
		}
	}
	
	return titleObj;
}






















function SystemTitle( node )
{

	this.titleNode = node;
}






SystemTitle.prototype.getSC = function ()
{
	var sc = this.titleNode.getAttribute("tsc");

	if( sc != "" && sc != null){
		
		return sc;
	}
	else{
		return this.titleNode.getAttribute("sc");
	}
}



SystemTitle.prototype.getSCType = function ()
{
	var tsc = this.titleNode.getAttribute("tsc");
	if( tsc != ""){
		return "tmc";
	}
	else{
		return "jikou";
	}

}




SystemTitle.prototype.getCode = function ()
{
	var code = this.titleNode.selectSingleNode("name").getAttribute("code");
	
	return code;
}





SystemTitle.prototype.getName = function ()
{
	var name = this.titleNode.selectSingleNode("name").text;
	
	return name;
}




SystemTitle.prototype.getFigTextArray = function ()
{
	var figTextArray = new Array();
	
	var figNodes = this.titleNode.selectNodes("fig");
	for (var i=0; i < figNodes.length; i++) {
		figTextArray[figTextArray.length] = figNodes.item(i).text;
	}
	
	return figTextArray;
}





SystemTitle.prototype.getFigFileName = function (figNo)
{
	var figIndex = 0;
	if(isNaN(parseInt(figNo)) == false){
		figIndex = parseInt(figNo) - 1;
	}
	
	var figNodes = this.titleNode.selectNodes("fig");
	var fileName = figNodes.item(figIndex).text;
	var ext = figNodes.item(figIndex).getAttribute("type");
	fileName = fileName + "." + ext;
	
	return fileName;
}


SystemTitle.prototype.getPdfFileName = function ()
{
	var figNode = this.titleNode.selectSingleNode("fig");
	var fileName = figNode.text;
	var ext = "pdf";
	

	var startIndex = fileName.lastIndexOf("_");
	if( startIndex != -1 && startIndex != fileName.length -1){
		var lastName = fileName.slice(startIndex+1);
		var bDigit = true;
		for(var i=0; i < lastName.length; i++){
			if( lastName.charAt(i).search(/\d/) == -1 ){
				bDigit = false;
				break;
			}
		}
		if( bDigit )
			fileName = fileName.slice(0, startIndex);
	}
	
	return fileName + "." + ext;
}



SystemTitle.prototype.isInTerm = function ( term )
{
	if( term == null ) return true;
	
	var termNodes = this.titleNode.selectNodes("term");
	for( var i=0; i < termNodes.length; i++ ){
		var from = parseInt(termNodes.item(i).getAttribute("from"));

		if( from == null ) continue;
		if( from > term ) continue;
		
		var to = parseInt(termNodes.item(i).getAttribute("to"));

		if( to != null ){
			if( to < term ) continue;
		}
		
		return true;
	}
	
	return false;
}



SystemTitle.prototype.getType = function ()
{
	return "system";
}




























function RoutingTitle( node )
{

	this.titleNode = node;
}





RoutingTitle.prototype.getGroupCode = function ()
{
	var section = this.titleNode.getAttribute("section");

	var note = this.titleNode.getAttribute("note");
	
	var groupCode = null;

	if( note != null ){
		groupCode = section + note;
	} else {
		groupCode = section;
	}

	
	return groupCode;
}





RoutingTitle.prototype.getCode = function ()
{
	var code = this.titleNode.selectSingleNode("name").getAttribute("code");
	return code;
}




RoutingTitle.prototype.getTextName = function ()
{
	var name = this.titleNode.selectSingleNode("name").text;
	
	var note = this.titleNode.selectSingleNode("note");
	if( note != null ){
		if( note.text != "" )
			name = name + "(" + note.text + ")";
	}
	
	return name;
}




RoutingTitle.prototype.getTitleName = function ()
{
	var sectionCode = this.titleNode.getAttribute("section");
	var titleName = this.getTitleNameByCode( sectionCode );
	
	
	
	var note = this.titleNode.getAttribute("note");
	if( note != null )
		titleName = titleName + "(" + note + ")";
	
	return titleName;
}



RoutingTitle.prototype.getName = function ()
{
	var fullName = this.getTitleName() + " " + this.getTextName();
	return fullName;
}




RoutingTitle.prototype.getTitleNameByCode = function (code)
{
	var titleName = "";
	switch( code )
	{
		case "EG":

		titleName = "Engine Room";	break;
		
		case "INPANE":

		titleName = "Instrument Panel";	break;
		
		case "BODY":

		titleName = "Body";		break;
		
		case "SEAT":

		titleName = "Seat";		break;


		case "HVB":
		titleName = "Battery Pack (HV)";		break;
	}
	
	return titleName;
}




RoutingTitle.prototype.getFigTextArray = function ()
{
	var figTextArray = new Array();
	
	var figNodes = this.titleNode.selectNodes("fig");
	for (var i=0; i < figNodes.length; i++) {
		figTextArray[figTextArray.length] = figNodes.item(i).text;
	}
	
	return figTextArray;
}





RoutingTitle.prototype.getFigFileName = function (figNo)
{
	var figIndex = 0;
	if(isNaN(parseInt(figNo)) == false){
		figIndex = parseInt(figNo) - 1;
	}
	
	var figNodes = this.titleNode.selectNodes("fig");
	var fileName = figNodes.item(figIndex).text;
	var ext = figNodes.item(figIndex).getAttribute("type");
	fileName = fileName + "." + ext;
	
	return fileName;
}


RoutingTitle.prototype.getPdfFileName = function ()
{
	var figNode = this.titleNode.selectSingleNode("fig");
	var fileName = figNode.text;
	var ext = "pdf";
	

	var startIndex = fileName.lastIndexOf("_");
	if( startIndex != -1 && startIndex != fileName.length -1){
		var lastName = fileName.slice(startIndex+1);
		var bDigit = true;
		for(var i=0; i < lastName.length; i++){
			if( lastName.charAt(i).search(/\d/) == -1 ){
				bDigit = false;
				break;
			}
		}
		if( bDigit )
			fileName = fileName.slice(0, startIndex);
	}
	
	return fileName + "." + ext;
}



RoutingTitle.prototype.isInTerm = function ( term )
{
	if( term == null ) return true;
	
	var termNodes = this.titleNode.selectNodes("term");
	
	for( var i=0; i < termNodes.length; i++ ){
		var from = parseInt(termNodes.item(i).getAttribute("from"));

		if( from == null ) continue;
		if( from > term ) continue;
		
		var to = parseInt(termNodes.item(i).getAttribute("to"));

		if( to != null ){
			if( to < term ) continue;
		}
		
		return true;
	}
	
	return false;
}





RoutingTitle.prototype.getType = function ()
{
	return "routing";
}




























function RelayTitle( node )
{

	this.titleNode = node;
}






RelayTitle.prototype.getCode = function ()
{
	var code = this.titleNode.selectSingleNode("name").getAttribute("code");
	
	return code;
}





RelayTitle.prototype.getName = function ()
{
	var name = this.titleNode.selectSingleNode("name").text;
	
	return name;
}



RelayTitle.prototype.getFigTextArray = function ()
{
	var figTextArray = new Array();
	
	var figNodes = this.titleNode.selectNodes("fig");
	for (var i=0; i < figNodes.length; i++) {
		figTextArray[figTextArray.length] = figNodes.item(i).text;
	}
	
	return figTextArray;
}




RelayTitle.prototype.getFigFileName = function (figNo)
{
	var figIndex = 0;
	if(isNaN(parseInt(figNo)) == false){
		figIndex = parseInt(figNo) - 1;
	}
	
	var figNodes = this.titleNode.selectNodes("fig");
	var fileName = figNodes.item(figIndex).text;
	var ext = figNodes.item(figIndex).getAttribute("type");
	fileName = fileName + "." + ext;
	
	return fileName;
}



RelayTitle.prototype.getPdfFileName = function ()
{
	var figNode = this.titleNode.selectSingleNode("fig");
	var fileName = figNode.text;
	var ext = "pdf";
	

	var startIndex = fileName.lastIndexOf("_");
	if( startIndex != -1 && startIndex != fileName.length -1){
		var lastName = fileName.slice(startIndex+1);
		var bDigit = true;
		for(var i=0; i < lastName.length; i++){
			if( lastName.charAt(i).search(/\d/) == -1 ){
				bDigit = false;
				break;
			}
		}
		if( bDigit )
			fileName = fileName.slice(0, startIndex);
	}
	

	
	return fileName + "." + ext;
}




RelayTitle.prototype.getRelayType = function ()
{
	var type = this.titleNode.getAttribute("type");
	return type;
}


RelayTitle.prototype.getLocation = function ()
{
	var location = this.titleNode.getAttribute("location");
	return location;
}


RelayTitle.prototype.getObject = function ()
{
	var object = this.titleNode.getAttribute("object");
	return object;
}


RelayTitle.prototype.getInner = function ()
{
	var inner = this.titleNode.getAttribute("inner");
	return inner;
}


RelayTitle.prototype.isInner = function ()
{
	var type = this.getRelayType();
	if( type == "inner" )
		return true;
	else
		return false;
}


RelayTitle.prototype.hasInner = function ()
{
	var inner = this.getInner();
	if( inner != null && inner != "" )
		return true;
	else
		return false;
}


RelayTitle.prototype.isInTerm = function ( term )
{
	if( term == null ) return true;
	
	var termNodes = this.titleNode.selectNodes("term");
	
	for( var i=0; i < termNodes.length; i++ ){
		var from = parseInt(termNodes.item(i).getAttribute("from"));

		if( from == null ) continue;
		if( from > term ) continue;
		
		var to = parseInt(termNodes.item(i).getAttribute("to"));

		if( to != null ){
			if( to < term ) continue;
		}
		
		return true;
	}
	
	return false;
}




RelayTitle.prototype.getType = function ()
{
	return "relay";
}





