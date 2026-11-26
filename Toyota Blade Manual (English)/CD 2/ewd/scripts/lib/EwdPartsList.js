/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function EwdPartsList( path )
{

	this.xmlDoc = null;
	this.ewdPartsArray = null;
	
	

	this.xmlDoc = loadXML( path );
	this.ewdPartsArray = this.makeEwdPartsArray();
}




EwdPartsList.prototype.makeEwdPartsArray = function ()
{
	var tagName = "CodedItem";
	
	var nodeList = this.xmlDoc.getElementsByTagName(tagName);
	var itemClsArray = new Array(nodeList.length);
	for(var i=0; i < nodeList.length; i++ ){
		itemClsArray[i] = new EwdParts( nodeList.item(i) );
	}
	
	return itemClsArray;
}


EwdPartsList.prototype.getItemArray = function ( code, type )
{
	var retArray = new Array();
	for( var i=0; i < this.ewdPartsArray.length; i++ ){
		var tmpParts = this.ewdPartsArray[i];
		if( tmpParts.getCode() != code )
			continue;
		if( adjustType(tmpParts.getType()) != adjustType(type) )
			continue;
		
		retArray[retArray.length] = tmpParts;
	}
	return retArray;
}


EwdPartsList.prototype.getItem = function ( code, type, spec )
{
	for( var i=0; i < this.ewdPartsArray.length; i++ ){
		var tmpParts = this.ewdPartsArray[i];
		if( tmpParts.getCode() != code )
			continue;
		if( adjustType(tmpParts.getType()) != adjustType(type) )
			continue;
		if( tmpParts.getSpec().toUpperCase() != spec.toUpperCase() )
			continue;
		
		return tmpParts;
	}
	return null;
}


EwdPartsList.prototype.getLang = function ()
{
	return this.xmlDoc.documentElement.getAttribute("xml:lang");
}







function EwdParts( node )
{

	this.ewdPartsNode = node;
}


EwdParts.prototype.getCode = function ()
{
	var code = this.ewdPartsNode.getAttribute("code");
	return code;
}

EwdParts.prototype.getType = function ()
{
	var type = this.ewdPartsNode.getAttribute("type");
	return type;
}

EwdParts.prototype.getName = function ()
{
	var name = this.ewdPartsNode.selectSingleNode("name").text;
	return name;
}


EwdParts.prototype.getNameCode = function ()
{
	var code = this.ewdPartsNode.selectSingleNode("name").getAttribute("code");
	return code;
}

EwdParts.prototype.getNo = function ()
{
	var no = this.ewdPartsNode.selectSingleNode("partNo").text;
	return no;
}

EwdParts.prototype.getColor = function ()
{
	var color = this.ewdPartsNode.selectSingleNode("color").text;
	return color;
}

EwdParts.prototype.getSpec = function ()
{
	var spec = this.ewdPartsNode.selectSingleNode("spec").text;
	return spec;
}


EwdParts.prototype.getRepair = function ()
{
	var repair = this.ewdPartsNode.selectSingleNode("repairWire").text;
	return repair;
}

EwdParts.prototype.getFig = function ()
{
	var fig = this.ewdPartsNode.selectSingleNode("fig").text;
	var type = this.ewdPartsNode.selectSingleNode("fig").getAttribute("type");
	fig = fig + "." + type;
	return fig;
}


EwdParts.prototype.getFigFileName = function ()
{
	var fig = this.ewdPartsNode.selectSingleNode("fig").text;
	if( fig != null && fig != "" ){
		fig = fig + "." + this.ewdPartsNode.selectSingleNode("fig").getAttribute("type");
	}
	return fig;
}
