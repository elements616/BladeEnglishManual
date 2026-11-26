/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/





function Connect(path)
{

	this.xmlDoc = loadXML( path );
}



Connect.prototype.getConnectedEwdItem = function ( lineID )
{
	var connection = new Connection();
	connection.setDataFromXML( this.xmlDoc, lineID );
	
	var ewdItemArray = this.extractEwdItem( connection );
	
	return ewdItemArray;
}



Connect.prototype.extractEwdItem = function ( connection )
{
	var ewdItemArray = new Array();
	

	for( var j = 0; j < connection.connPinArray.length; j++ ){
		var ewdItem = connection.connPinArray[j].ewdItem;
		var nIndex = this.checkSameEWDItemIndex(ewdItemArray, ewdItem );
		
		ewdItemArray[nIndex] = ewdItem;
	}
	
	return ewdItemArray;
}



Connect.prototype.checkSameEWDItemIndex = function ( ewdItemArray, ewdItem )
{
	for( var cnt = 0; cnt < ewdItemArray.length; cnt++ ){

		if( ewdItemArray[cnt].isSame(ewdItem, true, false) ){
			return cnt;
		}
	}
	
	return ewdItemArray.length;
}







Connect.prototype.getConnectItem = function ( lineIDArray )
{
	var connectionArray = new Array();
	
	for( var i = 0; i < lineIDArray.length; i++ ){
		connectionArray[i] = new Connection();
		connectionArray[i].setDataFromXML( this.xmlDoc, lineIDArray[i] );
	}
	
	var connectPinArray = this.extractConnectPin(connectionArray);
	
	return connectPinArray;
}



Connect.prototype.extractConnectPin = function (connectionArray)
{
	var connectPinArray = new Array();

	for( var i=0; i < connectionArray.length; i++ ){
		for( var j=0; j < connectionArray[i].connPinArray.length; j++ ){
			var pinObj =  connectionArray[i].connPinArray[j];
			var nIndex = this.checkSameConnectPinIndex( connectPinArray, pinObj );
			
			if( nIndex >= connectPinArray.length ){

				connectPinArray[nIndex] = pinObj;
			}
			else{

				connectPinArray[nIndex].addUsePin( pinObj.usePin );
			}
		}
	}

	return connectPinArray;
}



Connect.prototype.checkSameConnectPinIndex = function ( connectPinArray, pinObj )
{
	for( var cnt = 0; cnt < connectPinArray.length; cnt++ ){

		if( connectPinArray[cnt].ewdItem.isSame(pinObj.ewdItem, false, true) ){
			return cnt;
		}
	}

	return connectPinArray.length;
}














function Connection()
{
	this.lineID = null;
	this.connPinArray = new Array();
}

Connection.prototype.setDataFromXML = function ( xmlDoc, lineID )
{
	this.lineID = lineID;
	var lineNodeArray = this.searchLine( xmlDoc, lineID );
	
	this.getDataFromLine( lineNodeArray );
}


Connection.prototype.searchLine = function ( xmlDoc, lineID )
{
	var lineNodeArray = new Array();
	
	var lineNodes = xmlDoc.getElementsByTagName("line");
	for( var i = 0; i < lineNodes.length; i++ ){
		if( this.isContainLine(lineID, lineNodes.item(i)) ){
			lineNodeArray[lineNodeArray.length] = lineNodes.item(i);
		}
	}
	
	return lineNodeArray;
}


Connection.prototype.isContainLine = function (lineID, lineNode)
{



	var lineNodeID = lineNode.getAttribute("id");
	
	lineNodeIDArray = lineNodeID.split(":");
	for( var i=0; i < lineNodeIDArray.length; i++ ){
		if( lineNodeIDArray[i] == lineID ) return true;
	}
	
	return false;
}

Connection.prototype.getDataFromLine = function ( lineNodeArray )
{
	for( var i = 0; i < lineNodeArray.length; i++ ){
		this.getParentData( lineNodeArray[i] );
		this.getChildData( lineNodeArray[i] );
	}
}

Connection.prototype.getParentData = function ( lineNode )
{
	var connNode = lineNode.parentNode.parentNode;
	this.getPartsInfo( connNode );
}


Connection.prototype.getChildData = function ( lineNode )
{
	var connNodeList = lineNode.getElementsByTagName("connector");
	for( var i = 0; i < connNodeList.length; i++ ){
		this.getPartsInfo( connNodeList[i] );
	}
}




Connection.prototype.getPartsInfo = function ( connNode )
{
	var type = connNode.getAttribute("type");
	var code = connNode.getAttribute("code");
	var spec = connNode.getAttribute("spec");
	var pinNo = this.getPinNoData( connNode );
	

	var ewdItem = new EWDItem(code, type);
	ewdItem.spec = spec;
	ewdItem.pinNo = pinNo;
	

	var pinNoArray = this.makePinNoArray(connNode, pinNo);
	

	this.connPinArray[this.connPinArray.length] = new ConnectPin(ewdItem, pinNoArray);
}




Connection.prototype.getPinNoData = function ( connNode )
{
	var pinNode = connNode.selectSingleNode("pin");
	var pinNo = pinNode.getAttribute("no");
	
	if( pinNo == null || pinNo == "")
		return "0";
	else
		return pinNo;
}




Connection.prototype.makePinNoArray = function ( connNode, pinNo )
{
	var pinNoArray = new Array();
	var junctionNode = connNode.selectSingleNode("pin/junction");
	if( junctionNode == null ){
		pinNoArray[0] = pinNo;
	}
	else{
		var pointNode = junctionNode.selectSingleNode("point");
		var pinNodes = pointNode.getElementsByTagName("pin");
		for( var i = 0; i < pinNodes.length; i++ ){
			pinNoArray[i] = pinNodes[i].getAttribute("no");
		}
	}
	
	return pinNoArray;
}








function ConnectPin(ewdItem, pinNoArray)
{
	this.ewdItem = ewdItem;
	this.usePin  = pinNoArray;
}


ConnectPin.prototype.addUsePin = function ( pinNoArray )
{
	for( var i=0; i < pinNoArray.length; i++ ){

		var bFound = false;
		for( var j=0; j < this.usePin.length; j++ ){
			if( this.usePin[j] == pinNoArray[i] ){
				bFound = true;
				break;
			}
		}
		if( bFound ) continue;
		

		this.usePin[this.usePin.length] = pinNoArray[i];
	}
}












function filterEwdItemArray( ewdItemArray )
{
	var retEwdItemArray = new Array();
	
	for( var i=0; i < ewdItemArray.length; i++ ){

		if( ewdItemArray[i].type == "relay" ) continue;
		if( ewdItemArray[i].subType == "NON" ) continue;
		
		retEwdItemArray[retEwdItemArray.length] = ewdItemArray[i];
	}
	
	return retEwdItemArray;
}


function filterConnectPinArray( connectPinArray )
{
	var retConnectPinArray = new Array();
	
	for( var i=0; i < connectPinArray.length; i++ ){


		if( connectPinArray[i].ewdItem.type == "sp" )	continue;
		if( connectPinArray[i].ewdItem.type == "relay" ) continue;
		if( connectPinArray[i].ewdItem.subType == "NON" ) continue;
		
		retConnectPinArray[retConnectPinArray.length] = connectPinArray[i];
	}
	
	return retConnectPinArray;
}
