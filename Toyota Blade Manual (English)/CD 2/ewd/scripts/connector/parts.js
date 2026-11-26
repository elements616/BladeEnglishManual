/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/



var MODE = "ConnectorList";




function getMode()
{
	return MODE;
}


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
		
		d_search.window.location.assign("psearch.html" + window.location.search );
		d_list.window.location.assign("partslist.html" + window.location.search );
		d_info.window.location.assign("partsref.html" + window.location.search );
	}
	catch( e ){
		window.alert(e.description);
	}
}



function showNameList()
{
	d_list.window.location.assign("partslist_name.html");
}

function showCodeList()
{
	d_list.window.location.assign("partslist_code.html");
}

function showListByKey( key )
{
	d_list.showList(key);
}
