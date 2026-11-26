var memoIcon = ['memo_w.gif','memo_r.gif'];
var memoIconPath = '../images/';
var memoPath = 'ncf\\memo\\';
var memoExt = '.txt';

function WriteFile(){
	var result, filename, text;
	try {
		// ローカルファイルアクセスのオブジェクトを作成
		var oFileCtrl = new ActiveXObject("AxPlug.FileAccess.1");
	} catch (error) {
		// オブジェクトが作成できなかった場合の例外処理
		alert(error);
		return;
	}

	// ファイル名の取得
	filename = memoPath + document.frmFile.filename.value + memoExt;

	// ファイルに書き込む文字列の取得
	text     = document.frmFile.memo.value;

	// ファイル書き込みメソッドの実行
	oFileCtrl.AxWriteFile(filename, text);

	ImgId = document.frmFile.filename.value;
	// メモの内容が入っていればアイコンを赤に、空なら白にする
	if(text == null || text == ''){
		dialogArguments[2].document.getElementById(ImgId).src = memoIconPath + memoIcon[0];
	}else{
		dialogArguments[2].document.getElementById(ImgId).src = memoIconPath + memoIcon[1];
	}

	// オブジェクトの開放
	oFileCtrl = "";
	window.close();
}


// メモウィンドウを開いたときの処理
function ReadFile(){
	var result, filename;
	try {
		// ローカルファイルアクセスのオブジェクトを作成
		var oFileCtrl = new ActiveXObject("AxPlug.FileAccess.1");
	} catch (error) {
		// オブジェクトが作成できなかった場合の例外処理
		alert(error);
		return;
	}

	// ファイル名の取得
	filename = memoPath + dialogArguments[0] + memoExt;
	// ファイル読み込みメソッドの実行
	document.frmFile.memo.value = oFileCtrl.AxReadFile(filename);
	document.frmFile.filename.value = dialogArguments[0];
	document.frmFile.Title.value = dialogArguments[1];
	document.getElementById('memotitle').innerText = dialogArguments[1];

	oFileCtrl = "";
}


// 修理書用に追加　2003.09.12
// 開いたウィンドウにタイトル、テキストを流し込む
function memo(ID,TITLE){
var memoWindow;
var args = [ID,TITLE,window];
var _height = screen.availHeight - 320;
var _left = screen.availWidth - (screen.availWidth - 50);
	dialogStatus = 'dialogTop:'+_height+'px;dialogLeft:'+_left+'px;dialogWidth:450px;dialogHeight:270px;help:no;resizable=yes;'
	memoWindow = showModelessDialog('../html/memowindow.html',args,dialogStatus);
}


// 読み込んだときにアイコンの色を変える　2003.09.16
function changeIcon(){
	var count = 0;
	var Img = document.all.tags('img');
	var result, filename;
	try {
		// ローカルファイルアクセスのオブジェクトを作成
		var oFileCtrl = new ActiveXObject("AxPlug.FileAccess.1");
	} catch (error) {
		// オブジェクトが作成できなかった場合はメモアイコンを非表示にする
		for(i = 0; i < Img.length; i++){
			var fileName = Img[i].src.substring(Img[i].src.lastIndexOf('/') + 1,Img[i].src.length);
			if((fileName == memoIcon[0]) || (fileName == memoIcon[1])){
				// メモアイコンの数
				count++;
				var ImgId = Img[i].id;
				// ファイル名の取得
				filename = memoPath + ImgId + memoExt;
				// メソッド実行結果を取得
				document.getElementById(ImgId).style.visibility = 'hidden';
			}
		}
		return;
	}

	// ドキュメント内の画像の中からメモアイコンの数を割り出す
	for(i = 0; i < Img.length; i++){
		var fileName = Img[i].src.substring(Img[i].src.lastIndexOf('/') + 1,Img[i].src.length);
		if((fileName == memoIcon[0]) || (fileName == memoIcon[1])){
			// メモアイコンの数
			count++;
			var ImgId = Img[i].id;
			// ファイル名の取得
			filename = memoPath + ImgId + memoExt;
			// メソッド実行結果を取得
			oFileCtrl.AxReadFile(filename);
			result = oFileCtrl.Result;
			if(result == 0){
				if((oFileCtrl.AxReadFile(filename)) == null || (oFileCtrl.AxReadFile(filename) == '')){
					void(0);
				}else{
					document.getElementById(ImgId).src = memoIconPath + memoIcon[1];
				}
			}else if(result == -3){
				document.getElementById(ImgId).src = memoIconPath + memoIcon[0];
			}else{
				void(0);
			}
		}
	}
}
