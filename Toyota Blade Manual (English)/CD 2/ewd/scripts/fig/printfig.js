/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function doPrintPDF( filePath )
{

	
	openPrintWindow(filePath);
}


function openPrintWindow(filePath)
{
	w = window.open( filePath, "_pdf",
		"left = 0, top = 0, width=700, height=600, toolbar=no, menubar=no, location=no, status=no, resizable=yes, scrollbars=yes" );
	return w;
}
