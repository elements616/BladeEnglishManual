

function call_runOnLoad()
{
}

function call_runOnMouseOver(){
	var obj = event.srcElement;
	if( obj.className == "menu-active" ) return;
	obj.className = "menu-hover";
}

function call_runOnMouseOut(){
	var obj = event.srcElement;
	if( obj.className == "menu-active" ) return;
	obj.className = "menu";
}

function call_runOnClickItem(code)
{
	selectItem( code );
	resetItemStyle();
	setSelectedItemStyle(event.srcElement);
}




function selectItem( code )
{
	var ewdType = document.all("ewdType").value;
	
	if( ewdType == "system" ){
		window.open( "../conninfo_system/" + code + ".html" , "conn" );
		return;
	}
	
	if( ewdType == "routing" ){
		window.open( "../conninfo_routing/" + code + ".html" , "conn" );
		return;
	}
	
	if( ewdType == "relay" ){
		window.open( "../conninfo_relay/" + code + ".html" , "conn" );
		return;
	}
}


function setSelectedItemStyle( destObj )
{
	if( destObj != null )
		destObj.className = "menu-active";
}

function resetItemStyle()
{
	var obj = document.all.tags("div");
	
	for(var i=0; i < obj.length; i++ ){
		if( obj(i).className != "menu" )
			obj(i).className = "menu";
	}
}
