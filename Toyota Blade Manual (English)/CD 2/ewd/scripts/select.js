/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function call_runOnLoadProc()
{
	try{
		if( getURLParam("print") == "yes" )
			showPrintButton( true );
	}
	catch( e ){
		window.alert(e.description);
	}
}





function call_runOnClickCategorySelect( category )
{
	try{
		showPrintButton( false );
		
		var paramTable = makeParamTable();
		paramTable.put("category",category);
		paramTable.put("imode","category");
		paramTable.put("term",top.getURLParam("term"));
		
		if( parent.d_mainframe == null ) return;
		parent.d_mainframe.window.location.assign("category_frame.html" + makeParamString(paramTable) );
	}
	catch( e ){
		window.alert(e.description);
	}
}




function call_runOnClickPrtBtn()
{
	try{
		showPrintWindow()
	}
	catch( e ){
		window.alert(e.description);
	}
}






function call_runOnClickOtherWindow()
{
	try{

		window.open("../../index.html" , "_blank", "width=950, height=620, top=16, left=16, status=yes, menubar=yes, resizable=yes, scrollbars=yes");
	}
	catch( e ){
		window.alert(e.description);
	}
}




function call_runOnClickLinkToTop()
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term",top.getURLParam("term"));
		
		top.window.location.assign("../../index.html" + makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}



function showPrintButton( bool )
{
	if( bool ){
		document.all("print").style.visibility = "visible";
	} else {
		document.all("print").style.visibility = "hidden";
	}
}
