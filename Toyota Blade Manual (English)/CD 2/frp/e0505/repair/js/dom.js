/* $Id: dom.js,v 1.28 2004/12/07 12:34:02 k-narumi Exp $ */
//==================================================================//
//    DOM操作関数                                                   //
//    xml.jsが必要です。                                            //
//==================================================================//

// 
// パラグラフIDからパラグラフ名称を取得する
// arg[0]: パラグラフID
// arg[1]: パラグラフ名要素の名前                       省略時: name要素を参照
// arg[2]: 取得元オブジェクト(またはファイル名)         省略時: パラグラフID.xml
//
function getParagraphName() {
	if (arguments==null) {
		alert("Invalid arguments!");
		return null;
	}
	var paraId = arguments[0];
	var objXml = null;
	if (arguments[2]==null || typeof(arguments[2])=="string") {
		var fileName = (arguments[2]==null)?arguments[0].toLowerCase()+".xml":arguments[2].toLowerCase();
		objXml = initXml(fileName);
	} else {
		objXml = arguments[2];
	}
	var name = (arguments[1]==null)?"name":arguments[1];
	if (objXml==null) {
		alert("There is no XML object from which to obtain the paragraph name.");
		return null;
	}
	objXml.setProperty("SelectionLanguage", "XPath");
	var para = objXml.selectSingleNode("//para[@id='"+ paraId +"']/"+name).nodeTypedValue;
	if (para==null) {
		alert("Paragraph name is null!");
		return;
	}
	return para;
}

// 
// パラグラフIDから親タイトルの名称を取得する
// arg[0]: パラグラフID
// arg[1]: 取得元オブジェクト(またはファイル名)         省略時: パラグラフID.xml
//
function getTitleName() {
	if(arguments==null) {
		alert("Invalid arguments");
		return;
	}
	var paraId = arguments[0];
	var objXml = null;
	if (arguments[1]==null || typeof(arguments[1])=="string") {
		var fileName = (arguments[1]==null)?arguments[0].toLowerCase()+".xml":arguments[1].toLowerCase();
		objXml = initXml(fileName);
	} else {
		objXml = arguments[1];
	}
	if (objXml==null) {
		alert("There is no XML object from which to obtain the title name.");
		return null;
	}
	objXml.setProperty("SelectionLanguage", "XPath");
	var ttl = objXml.selectSingleNode("//ttl[para[@id='"+ paraId +"']]");
	var ttlName = ttl.getElementsByTagName("name").item(0).nodeTypedValue;
	if (ttlName==null) {
		alert("Title name is null!");
		return null;
	}
	return ttlName;
}

// 
// パラグラフから親セクションの名称を取得する
// arg[0]: パラグラフID
// arg[1]: 取得元オブジェクト(またはファイル名)         省略時: パラグラフID.xml
//
function getSectionName() {
	if(arguments==null) {
		alert("Invalid arguments");
		return;
	}
	var paraId = arguments[0];
	var objXml = null;
	if (arguments[1]==null || typeof(arguments[1])=="string") {
		var fileName = (arguments[1]==null)?arguments[0].toLowerCase()+".xml":arguments[1].toLowerCase();
		objXml = initXml(fileName);
	} else {
		objXml = arguments[1];
	}
	if (objXml==null) {
		alert("There is no XML object from which to obtain the section name.");
		return null;
	}
	objXml.setProperty("SelectionLanguage", "XPath");
	var sec = objXml.selectSingleNode("//section[descendant::para[@id='"+ paraId +"']]");
	var secName = sec.getElementsByTagName("name").item(0).nodeTypedValue;
	if (secName==null) {
		alert("Title name is null!");
		return;
	}
	return secName;
}

//
// パラグラフIDから親サービスカテゴリタイプの名称を取得する
// arg[0]: パラグラフID
// arg[1]: 取得元オブジェクト(またはファイル名)         省略時: パラグラフID.xml
//
function getServiceName() {
	if(arguments==null) {
		alert("Invalid arguments");
		return;
	}
	var paraId = arguments[0];
	var objXml = null;
	if (arguments[1]==null || typeof(arguments[1])=="string") {
		var fileName = (arguments[1]==null)?arguments[0].toLowerCase()+".xml":arguments[1].toLowerCase();
		objXml = initXml(fileName);
	} else {
		objXml = arguments[1]
	}
	if (objXml==null) {
		alert("There is no XML object from which to obtain the service category name.");
		return null;
	}
	objXml.setProperty("SelectionLanguage", "XPath");
	var sec  = objXml.selectSingleNode("//section[descendant::para[@id='"+ paraId +"']]");
	var sct  = objXml.selectSingleNode("//servcat[descendant::para[@id='"+ paraId +"']]");
	var dispName  = sct.getElementsByTagName("name").item(0).nodeTypedValue;
	if ( isNaN( sct.getAttribute("id").substring(0,1) ) ){
		dispName  = sec.getElementsByTagName("name").item(0).nodeTypedValue;
	}
	return dispName;
}

// 
// パラグラフIDからパラグラフに含まれる構成図(部品配置図)イラストIDのリストを取得
// paraId: パラグラフID
//
function getIllustIdList(paraId) {
	var fileName = "components.xml";
	var objXml = initXml(fileName);
	var illustNodes = objXml.selectNodes("//para[@id='"+ paraId +"']//illust");
	var illustIds = new Array();
	for (var i=0; i<illustNodes.length; i++) {
		var id = illustNodes.item(i).getAttribute("id");
		illustIds.push(id);
	}
	return illustIds;
}

// 
// 部品IDから部品名称を取得する
// arg[0]: 部品ID
//
function getPartsName( partsId ) {
	var objXml = initXml("parts.xml");
	var parts  = objXml.selectSingleNode("//parts[@id='"+ partsId +"']/name");
	if (parts==null) {
		return null;
	}
	return parts.nodeTypedValue;
}

//
// 指定されたパラグラフが特定のカテゴリを持つ兄弟パラグラフを
// 持つか調べる
// return:    ある -> true
//            ない -> false
//
function hasSiblingParagraph(tocXml, paraId, siblingCategory) {
	tocXml.setProperty("SelectionLanguage", "XPath");
	var ttl = tocXml.selectSingleNode("//ttl[para[@id='"+paraId+"']]");
	if (ttl==null)
		return false;
	var para = ttl.selectNodes("para[@category='"+siblingCategory+"']");
	return (para.length>0);
}

//
// 指定されたパラグラフが特定のカテゴリを持つ兄弟パラグラフを
// 取得する。(はじめに合致したもの)
// 
function getSiblingParagraph(tocXml, paraId, siblingCategory) {
	tocXml.setProperty("SelectionLanguage", "XPath");
	var ttl = tocXml.selectSingleNode("//ttl[para[@id='"+paraId+"']]");
	var para = ttl.selectSingleNode("para[@category='"+siblingCategory+"']");
	return para;
}

//
//frameロード時に実行：localフレームに出力するパラグラフのリストを返す。
//
function getParagraphList(tocXml,secId,secVa,ttlId,ttlVa){
	tocXml.setProperty("SelectionLanguage", "XPath");
	var ttlList = null;
	var paraList = null;
	var secList = tocXml.selectNodes("//section[self::node()[@id='"+ secId +"'] and self::node()[@variety ='"+ secVa +"']]");
	for(i=0;i<secList.length;i++){
		var secNode = secList.item(i);
		ttlList = secNode.selectNodes("./ttl[self::node()[@id ='"+ ttlId +"'] and self::node()[@variety ='"+ ttlVa +"']]");
		for(j=0;j<ttlList.length;j++){
			var ttlNode	= ttlList.item(j);
			paraList = ttlNode.selectNodes("./para[@category='A' or @category='F' or @category='L' or @category='M' or @category='N' or @category='G' or @category='D' or @category='U']");
		}
	}
	if(paraList.length == 0) {
		alert("There are no removal/installation items for the selected title.");
		return null;
	}
	return paraList;
}

// 
// パラグラフIDからパラグラフの親パラメータリストを取得する
// tocXml: 取得元オブジェクト
// paraId: パラグラフID
//
function getParaParentParameter(tocXml,paraId) {
	var paraNode    = tocXml.selectSingleNode("//servcat/section/ttl/para[@id='"+ paraId +"']");
	var ttlNode     = paraNode.parentNode;
	var sectionNode = ttlNode.parentNode;
	var servcatNode = sectionNode.parentNode;
	return    "?parag="+paraNode.getAttribute("id")
		+"&paraname="+paraNode.getElementsByTagName("name").item(0).nodeTypedValue
		+"&ttl="+ttlNode.getAttribute("id")
		+"&ttlvar="+ttlNode.getAttribute("variety")
		+"&ttlname="+ttlNode.getElementsByTagName("name").item(0).nodeTypedValue
		+"&section="+sectionNode.getAttribute("id")
		+"&sectionvar="+sectionNode.getAttribute("variety")
		+"&sectionname="+sectionNode.getElementsByTagName("name").item(0).nodeTypedValue
		+"&servcat="+servcatNode.getAttribute("id")
		+"&servcatname="+servcatNode.getElementsByTagName("name").item(0).nodeTypedValue
		;
}

// 
// 部品IDを元に手順XMLファイルインスタンスから同一タイトルのパラグラフリストを取得する
// partId : 部品ID
// procXml: 手順XMLファイルインスタンス
//
function getParaList(partId , procXml) {
	var ret  = new Array();
	var paraItems = procXml.selectNodes("//ttl[parts[@id='"+partId+"']]/para[@category='G']");
	for (var i=0; i<paraItems.length; i++) {
		ret.push(paraItems.item(i));
	}
	return ret;	
}

// タイトルIDから次の要領表示画面へ遷移するためのURLを取得する
// paraId:    パラグラフID
// illustId:  イラストID
// termId:    適用年月
// ttlId:     タイトルのID
// tocXmlObj: 取得元xmlオブジェクト
//
function getCttLink(paraId,illustId,termId,ttlId,tocXmlObj) {
	var target  = location;	
	//var parameterData = "?parag="+paraId+"&illust="+illustId+"&term="+termId;
	var parameterData = "?parag="+paraId+"&illust="+illustId;
	var blink   = "&"+getBackParameter(target.pathname,parameterData);
	if( paraId == null || illustId == null || paraId == "" || illustId == "" ){
		blink   = "";
	}
	var ttlItem = tocXmlObj.selectSingleNode("//ttl[@id='"+ ttlId +"']");
	var secItem = ttlItem.parentNode;
	var lik =   "?section="+secItem.getAttribute("id")
		+"&ttl="+ttlItem.getAttribute("id")
		+"&sectionvar="+secItem.getAttribute("variety")
		+"&ttlvar="+ttlItem.getAttribute("variety")
		+"&illust="+illustId
		+"&term="+termId
		+blink
		;
	return lik;
}
