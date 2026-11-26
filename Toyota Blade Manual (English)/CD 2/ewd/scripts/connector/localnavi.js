/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved.
*/

var DEFAULT_COLS_SIZE = "250,*";
var DEFAULT_ROWS_SIZE = "200,*";

var g_partsList = null;
var g_codeListArray = null;

var g_prevColsSize = null;



function loadLocalNavi()
{
	initLocalNavi();
	initFrameSize();
	
	d_partslist.window.location.assign("../connector/plist.html" + window.location.search );
	d_partsinfo.window.location.assign("../connector/pinfo.html" + window.location.search );
}



function initLocalNavi()
{
	var titleObj = getTitleObj();
	g_codeListArray = makeCodeListArray( titleObj );
	g_partsList = makePartsList( titleObj, g_codeListArray );
}



function initFrameSize()
{
	g_prevColsSize = DEFAULT_COLS_SIZE;
	
	if( getURLParam("localnavi") == "no" ){
		document.all("Frame1").cols = "0,*";
	}
	else {
		if( getListLength() == 0 ){
			document.all("Frame1").cols = "0,*";
		}
		else {
			document.all("Frame1").cols = DEFAULT_COLS_SIZE;
		}
	}
	
	document.all("Frame2").rows = DEFAULT_ROWS_SIZE;
}






function getListLength()
{
	try{
		var length = g_partsList.partsArray.length;
		return length;
	}
	catch(e){
		window.alert(e.description);
		return null;
	}
}



function showConnListFrame( bool )
{
	var destObj = document.all("Frame2");
	
	if( bool ){
		destObj.rows = "0,*";
	}
	else {
		destObj.rows = DEFAULT_ROWS_SIZE;
	}
}


function showLocalNavi( bool )
{
	var destObj = document.all("Frame1");
	
	if( bool ){
		if( g_prevColsSize == null ) return;
		destObj.cols = g_prevColsSize;
		g_prevColsSize = null;
		setNoResize( destObj.children.item(0), false );
	}
	else {
		g_prevColsSize = destObj.cols;
		destObj.cols = "0,*";
		setNoResize( destObj.children.item(0), true );
	}
}


function setNoResize( frmset, val )
{
	for( i = 0; i < frmset.children.length; i++ ){
		frmset.children.item(i).noResize=val;
	}
}
