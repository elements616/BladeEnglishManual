/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/






function showPrintWindow()
{
	if( parent.d_mainframe.getMode == null ) return;
	var mode = parent.d_mainframe.getMode();
	
	switch (mode) {
	case "ConnectorList":
		showPrintDialogConn();
		break;
	
	case "Loads":
		showPrintDialogLoads();
		break;
		
	case "FigMap":
		openPDF();
		break;
		
	default:
		break;
	}
}





function showPrintDialogConn()
{
	var path = "connector/partsref_p.html"
	

	var selectedPinNoOfFigArray = new Array();
	var d_destFrame = parent.d_mainframe.d_info;
	for (var i=0; i < d_destFrame.window.document.embeds.length; i++) {
		var pinNoArray = null;
		try{
			var svgDoc = __svgDoc(d_destFrame.window.document.embeds[i]);
			pinNoArray = d_destFrame.getSelectedPinNoArray( svgDoc );
		}
		catch( e ){
			pinNoArray = null;
		}
		selectedPinNoOfFigArray[i] = pinNoArray;
	}
	
	var args = new Array();
	args[0] = "print";
	args[1] = getPrintDialogHeader();
	args[2] = d_destFrame.window.document.body.innerHTML;
	args[3] = selectedPinNoOfFigArray;
	
	var style = "dialogWidth:700px; dialogHeight:620px; help:no";
	
	self.showModalDialog( path, args, style );
}





function showPrintDialogLoads()
{
	var path = "loads/matrix_p.html"
	
	var args = new Array();
	args[0] = "print";
	args[1] = getPrintDialogHeader();
	args[2] = parent.d_mainframe.window.document.body.innerHTML;
	
	var style = "dialogWidth:700px; dialogHeight:620px; help:no";
	self.showModalDialog( path, args, style );
}





function openPDF()
{
	var titleObj = parent.d_mainframe.getTitleObj();

	var fileName = titleObj.getPdfFileName();
	var ewdType = titleObj.getType();
	fileName = "./" + ewdType + "/pdf/" + fileName;

	

	doPrintPDF( fileName );
}







function getPrintDialogHeader()
{
	var xmlDoc = loadXML("../styles/common/print_head.xml");
	return xmlDoc.xml;
}
