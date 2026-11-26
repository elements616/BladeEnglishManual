/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function openNewEWD( destURL, paramTable )
{
	paramTable.put("globalnavi","no");
	paramTable.put("localnavi","no");
	paramTable.put("imode","ewd");
	
	destURL += makeParamString(paramTable);
	
	var winStyle = makeWinStyleString();
	
	window.open( destURL , "newEwd" , winStyle);
}



function makeWinStyleString()
{

	var height = parent.d_map.window.document.body.clientHeight;
	var width = parent.d_map.window.document.body.clientWidth;
	var winY = window.screen.availHeight - height - 50;
	var winX = window.screen.availWidth - width - 20;
	
	var winStyle = "";
	winStyle += "height=" + height + ",width=" + width;
	winStyle += ",top=" + winY + ",left=" + winX;
	winStyle += ",status=no,resizable=yes,scrollbars=yes";
	
	return winStyle;
}


function openCompCheck(strParam)
{

	openWindowToCenter("../../../repair/html/isp_toc/ewd_frame.html" + strParam, "_blank", 700, 600, ", resizable=yes, scrollbars=yes" );
}


function openWindowToCenter(url, name, nWidth, nHeight, extStyle )
{
	var nTop = (window.screen.availHeight - nHeight) / 2;
	var nLeft = (window.screen.availWidth - nWidth) / 2;

	window.open( url, name, "width=" + nWidth + ",height=" + nHeight + ",top=" + nTop + ",left=" + nLeft + extStyle);
}
