/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/





function call_runOnClickConnectorList()
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("term", getURLParam("term"));
		
		parent.window.location.assign( "connector/parts.html" + makeParamString(paramTable) );
	}
	catch( e ){
		window.alert(e.description);
	}
}





function call_runOnClickLoads( loads )
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("loads",loads);
		paramTable.put("term", getURLParam("term"));
		
		parent.window.location.assign( "loads/matrix.html" + makeParamString(paramTable) );
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnMouseOver()
{
	try{
		window.event.srcElement.className = "titlelist_hover";
	}
	catch(e){
		window.alert(e.description);
	}
}



function call_runOnMouseOut()
{
	try{
		window.event.srcElement.className = "titlelist";
	}
	catch(e){
		window.alert(e.description);
	}
}

