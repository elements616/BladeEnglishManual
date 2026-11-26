/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/




function call_runOnLoadProc()
{
	try{
		showSystemTitleList();
	}
	catch( e ){
		window.alert(e.description);
	}
}




function call_runOnClickTitle( systemCode )
{
	try{
		var paramTable = makeParamTable();
		paramTable.put("ewd", systemCode);
		paramTable.put("ewd_type", "system");
		paramTable.put("term", getURLParam("term"));
		

		parent.window.location.assign("system/system.html" + makeParamString(paramTable) );
	}
	catch( e ){
		window.alert(e.description);
	}

}




function call_runOnMouseOver()
{
	try{
		window.event.srcElement.className = "titlelist_hover";
	}
	catch(e){
		window.alert(e.description);
	}
}




function call_runOnMouseOut()
{
	try{
		window.event.srcElement.className = "titlelist";
	}
	catch(e){
		window.alert(e.description);
	}
}




function showSystemTitleList()
{

	var xmlDoc = createListXML();

	var xslDoc = loadXML("../styles/category/system_index.xsl");
	document.body.innerHTML = xmlDoc.transformNode(xslDoc);

}



function createListXML()
{
	var xmlDoc = createDOM();
	

	var root = xmlDoc.createElement("List");
	xmlDoc.appendChild(root);
	
	

	var elHeader = xmlDoc.createElement("Header");
	elHeader.text = getScName();
	root.appendChild(elHeader);
	
	

	var elList = xmlDoc.createElement("TitleList");
	root.appendChild(elList);
	var systemArray = getSystemArray();
	for(var i=0; i < systemArray.length; i++ ){
		var elTitle = xmlDoc.createElement("Title");
		elTitle.setAttribute("code", systemArray[i].getCode());
		elTitle.text = systemArray[i].getName();
		elList.appendChild(elTitle);
	}
	
	return xmlDoc;
}




function getSystemArray()
{
	var titleList = new TitleList("./system/title.xml", "system");
	titleList.filteringByTerm(getURLParam("term"));
	
	var sc = getURLParam("sc");
	var systemTitleArray = titleList.getSystemTitleArrayBySC(sc);
	
	return systemTitleArray;
}





function getScName()
{
	var serviceCategory = new ServiceCategory("../defs/sc.xml");
	var category = serviceCategory.getCategory( getURLParam("sc") );
	if( category == null ){
		serviceCategory = new ServiceCategory("../defs/scJikou.xml");
		category = serviceCategory.getCategory( getURLParam("sc") );
	}
	if( category == null ) return "";
	
	return category.name;
}
