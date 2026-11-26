/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/

var XML_SYSTEM = "../system/title.xml";
var XML_ROUTING = "../routing/title.xml";

var XML_PS = "ps.xml";
var XML_GP = "gp.xml";

var XSL_PS_CAPACITY = "../../styles/loads/ps_cap.xsl";
var XSL_PS_NAME     = "../../styles/loads/ps_name.xsl";
var XSL_GP          = "../../styles/loads/gp.xsl";

var MODE = "Loads";



function call_runOnLoadProc()
{
	try{
		if( parent.d_selector != null ){
			if( parent.getLoadedFlag() == true ){
				parent.d_selector.showPrintButton( true );
			}
			else{
				parent.d_selector.window.location.assign("../select.html?print=yes");
				parent.setLoadedFlag(true);
			}
		}
		
		
		if( self.dialogArguments != null ) {

			if( self.dialogArguments[0] == "print" ){
				document.body.innerHTML = self.dialogArguments[2];
				document.all("div_header").innerHTML = self.dialogArguments[1];
			}
			return;
		}
		
		
		var loads = getURLParam("loads");
		var sort = getURLParam("loads_sort");
		var targetID = getURLParam("loads_scroll");
		var term = getURLParam("term");
		
		

		if( loads == "gp" ){
			showGpMatrix(term);
		}
		else if( loads == "ps" ){
			if( sort == "capacity" )
				showPsMatrixOrderByCapacity(term);
			else if( sort == "name" )
				showPsMatrixOrderByName(term);
			else 
				showPsMatrixOrderByCapacity(term);
		}
		
		

		if( document.all(targetID) != null ){
			document.all(targetID).scrollIntoView();
		}
	}
	catch(e){
		window.alert(e.description);
	}
}



function call_runOnClickSystemProc( code, partsCode )
{
	try{
		if( self.window.dialogArguments != null ) return;
		
		var paramTable = makeParamTable();
		paramTable.put("ewd", code);
		paramTable.put("ewd_type", "system");
		if( partsCode != "" ){
			paramTable.put("code", partsCode)
			paramTable.put("type", "gp")
		}
		paramTable.put("term", getURLParam("term"));
		
		

		self.window.location.assign("../system/system.html" + makeParamString(paramTable) );
	}
	catch(e){
		window.alert(e.description);
	}
}


function call_runOnClickRoutingProc( code, partsCode )
{
	try{
		if( self.window.dialogArguments != null ) return;
		
		var paramTable = makeParamTable();
		paramTable.put("ewd", code);
		paramTable.put("ewd_type", "routing");
		if( partsCode != "" ){
			paramTable.put("code", partsCode)
			paramTable.put("type", "gp")
		}
		paramTable.put("term", getURLParam("term"));
		

		self.window.location.assign("../routing/routing.html" + makeParamString(paramTable) );
	}
	catch(e){
		window.alert(e.description);
	}
}


function call_runOnClickRelayProc( code )
{
	try{
		if( self.window.dialogArguments != null ) return;
		
		var paramTable = makeParamTable();
		paramTable.put("ewd", code);
		paramTable.put("ewd_type", "relay");
		paramTable.put("term", getURLParam("term"));
		

		self.window.location.assign("../routing/routing.html" + makeParamString(paramTable) );
	}
	catch(e){
		window.alert(e.description);
	}
}



function call_runOnMouseOverProc( obj )
{
	try{
		obj.className = "loads_ref_hover";
	}
	catch(e){
		window.alert(e.description);
	}
}


function call_runOnMouseOutProc( obj )
{
	try{
		obj.className = "loads_ref";
	}
	catch(e){
		window.alert(e.description);
	}
}



function call_runOnClickOrder( order )
{
	try{
		if( self.window.dialogArguments != null ) return;
		

		var term = getURLParam("term");
		switch( order ){
			case "capacity":
			showPsMatrixOrderByCapacity(term);
			break;
			
			case "name":
			showPsMatrixOrderByName(term);
			break;
		}
	}
	catch(e){
		window.alert(e.description);
	}
}







function getMode()
{
	return MODE;
}



function showPsMatrixOrderByCapacity(term)
{
	var loadsList = new LoadsList( XML_PS );
	var systemTitle = new TitleList( XML_SYSTEM, "system" );
	
	var html = loadsList.makeBodyHTML( XSL_PS_CAPACITY, term, systemTitle );
	document.body.innerHTML = html;
	
	document.all("optCapacity").checked = true;
}


function showPsMatrixOrderByName(term)
{
	var loadsList = new LoadsList( XML_PS );
	var systemTitle = new TitleList( XML_SYSTEM, "system" );
	
	var html = loadsList.makeBodyHTML( XSL_PS_NAME, term, systemTitle );
	document.body.innerHTML = html;
	
	document.all("optName").checked = true;
}


function showGpMatrix(term)
{
	var loadsList = new LoadsList( XML_GP );
	var systemTitle = new TitleList( XML_SYSTEM, "system" );
	var routingTitle = new TitleList( XML_ROUTING, "routing" );
	
	var html = loadsList.makeBodyHTML( XSL_GP, term, systemTitle, routingTitle );
	document.body.innerHTML = html;
}
