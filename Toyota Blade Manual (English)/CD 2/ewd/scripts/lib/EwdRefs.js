/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/



function EwdRefs(path)
{

	this.xmlDoc = null;
	

	this.xmlDoc = loadXML( path );
}





EwdRefs.prototype.makeRefsPartsObj = function ( partsCode, partsType )
{
	var partsNodes = this.xmlDoc.documentElement.selectNodes("Parts");
	var partsNode = null;
	for( var i=0; i < partsNodes.length; i++ ){
		if( partsNodes.item(i).getAttribute("id") == partsCode ){
			if( partsNodes.item(i).getAttribute("type") == partsType ){
				partsNode = partsNodes.item(i);
			}
		}
	}
	
	return new RefsParts(partsNode);
}





function RefsParts( node )
{

	this.refsPartsNode = node;
}


RefsParts.prototype.getTitleObjArray = function ( tagName, titleList )
{
	var titleObjArray = new Array();
	
	var nodeList = this.refsPartsNode.getElementsByTagName(tagName);
	for( var i=0; i < nodeList.length; i++ ){
		var ewdCode = nodeList.item(i).getAttribute("id");
		titleObjArray[titleObjArray.length] = titleList.getTitleObjByCode( ewdCode )
	}
	
	return titleObjArray;
}
