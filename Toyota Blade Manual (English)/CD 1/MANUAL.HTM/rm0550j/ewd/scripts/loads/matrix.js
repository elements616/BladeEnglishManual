/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function call_runOnClickSystemProc( code )
{
	top.window.location.href="../system/main/" + code + ".html";
}

function call_runOnClickRoutingProc( code )
{
	top.window.location.href="../routing/main/" + code + ".html";
}

function call_runOnClickRelayProc( code )
{
	top.window.location.href="../relay/main/" + code + ".html";
}










function call_runOnClickOrder( order )
{
	if( order == "capacity" )
	{
		self.window.location.href="ps_capacity.html";
		return;
	}
	
	if( order == "name" )
	{
		self.window.location.href="ps_name.html";
		return;
	}
}
