/* $Id: scantool.js,v 1.11 2004/03/17 08:41:54 t-kato Exp $ */
//
//  ScanTool 関連 JavaScript
//  表示を行うときは、scantool.css を使用してください
//
//
var RET_SEP_KEY   = "=$=";
var RET_SEP_VALUE = "|$|";
var FILE_SEP  = "\\";
var RESULT_PATH = "repair" + FILE_SEP + "scantool" + FILE_SEP;
var g_oFileCtrl;
var g_testIds = new Array();

//
// ScanTool結果のデータから、HTML形式に整形したデータを取得
//  @param	result		ファイルに記述された文字列
//  @return				HTMLに変換した文字列
//
function getScanDispHtml(result) {
	var item = result.split(RET_SEP_VALUE);
	if( item.length < 2 || item[0] == null || item[0].length == 0) return "";
	var param = item[0].split(RET_SEP_KEY);
	if( param[1] == null ) return "";

	// 各タイプのHTMLを作成,表示
	var _html = "";
	if( param[1] == 1 )      _html = getReadHtml(item);
	else if( param[1] == 2 ) _html = getDeleteHtml(item);
	else if( param[1] == 4 ) _html = getMonitorHtml(item);
	else if( param[1] == 8 ) _html = getActiveTestHtml(item);
	return _html;
}

// Read ScanTool's Result
function readResultFile(testid) {
	if( g_oFileCtrl == null )
		g_oFileCtrl = new ActiveXObject("AxPlug.FileAccess.1");
	var _fName = RESULT_PATH + testid + ".txt";
	_fName = _fName.toLowerCase();
	var _result  = g_oFileCtrl.AxReadFile( _fName );
	var _ret = g_oFileCtrl.Result;
	if ( _ret == 0 ) {
		//ファイル読み込み成功;
	}else if ( _ret == -1 ) {
		//alert("ファイルオープン失敗");
	}else if ( _ret == -2 ) {
		//alert("ファイル読み込み失敗");
	}else if ( _ret == -3 ) {
		//alert("指定ファイルが存在しない");
	}else if ( _ret == -4 ) {
		//alert("ファイル名が指定されていない");
	}
	return _result;
}

// Delete ScanTool's Result file
// 実行されたIDのみ削除
function deleteResultFile() {
	deleteFiles(g_testIds);
}
function deleteFiles(testids) {
  try{  
	if( g_oFileCtrl == null )
		g_oFileCtrl = new ActiveXObject("AxPlug.FileAccess.1");
	for( var i = 0; i < testids.length; i++){
		var _fName = RESULT_PATH + testids[i] + ".txt";
		g_oFileCtrl.AxDeleteFile( _fName.toLowerCase() );
	}
  } catch(e) {} /* IE5.5 AxPlugがない場合のエラー抑制 */
}

// ScanTool実行IDを保持
function addPlayTestId(testid){
	g_testIds.push(testid);
}
// ScanTool実行IDを全消去
function clearTestId(){
	g_testIds = null;
	g_testIds = new Array();
}
// ScanToolを実行したか否か
// retuen : true=実行 , false=未実行
function isPlayTest(testid){
	var _exists = false;
	for (var i = 0; i < g_testIds.length; i++) {
		if (g_testIds[i] == testid) {
			_exists = true;
			break;
		}
	}
	return _exists;
}

// Delete ScanTool's Result file
// 関係する全IDのファイルを削除
//   未使用！
function delAllScanRetFile(o_cttXml) {
	if( g_oFileCtrl == null )
		g_oFileCtrl = new ActiveXObject("AxPlug.FileAccess.1");

	var _testIds = o_cttXml.selectNodes("//testgrp");
	for( var i = 0; i < _testIds.length; i++){
		var _crtid = _testIds.item(i).getAttribute("id");
		var _fName = RESULT_PATH + _crtid + ".txt";
		g_oFileCtrl.AxDeleteFile( _fName.toLowerCase() );
	}
}

//----------------------------------------------------------------------------
// private function
//
// "ダイアグコード読み出し"の情報をテーブル形式のHTMLの変換
function getReadHtml(item){
	var _disp  = "<br>";
	var _param = item[1].split(RET_SEP_KEY);
	var _euc   = (_param[1] == null || _param[1].length == 0) ? " " : _param[1];
	var _caption = "<caption>" + _euc + "/Read DTC</caption>";

	var _cnt = 2;
	while(true){
		if( _cnt >= item.length ) break;

		_param = item[_cnt].split(RET_SEP_KEY);
		var _ptn = (_param[1] == null || _param[1].length == 0) ? " " : _param[1];

		var _dtcitem = new Array(0);
		_cnt++;
		for(var _index = 0 ; _cnt < item.length; _cnt++, _index++){
			_param =  item[_cnt].split(RET_SEP_KEY);
			var _key   = (_param[0] == null || _param[0].length == 0) ? "" : _param[0];
			var _value = (_param[1] == null || _param[1].length == 0) ? " " : _param[1];
			if( _key == "diag-read-pattern" ){
				break;
			}
			_dtcitem[_index] = _value;
		}

		// 現在
		if( _ptn == "0" ){
			_disp += getReadContents(_dtcitem, _caption, "Current");
		}
		// 過去
		else if( _ptn == "1" ){
			_disp += getReadContents(_dtcitem, _caption, "History");
		}
		// 現在のみ
		else if( _ptn == "2" ){
			_disp += getReadCrtOnlyContents(_dtcitem, _caption);
		}
		else{
			break;
		}
		_caption = "&nbsp;";
	}

	return _disp;
}


function getReadCrtOnlyContents(item, caption){
	var _disp = "<table class='scanret-tbl' width='90%' border='1' cellspacing='0' cellpadding='0' align='center'>";
	_disp += caption;
	if( item.length > 1 ){
		_disp += "<tr><th class='scan-no scanret-th'>No.</th>";
		_disp += "<th width='25%' class='scan-cell scanret-th'>Diagnostic Trouble Code (DTC)</th>";
		_disp += "<th class='scan-cell scanret-th'>DTC Name</th></tr>";
	}
	var _cnt  = 1;
	for(var i = 0; i < item.length; i=i+2, _cnt++){
		if( item[i] == null || item[i+1] == null) continue;
		_disp += "<tr><td class='scan-no scanret-td'>" + _cnt + ".</td>";
		_disp += "<td class='scan-cell scanret-td'>" + item[i] + "&nbsp;</td>";
		_disp += "<td class='scan-cell scanret-td'>" + item[i+1] + "&nbsp;</td></tr>";
	}
	_disp += "</table>";
	return _disp;
}

function getReadContents(item, caption, leftcap){
	var _row = item.length / 2;
	var _disp = "<table border='0' cellspacing='0' cellpadding='0' width='90%' align='center'>";
	_disp += "<tr><td>&nbsp;</td><td rowspan=" + (_row + 2) +  ">";
	_disp += "<table class='scanret-tbl' width='100%' border='1' cellspacing='0' cellpadding='0' align='center'>";
	_disp += caption;
	if( item.length > 1 ){
		_disp += "<tr><th class='scan-no scanret-th'>No.</th>";
		_disp += "<th width='25%' class='scan-cell scanret-th'>Diagnostic Trouble Code (DTC)</th>";
		_disp += "<th class='scan-cell scanret-th'>DTC Name</th></tr>";
	}
	var _cnt  = 1;
	for(var i = 0; i < item.length; i=i+2, _cnt++){
		if( item[i] == null || item[i+1] == null) continue;
		_disp += "<tr><td class='scan-no scanret-td'>" + _cnt + ".</td>";
		_disp += "<td class='scan-cell scanret-td'>" + item[i] + "&nbsp;</td>";
		_disp += "<td class='scan-cell scanret-td'>" + item[i+1] + "&nbsp;</td></tr>";
	}
	_disp += "</table></td></tr>";
	_disp += "<tr><td class='scan-cell scanret-td' width='50'>" + leftcap + "<td></tr>";

	for(var j = 0; j < _row; j++){
		_disp += "<tr><td>&nbsp;</td></tr>";
	}
	_disp += "</table>";

	return _disp;
}


// "ダイアグコード消去"の情報をテーブル形式のHTMLの変換
function getDeleteHtml(item){
	var _param = item[1].split(RET_SEP_KEY);
	var _euc   = (_param[1] != null) ? _param[1] : "";
	var _disp  = "<br><table class='scanret-tbl' width='90%' border='1' cellspacing='0' cellpadding='0' align='center'>";
	_disp += "<caption>" + _euc + "/Clear DTC</caption>";
	_disp += "<tr><th width='150' class='scan-cell scanret-th'>Clear DTC</th>";

	// delete-conduct-flag == 0 の時未実施
	_param = (item[2] != null) ? (item[2].split(RET_SEP_KEY)) : (new Array(0));
	var _flag = (_param[1] != null) ? _param[1] : "";
	if( _flag == "1" ){
		_disp += "<td class='scan-cell scanret-td'>Completed</td></tr>";
	} else {
		_disp += "<td class='scan-cell scanret-td'>Not performed</td></tr>";
	}
	return _disp;
}

// "データモニタ"の情報をテーブル形式のHTMLの変換
function getMonitorHtml(item){
	var _param = item[1].split(RET_SEP_KEY);
	var _euc   = (_param[1] == null || _param[1].length == 0) ? " " : _param[1];
	var _disp  = "<br><table class='scanret-tbl' width='90%' border='1' cellspacing='0' cellpadding='0' align='center'>";
	_disp += "<caption>" + _euc + "/Data Monitor</caption>";
	if( item.length > 3 ){
		_disp += "<tr><th class='scan-no scanret-th'>No.</th>";
		_disp += "<th width='50%' class='scan-cell scanret-th'>Monitor Item</th>";
		_disp += "<th class='scan-cell scanret-th'>Data [Unit]</th></tr>";
	}

	var _cnt = 1;
	for(var i = 2; i < item.length; i=i+3, _cnt++){
		if( item[i]   == null || item[i].length   == 0
		 || item[i+1] == null || item[i+1].length == 0
		 || item[i+2] == null || item[i+2].length == 0) continue;

		_param    = item[i].split(RET_SEP_KEY);
		var _name = (_param[1] == null || _param[1].length == 0) ? "　" : _param[1];
		_param    = item[i+1].split(RET_SEP_KEY);
		var _val  = (_param[1] == null || _param[1].length == 0) ? "　" : _param[1];
		_param    = item[i+2].split(RET_SEP_KEY);
		var _unit = (_param[1] == null || _param[1].length == 0) ? "" : _param[1];

		_disp += "<tr><td class='scan-no scanret-td'>" + _cnt + ".</td>";
		_disp += "<td class='scan-cell scanret-td'>" + _name + "</td>";
		_disp += "<td class='scan-cell scanret-td'>" + _val + " [" + _unit + "] </td></tr>";
	}
	_disp += "</table>";
	return _disp;
}

// "アクティブテスト"の情報をテーブル形式のHTMLの変換
function getActiveTestHtml(item){
	var _param = item[1].split(RET_SEP_KEY);
	var _euc   = (_param[1] == null || _param[1].length == 0) ? " " : _param[1];
	_param     = item[2].split(RET_SEP_KEY);
	var _act   = (_param[1] == null || _param[1].length == 0) ? " " : _param[1];
	var _disp  = "<br><table class='scanret-tbl' width='90%' border='1' cellspacing='0' cellpadding='0' align='center'>";
	_disp += "<caption>" + _euc + "/Active Test[" + _act + "]</caption>";
	if( item.length > 3 ){
		_disp += "<tr ><th class='scan-no scanret-th'>No.</th>";
		_disp += "<th width='50%' class='scan-cell scanret-th'>Monitor Item</th>";
		_disp += "<th class='scan-cell scanret-th'>Data [Unit]</th></tr>";
	}

	var _cnt = 1;
	for(var i = 3; i < item.length; i=i+3, _cnt++){
		if( item[i]   == null || item[i].length   == 0
		 || item[i+1] == null || item[i+1].length == 0
		 || item[i+2] == null || item[i+2].length == 0) continue;

		_param    = item[i].split(RET_SEP_KEY);
		var _name = (_param[1] == null || _param[1].length == 0) ? "　" : _param[1];
		_param    = item[i+1].split(RET_SEP_KEY);
		var _val  = (_param[1] == null || _param[1].length == 0) ? "　" : _param[1];
		_param    = item[i+2].split(RET_SEP_KEY);
		var _unit = (_param[1] == null || _param[1].length == 0) ? "" : _param[1];

		_param = item[i].split(RET_SEP_KEY);
		_disp += "<tr><td class='scan-no scanret-td'>" + _cnt + ".</td>";
		_disp += "<td class='scan-cell scanret-td'>" + _name + "</td>";
		_disp += "<td class='scan-cell scanret-td'>" + _val + " [" + _unit + "] </td></tr>";
	}
	_disp += "</table>";
	return _disp;
}
