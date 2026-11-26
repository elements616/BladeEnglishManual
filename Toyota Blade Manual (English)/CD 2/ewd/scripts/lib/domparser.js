/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function loadXML( path )
{
	var xmlDoc = createDOM();
	
	if( xmlDoc.load(path) == false ){
		var err = new Error(0, "\r\n" + 
							"File: " + path + "\r\n" + 
							"Line: " + xmlDoc.parseError.line + "\r\n" + 
							"Content: " + xmlDoc.parseError.reason);
		throw err;
	}
	
	return xmlDoc;
}



function createDOM()
{

	var dom = new ActiveXObject("MSXML2.DOMDocument");

	dom.async = false;
	
	return dom;
}
