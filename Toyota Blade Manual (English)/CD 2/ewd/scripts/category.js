/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/





function call_runOnLoadProc()
{
	try{
		showCategoryList();
		
		loadTitleList();
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnClick()
{
	try{
		selectCategory( window.event.srcElement );
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnMouseOver(){
	try{
		var obj = window.event.srcElement;
		if( obj.className == "menu_active" ) return;
		obj.className = "menu_hover";
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnMouseOut(){
	try{
		var obj = window.event.srcElement;
		if( obj.className == "menu_active" ) return;
		obj.className = "menu";
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnClickInfo()
{
	try{
		selectInfo( window.event.srcElement );
	}
	catch( e ){
		window.alert(e.description);
	}
}


function call_runOnMouseOverInfo(){
	try{
		var obj = window.event.srcElement;
		if( obj.className == "category_active" ) return;
		obj.className = "category_hover";
	}
	catch( e ){
		window.alert(e.description);
	}
}



function call_runOnMouseOutInfo(){
	try{
		var obj = window.event.srcElement;
		if( obj.className == "category_active" ) return;
		obj.className = "category";
	}
	catch( e ){
		window.alert(e.description);
	}
}



function showCategoryList()
{

	var xmlDoc = createCategoryXML();
	var xslDoc = loadXML("../styles/category/category.xsl");
	document.body.innerHTML = xmlDoc.transformNode(xslDoc);

	
	
}




function createCategoryXML()
{
	var xmlDoc = createDOM();
	
	

	var root = xmlDoc.createElement("Category");
	xmlDoc.appendChild(root);
	
	
	

	var elTitle = xmlDoc.createElement("Title");
	if( getURLParam("imode") == null )
		elTitle.text = "index"
	else
		elTitle.text = "ewd"
	root.appendChild(elTitle);
	
	
	

	var elCategory = xmlDoc.createElement("CategoryInfo");
	root.appendChild(elCategory);
	

	var elSystem = xmlDoc.createElement("System");
	elCategory.appendChild(elSystem);
	var serviceCategory = new ServiceCategory("../defs/sc.xml");
	var scArray = getExistSCArray();
	var categoryObjArray = serviceCategory.getCategoryArrayByCodeArray( scArray );


	if(categoryObjArray.length == 0){
		serviceCategory = new ServiceCategory("../defs/scJikou.xml");
		scArray = getExistSCArray();
		categoryObjArray = serviceCategory.getCategoryArrayByCodeArray( scArray );
	}

	for(var i=0; i < categoryObjArray.length; i++ ){
		var elItem = xmlDoc.createElement("Item");
		elItem.setAttribute("code", categoryObjArray[i].code);
		elItem.text = categoryObjArray[i].name;
		elSystem.appendChild(elItem);
	}
	

	var elRouting = xmlDoc.createElement("Routing");
	elRouting.setAttribute("num", getExistRoutingNum());
	elCategory.appendChild(elRouting);
	
	return xmlDoc;
}




function getExistSCArray()
{
	var titleList = new TitleList("./system/title.xml", "system" );
	titleList.filteringByTerm(getURLParam("term"));
	
	return titleList.getExistScCodeArray();
}



function getExistRoutingNum()
{
	var routingTitleList = new TitleList("./routing/title.xml", "routing" );
	routingTitleList.filteringByTerm(getURLParam("term"));
	
	var relayTitleList = new TitleList("./relay/title.xml", "relay" );
	relayTitleList.filteringByTerm(getURLParam("term"));
	
	return routingTitleList.titleArray.length + relayTitleList.titleArray.length;
}




function loadTitleList()
{

	var category = getURLParam("category");
	var sc = getURLParam("sc");
	
	
	var destObj;
	switch( category ){
		case "system":
		if( sc == null )
			destObj = null;
		else
			destObj = document.all( sc );
		break;
		
		case "routing":
		destObj = document.all(category);
		break;
		
		case "cfe":
		destObj = document.all(category);
	}
	
	if( destObj == null ){
		var d_destFrame = parent.d_titlelist;
		var imode = getURLParam("imode");
		if( imode == null ){
			d_destFrame.window.location.assign( "system_top_m.html" );
		}
		else{
			d_destFrame.window.location.assign( "system_top.html" );
		}
	}
	else
		selectCategory( destObj );
}



function selectInfo( obj )
{
	if ( obj == null ) return;
	
	resetCategoryStyle();
	setSelectedInfoStyle( obj );
	
	parent.d_titlelist.window.location.assign("./common/index.html");
}




function selectCategory( obj )
{
	if ( obj == null ) return;
	
	
	resetCategoryStyle();
	setSelectedCategoryStyle( obj );
	
	
	var d_destFrame = parent.d_titlelist;
	if ( d_destFrame == null ) return;
	
	var paramTable = makeParamTable();
	paramTable.put("term", getURLParam("term"));
	
	if( obj.id == "cfe" ){
		d_destFrame.window.location.assign("cfe_index.html" + makeParamString(paramTable));
	}
	else if( obj.id == "routing" ){
		d_destFrame.window.location.assign("routing_index.html" + makeParamString(paramTable));
	}
	else {
		paramTable.put("sc", obj.id);
		d_destFrame.window.location.assign("system_index.html" + makeParamString(paramTable));
	}
}




function resetCategoryStyle()
{

	document.all("info").className = "category";
	

	var destObj = document.all("category");
	for(var i=0; i < destObj.all.tags("div").length; i++ ){
		destObj.all.tags("div").item(i).className = "menu";
	}
}




function setSelectedCategoryStyle(obj)
{
	obj.className = "menu_active";
}


function setSelectedInfoStyle(obj)
{
	obj.className = "category_active";
}
