/* $Id: xml.js,v 1.50 2006/08/29 02:08:30 h-suzuki Exp $ */
//
//  XML 関連 JavaScript
//  hashtable.js、util.jsをHTMLでインクルードして使用してください。
//
//

var g_displaySource = null;
var g_displayArgs   = null;
var g_displayXsl    = null;
var SEEPAGE_WIDTH   = 650;
var SEEPAGE_OFFSET  = 30;

//
//  XML文書オブジェクト、XSL文書オブジェクトのそれぞれを初期化します
//
function initXml(xmlFile, hasAbsolutePath, verbose) {
	var xmlPath = "";
	if (arguments.length==1 || !hasAbsolutePath) {
		xmlPath = getXmlPath(xmlFile);
	}
	var objXml = new ActiveXObject("Msxml2.DOMDocument");
	objXml.async = false;
	objXml.validateOnParse = false;
	objXml.resolveExternals = false;
//  try{objXml.setProperty("ForcedResync", false);}catch(e){/* MSXML3sp2 or lower */}

	objXml.load((xmlPath + xmlFile).toLowerCase());

	if (objXml.parseError.errorCode!=0) {
		var msg = objXml.parseError.reason;
		msg+= " [File:"+xmlPath +xmlFile+"]";
		if (arguments.length<3 || verbose) alert(msg);
		return null;
	}
	return objXml;
}

//
//
//
function getXmlPath(xmlFile) {
	var t0reg= new RegExp("pub|parts", "g");
	var treg = new RegExp("toc|proc|components|psearch|trouble|link", "g");
	var preg = new RegExp("ppr", "g");
	var sreg = new RegExp("scantool", "g");
	var lreg = new RegExp("html\/.*\/.*\.html","g");
	var term = getParameterValue("term");
	var path;
	var defaultPath = (location.toString().search(lreg) >= 0) ? "../../" : "../";
	if (xmlFile.search(t0reg)==0) {
			path = defaultPath + "term/";
	} else if (xmlFile.search(treg)==0) {
		if (term==null || term=="") {
			path = defaultPath + "term/";
		} else {
			path = getTermPath(term);
		}
	} else if (xmlFile.search(preg)==0) {
		path = defaultPath + "preparation/";
	} else if (xmlFile.search(sreg)==0) {
		path = defaultPath + "scantool/";
	} else {
		path = defaultPath + "contents/";
	}
	return path;
}

//
//
//
function getTermPath(term) {
	var lreg = new RegExp("html\/.*\/.*\.html","g");
	var defaultPath = (location.toString().search(lreg) >= 0) ? "../../" : "../";

	if (term == null || term == "") {
		return defaultPath + "term/";
	} 
	var path = defaultPath + "term/";
	var objXml = new ActiveXObject("Msxml2.DOMDocument");
	objXml.async = false;
	objXml.resolveExternals = false;
  try{objXml.setProperty("ForcedResync", false);}catch(e){/* MSXML3sp2 or lower */}

	objXml.load((path + "pub.xml").toLowerCase());

	if (objXml.parseError.errorCode!=0) {
		return path;
	}
	var termList = objXml.getElementsByTagName("term");
	var items = new Array();
	for (var i=0; i<termList.length; i++) {
		var date = termList.item(i).getAttribute("date");
		items.push(date);
	}
	items.sort();
	if(items[0]>term) return defaultPath + "term/";
	for (var i=1; i<items.length; i++) {
		if(items[i]>term)  return  defaultPath + items[i-1]+ "/";
	}
	return defaultPath + items[items.length-1]+ "/";
}

//
//
//
function initXsl(xslPath) {
	var objXsl = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
	objXsl.async = false;
//  2008/12/16 KSE Y.NARUMI 外部ファイル読み込み設定修正 START
//	objXsl.resolveExternals = false;
	objXsl.resolveExternals = true;
//  2008/12/16 KSE Y.NARUMI 外部ファイル読み込み設定修正 END
  try{objXsl.setProperty("ForcedResync", false);}catch(e){/* MSXML3sp2 or lower */}
	objXsl.load(xslPath.toLowerCase());
	if (objXsl.parseError.errorCode!=0) {
		var msg = objXsl.parseError.reason;
		msg+= " [XSL File:"+xslPath+"]";
		alert(msg);
		return;
	}
	return objXsl;
}

//
//  XML、XSLのDOMオブジェクトを受け取り指定されたHTML要素に
//  画面表示します。
//
function display(objXml, objXsl, objHtml, args) {
	if (objXml==null || objXsl==null || objHtml==null) {
		return;
	}
	var objTemp = new ActiveXObject("Msxml2.XSLTemplate");
	objTemp.stylesheet=objXsl;
	var objProc = objTemp.createProcessor();
	if (args != null) {
		var keys = args.keys();
		for (var i=0; i<args.size(); i++) {
			var val = args.get(keys[i]);
			objProc.addParameter(keys[i], args.get(keys[i]).toString());
		}
	}
	objProc.input = objXml;
	objProc.transform();
	objHtml.innerHTML=objProc.output;
 	setDisplaySource(objXml);
	setDisplayArgs(args);
	setDisplayXsl(objXsl);
}

//
//
//
function iterateDisplay(objXml, objXsl, objHtml, args, isInitial) {
	if (objXml==null || objXsl==null || objHtml==null) {
		return;
	}
	var objTemp = new ActiveXObject("Msxml2.XSLTemplate");
	objTemp.stylesheet=objXsl;
	var objProc = objTemp.createProcessor();
	if (args != null) {
		var keys = args.keys();
		for (var i=0; i<args.size(); i++) {
			var val = args.get(keys[i]);
			objProc.addParameter(keys[i], args.get(keys[i]).toString());
		}
	}
	objProc.input = objXml;
	objProc.transform();
	if(isInitial)
		objHtml.innerHTML=objProc.output;
	else
		objHtml.innerHTML+=objProc.output;
}

function setDisplaySource(objXml) {
	g_displaySource = objXml;
}
function setDisplayArgs(args) {
	g_displayArgs = args;
}
function setDisplayXsl(objXsl) {
	g_displayXsl = objXsl;
}
function getDisplaySource() {
	return g_displaySource;
}
function getDisplayArgs() {
	return g_displayArgs;
}
function getDisplayXsl() {
	return g_displayXsl;
}

//
//seePageオープン準備idの分割、適切なobjXml、objXsl作成。
//
var g_margin;
function seePage(xlink){
	var objXsl = null;
	var xlinkSub = null;
	var xlinkS1 = null;
	var xlinks = xlink.toLowerCase().split("_");
	var objXml = initXml(xlinks[0]+".xml",false,false);
	if ( objXml == null ) {
		alert(" File "+xlinks[0]+".xml not found.");
		return;
	}
	if(xlinks[1] != null) {
		xlinkSub = xlinks[0]+"_"+xlinks[1];
		if(xlinks[2] != null) xlinkS1 = xlink;
	}
	var category = objXml.selectSingleNode("//para").getAttribute("category");
	if(category == 'A' || category == 'M' || category =='N') objXsl = initXsl("../../xsl/rmv/through.xsl");
	if(category == 'G') objXsl = initXsl("../../xsl/isp/contents.xsl");
	if(category == 'C' || category == 'J') objXsl = initXsl("../../xsl/trb_dag/through_contents.xsl");
	var cats = new RegExp("L|F|H|S|T|D|U|V");
	if(category.search(cats) >= 0) objXsl = initXsl("../../xsl/toc/contents.xsl");
	if(category == 'K' || category == 'R') objXsl = initXsl("../../xsl/toc/comp_contents.xsl");

	var args = new Hashtable();
	//path この関数が呼ばされた先のパス
	args.put("path",location.pathname);
	args.put("xml",objXml);
	args.put("xsl",objXsl);
	if(g_margin==null) {
		g_margin = (screen.width - SEEPAGE_WIDTH)/2;
	} else if (g_margin + SEEPAGE_WIDTH + SEEPAGE_OFFSET + 10 > screen.width) {
		g_margin = 5;
	}
	args.put("margin",g_margin);
	if(xlinkSub != null) args.put("sub",xlinkSub);
	if(xlinkS1 != null) args.put("s1",xlinkS1);

	openSeePage(args);
}

function getSeePageMargin(){
	return g_margin;
}
function setSeePageMargin(mar){
	g_margin = mar;
}
