/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function PartsList()
{

	this.partsArray = new Array();
}



PartsList.prototype.getSamePartsIndex = function ( partsName, partsType )
{
	var nIndex = -1;
	if( this.partsArray == null )	return nIndex;
	
	var length = this.partsArray.length;
	for( var i = 0; i < this.partsArray.length; i++ ){
		if( this.partsArray[i].isSameName(partsName, partsType) ){
			nIndex = i;
			break;
		}
	}
	
	return nIndex;
}




PartsList.prototype.makePartsArrayForCode = function ( ewdPartsArray, query, fFilter )
{
	this.partsArray = new Array();
	if( ewdPartsArray == null ) return;
	if( query != null )	query = query.toUpperCase();
	
	for( var i = 0; i < ewdPartsArray.length; i++ ){
		var partsName = ewdPartsArray[i].getCode();
		var partsCode = ewdPartsArray[i].getCode();
		var partsType = ewdPartsArray[i].getType();
		if( query != null && query != ""){
			if( partsName.toUpperCase().indexOf( query ) == -1 ) continue;
		}
		
		this.partsArray[this.partsArray.length] = new Parts( partsName, partsCode, partsType );
	}
}





PartsList.prototype.makePartsArrayForName = function ( ewdPartsArray, query, fFilter )
{
	this.partsArray = new Array();
	if( ewdPartsArray == null ) return;
	if( query != null )	query = query.toUpperCase();
	
	for( var i = 0; i < ewdPartsArray.length; i++ ){
		var partsName = ewdPartsArray[i].getName();
		var partsCode = ewdPartsArray[i].getCode();
		var partsType = ewdPartsArray[i].getType();
		if( query != null && query != ""){
			if( partsName.toUpperCase().indexOf( query ) == -1 ) continue;
		}
		
		var nIndex = this.getSamePartsIndex( partsName, partsType );
		if( nIndex < 0 ){
			this.partsArray[this.partsArray.length] = new Parts( partsName, partsCode, partsType );
		}
		else{

			this.partsArray[nIndex].addCode( partsCode );
		}
	}
}





PartsList.prototype.makePartsArrayByEwdPartsList = function ( codeListArray, ewdPartsList )
{
	this.partsArray = new Array();
	if( ewdPartsList == null ) return;
	if( codeListArray == null ) return;
	
	var idArray = this.selectCodesID( codeListArray , "conn" );
	var ewdPartsArray = this.searchPartsObjs(ewdPartsList, idArray);
	
	for( var i = 0; i < ewdPartsArray.length; i++ ){
		var ewdPartsObj = ewdPartsArray[i];
		
		var partsCode = ewdPartsObj.getCode();
		var partsType = ewdPartsObj.getType();
		var partsName = ewdPartsObj.getName();
		
		var nIndex = this.getSamePartsIndex( partsName, partsType );
		if( nIndex < 0 ){
			this.partsArray[this.partsArray.length] = new Parts( partsName, partsCode, partsType );
		}
		else{

			this.partsArray[nIndex].addCode( partsCode );
		}
	}
	

	this.partsArray.sort(comparePartsObj);
}







PartsList.prototype.makePartsArrayForLocation = function ( codeListArray, ewdPartsList, titleList )
{
	this.partsArray = new Array();
	if( titleList == null ) return;
	if( codeListArray == null ) return;
	
	var idArray = this.selectCodesID( codeListArray );
	var titleArray = this.searchTitleObjs(titleList, idArray);
	
	for( var i = 0; i < titleArray.length; i++ ){
		var titleObj = titleArray[i];
		
		var partsCode = titleObj.getCode();
		var partsType = "relay";
		var partsName = titleObj.getName();
		
		var nIndex = this.getSamePartsIndex( partsName, partsType );
		if( nIndex < 0 ){
			this.partsArray[this.partsArray.length] = new Parts( partsName, partsCode, partsType );
		}
		else{

			this.partsArray[nIndex].addCode( partsCode );
		}
	}
	
	
	

	var idArray = this.selectCodesID( codeListArray , "conn" );
	var ewdPartsArray = this.searchPartsObjs(ewdPartsList, idArray);
	
	for( var i = 0; i < ewdPartsArray.length; i++ ){
		var ewdPartsObj = ewdPartsArray[i];
		
		var partsCode = ewdPartsObj.getCode();
		var partsType = ewdPartsObj.getType();
		var partsName = ewdPartsObj.getName();
		
		var nIndex = this.getSamePartsIndex( partsName, partsType );
		if( nIndex < 0 ){
			this.partsArray[this.partsArray.length] = new Parts( partsName, partsCode, partsType );
		}
		else{

			this.partsArray[nIndex].addCode( partsCode );
		}
	}
}





PartsList.prototype.makePartsArrayForObject = function ( codeListArray, ewdPartsList )
{
	this.partsArray = new Array();
	if( ewdPartsList == null ) return;
	if( codeListArray == null )	return;
	
	var idArray = this.selectCodesID( codeListArray );
	var ewdPartsArray = this.searchPartsObjs(ewdPartsList, idArray);
	
	for( var i = 0; i < ewdPartsArray.length; i++ ){
		var ewdPartsObj = ewdPartsArray[i];
		
		var partsCode = ewdPartsObj.getCode();
		var partsType = ewdPartsObj.getType();
		var partsName = ewdPartsObj.getName() + " - " + partsCode;
		
		var nIndex = this.getSamePartsIndex( partsName, partsType );
		if( nIndex < 0 ){
			this.partsArray[this.partsArray.length] = new Parts( partsName, partsCode, partsType );
		}
		else{

			this.partsArray[nIndex].addCode( partsCode );
		}
	}
}





PartsList.prototype.selectCodesID = function ( codeListArray, type )
{
	var idArray = new Array();
	
	for( var i=0; i < codeListArray.length; i++ ){
		idArray = idArray.concat(codeListArray[i].selectCodesID(type));
	}
	if( idArray.length == 0 ) return idArray;
	
	

	idArray.sort();
	var uniqueIDArray = new Array();
	uniqueIDArray[0] = idArray[0];
	for( var i=0; i < idArray.length; i++ ){
		if( uniqueIDArray[uniqueIDArray.length-1] != idArray[i] ){
			uniqueIDArray[uniqueIDArray.length] = idArray[i];
		}
	}
	
	return uniqueIDArray;
}


PartsList.prototype.searchPartsObjs = function ( ewdPartsList, idArray )
{
	var objArray = new Array();
	
	for( var i=0; i < idArray.length; i++ ){
		var partsCode = getCodeFromID(idArray[i]);
		var partsType = getTypeFromID(idArray[i]);
		

		var ewdPartsObjs = ewdPartsList.getItemArray(partsCode, partsType);
		if( ewdPartsObjs.length == 0 ){
			window.alert("Not Found : " + idArray[i]);
			continue;
		}
		

		objArray[objArray.length] = ewdPartsObjs[0];
	}
	
	return objArray;
}


PartsList.prototype.searchTitleObjs = function ( titleList, idArray )
{
	var objArray = new Array();
	
	for( var i = 0; i < idArray.length; i++ ){
		var partsCode = getCodeFromID(idArray[i]);
		var partsType = getTypeFromID(idArray[i]);
		
		if( adjustType(partsType) != "relay" ) continue;
		

		var titleObj = titleList.getTitleObjByCode(partsCode);
		if( titleObj == null ){
			window.alert("Not Found : " + idArray[i]);
			continue;
		}
		

		objArray[objArray.length] = titleObj;
	}
	
	return objArray;
}





function comparePartsObj(obj1, obj2)
{
	if( obj1.name < obj2.name ){
		return -1;
	}
	else if( obj1.name > obj2.name ){
		return 1;
	}
	else{
		return 0;
	}
}










function Parts(name, code, type)
{
	this.codeArray = new Array();
	
	this.name = name;
	this.type = type;
	this.codeArray[0] = code;
}


Parts.prototype.isSameName = function ( name, type )
{
	if( name != this.name )	return false;
	if( type != this.type )	return false;
	return true;
}


Parts.prototype.addCode = function ( code )
{
	for( var i=0; i < this.codeArray.length; i++ ){
		if(this.codeArray[i] == code) return;
	}
	
	this.codeArray[this.codeArray.length] = code;
}


Parts.prototype.makeID = function ()
{
	return makeID(this.codeArray.join(","), this.type);
}










function makePartsList( titleObj, codeListArray )
{
	var partsList = new PartsList();
	
	var ewdPartsList = new EwdPartsList("../connector/parts.xml");
	var titleList = new TitleList("../relay/title.xml", "relay");
	

	var mapType = titleObj.getType();
	if( mapType == "system" || mapType == "routing" ){
		partsList.makePartsArrayByEwdPartsList(codeListArray, ewdPartsList);
	}

	else {
		var relayType = titleObj.getRelayType();
		if( relayType == "location" ){
			partsList.makePartsArrayForLocation(codeListArray, ewdPartsList, titleList);
		}
		else if( relayType == "object" || relayType == "inner"){
			partsList.makePartsArrayForObject(codeListArray, ewdPartsList);
		}
	}
	
	return partsList;
}
