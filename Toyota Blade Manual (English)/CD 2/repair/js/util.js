/* $Id: util.js,v 1.68 2006/11/08 05:42:34 h-suzuki Exp $ */
//
//  雑多な JavaScript
//

//
// 渡した変数からパラメータを探す，最初に見つかった値を返す。
//  arguments[0]:    パラメータ名
//  arguments[1…]:  パラメータを含む変数(複数も可能)
//
function findParameterValue() {
	if (arguments.length <2) {
		return getParameterValue(arguments);
	} else {
		var key = arguments[0];
		var paramList = null;
		for(var i = 1; i<arguments.length; i++){
			paramList = arguments[i];
			var ret = getParameterValue(key , paramList );
			if( ret != null ) return ret;
		}
	} 
	return null;
}

//
//
//
//
function getParameterValue() {
	var key=null;
	var paramList = null;
	if (arguments.length <= 0) {
		return null;
	} else if (arguments.length == 1) {
		paramList = getParameterList();
		key = arguments[0];
	} else {
		if (arguments[1] == null) return null;
		paramList = getParameterList(arguments[1]);
		key = arguments[0];
	}
	if (paramList==null) return null;
	for(var i=0; i<paramList.length; i++) {
		var param = paramList[i].split("=");
		if(param[0].match(key)) return param[1];
	}
	return null;
}

//
//
//
//
function getParameterValueList() {
	var str = null;
	if (arguments.length <= 0) {
		str = location.search;
	} else {
		str = arguments[0];
	}
	var paramList = getParameterList(str);
	var list = new Array();
	for(var i=0; i<paramList.length; i++) {
		var param = paramList[i].split("=");
		list.push(param[1]);
	}
	return list;
}

//
//
//
//
function getParameterList() {
	var str;
	if (arguments.length <= 0) {
		str = location.search;
	} else {
		str = arguments[0].toString();
		//str = "?"+str.toString().split("?")[1];
		var n = str.indexOf("?");
		str = str.substring(n,str.length);
	}
	var loc = str.toString().substring(1, str.length);
	var paramList = loc.split("&");
	return paramList;
}

//
//
//
function openDialog(type, url) {
	var addDialog = "dialogWidth=950px; dialogHeight=600px; status=yes; resizable=yes; help=no;";
	var throughPrint = "dialogWidth=700px; dialogHeight=600px; status=yes; resizable=yes; help=no;";
	var normalPrint = "dialogWidth=700px; dialogHeight=600px; status=yes; resizable=yes; help=no;";
	var choiceTitleDialog = "dialogWidth=700px; dialogHeight=300px; status=yes; resizable=yes; help=no;";
	var seePageDialog = "dialogWidth=700px; dialogHeight=600px; status=yes; resizable=yes; help=no; dialogLeft="+g_margin+";";
	var pprDialog = "dialogWidth=700px; dialogHeight=600px; status=yes; resizable=yes; help=no; dialogLeft="+g_margin+";";
	var singledisplayDialog = "dialogWidth=700px; dialogHeight=640px; status=yes; resizable=yes; help=no; dialogLeft="+((screen.width - 650)/2-30)+";";
	var defaultDialog = "dialogWidth=700px; dialogHeight=600px; status=yes; resizable=yes; help=no;";
	switch (type) {
		case "print":
			var xml = getDisplaySource();
			var args = getDisplayArgs();
			var xsl = getDisplayXsl();
			showModalDialog(url, new Array(xml, args, xsl), normalPrint);
			break;
		case "tprint":
			var prt = getDisplaySource();
			showModalDialog(url, prt, throughPrint);
			break;
		case "additional":
			var args = getDisplayArgs();
			showModalDialog(url, args, addDialog);
			break;
		case "attention":
			var xml = getDisplaySource();
			var args = getDisplayArgs();
			showModalDialog(url,new Array(xml,args),defaultDialog);
			break;
		case "precheck":
			var xml = getDisplaySource();
			var args = getDisplayArgs();
			showModalDialog(url,new Array(xml,args),addDialog);
			break;
		case "checkdata":
			var xml = getDisplaySource();
			var args = getDisplayArgs();
			showModalDialog(url,new Array(xml,args),addDialog);
			break;
		case "trbprint":
			var xml = getDisplaySource();
			var args = getDisplayArgs();
			showModalDialog(url,new Array(xml,args), normalPrint);
			break;
		case "symptom":
			var args = getDisplayArgs();
			showModalDialog(url, args, throughPrint);
			break;
		case "seepage":
			var args = getDisplayArgs();
			showModalDialog(url, args, seePageDialog);
			break;
		case "ppr":
			//準備品があるかどうか判断する
			var args = new Array();
			var paraItems = getDisplayArgs();
			for (var i=0; i<paraItems.length; i++) {
				paraId = paraItems[i];
				var pprXml = initXml("ppr_" + paraId.toLowerCase() + ".xml",false,false);
				if ( pprXml == null ) {
					//alert("関連する準備品が見つかりません。[準備品ID:"+paraId +"]");
					continue;
				}
				args.push( paraId );
			}
			if ( args.length == 0 ) {
				alert("Related preparation not found.");
				break;
			}
			showModalDialog("../etc/"+url, args, pprDialog);
			break;
		case "singledisplay":
			var args = getDisplayArgs();
			var ret = showModalDialog(url, args , singledisplayDialog );
			return ret;
		case "alldisplay":
			var args = getDisplayArgs();
			var ret = showModalDialog(url, args , choiceTitleDialog );
			return ret;
		case "component":
		case "pdisplay":
			showModalDialog(url, getDisplayArgs(), throughPrint);
			break;
		case "guide":
			var prt = getDisplaySource();
			var arg = getDisplayArgs();
			showModalDialog(url, new Array(prt, arg), throughPrint);
			break;
		default:
			var xml = getDisplaySource();
			var ret = showModalDialog(url, xml, defaultDialog);
			if (ret!=null && ret!='')	{
				selectTypedLocation(ret, "C");
			}
	}
	return;
}

//
// 新しいウィンドウを表示します
// arguments[0]:   URL
// arguments[1]:   ウィンドウの名前
//
function openNewWindow() {
	if (arguments==null) return;
	var url = arguments[0];
	var name = (arguments[1]!=null) ? arguments[1] : "";
	win = window.open(url, name, "width=950, height=620, top=30, left=30, status=yes, menubar=yes, resizable=yes, scrollbars=yes");
	win.focus();
}

//
// URLに適用連番(パラメータ term)を追加して画面遷移する
// url:   追加元URL
// term:  適用時期
//
function setTermValue(url, term) {
/*
	if (url.indexOf('?')>0) {
		document.location.href=url+"&term="+term;
	} else {
		document.location.href=url+"?term="+term;
	}
*/
	var tv = null;
	if (arguments[1]==null) {
		var termElem = document.getElementById("term");
		if (termElem==null) {
			document.location.href=arguments[0];
			return;
		}
		tv = termElem.value;
		if (tv==null || tv=="") {
			alert("Please select the applicable date");
			return;
		}
	} else {
		tv = arguments[1];
	}
	if (arguments[0].indexOf('?')>0) {
		document.location.href=arguments[0]+"&term="+tv;
	} else {
		document.location.href=arguments[0]+"?term="+tv;
	}

}

//
//  フレームを印刷する
//
function framePrint(frameName) {
	var disp = frameName.disp;
	var chgSeepage = false;
	if (disp!= null) {
		// 印刷前の状態を退避
		var orgHtml = disp.innerHTML;
		// 参照ページ部変換
		chgSeepage = convSeepage(frameName.document);
	}
	frameName.focus();
	frameName.print();
	// 印刷前の状態に戻す
	if (disp!= null && chgSeepage) {
		disp.innerHTML = orgHtml;
	}
}

//
//  目次へリンクのパラメータを組み合わせる
// pathData: 戻るパスデータ
// parameterData: 戻るパラメータデータ
// hashParaId: 戻るURLのハッシュ(#)
//
function getBackParameter(pathData,parameterData,hashParaId) {
	var bd = pathData;
	var regTrb = new RegExp("repair.html.trb_toc", "g");
	var regMnt = new RegExp("repair.html.mnt", "g");
	var regRmv = new RegExp("repair.html.rmv_toc", "g");
	var regIsp = new RegExp("repair.html.isp_toc", "g");
	var regToc = new RegExp("repair.html.toc", "g");
	
	if (bd.search(regTrb)>0) {
		bd="trb_toc";
	} else if (bd.search(regMnt)>0) {
		bd="mnt";
	} else if (bd.search(regRmv)>0) {
		bd="rmv_toc";
	} else if (bd.search(regIsp)>0) {
		bd="isp_toc";
	} else if (bd.search(regToc)>0) {
		bd="toc";
	} else {
		bd="toc";
	}
	
	if( hashParaId == null) {
		hashParaId="";
	}else{
		hashParaId="&hashparag="+hashParaId;
	}	
	var bp = (parameterData+hashParaId).replace(/\=/g, "+");
	if (bp==null||bp.length=="") bp = location.search.replace(/\=/g, "+");
	bp = bp.replace(/\&/g, "?");
	return "bp="+bp+"&bd="+bd;
}

//
//  目次一覧などから要領表示画面への画面遷移を行う
//  paraId:   要領表示対象となるパラグラフのID
//  paratype: パラタイプ(先頭'P'の場合はポップアップ表示になる)
//
function selectTypedLocation(paraId, paratype, frpPub) {
	var absolutePath = (arguments.length>2 && frpPub!=null) 
		? "../../../frp/" + frpPub.toLowerCase() + "/repair/html/" 
		: "../";
	var target  = parent.contents.location;	
	var blink   = getBackParameter(target.pathname,target.search,paraId);
	var termId  = getParameterValue("term", parent.location);

	switch(paratype) {
		// 脱着要領
		case "A":
			setTermValue(absolutePath+"rmv_ctt/frame.html?parag="+paraId+"&"+blink, termId);
			break;
		case "PA":
			openNewWindow(absolutePath+"rmv_ctt/frame.html?parag=" + paraId + "&term=" + termId);
			break;
		// 診断要領(DTC)
		case "C":
			setTermValue(absolutePath+"trb_dag/frame.html?parag="+paraId+"&"+blink, termId);
			break;
		case "PC":
			openNewWindow(absolutePath+"trb_dag/frame.html?parag=" + paraId + "&term=" + termId);
			break;
		case "J":
			setTermValue(absolutePath+"trb_dag/frame.html?parag="+paraId+"&"+blink, termId);
			break;
		case "PJ":
			openNewWindow(absolutePath+"trb_dag/frame.html?parag=" + paraId + "&term=" + termId);
			break;
		// 点検要領
		case "G":
			setTermValue(absolutePath+"isp_ctt/frame.html?parag="+paraId+"&"+blink, termId);
			break;
		case "PG":
			openNewWindow(absolutePath+"isp_ctt/frame.html?parag=" + paraId + "&term=" + termId);
			break;
		// 診断要領(症状)
		// 構成図
		case "K":
			setTermValue(absolutePath+"rmv_toc/frame.html?parag="+paraId+"&"+blink, termId);
			break;
		case "PK":
			openNewWindow(absolutePath+"rmv_toc/frame.html?parag=" + paraId + "&term=" + termId);
			break;
		// 部品配置図
		case "R":
			setTermValue(absolutePath+"isp_toc/frame.html?parag="+paraId+"&"+blink, termId);
			break;
		case "PR":
			openNewWindow(absolutePath+"isp_toc/frame.html?parag=" + paraId + "&term=" + termId);
			break;
		default:
			if (paratype.length>1 && paratype.charAt(0)=='P') {
				openNewWindow(absolutePath+"toc/gen_frame.html?parag="+paraId+"&term="+termId);
			} else {
				setTermValue(absolutePath+"toc/gen_frame.html?parag="+paraId+"&"+blink, termId);
			}
	}
}

//
// 目次画面へリンクの動作
//
function backTocPage(bpara, bdir) {
	// 主にポップアップ
	if (bpara==null || bdir==null) {
		setTermValue("../index.html", getParameterValue("term", location));
		return;
	}
	bpara=bpara.replace(/\+/g, "=");
	bpara=bpara.replace(/\?/g, "&");
	bpara=bpara.replace(/&/, "?");
	setTermValue("../"+bdir+"/frame.html"+bpara, parent.getParameterValue("term"));
}

//
//SeePageのオープン/xml.js_seePage()から引数渡す。args:subpara_id&s-1_IdのHashTable
//
function openSeePage(subs1Id){
	setDisplayArgs(subs1Id);
	openDialog("seepage","../etc/seepage_frame.html");
}


// 
// ソートする区別子
//
//var g_splitMark = "------" ;
var g_splitMark = "!#$%" ;

// 
// 配列データをソートする
// arguments[0]: ソートキー
// arguments[1]: ソートキーによってソートデータ
// arguments[n]: ソートキーによってソートデータ
// 処理内容:
// 1.  sortOrder(new Array(22,12,55), 
//               new Array("22X","12X","55X"),
//               new Array("22Q","12Q","55Q")  
//              );
// 2.  new Array("22------22X--------22Q","12------12X--------12Q","55------55X--------55Q")
// 3.  ソートキーによってソートデータ
// 4.  new Array("12------12X--------12Q","22------22X--------22Q","55------55X--------55Q")
// 5.  return          new Array(12,22,55), 
//               new Array("12X","22X","55X"),
//               new Array("12Q","22Q","55Q")  
//

function sortOrder() {
	if (arguments==null) return;
	var sortBase = arguments[0];
	for (var i=0; i<arguments.length; i++) {
		if ( arguments[i].length !=  sortBase.length ){
			return;
		}
	}
	
	var sortData = new Array();
	for (var i=0; i<sortBase.length; i++) {
		var one = "";
		for (var j=0; j<arguments.length; j++) {
			one = one + arguments[j][i]  + g_splitMark;
		}
		//if(i %100==0)
			//alert("one ["+i+"]="+one );
		sortData.push(one); 
	}
	if( checkNumber(sortBase) ){
		sortData.sort(numberOrder);
	}else{
		sortData.sort();
	} 
	for (var i=0; i<sortData.length; i++) {
		var one = sortData[i].split(g_splitMark );
		for (var j=0; j<arguments.length; j++) {
			arguments[j][i]  = one[j];
		}
		//if(i %100==0)
		//alert("sortData["+i+"]="+sortData[i]);
	}
}

// 
// 配列に全部数字かチェック
//
function checkNumber(item) {
	for (var i=0; i<item.length; i++) {
		if(isNaN(item[i]) ) return false; 
	}
	return true;
}

// 
// ソートで使用する数字大小比較関数
// 数値順にソートする関数
//
function numberOrder(a,b) {
	var a1 = a.split(g_splitMark ); 
	var b1 = b.split(g_splitMark ); 
	return a1[0] - b1[0];
}

// *******************TEST******************** //
//sortOrder( new Array(22,12,11,33,55), new Array("22X","12X","11X","33X","55X"),new Array("22Q","12Q","11Q","33Q","55Q")   ) ;
// *******************TEST******************** //


//
// プロトコル判断
// ウェブサーバから場合は true を返す
//
function isHttpProtocol() {
	return ( location.protocol.indexOf("http")==0 )? true : false;
}

//
// プロトコル判断
// ローカルから場合は true を返す
//
function isFileProtocol() {
	return ( location.protocol.indexOf("file")==0 )? true : false;
}

//alert("isFileProtocol()="+isFileProtocol()+" isHttpProtocol()="+isHttpProtocol());


//
// ブラウザバージョン　判断
//
function checkIEVersion() { return true; /* modern browser */
	// テストを簡単にするために全文字列を小文字に変換
	var agt=navigator.userAgent.toLowerCase();

	// ブラウザバージョン
	var ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
	if( !ie ) {
		alert("This system operates only with Internet Explorer.");
		return false;
	}
	var m  = agt.indexOf("msie")+4;
	var n  = agt.indexOf(";",m);
	var   iestring  = agt.substring(m,n);
	var IEVersion = parseFloat( iestring ) ;
	if( IEVersion < 5.5 ) {
		alert("Please use version IE5.5 or later of this system. ");
		return false;
	}
	//alert("agt="+agt +"  IEVersion ="+IEVersion );
	return true;
}

//
//ActiveX　判断
//
function checkActiveX(name,msg,verbose) {
	//MSXML　判断
	try{
		var objXml = new ActiveXObject(name);
		if( objXml == null){
			if (arguments.length<3 || verbose) alert(msg);
			return false;
		}
	}catch(e){
		if (arguments.length<3 || verbose) alert(msg);
		return false;
	}	
	return true;
}


//
//SVGViewer　判断
//
function checkSvgViewer() { return true; /* modern browser */
	try{
		var objSvg = document.all.tags('embed');
		if( __svgDoc(objSvg[0]) == null){
			alert("Please install SVGViewer.");
			return false;
		}
	}catch(e){
		alert("Please install SVGViewer.");
		return false;
	}	
	
	//alert("objSvg ="+objSvg +" length ="+objSvg.length  );
	//alert(" __svgDoc(objSvg) ="+__svgDoc(objSvg[0]));
	return true;
}


//
//  印刷画面への画面遷移を行う
//  titleText:	印刷のタイトル
//  dispText:	印刷内容
//  windowTitle:	ダイアログウィンドウのタイトル
//
function printFrame(titleText, dispText, windowTitle) {
	// 印刷用設定(表示内容をdialogの引数で使用できるようにしておく)
	var arg = new Array(titleText,dispText,windowTitle);
	setDisplayArgs(arg);
	openDialog("pdisplay", "../etc/prt_frame.html");
}

//
// 参照ページ部をセクション／タイトル／パラ(適用時期)に変換する
// initXml使用の為、xml.jsがインポートされていない箇所からの呼び出しは不可
//
// doc htmlのドキュメント
//
function convSeepage(doc) {
	var chgSeepage = false;
	var refList = doc.getElementsByTagName("a");
	var tocXml = null;
	if (refList.length > 0) {
		tocXml = initXml("toc_rpr.xml");
	}
	for (var i=0; i<refList.length; i++) {
		var ref = refList.item(i);
		if (ref.name!="pvElement") {
			var paraId = null;
			var imgTagList = ref.getElementsByTagName("img");
			if (imgTagList.length > 0) {
				var imgSrc = imgTagList.item(0).getAttribute("src");
				// 参照ページアイコンの場合
				if (imgSrc.indexOf("extxref.png") != -1) {
					var onclickStr = ref.getAttribute("onclick").toString();
					paraId = onclickStr.substring(onclickStr.indexOf("'") + 1, onclickStr.lastIndexOf("'"));
				}
			}
			var flowCnvFlg = 0;
			var href = ref.getAttribute("href");
			// 診断症状の"フローへ"のリンクの場合
			if (href.indexOf("openNewWindow") != -1) {
				flowCnvFlg = 1;
				paraId = href.substr(href.indexOf("=") + 1, 15);
			}
			if (paraId == null) {
				continue;
			}
			chgSeepage = true;
			// パラID取り出し(サブパラ、手順参照用)
			paraId = paraId.substring(0, 15);
			// 文書構成からセクション、タイトル、パラを取得
			var secNode = tocXml.selectSingleNode("//section[ttl[para[@id='"+paraId+"']]]");
			var secName = "";
			var ttlName = "";
			var paraName = "";
			var term = "";
			if (secNode != null) {
				secName = secNode.getElementsByTagName("name").item(0).nodeTypedValue;
				var ttlNode = secNode.selectSingleNode("//ttl[para[@id='"+paraId+"']]");
				ttlName = ttlNode.getElementsByTagName("name").item(0).nodeTypedValue;
				var paraNode = ttlNode.selectSingleNode("//para[@id='"+paraId+"']");
				var nameList = paraNode.getElementsByTagName("name");
				for (var j=0; j<nameList.length; j++) {
					paraName += nameList.item(j).nodeTypedValue;
					if (j != nameList.length - 1) {
						paraName += "  ";
					}
				}
				// 適用時期取得
				var termFrom = paraNode.getAttribute("from");
				var termTo = paraNode.getAttribute("to");
				if (termFrom != null || termTo != null) {
					term += "(";
					if (termFrom != null) {
						term += termFrom;
					}
					term += " - ";
					if (termTo != null) {
						term += termTo;
					}
					term += ")";
				}
			}
			var replaceString = "";
			if (secNode != null) {
				replaceString = " " + secName + "／" + ttlName + "／" + paraName + term + " ";
			}

			// 変換文字
			var textTag = doc.createElement("span");
			textTag.className ="printseepage";
			textTag.innerText = replaceString;

			// 参照ページのアイコン用
			if (flowCnvFlg == 0) {
				// リンク削除
				ref.setAttribute("onclick", "");
				ref.removeAttribute("href");
				ref.removeChild(imgTagList.item(0));
				ref.appendChild(textTag);
			// "フローへ"用
			} else {
				// リンク削除
				ref.setAttribute("onclick", "");
				ref.setAttribute("href", "javascript:void(0);");
				ref.style.color="#0000FF";
				ref.style.cursor="default";
				var textTag1 = doc.createElement("span");
				textTag1.innerText = "(see";
				var textTag2 = doc.createElement("span");
				textTag2.innerText = ")";
				ref.appendChild(textTag1);
				ref.appendChild(textTag);
				ref.appendChild(textTag2);
			}
		} else {
			ref.removeAttribute("href");
		}
	}
	return chgSeepage;
}
