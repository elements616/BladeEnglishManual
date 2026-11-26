/* $Id: style.js,v 1.28 2005/03/23 01:14:36 k-narumi Exp $ */
// 
//  StyleSheet 操作関連 JavaScript
//

//
// グローバルナビに含まれるタブ表示の切り替えを行う。
//
var CONTENT         = "content";
var THROUGH         = "through";
var ACTIVE_COLOR    = "#666666";
var ACTIVE_BGCOLOR  = "#dbdfe0";
var ACTIVE_CURSOR   = "default";
var DISABLE_COLOR   = "#ffffff";
var DISABLE_BGCOLOR = "#adb7bc";
var DISABLE_CURSOR  = "hand";
var OFF_LEFT        = "_of_l.png";
var OFF_RIGHT       = "_of_r.png";
var ON_LEFT         = "_on_l.png";
var ON_RIGHT        = "_on_r.png";
var MIDDLE_ON_LEFT  = "_on2_l.png";
var MIDDLE_ON_RIGHT = "_on2_r.png";

function switchTag(doc, on, off, li, mi, ri) {
	// 文書内のオブジェクトの取得
	var active    = doc.getElementById(on);
	var disable   = doc.getElementById(off);
	var leftImg   = doc.getElementById(li);
	var middleImg = doc.getElementById(mi);
	var rightImg  = doc.getElementById(ri);

	// 既にタブが選択状態であれば何もしない
	if (on==CONTENT && leftImg.src.match(ON_LEFT))
		return;
	else if (on==THROUGH && rightImg.src.match(OFF_RIGHT))
		return;
	// タブ選択
	active.style.color       = ACTIVE_COLOR;
	active.style.background  = ACTIVE_BGCOLOR;
	active.style.cursor      = ACTIVE_CURSOR;
	// タブ非選択
	disable.style.color      = DISABLE_COLOR;
	disable.style.background = DISABLE_BGCOLOR;
	disable.style.cursor     = DISABLE_CURSOR;
	// タブ画像表示切替
	if (leftImg.src.match(ON_LEFT)) {
		leftImg.src   = leftImg.src.replace(/_on_l.png/, OFF_LEFT);
		middleImg.src = middleImg.src.replace(/_on2_r.png/, MIDDLE_ON_LEFT);
		rightImg.src  = rightImg.src.replace(/_on_r.png/, OFF_RIGHT);
	} else {
		leftImg.src   = leftImg.src.replace(/_of_l.png/, ON_LEFT);
		middleImg.src = middleImg.src.replace(/_on2_l.png/, MIDDLE_ON_RIGHT);
		rightImg.src  = rightImg.src.replace(/_of_r.png/, ON_RIGHT);
	}
	// 印刷リンクURL変更
	var prt=null, trt=null
	if ((prt=doc.getElementById("prt"))!=null && (trt=doc.getElementById("trt"))!=null) {
		if (on==CONTENT) {
			prt.style.visibility="visible";
			prt.style.display="inline";
			trt.style.visibility="hidden";
			trt.style.display="none";
		} else {
			trt.style.visibility="visible";
			trt.style.display="inline";
			prt.style.visibility="hidden";
			prt.style.display="none";
		}
	}
	// トラブルシュートでの保存リンクの表示／非表示の切り替え
	var svLink=null;
	if ((svLink=doc.getElementById("saveData"))!=null) {
		svLink.style.visibility=(on==CONTENT) ? "visible" : "hidden";
	}
	return;
}

//
// マウスクリック等イベント発生時処理
//
var oMode = null;
function changeMode(obj) {
	if(obj == oMode) return;
	obj.style.color="blue";
	obj.style.fontWeight="bold";
	if (oMode != null) {
		oMode.style.color="#000000";
		oMode.style.fontWeight="lighter";
	}
	oMode = obj;
	return;
}
function over(obj) {
	if(oMode!=obj) obj.style.color = "#3b96bf";
}
function out(obj) {
	if(oMode!=obj) obj.style.color = "#000000";
}

//
// パラグラフ名リンクonClick時
//
var paraMode = null;
function paragChangeMode(obj) {
	if(obj == paraMode) return;
	obj.style.color="#ffa500";
	obj.style.fontWeight="bold";
	if (paraMode != null) {
		paraMode.style.color="#000000";
		paraMode.style.fontWeight="bold";
	}
	paraMode = obj;
	return;
}
//
// パラグラフ名リンクmouseOver時
//
function paragOver(obj) {
	if(paraMode!=obj) obj.style.color = "#ffffff";
}
//
// パラグラフ名リンクmouseOut時
//
function paragOut(obj) {
	if(paraMode!=obj) obj.style.color = "#000000";
}

//
// 印刷対象選択画面を印刷確認画面に切り替える
//
function printConfirm(objctt, objglb) {
	if( objctt.f1 == null || objctt.f1.elements == null )   return;
	var items=0;
	for (var i=0; i<objctt.f1.elements.length; i++) {
		var frm = objctt.f1.elements[i];
		if (!frm.checked) items++;
	}
	if (items==objctt.f1.elements.length) {
		alert("Please select the procedure to print.");
		return;
	}
	for (var i=0; i<objctt.f1.elements.length; i++) {
		var frm = objctt.f1.elements[i];
		if (!frm.checked) {
			with( objctt.getElementById(frm.name).style ) {
				visibility="hidden";
				position="absolute";
				display="none";
			}
		} else {
			frm.style.visibility="hidden";
		}
	}
	with(objglb.getElementById("confirm").style) {
		visibility="hidden";
		position="absolute";
		display="none";
	}
	with(objglb.getElementById("selectall").style) {
		visibility="hidden";
		position="absolute";
		display="none";
	}
	with(objglb.getElementById("selectnone").style) {
		visibility="hidden";
		position="absolute";
		display="none";
	}
	with(objglb.getElementById("print").style) {
		visibility="visible";
		position="fixed";
		display="";
	}
}

//
// 印刷確認画面でチェックボックスを非表示にする。
//
function hideCheckbox(fom) {
	for (var i=0; i<fom.elements.length; i++) {
		var frm = fom.elements[i];
		if (frm.type=="checkbox") {
			frm.style.visibility="hidden";
			frm.style.position="absolute";
		}
	}
}

//
// 印刷画面でSeepageアイコンを変換する
//
function disableSeepage(doc) {
	convSeepage(doc);
}

//
// 印刷画面で症状・ダイアグコードのlinkを非表示にする
//
function disableLink(doc) {
	var refList = doc.getElementsByTagName("a");
	for (var i=0; i<refList.length; i++) {
		var ref = refList.item(i);
		ref.removeAttribute("href");
	}
}

//
// 印刷画面で全て選択を行う
//
function allSelect(fom, bool) {
	if( fom == null || fom.elements == null )   return;
	for (var j=0; j<fom.elements.length; j++) {
		var frm = fom.elements[j];
		if (frm.type=="checkbox") {
			frm.checked=bool;
		}
	}
	return;
}

//
// 初期表示ではじめに表示されているタイトルをハイライトする
//
function hiliteTopLink(doc) {
	var topTitle = doc.getElementsByTagName("a");
	changeMode(topTitle.item(0));
}
