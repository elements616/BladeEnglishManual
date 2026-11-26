//===========================================================================
// 部品名検索用JavaScript
//===========================================================================

var MAXDISPNUM_ALL = 10;
var MAXDISPNUM_CAT = 20;
var g_hitRpr = 0;
var g_hitNcf = 0;
var g_hitEwd = 0;
var g_hitFrp = 0;
var g_rsXmlRpr = null;
var g_rsXmlNcf = null;
var g_rsXmlEwd = null;
var g_rsXmlFrp = null;
var g_pageNum = 1;
// 検索キーの特定文字を別の文字と比較する際の特定文字のリスト
var g_changeCharList  = null;
//var g_changeCharList  = new Array("ー","-",")");
// 検索キーの特定文字を別の文字と比較する際の別の文字のリスト
var g_replaceCharList = null;
//var g_replaceCharList = new Array("－","－","）");
var g_key1_list = null;
var g_key2_list = null;

//===========================================================================
// 初期処理
//===========================================================================
function initReplaceKey() {
	// エスケープ記号挿入
	if (g_changeCharList != null && g_changeCharList.length >0) {
		for(var i = 0; i < g_changeCharList.length; i++){
			g_changeCharList[i] = insertEscape(g_changeCharList[i]);
			g_replaceCharList[i] = insertEscape(g_replaceCharList[i]);
		}
	}
}

//===========================================================================
// 検索処理
//   検索キーで、XMLの検索処理を実行する。
//   結果のXML及びHIT数は内部保持する。
//
// key1   : 部品名の検索キー
// key2   : 部品IDの検索キー
// objXml :XMLオブジェクト
// catcd  :カテゴリ種別
//===========================================================================

function setSearchKey(key1, key2) {

	for(var i = 0; i < key1.length; i++){
		key1[i] = insertEscape(key1[i]);
	}
	for(var i = 0; i < key2.length; i++){
		key2[i] = insertEscape(key2[i]);
	}
	// 検索キーのリストを作成
	makeSearchKeyList2(key1, 1);
	makeSearchKeyList2(key2, 2);
}

//===========================================================================
// 検索キーのリストを特定文字を含めた形に変える
//
// key   : 検索キー
// keyNum: 検索キー種別(1:部品名 2:部品ID)
//===========================================================================
function makeSearchKeyList(key, keyNum) {
	var retKeyList = new Array();
	for(var i = 0; i < key.length; i++) {
		var keyList = new Array();
		if (keyNum == 1 && g_changeCharList != null && g_changeCharList.length >0) {
			for(var j = 0; j < g_changeCharList.length; j++) {
				if (j == 0) {
					keyList[0] = key[i];
				}
				replaceRegEx = new RegExp(g_changeCharList[j], "ig");
				var chgKey = key[i].replace(replaceRegEx, g_replaceCharList[j]);
				// 置き換わった場合のみ
				if (chgKey != key[i]) {
					keyList[keyList.length] = chgKey;
				}
			}
		} else {
			keyList[0] = key[i];
		}
		retKeyList[i] = keyList;
	}

	if (keyNum == 1) {
		g_key1_list = retKeyList;
	} else if (keyNum == 2) {
		g_key2_list = retKeyList;
	}
}

//===========================================================================
// 検索キーのリストを特定文字を含めた形に変える
//
// key   : 検索キー
// keyNum: 検索キー種別(1:部品名 2:部品ID)
//===========================================================================
function makeSearchKeyList2(key, keyNum) {
	var retKeyList = new Array();
	for(var i = 0; i < key.length; i++) {
		var keyList = new Array();
		if (keyNum == 1 && g_changeCharList != null && g_changeCharList.length >0) {
			keyList[0] = key[i];
			var chgKey = key[i];
			for(var j = 0; j < g_changeCharList.length; j++) {
				replaceRegEx = new RegExp(g_changeCharList[j], "ig");
				chgKey = chgKey.replace(replaceRegEx, g_replaceCharList[j]);
			}
			// 置き換わった場合のみ
			if (chgKey != key[i]) {
				keyList[1] = chgKey;
			}
		} else {
			keyList[0] = key[i];
		}
		retKeyList[i] = keyList;
	}

	if (keyNum == 1) {
		g_key1_list = retKeyList;
	} else if (keyNum == 2) {
		g_key2_list = retKeyList;
	}
}

//===========================================================================
// 検索処理
//   検索キーで、XMLの検索処理を実行する。
//   結果のXML及びHIT数は内部保持する。
//
// objXml :XMLオブジェクト
// catcd  :カテゴリ種別
//===========================================================================
function search(objXml, catcd) {
	// 部品名で検索
	if (g_key1_list.length != 0) {
		objXml = getWordContainsName(g_key1_list, objXml, catcd);
	}
	// 部品IDで検索
	if (g_key2_list.length != 0) {
		objXml = getWordContainsId(g_key2_list, objXml, catcd);
	}
	// Hit数をカウント
	recountHitCount(objXml, catcd);
	if (catcd == 1) {
		g_rsXmlRpr = objXml;
	} else if (catcd == 2) {
		g_rsXmlNcf = objXml;
	} else if (catcd == 3) {
		g_rsXmlEwd = objXml;
	} else if (catcd == 4) {
		g_rsXmlFrp = objXml;
	}
}

//===========================================================================
// searchStr 内に keyword が含まれるかどうか判を定する。
//
// keyword   : 検索キー
// searchStr : 検索対象文字列
// return : true = keywordを含む / false = keywordを含まない
//===========================================================================
function isContainWord(keywordList, searchStr) {
	var ret = false;
	for (var i = 0; i < keywordList.length; i++) {
		var keyList = keywordList[i];
		for (var j = 0; j < keyList.length; j++) {
			var regEx = new RegExp(keyList[j], "i");
			ret = regEx.test(searchStr);
			// 一致したら次のキーへ
			if (ret) {
				break;
			}
		}
		// 一致しなかった時点で終了
		if (!ret) {
			return ret;
		}
	}
	return ret;
}

//===========================================================================
// 部品名検索処理
//
// key    :検索キー
// objXml :XMLオブジェクト
// catcd  :カテゴリ種別
// return : 検索結果を反映したXMLオブジェクト
//===========================================================================
function getWordContainsName(key, objXml, catcd){
	var tmcNode = null;
	if (catcd == 1 || catcd == 4) {
		tmcNode = objXml.selectSingleNode("//tmc-service-db");
	} else {
		tmcNode = objXml.selectSingleNode("//tmc-service-ncfewd");
	}
	var pubNodeList = objXml.selectNodes("//pub");
	for (var i = 0; i < pubNodeList.length; i++) {
		var pubNode = pubNodeList.item(i);
		var servcatList = pubNode.selectNodes("servcat");
		for (var j = 0; j < servcatList.length; j++) {
			var servcatNode = servcatList.item(j);
			var secList = servcatNode.selectNodes("section");
			for (var k = 0; k < secList.length; k++) {
				var secNode = secList.item(k);
				var ttlList = null;
				if (catcd == 1 || catcd == 4) {
					ttlList = secNode.selectNodes("ttl");
				} else {
					ttlList = secNode.selectNodes("title");
				}
				for (var l = 0; l < ttlList.length; l++) {
					var ttlFlg = 0;
					var ttlNode = ttlList.item(l);
					var prtNode = ttlNode.selectNodes("parts");
					var prtName = "";
					if (prtNode.length != 0) {
						prtName = prtNode.item(0).getElementsByTagName("name").item(0).nodeTypedValue;
					}
					var ttlFlg = isContainWord(key, prtName) ? 1 : 0;
					if (ttlFlg == 1) {
						continue;
					}
					var paraList = ttlNode.selectNodes("para");
					for (var m = 0; m < paraList.length; m++) {
						var paraFlg = 0;
						var paraNode = paraList.item(m);
						var prtList = paraNode.selectNodes("parts");
						for (var n = 0; n < prtList.length; n++) {
							var prtFlg = 0;
							prtNode = prtList.item(n);
							prtName = prtNode.getElementsByTagName("name").item(0).nodeTypedValue;
							prtFlg = isContainWord(key, prtName) ? 1 : 0;
							if (prtFlg == 0) {
								paraNode.removeChild(prtNode);
							} else {
								paraFlg = 1;
								break;
							}
						}
						if (paraFlg == 0) {
							ttlNode.removeChild(paraNode);
						}
					}
					// paraが全て消えていたらttlを消す
					if (ttlNode.selectNodes("para").length == 0) {
						secNode.removeChild(ttlNode);
					}
				}
				// ttlが全て消えていたらsectionを消す
				if (secNode.selectNodes("ttl").length == 0 && secNode.selectNodes("title").length == 0) {
					servcatNode.removeChild(secNode);
				}
			}
			// sectionが全て消えていたらservcatを消す
			if (servcatNode.selectNodes("section").length == 0) {
				pubNode.removeChild(servcatNode);
			}
		}
		// servcatが全て消えていたらpubを消す
		if (pubNode.selectNodes("servcat").length == 0) {
			tmcNode.removeChild(pubNode);
		}
	}
	return objXml;
}

//===========================================================================
// 部品ID検索処理
//
// key    :検索キー
// objXml :XMLオブジェクト
// catcd  :カテゴリ種別
// return : 検索結果を反映したXMLオブジェクト
//===========================================================================
function getWordContainsId(key, objXml, catcd){
	var tmcNode = null;
	if (catcd == 1 || catcd == 4) {
		tmcNode = objXml.selectSingleNode("//tmc-service-db");
	} else {
		tmcNode = objXml.selectSingleNode("//tmc-service-ncfewd");
	}
	var pubNodeList = objXml.selectNodes("//pub");
	for (var i = 0; i < pubNodeList.length; i++) {
		var pubNode = pubNodeList.item(i);
		var servcatList = pubNode.selectNodes("servcat");
		for (var j = 0; j < servcatList.length; j++) {
			var servcatNode = servcatList.item(j);
			var secList = servcatNode.selectNodes("section");
			for (var k = 0; k < secList.length; k++) {
				var secNode = secList.item(k);
				var ttlList = null;
				if (catcd == 1 || catcd == 4) {
					ttlList = secNode.selectNodes("ttl");
				} else {
					ttlList = secNode.selectNodes("title");
				}
				for (var l = 0; l < ttlList.length; l++) {
					var ttlFlg = 0;
					var ttlNode = ttlList.item(l);
					var ttlPrtNode = ttlNode.selectNodes("parts")
					var prtId = null;
					if (ttlPrtNode.length != 0) {
						prtId = ttlPrtNode.item(0).getAttribute("id");
					}
					var ttlFlg = isContainWord(key, prtId) ? 1 : 0;
					if (ttlFlg == 1) {
						continue;
					}
					var paraList = ttlNode.selectNodes("para");
					for (var m = 0; m < paraList.length; m++) {
						var paraFlg = 0;
						var paraNode = paraList.item(m);
						var prtList = paraNode.selectNodes("parts");
						for (var n = 0; n < prtList.length; n++) {
							var prtFlg = 0;
							prtNode = prtList.item(n);
							prtId = prtNode.getAttribute("id");
							prtFlg = isContainWord(key, prtId) ? 1 : 0;
							if (prtFlg == 0) {
								paraNode.removeChild(prtNode);
							} else {
								paraFlg = 1;
								break;
							}
						}
						if (paraFlg == 0) {
							ttlNode.removeChild(paraNode);
						}
					}
					// paraが全て消えていたらttlを消す
					if (ttlNode.selectNodes("para").length == 0) {
						secNode.removeChild(ttlNode);
					}
				}
				// ttlが全て消えていたらsectionを消す
				if (secNode.selectNodes("ttl").length == 0 && secNode.selectNodes("title").length == 0) {
					servcatNode.removeChild(secNode);
				}
			}
			// sectionが全て消えていたらservcatを消す
			if (servcatNode.selectNodes("section").length == 0) {
				pubNode.removeChild(servcatNode);
			}
		}
		// servcatが全て消えていたらpubを消す
		if (pubNode.selectNodes("servcat").length == 0) {
			tmcNode.removeChild(pubNode);
		}
	}
	return objXml;
}

//===========================================================================
// objXml の検索結果のHIT数をカウントし、内部保持する。
//
// objXml :XMLオブジェクト
// catcd  :カテゴリ種別
//===========================================================================
function recountHitCount(objXml, catcd){
	// para/anemの数でカウント
	var _paraNode = objXml.selectNodes("//para/name");
	var secCnt = 0;
	// 解配用 section配下にpara/nameがないものはsection毎に1個カウント
	if (catcd == 2 || catcd == 3) {
		var secList = objXml.selectNodes("//section");
		for (var i = 0; i < secList.length; i++) {
			var secNode = secList.item(i);
			var ttlList = secNode.selectNodes("title");
			for (var j = 0; j < ttlList.length; j++) {
				var ttlNode = ttlList.item(j);
				var paraNameList = ttlNode.selectNodes("para/name");
				if (paraNameList.length == 0) {
					secCnt++;
				}
			}
		}
	}
	if (catcd == 1) {
		g_hitRpr = _paraNode.length;
	} else if (catcd == 2) {
		g_hitNcf = _paraNode.length + secCnt;
	} else if (catcd == 3) {
		g_hitEwd = _paraNode.length + secCnt;
	} else if (catcd == 4) {
		g_hitFrp = _paraNode.length;
	}
}

//===========================================================================
// 内部保持している検索結果から、全体表示用のHTML文書を作成し、返す。
//
// catcd  :カテゴリ種別
// return : 検索結果HTML
//===========================================================================
function getDispRetHTMLForAll(catcd){

	var _objTemp2 = new ActiveXObject("Msxml2.XSLTemplate");

	var _dispXsl = null;
	var rsXml = null;
	var hitCnt = 0;

	if (catcd == 1) {
		rsXml = cutRsXml(g_rsXmlRpr, 1, MAXDISPNUM_ALL, 1);
		_dispXsl  = parent.g_searchRpr;
		hitCnt = g_hitRpr;
	} else if (catcd == 2) {
		rsXml = cutRsXml(g_rsXmlNcf, 1, MAXDISPNUM_ALL, 2);
		_dispXsl  = parent.g_searchNcf;
		hitCnt = g_hitNcf;
	} else if (catcd == 3) {
		rsXml = cutRsXml(g_rsXmlEwd, 1, MAXDISPNUM_ALL, 3);
		_dispXsl  = parent.g_searchEwd;
		hitCnt = g_hitEwd;
	} else if (catcd == 4) {
		rsXml = cutRsXml(g_rsXmlFrp, 1, MAXDISPNUM_ALL, 4);
		_dispXsl  = parent.g_searchFrp;
		hitCnt = g_hitFrp;
	}
	_objTemp2.stylesheet = _dispXsl;
	_objProc = _objTemp2.createProcessor();
	_objProc.input = rsXml;
	_objProc.addParameter("fcnt", 1);
	_objProc.addParameter("ecnt", (hitCnt > MAXDISPNUM_ALL) ? MAXDISPNUM_ALL : hitCnt); // end count
	_objProc.addParameter("count", hitCnt); // hit count
	_objProc.addParameter("prevLink", false);
	_objProc.addParameter("nextLink", false);
	_objProc.addParameter("term", g_term);
	_objProc.transform();
	return _objProc.output;
}

//===========================================================================
// 内部保持している検索結果から、個別表示用のHTML文書を作成し、返す。
//
// pageNum:表示ページ数
// catcd  :カテゴリ種別
// return : 検索結果HTML
//===========================================================================
function getDispRetHTML(pageNum, catcd){
	var _objTemp2 = new ActiveXObject("Msxml2.XSLTemplate");

	var _dispXsl = null;
	var rsXml = null;
	var hitCnt = 0;
	if (catcd == 1) {
		rsXml = cutRsXml(g_rsXmlRpr, pageNum, MAXDISPNUM_CAT, 1);
		_dispXsl  = parent.g_searchRpr;
		hitCnt = g_hitRpr;
	} else if (catcd == 2) {
		rsXml = cutRsXml(g_rsXmlNcf, pageNum, MAXDISPNUM_CAT, 2);
		_dispXsl  = initXsl("../../xsl/prt/searchretncf.xsl");
		hitCnt = g_hitNcf;
	} else if (catcd == 3) {
		rsXml = cutRsXml(g_rsXmlEwd, pageNum, MAXDISPNUM_CAT, 3);
		_dispXsl  = initXsl("../../xsl/prt/searchretewd.xsl");
		hitCnt = g_hitEwd;
	} else if (catcd == 4) {
		rsXml = cutRsXml(g_rsXmlFrp, pageNum, MAXDISPNUM_CAT, 4);
		_dispXsl  = initXsl("../../xsl/prt/searchretfrp.xsl");
		hitCnt = g_hitFrp;
	}

	_objTemp2.stylesheet = _dispXsl;
	_objProc = _objTemp2.createProcessor();
	_objProc.input = rsXml;
	var paraCnt = 0;
	var fcnt = (pageNum - 1) * MAXDISPNUM_CAT + 1;
	var endMaxCnt = (pageNum) * MAXDISPNUM_CAT;
	var prevLink = false;
	var nextLink = false;
	if (fcnt > 1) {
		prevLink = true
	}
	if (endMaxCnt < hitCnt) {
		nextLink = true
	}
	_objProc.addParameter("fcnt", fcnt);
	_objProc.addParameter("ecnt", (hitCnt > endMaxCnt) ? endMaxCnt : hitCnt); // end count
	_objProc.addParameter("count", hitCnt); // hit count
	_objProc.addParameter("prevLink", prevLink);
	_objProc.addParameter("nextLink", nextLink);
	_objProc.addParameter("term", g_term);
	_objProc.transform();
	return _objProc.output;
}

//===========================================================================
// 結果を表示単位ごとに切り出したXMLを作成し、返す。
//
// rsXml  :XMLオブジェクト
// pageNum:表示ページ数
// maxCnt :最大表示件数
// catcd  :カテゴリ種別
// return :必要分のみの抽出したXML
//===========================================================================
function cutRsXml(rsXml, pageNum, maxCnt, catcd) {

	var paraCnt = 0;
	var startCnt = (pageNum - 1) * maxCnt + 1;
	var endCnt = (pageNum) * maxCnt;

	var cutXml = new ActiveXObject("Msxml2.DOMDocument");
	cutXml.async = false;
	cutXml.resolveExternals = false;
	cutXml.setProperty("SelectionLanguage", "XPath");
	var tmcNode = null;
	if (catcd == 1 || catcd == 4) {
		tmcNode = cutXml.createElement("tmc-service-db");
	} else {
		tmcNode = cutXml.createElement("tmc-service-ncfewd");
	}
	cutXml.appendChild(tmcNode);

	// クローンを作成し返却用のXMLとする
	var pubNodeList = rsXml.selectNodes("//pub");
	for (var i = 0; i < pubNodeList.length; i++) {
		var orgPubNode = pubNodeList.item(i);
		var newPubNode = orgPubNode.cloneNode(true);
		tmcNode.appendChild(newPubNode);
	}

	pubNodeList = cutXml.selectNodes("//pub");
	for (var i = 0; i < pubNodeList.length; i++) {
		var pubNode = pubNodeList.item(i);
		var servcatList = pubNode.selectNodes("servcat");
		for (var j = 0; j < servcatList.length; j++) {
			var servcatNode = servcatList.item(j);
			var secList = servcatNode.selectNodes("section");
			for (var k = 0; k < secList.length; k++) {
				var secNode = secList.item(k);
				var ttlList = null;
				if (catcd == 1 || catcd == 4) {
					ttlList = secNode.selectNodes("ttl");
				} else {
					ttlList = secNode.selectNodes("title");
				}
				for (var l = 0; l < ttlList.length; l++) {
					var ttlNode = ttlList.item(l);
					var paraList = ttlNode.selectNodes("para");
					var chkParaCnt = paraCnt;
					for (var m = 0; m < paraList.length; m++) {
						var paraNode = paraList.item(m);
						var paraNameList = paraNode.selectNodes("name");
						for (var n = 0; n < paraNameList.length; n++) {
							var paraNameNode = paraNameList.item(n);
							paraCnt++;
							// 表示件数外のnameを削除
							if (paraCnt < startCnt || paraCnt > endCnt) {
								paraNode.removeChild(paraNameNode);
							}
						}
						// 元々paraにnameがあり、nameが全て消された場合、paraを消す
						if (paraNameList.length > 0  && paraNode.selectNodes("name").length == 0) {
							ttlNode.removeChild(paraNode);
						}
					}
					// para/nameが無ければttlからparaを消す
					if (ttlNode.selectNodes("para/name").length == 0) {
						var delParaList = ttlNode.selectNodes("para");
						for (var p = 0; p < delParaList.length; p++) {
							delParaNode = delParaList.item(p);
							ttlNode.removeChild(delParaNode);
						}
					}
					var ttlDelflg = 0;
					// タイトル配下にpara/nameが1個も無かった場合(解配用)
					if ((catcd == 2 || catcd == 3) && chkParaCnt == paraCnt) {
						// 1件カウント
						paraCnt++;
						// カウントが表示件数内だった場合、空のparaを作成
						if (paraCnt >= startCnt && paraCnt <= endCnt) {
							var newParaNode = cutXml.createElement("para");
							ttlNode.appendChild(newParaNode);
						} else {
							secNode.removeChild(ttlNode);
							ttlDelflg = 1;
						}
					}
					// paraが全て消えていたらttlを消す
					if (ttlNode.selectNodes("para").length == 0 && ttlDelflg == 0) {
						secNode.removeChild(ttlNode);
					}
				}
				// ttlが全て消えていたらsectionを消す
				if (secNode.selectNodes("ttl").length == 0 && secNode.selectNodes("title").length == 0) {
					servcatNode.removeChild(secNode);
				}
			}
			// sectionが全て消えていたらservcatを消す
			if (servcatNode.selectNodes("section").length == 0) {
				pubNode.removeChild(servcatNode);
			}
		}
		// servcatが全て消えていたらpubを消す
		if (pubNode.selectNodes("servcat").length == 0) {
			tmcNode.removeChild(pubNode);
		}
	}
	return cutXml;
}

//===========================================================================
// ページ数をリセットする
//
//===========================================================================
function clearPageNum() {
	g_pageNum = 1;
}

//===========================================================================
// 正規表現に使用される文字の直前にエスケープ記号を挿入する
//
// str : エスケープ記号を挿入したい文字列
// return : エスケープ記号挿入後の文字列
//===========================================================================
function insertEscape(str) {
	if(str == null) return null;
	var _ret = "";
	for (var index = 0; index < str.length; index++) {
		var _ch = str.charAt(index);
		if( _ch == '!' || _ch == '$' || _ch == '(' || _ch == ')'
		 || _ch == '=' || _ch == '^' || _ch == '|' || _ch == '\\'
		 || _ch == '[' || _ch == ']' || _ch == '{' || _ch == '}'
		 || _ch == ':' || _ch == '*' || _ch == ';' || _ch == '+'
		 || _ch == '?' || _ch == '/' || _ch == '.' || _ch == ','
		 || _ch == '-'
		) {
			_ret = _ret.concat("\\");
		}
		_ret = _ret.concat(_ch);
	}
	return _ret;
}
