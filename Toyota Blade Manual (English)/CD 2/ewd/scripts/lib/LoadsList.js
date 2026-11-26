/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/



function LoadsList( path )
{
	this.xmlDoc = null;
	

	this.xmlDoc = loadXML( path );
}




LoadsList.prototype.makeBodyHTML = function ( xslPath, term, systemTitleList, routingTitleList )
{

	if( term != null ){
		if( systemTitleList != null )
			this.filtering( systemTitleList, term );
		if( routingTitleList != null )
			this.filtering( routingTitleList, term );
	}
	

	var xslDoc = loadXML(xslPath);
	var html = this.xmlDoc.transformNode(xslDoc);
	
	return html;
}





LoadsList.prototype.filtering = function ( titleList, term )
{

	titleList.filteringByTerm(term);
	

	var tagName = null;
	if( titleList.type == "system" )
		tagName = "System";
	else
		tagName = "Routing";
	var destNodes = this.xmlDoc.getElementsByTagName( tagName );
	

	for(var i=0; i < destNodes.length; i++){
		var destNode = destNodes.item(i);
		var code = destNode.getAttribute("code");
		var titleObj = titleList.getTitleObjByCode(code);
		
		if( titleObj == null ){
			destNode.parentNode.removeChild(destNode);
		}
	}
}
