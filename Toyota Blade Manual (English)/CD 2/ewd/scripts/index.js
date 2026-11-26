/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/



function call_runOnLoadProc()
{
	try{
		setGNaviFlag(true);
		

		var globalNavi = getURLParam("globalnavi");
		if( globalNavi == "no" ){
			document.all("frame1").rows = "0,*";
		}
		
		d_mainframe.window.location.assign("./ewd_main.html" + window.location.search);
	}
	catch( e ){
		window.alert(e.description);
	}
}
