var ZOOMINDEX_DEFAULT = 3;




function call_runOnLoadProc()
{
	try{
		var connlist = getURLParam("connlist");
		if( connlist == "yes" ){
			document.all("d_showConnList").style.visibility = "visible";
		}
		
		var pageSelect = getURLParam("page_select");
		if( pageSelect == "yes" ){
			document.all("page_select").style.visibility = "visible";
		}
		
		
		var figLength = getURLParam("fig_len");
		var figNo = getURLParam("fig_no");
		if( figNo == null ) figNo = "1";
		if( figLength != 1 ){
			document.all("fig_select").style.visibility = "visible";
			document.all("fig_no").innerHTML = figNo;
			if( figNo == 1 ){
				document.all("fig_back").style.visibility = "hidden";
			}
			if( figNo == figLength ){
				document.all("fig_next").style.visibility = "hidden";
			}
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickFigBack()
{
	try{
		var figLength = getURLParam("fig_len");
		var figNo = getURLParam("fig_no");
		if( figNo == null ) figNo = 1;
		
		var nextNo = parseInt(figNo) - 1;
		if( nextNo < 1 ) nextNo = figLength;
		

		parent.parent.loadMap(parent.parent.getTitleObj(), nextNo, null, null);
		

		parent.parent.d_partslist.resetItemStyle();
		

		(function (get, args) { var call = function () { var p = get(); if (!p || typeof p.resetPartsInfo !== 'function' || !p.document || p.document.readyState !== 'complete') return false; p.resetPartsInfo.apply(p, args); return true; }; if (!call()) { var n = 0, t = setInterval(function () { if (call() || ++n > 50) clearInterval(t); }, 100); } })(function () { return parent.parent.d_partsinfo; }, []);
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnClickFigNext()
{
	try{
		var figLength = getURLParam("fig_len");
		var figNo = getURLParam("fig_no");
		if( figNo == null ) figNo = 1;
		
		var nextNo = parseInt(figNo) + 1;
		if( nextNo > figLength ) nextNo = 1;
		

		parent.parent.loadMap(parent.parent.getTitleObj(), nextNo, null, null);
		

		parent.parent.d_partslist.resetItemStyle();
		

		(function (get, args) { var call = function () { var p = get(); if (!p || typeof p.resetPartsInfo !== 'function' || !p.document || p.document.readyState !== 'complete') return false; p.resetPartsInfo.apply(p, args); return true; }; if (!call()) { var n = 0, t = setInterval(function () { if (call() || ++n > 50) clearInterval(t); }, 100); } })(function () { return parent.parent.d_partsinfo; }, []);
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClickPage( pageNo )
{
	try{
		parent.parent.changePage( pageNo );
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_zoomIn()
{
	try{
		var result = window.parent.d_figmap.zoomCtrl("in");
		setZoomSelector( result );
	}
	catch( e ){
		window.alert(e.description);
	}
}

function call_zoomOut()
{
	try{
		var result = window.parent.d_figmap.zoomCtrl("out");
		setZoomSelector( result );
	}
	catch( e ){
		window.alert(e.description);
	}
}

function call_showWhole()
{
	try{
		window.parent.d_figmap.fitToWindow("all");
		setZoomSelector(ZOOMINDEX_DEFAULT);
	}
	catch( e ){
		window.alert(e.description);
	}
}

function call_fitToWindow()
{
	try{


		window.parent.d_figmap.fitToWindow("height");
		setZoomSelector(ZOOMINDEX_DEFAULT);
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_zooming()
{
	try{
		window.parent.d_figmap.setZoom( window.document.all.d_zoomSelector.selectedIndex );
		return true;
	}
	catch(e){
		return false;
	}
}



function call_showConnectList()
{
	try{
		parent.parent.showConnectList();
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_printEWD()
{
	try{
		var titleObj = parent.parent.getTitleObj();
		var fileName = titleObj.getPdfFileName();
		var ewdType = titleObj.getType();
		fileName = "../" + ewdType + "/pdf/" + fileName;
		
		parent.doPrintPDF( fileName );
	}
	catch( e ){
		window.alert(e.description);
	}
}


function setZoomSelector( nIndex )
{
	if( nIndex < 0 )	return;
	try{
		window.document.all.d_zoomSelector.selectedIndex = nIndex;
	}
	catch(e){
		window.alert( "zoom select error" );
	}
}



function getCurFigNo()
{
	var figNo = document.all("fig_no").innerHTML;
	

	if( isNaN(parseInt(figNo)) ){
		figNo = null;
	}
	
	return figNo;
}
