/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function SysRefs(path)
{

	this.xmlDoc = null;
	

	this.xmlDoc = loadXML( path );
}




SysRefs.prototype.makeTitleObjArray = function ( ewdParts, systemTitleList )
{
	var connNode = this.getConnNode( ewdParts );
	
	var systemNodeArray = this.getSystemNodeArray( connNode );
	


	var titleObjArray = this.cvtSystemNodeArray( systemNodeArray, systemTitleList );
	titleObjArray = this.filtering(titleObjArray);
	
	return titleObjArray;
}




SysRefs.prototype.makeTitleObjArrayByPinNoArray = function ( ewdParts, pinNoArray, systemTitleList )
{
	var connNode = this.getConnNode( ewdParts );
	
	var systemNodeArray = this.getSystemNodeArrayByPinNoArray( connNode, pinNoArray );
	


	var titleObjArray = this.cvtSystemNodeArray( systemNodeArray, systemTitleList );
	titleObjArray = this.filtering(titleObjArray);
	
	return titleObjArray;
}




SysRefs.prototype.getConnNode = function ( ewdParts )
{
	var ewdItemCode = ewdParts.getCode();
	var ewdItemType = ewdParts.getType();
	var ewdItemSpec = ewdParts.getSpec();
	if( ewdItemType == "jbc" ) return null;
	
	var connNodes = this.xmlDoc.getElementsByTagName("connector");
	for( var i=0; i < connNodes.length; i++ ){

		if( connNodes.item(i).getAttribute("id") != ewdItemCode ) continue;
		if( connNodes.item(i).getAttribute("type") != ewdItemType ) continue;
		if( connNodes.item(i).getAttribute("spec").toUpperCase() != ewdItemSpec.toUpperCase() ) continue;
		return connNodes.item(i);
	}
	
	return null;
}




SysRefs.prototype.getSystemNodeArray = function ( connNode )
{
	if( connNode == null ) return new Array();
	
	var systemNodes = connNode.getElementsByTagName("system");
	
	var systemNodeArray = new Array();
	for( var i=0; i < systemNodes.length; i++ ){
		systemNodeArray[i] = systemNodes.item(i);
	}
	
	return systemNodeArray;
}




SysRefs.prototype.getSystemNodeArrayByPinNoArray = function ( connNode, pinNoArray )
{
	if( connNode == null ) return new Array();
	
	var systemNodes = connNode.getElementsByTagName("system");
	
	var systemNodeArray = new Array();
	for( var i=0; i < systemNodes.length; i++ ){
		var attrPinNo = systemNodes.item(i).parentNode.getAttribute("no");
		for( var j=0; j < pinNoArray.length; j++ ){
			if( attrPinNo == pinNoArray[j] ){
				systemNodeArray[systemNodeArray.length] = systemNodes.item(i);
				break;
			}
		}
	}
	
	return systemNodeArray;
}





SysRefs.prototype.cvtSystemNodeArray = function ( systemNodeArray, systemTitleList )
{
	var retTitleObjArray = new Array();
	
	var titleObjArray = systemTitleList.getTitleArray();
	
	for( var i=0; i < titleObjArray.length; i++ ){
		for( var j=0; j < systemNodeArray.length; j++ ){
			if( titleObjArray[i].getCode() == systemNodeArray[j].getAttribute("id") ){
				retTitleObjArray[retTitleObjArray.length] = titleObjArray[i];
				break;
			}
		}
	}
	
	return retTitleObjArray;
}




SysRefs.prototype.filtering = function ( titleObjArray )
{
	var retTitleObjArray = new Array();
	
	for( var i=0; i < titleObjArray.length; i++ ){
		var bFound = false;
		for( var j=0; j < retTitleObjArray.length; j++ ){
			if( titleObjArray[i].getCode() == retTitleObjArray[j].getCode() ){
				bFound = true;
				break;
			}
		}
		if(bFound) continue;
		
		retTitleObjArray[retTitleObjArray.length] = titleObjArray[i]
	}
	
	return retTitleObjArray;
}
