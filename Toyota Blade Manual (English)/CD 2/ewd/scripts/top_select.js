/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function call_runOnClickRepair()
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term",top.getURLParam("term"));
		
		top.window.location.assign("../repair/html/toc/frame.html" + makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickNFC()
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term",top.getURLParam("term"));
		
		top.window.location.assign("../ncf/html/toc_frame.html" + makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickEWD()
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term",top.getURLParam("term"));
		
		top.window.location.assign("./index.html" + makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickRepairFRP()
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term",top.getURLParam("term"));
		
		top.window.location.assign("../repair/html/toc/frp_frame.html" + makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}






function call_runOnClickOtherWindow()
{
	try{

		window.open("../index.html" , "_blank", "width=950, height=620, top=16, left=16, status=yes, menubar=yes, resizable=yes, scrollbars=yes");
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
		
		top.window.location.assign("../index.html" + makeParamString(paramTable));
	}
	catch( e ){
		window.alert(e.description);
	}
}
