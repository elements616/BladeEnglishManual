/*
   Copyright (c) 2003 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/


var g_htmlOpenBtn;
var g_htmlCloseBtn;



function call_runOnLoadProc()
{
	
	try{

		if( parent.parent != null ){
			if( parent.parent.getTitleObj() != null ){
				document.all("debug_title").innerHTML = parent.parent.getTitleObj().getName();
			}
		}
		
		
		

		g_htmlOpenBtn = loadXML("../../styles/common/figtitle_default.xml").xml;
		g_htmlCloseBtn = loadXML("../../styles/common/figtitle_closed.xml").xml;
		

		var frmCtrl = getURLParam("frm_ctrl");
		if( frmCtrl == "close" ){
			changeButton(false);
		}
		else {
			changeButton(true);
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_showLocalNavi()
{
	try{
		var val = window.event.srcElement.value;
		
		if( val == "<" ){
			parent.parent.showLocalNavi(false);
			changeButton(false);
		}
		else if( val == ">" ){
			parent.parent.showLocalNavi(true);
			changeButton(true);
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}


function changeButton( val )
{
	var destObj = document.all("button_place");
	if( val ){
		destObj.innerHTML = g_htmlOpenBtn;
	}
	else {
		destObj.innerHTML = g_htmlCloseBtn;
	}
}




function isOpenFrame()
{
	if( document.all("btnFrmCtrl").value == "<" )
		return true;
	else
		return false;
}
