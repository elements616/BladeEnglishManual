/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function CodeList( path )
{

	this.xmlDoc = null;
	

	this.xmlDoc = loadXML( path );
}


CodeList.prototype.selectCodesID = function ( type )
{
	var idArray = new Array();
	
	var tagName = "Code";
	if( type != null ) tagName = tagName + "[@type='" + type + "']";
	
	var codeNodes = this.xmlDoc.getElementsByTagName(tagName);
	for( var i=0; i < codeNodes.length; i++ ){

		var code = codeNodes.item(i).text;
		var type = codeNodes.item(i).getAttribute("type");
		idArray[idArray.length] = makeID(code, type);
	}
	
	return idArray;
}



CodeList.prototype.isContain = function ( code, type )
{
	var tagName = "Code";
	var codeNodes = this.xmlDoc.getElementsByTagName(tagName);
	for( var i=0; i < codeNodes.length; i++ ){

		if( codeNodes.item(i).text != code )
			continue;
		if( adjustType(codeNodes.item(i).getAttribute("type")) != adjustType(type) )
			continue;
		
		return true;
	}
	return false;
}














function makeCodesFilePath(ewdType, figName)
{
	var path = "../" + ewdType + "/codes/" + figName + ".xml";
	return path;
}



function makeCodeListArray( titleObj )
{
	var codeListArray = new Array();
	
	var figTextArray = titleObj.getFigTextArray()
	for( var i=0; i < figTextArray.length; i++ ){
		var path = makeCodesFilePath( titleObj.getType(), figTextArray[i] );
		codeListArray[i] = new CodeList(path);
	}
	
	return codeListArray;
}



function searchFigNoArray( partsCode, partsType, codeListArray )
{
	var figNoArray = new Array();
	
	for( var i=0; i < codeListArray.length; i++ ){
		if( codeListArray[i].isContain(partsCode, partsType) ){
			figNoArray[figNoArray.length] = i + 1;
		}
	}
	
	return figNoArray;
}
