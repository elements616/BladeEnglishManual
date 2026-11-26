var view = null;
var svgEmbedName = "svgEmbed";
var bZoom = true;
var TITLE_SIZE = 14;


function call_runOnload()
{
	try{
		var fileName = getURLParam("figname");
		if( fileName == null )	return;
		
		showSVG( document.all.d_svgfig, fileName, svgEmbedName );
	}
	catch( e ){
		window.alert(e.description);
	}
}

function changeStyle_svgmap()
{
	document.all('d_msg').style.display="none";
}


function showSVG( dest, fileName, naming )
{
	if( dest == null || fileName == null || naming == null )	return false;
	dest.innerHTML = makeEmbedNode( fileName, naming );
}


function loadSVG(fileName)
{
	showSVG( document.all.d_svgfig, fileName, svgEmbedName );
}

function makeEmbedNode( fileName, naming )
{

	var embedString = "<embed src=\""  + fileName + "\" ";
	embedString +=	"name=\"" + naming + "\" ";
	embedString +=	"id=\"" + naming + "\" ";

	embedString +=	"width=\"0\" ";
	embedString +=	"height=\"0\" ";

	embedString +=	"type=\"image/svg+xml\" ";
	embedString +=	"pluginspage=\"http://www.adobe.com/svg/viewer/install/\" />";

	return(embedString);

}

function sendOnloadMsg(svgFig)
{
	svgFig.setEmbedNode( getEmbedNode(window.document, "d_svgfig") );
	changeStyle_svgmap();
	view = new View();
	view.setFig(svgFig);
	

	if( parent.parent.getTitleObj().getType() == "relay" ){
		if( parent.parent.getTitleObj().getRelayType() == "inner" )
			view.fInner = true;
	}
	
	fitToWindow("height");

	new Title( svgFig.svgRootNode.getOwnerDocument(), TITLE_SIZE );
	
	

	var ewdItemCode = getURLParam("code");
	var ewdItemType = getURLParam("type");
	if( ewdItemCode != null ){
		ewdItemCode = ewdItemCode.replace(/\x2B/g, ",");
		drawSymbol(ewdItemCode, ewdItemType, true);
	}
}

function fitToWindow(mode)
{


	view.setViewRect( window.document.body );

	view.fitToWindow(mode);


	partsIntoView();

}

function getEmbedNode( doc, id )
{
	return doc.all(id).getElementsByTagName("embed").item(0);
}

function zoomAndPan( svgNode )
{
	var bZoomed;


	view.setViewRect( window.document.body );


	var pCenter = view.culcZoomCenter();

	if( svgNode.currentScale > 1 )	bZoomed = view.zoom("in");
	else					bZoomed = view.zoom("out");

	if( bZoomed == false )	return;


	pCenter.magnify( view.fig.width / view.initFigRect.width );


	view.centering( pCenter );

	setZoomSelector();

}

function setZoomSelector()
{
	try{
		window.parent.d_figctrl.setZoomSelector(view.zoomStateIndex);
	}
	catch(e){
		alert("Zoom Selector error");
	}
}

function zoomCtrl(mode)
{
	var index;


	var bZoomed = view.zoom(mode);

	if( bZoomed == false )	return -1;

	index = view.getZoomStateIndex();

	partsIntoView();

	return index;
}

function setZoom(nIndex)
{
	view.setZoom(nIndex);
}

function translateToScroll( pos )
{
	window.confirm("not implemented");
}








function getConnectPinArray()
{
	var systemID = parent.parent.getTitleObj().getCode();
	var connect = new Connect( "../system/connect/" + systemID + ".xml" );
	
	var figNo = parent.d_figctrl.getCurFigNo();
	var lineIDArray = getBlinkingLineIDArray(figNo);
	var connectPinArray = connect.getConnectItem( lineIDArray );
	

	connectPinArray = filterConnectPinArray( connectPinArray );
	
	return connectPinArray;
}






function getFigName()
{
	var fileName = getURLParam("figname");
	
	var index = fileName.lastIndexOf("/") + 1;
	fileName = fileName.substring(index);
	
	index = fileName.lastIndexOf(".");
	if( index != -1 ){
		fileName = fileName.substring(0,index);
	}
	
	return fileName;
}
