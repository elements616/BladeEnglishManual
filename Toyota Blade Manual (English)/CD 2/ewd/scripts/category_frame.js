/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/





function call_runOnLoadProc()
{
	try{

		if( parent.d_selector != null ){
			if( parent.getGNaviFlag() == true ){
				if( parent.getLoadedFlag() == true ){
					parent.d_selector.showPrintButton( false );
				}
				else{
					parent.d_selector.window.location.assign("./select.html");
					parent.setLoadedFlag(true);
				}
			}
			else{
				parent.d_selector.window.location.assign("../select.html");
				parent.setGNaviFlag(true);
			}
		}
		
		loadCategory();
	}
	catch( e ){
		window.alert(e.description);
	}
}



function loadCategory()
{

	d_category.window.location.assign("category.html" + window.location.search );
}
