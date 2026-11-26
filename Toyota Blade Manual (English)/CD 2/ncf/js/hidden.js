var basecolor = "#6B8490";
var baseimg = ['detail0.gif','detail_a0.gif','detail_b0.gif'];
var changecolor  ="#B7C4CA";
var changeimg = ['detail1.gif','detail_a1.gif','detail_b1.gif'];
var contentsFile = 'dummy';
var iconId;
var newWindow;
var searchGlobalUrl = top.document.location.href.split('/')[top.document.location.href.split('/').length - 1].substring(0,2);

//目次ページセット
function setMokuji(){
	if(top.frames.length != 0){
		var str=String(top.contents.location);
		var strLength=str.length;
		var urlStr=str.lastIndexOf("/html/",strLength);
		//目次ページが日付フォルダ内にある場合、ロケーションより日付取得
		if(urlStr==-1){
			var locValue = String(top.document.location);
			var locArray = locValue.split('.html');
			var fDate = locArray[0];
			var urlStr = fDate.substring(fDate.length - 6,fDate.length);
			var fileName = str.split('/')[str.split('/').length - 1];
			top.mokujiPage='../'+urlStr+'/'+fileName;
		}else{
			top.mokujiPage=".."+str.substring(urlStr,strLength);
		}
	}
}

//20030224追加　左メニュマウスオーーバー、マウスアウト
function mouseOverAndOut(iconIdZ,Flag){
	iconIdZ = 'C' + iconIdZ;
	if(Flag == 0){
		if(document.all.item(iconIdZ).style.backgroundColor != '#a9b2b7'){
			document.all.item(iconIdZ).style.backgroundColor = '#C6CFD3';
			document.all.item(iconIdZ).style.color = '#FFFFFF';
		}
	}if(Flag == 1){
		if(document.all.item(iconIdZ).style.backgroundColor != '#a9b2b7'){
			document.all.item(iconIdZ).style.backgroundColor = '#FFFFFF';
			document.all.item(iconIdZ).style.color = '#000000';
		}
	}
}

//解説読み込み時処理---------------------------------------
//コンテンツにあわせてタブセット
function setTab(num){
	if(top.frames.length != 0){
		if(num==0){
			top.global.document.all.item('Layer2').style.visibility = "hidden";
		}else if(num==1){
			top.global.document.all.item('Layer2').style.visibility = "visible";
		}
	}
}
//タブ切り替え-------------------------------------
function show(){
	var objID=document.getElementById('Layer2');
	if(objID.className=='close') {
		objID.style.visibility='visible';
		objID.className='open';
	}else{
		objID.style.visibility='hidden';
		objID.className='close';
	}
}

//localメニューのリンク先変更：locStatus　0>解説 1>解説スルー（上部タブより設定）
function setLstatus(){
	var Url1 = top.document.location;
	var Url2 = String(Url1).split('.html')[0];
	var Url3 = Url2.length;
	var Date = Url2.substring(Url3 - 6,Url3);
	if(top.contents.document.location.href.match('/xml/s') == '/xml/s'){
		top.contents.document.location.href = '../' + Date+'/' + top.local.urlArray[1].split('#')[0];
		localSwitch1();
	}else{
		top.contents.document.location.href = top.local.urlArray[0];
		localSwitch2();
	}
}
function localSwitch1(){
	if(top.frames.length != 0){
	for(i = 0; i < top.local.document.all.tags('table').length; i++){
		if(top.local.document.all.tags('table')[i].id.match('Parts1') != null){
			top.local.document.all.item('Parts1').style.display = 'none';
		}if(top.local.document.all.tags('table')[i].id.match('System1') != null){
			top.local.document.all.item('System1').style.display = 'none';
		}if(top.local.document.all.tags('table')[i].id.match('Parts2') != null){
			top.local.document.all.item('Parts2').style.display = 'block';
		}if(top.local.document.all.tags('table')[i].id.match('System2') != null){
			top.local.document.all.item('System2').style.display = 'block';
		}
	}
	}
}

function localSwitch2(){
	if(top.frames.length != 0){
	for(i = 0; i < top.local.document.all.tags('table').length; i++){
		if(top.local.document.all.tags('table')[i].id.match('Parts1') != null){
			top.local.document.all.item('Parts1').style.display = 'block';
		}if(top.local.document.all.tags('table')[i].id.match('System1') != null){
			top.local.document.all.item('System1').style.display = 'block';
		}if(top.local.document.all.tags('table')[i].id.match('Parts2') != null){
			top.local.document.all.item('Parts2').style.display = 'none';
		}if(top.local.document.all.tags('table')[i].id.match('System2') != null){
			top.local.document.all.item('System2').style.display = 'none';
		}
	}
	}
}

//local用---------------------------------------
//右フレームにコンテンツを読み込み
function contents_open(id){
	top.contents.location.href = id;
}

//---------------------------------------

//汎用ロード（フレーム指定,url)
function frameLoad(frm,url){
	if((top.frames.length != 0) && (top.newWin == undefined)){
//コンテンツか目次一覧かを判別（2003.09.08.追加）
		var fileName = String(top.document.location).split('/');
		var fileNameHead = fileName[fileName.length - 1].substring(0,2);
		if(fileNameHead == 'ks' || fileNameHead == 'ts'){	//構造・作動から入ったとき
			top.eval(frm).location.href=url;
		}
		if(fileNameHead == 'to'){
			if(top.mokujiFlag == '0'){	//目次一覧から入ったとき対応したセルを反転
				void(0);
			}else{
				top.mokujiFlag = '0';	//mokujiFlagを初期化
				top.contents.document.URL = top.right;
			}
		}
	}
}

//「目次画面へ」ボタンを押したときの分岐に使うフラグ
function setFlag(){
	top.mokujiFlag = '1';
}

//ヘッダボタンの表示非表示
function boVis(num){
	if(top.frames.length != 0){
		if (num == 01){
			top.global.document.all.item('Print').style.visibility = "visible";
			top.global.document.all.item('Mokuji').style.visibility = "visible";
			top.global.document.all.item('Layer1').style.visibility = "visible";
		}if (num == 02){
			top.global.document.all.item('Print').style.visibility = "visible";
			top.global.document.all.item('Mokuji').style.visibility = "visible";
		}if (num == 03){
			top.global.document.all.item('Print').style.visibility = "visible";
			top.global.document.all.item('Mokuji').style.visibility = "visible";
		}if (num == 04){
			top.global.document.all.item('Print').style.visibility = "visible";
			top.global.document.all.item('Mokuji').style.visibility = "visible";
		}if (num == 05){
			top.global.document.all.item('Print').style.visibility = "visible";
		}
	}
}

function boHid2Del(){
	if(top.frames.length != 0){
		top.global.document.all.item('Print').style.visibility = "hidden";
		top.global.document.all.item('Mokuji').style.visibility = "hidden";
		top.global.document.all.item('Layer1').style.visibility = "hidden";
		top.global.document.all.item('Layer2').style.visibility = "hidden";
	}
}

//左フレームの強調表示
function changeImg(iconIdZ){
	if(top.document.frames.length != 0){
		var baseimg = "b_icon0.gif";
		var changeimg = "b_icon1.gif";
		var basecolor = "#6B8490";
		var changecolor ="#B7C4CA";
		var Level;
		var iconId;
		var Level;
		var topObj = top.local;
		CiconIdZ = 'C' + iconIdZ;
		IiconIdZ = 'I' + iconIdZ;
		OiconIdZ = 'O' + iconIdZ;
		CcontentsFile = 'C' + top.local.contentsFile;
		IcontentsFile = 'I' + top.local.contentsFile;
		OcontentsFile = 'O' + top.local.contentsFile;
		Level = '../images/';
		for(i = 0; i < top.local.document.all.tags('div').length; i++){
			if((top.local.document.all.tags('div')[i].id.match(iconIdZ) != null) || (iconIdZ.substring(0,1) == 't') || (iconIdZ.substring(0,1) == 'e')){
				if(top.local.contentsFile == 'dummy'){
					top.local.document.all.item(IiconIdZ).src = Level + changeimg;
					top.local.document.all.item(OiconIdZ).style.backgroundColor = basecolor;
					top.local.document.all.item(CiconIdZ).style.backgroundColor = '#a9b2b7';
					top.local.document.all.item(CiconIdZ).style.color = '#ffffff';
				}else{
					top.local.document.all.item(IcontentsFile).src = Level + baseimg;
					top.local.document.all.item(OcontentsFile).style.backgroundColor = changecolor;
					top.local.document.all.item(CcontentsFile).style.backgroundColor = '#ffffff';
					top.local.document.all.item(CcontentsFile).style.color = '#000000';
					top.local.document.all.item(IiconIdZ).src = Level + changeimg;
					top.local.document.all.item(OiconIdZ).style.backgroundColor = basecolor;
					top.local.document.all.item(CiconIdZ).style.backgroundColor = '#a9b2b7';
					top.local.document.all.item(CiconIdZ).style.color = '#ffffff';
				}
				top.local.contentsFile = iconIdZ;
			}
		}
	}
}


//絵目次モーダルダイアログ表示用
function pocModal(url){
	var extPosition=url.lastIndexOf(".",url.length)
	if(url.substring(extPosition,url.length)==".xml"){
		showModalDialog("../xml/wprint.html",url,"dialogWidth:650px;dialogHeight:600px;help:no;resizable=yes;");
	}else{
		showModalDialog(url,"","dialogWidth:650px;dialogHeight:600px;help:no;resizable=yes;");
	}
}

//モーダル用に追加　2005.04.13
function setXml(){
here.innerHTML=ss_syuyousyogen.transformNode(ss_syuyousyogen0.documentElement);
}

//常に特定のフレームを開いて未表示部分を表示（印刷）
function myNewWin(){
	var url=top.contents.location.href;
	var extPosition=url.split('.')[url.split('.').length - 1].substring(0,3);
	if(extPosition=="xml"){
		if(top.global.document.all.item('Layer2').style.visibility == "visible"){
			showModalDialog("../xml/wprintz.html",url,"dialogWidth:650px;dialogHeight:600px;help:no;resizable=yes;");
		}else{
			showModalDialog("../xml/wprint.html",url,"dialogWidth:650px;dialogHeight:600px;help:no;resizable=yes;");
		}
	}else{
		showModalDialog(url,"","dialogWidth:650px;dialogHeight:600px;help:no;resizable=yes;");
	}
}
function windowFcsOpen() {
	pageUrl = top.contents.location.href;	//右フレームのURLを取得
	urlCnt = pageUrl.lastIndexOf("/");	//右から「/」を検索
	pageFileName = pageUrl.substring((urlCnt+1), pageUrl.length - 5);	//ファイル名を抽出
	pageFNCnt = pageFileName.substring(9,pageFileName.length - 0);	//ファイル名の末尾一文字を抽出
	myNewWin();
}

//ツリーメニュー
vType = ["none","block"];
function treeMenu(tName){
	tMenu = document.all[tName].style;
	tMenu.display = vType[tMenu.display.indexOf("none") + 1];
}

function chgImg(imgId){
	iconNameClose = ['detail0.gif','detail_a0.gif','detail_b0.gif'];
	iconNameOpen = ['detail1.gif','detail_a1.gif','detail_b1.gif'];
	srcURL = document.all.item(imgId).src;
	fileName = srcURL.substring((srcURL.lastIndexOf('/') + 1),srcURL.length);		//	ファイル名を抽出
	preSrcURL = srcURL.substring(0, (srcURL.length - (fileName.length)));
	for(a = 0; a < iconNameClose.length; a++){
		if(document.all.item(imgId).src == preSrcURL + iconNameClose[a]){
			document.all.item(imgId).src = preSrcURL + iconNameOpen[a];
		}else if(document.all.item(imgId).src == preSrcURL + iconNameOpen[a]){
			document.all.item(imgId).src = preSrcURL + iconNameClose[a];
		}else{
			void(0);
		}
	}
}

//印刷
function printCheck(){
	print();
}

//ウィンドウ閉じる
function closeWindow(){
	window.close();
}

//単独で開いたとき「印刷」、「閉じる」ボタンを表示
function printAndClose(){
	if(top.frames.length == 0){
		document.all.item('print').style.display = 'block';
		imgLength = document.all.tags("img").length;
		for(i = 0; i < imgLength; i++){
			srcURL = document.all.tags("img")[i].src;
			fileName = srcURL.substring((srcURL.lastIndexOf('/') + 1),srcURL.length);		//	ファイル名を抽出
			preSrcURL = srcURL.substring(0, (srcURL.length - (fileName.length)));		//	ファイル名の前まで
			if(fileName == baseimg[0]){
				document.all.tags("img")[i].src = preSrcURL + changeimg[0];
			}else if(fileName == baseimg[1]){
				document.all.tags("img")[i].src = preSrcURL + changeimg[1];
			}else if(fileName == baseimg[2]){
				document.all.tags("img")[i].src = preSrcURL + changeimg[2];
			}else{
				void(0);
			}
		}
		divLength = document.all.tags("div").length;
		for(i = 0; i < divLength; i++){
			if(document.all.tags("div")[i].style.display == 'none'){
				document.all.tags("div")[i].style.display = 'block'
			}
		}
	}
}

//単独で開いたとき「印刷」、「閉じる」ボタン、「チェックボックス」を表示（解説スルー用）　+　閉じているdivを開く　+　アイコンを開いたものに変える
function printAndCloseZ(){
	if(top.frames.length == 0){
		document.all.item('print').style.display = 'block';
		var checkLength = document.bmform.elements.length;
		for(i = 0; i < checkLength; i++){
			var obj = document.bmform.elements[i];
			if(obj.type == "checkbox"){
				obj.style.display = 'block';
			}
		}
		imgLength = document.all.tags("img").length;
		for(i = 0; i < imgLength; i++){
			srcURL = document.all.tags("img")[i].src;
			fileName = srcURL.substring((srcURL.lastIndexOf('/') + 1),srcURL.length);		//	ファイル名を抽出
			preSrcURL = srcURL.substring(0, (srcURL.length - (fileName.length)));		//	ファイル名の前まで
			if(fileName == baseimg[0]){
				document.all.tags("img")[i].src = preSrcURL + changeimg[0];
			}else if(fileName == baseimg[1]){
				document.all.tags("img")[i].src = preSrcURL + changeimg[1];
			}else if(fileName == baseimg[2]){
				document.all.tags("img")[i].src = preSrcURL + changeimg[2];
			}else{
				void(0);
			}
		}
		divLength = document.all.tags("div").length;
		for(i = 0; i < divLength; i++){
			if(document.all.tags("div")[i].style.display == 'none'){
				document.all.tags("div")[i].style.display = 'block'
			}
		}
	}
}

//チェックボックス全選択全解除（解説スルー用）
function selectAll(VALUE) {
	var checkLength = document.bmform.elements.length;
	for(i = 0; i < checkLength; i++){
	var obj = document.bmform.elements[i];
		if(obj.type == "checkbox"){
			obj.checked=VALUE;
		}
	}
	return;
}


//解説スルー用印刷確認
function printSelect(){
	dValue = document.divValue.hid.value;	//右フレームの隠しフォームから値を取得（印刷用）2003/4/9追記チェックボックスの数（多分）
	var checkLength = document.bmform.elements.length;
	for(i = 0; i < checkLength; i++){
	var obj = document.bmform.elements[i];
		if(obj.type == "checkbox"){
			obj.style.display = 'none';
		}
	}
	divLength = document.all.tags("div").length;
	for(i = 0; i < divLength; i++){
		if(document.all.tags("div")[i].style.display == 'none'){
			document.all.tags("div")[i].style.display = 'block'
		}
	}	for(i = 1; i < dValue; i++){
		mycheckId = 'check'+i;
		mybmId = 'bm'+i;
		if(document.bmform(mycheckId).checked == true){	//チェックされていたら表示
			document.all.item(mybmId).style.display = "block";
		}
		else{	//チェックされていなかったら非表示
			document.all.item(mybmId).style.display = "none";
		}
	}
	document.all.item('print2').style.display = 'none';
	document.all.item('print3').style.display = 'none';
	document.all.item('print4').style.display = 'block';
	document.all.item('print5').style.display = 'none';
}

//特定・サーチの車両概要で、印刷ボタンを押したときにタイトルバーを表示
function barBlock(){
	var dValue = (document.divValue.hid.value) - 1;
	if(top.frames.length == 0){
		for(i = 1; i <= dValue; i++){
			barID = 'bar'+i;
			document.getElementById(barID).style.display = 'block';
		}
	}
}

//車両四面図用
function changeSyaryo4menzu(){
	here.innerHTML = ss_syaryo4menzu.transformNode(ss_syaryo4menzu_style.documentElement);
}
SVGSize = ['0.5','1.0','1.5','2.0','3.0','4.0'];
imgWidth = '740';
imgHeight = '515';
IDXcount = 1;
function imgZoom(SIZE,Name){
	if(IDXcount <= 4){
		if(SIZE == 'up'){
		IDXcount++;
			Name.theSVG.height = imgHeight * SVGSize[IDXcount];
			Name.theSVG.width = imgWidth * SVGSize[IDXcount];
		}
	}
	if(IDXcount > 0){
		if(SIZE == 'down'){
		IDXcount--;
			Name.theSVG.height = imgHeight * SVGSize[IDXcount];
			Name.theSVG.width = imgWidth * SVGSize[IDXcount];
		}
	}
}
function writeIFrame(iFrameName,FileName){
	iFrameName.document.write('<html>\n<head><title>SWF</title></head>\n<body topmargin="0" leftmargin="0">\n');
	iFrameName.document.write('<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH="740" HEIGHT="515" id="theSVG">\n');
	iFrameName.document.write('<PARAM NAME=movie VALUE="../swf/' + FileName + '.swf">\n');
	iFrameName.document.write('<PARAM NAME=quality VALUE=high>\n');
	iFrameName.document.write('<PARAM NAME=bgcolor VALUE=#FFFFFF>\n');
	iFrameName.document.write('<EMBED src="../swf/' + FileName + '.swf" quality=high bgcolor=#FFFFFF WIDTH="740" HEIGHT="515" NAME="theSVG" TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED>\n');
	iFrameName.document.write('</OBJECT>');
	iFrameName.document.write('\n</body>\n</html>');
}

function openPDF(FILE){
	window.open('../pdf/'+FILE+'.pdf','','width=800,height=600,toolbar=0,menubar=0,scrollbars=1,resizable=1');
}