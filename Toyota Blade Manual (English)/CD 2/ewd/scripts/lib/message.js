/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/

var JPN = 0;
var ENG = 1;

var lung = JPN;




var IE_VERS_ERR			= new Array("Not supported in IE5.01",
									"IE5.01 has not corresponded.");

var SVGVIEWER_VERS_ERR	= new Array("Please use SVG viewer 3.0 or later",
									"SVG viewer version 3.0 or more are required.");

var NOT_FND_ERR			= new Array("Not found.",
									"not found.");

var NOT_FND_CONN_NO_ERR = new Array("Connector No. not found.",
									"not found connector number.");

var SELECT_PARTS_ERR	= new Array("No part is selected.",
									"not selected parts.");



function showMessage(type)
{
	window.alert(type[lung]);
}
