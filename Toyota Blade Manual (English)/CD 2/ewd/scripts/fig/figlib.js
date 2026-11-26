var SCROLL_BAR_SIZE=20;
var MARGIN_HEIGHT=30;


var NORMAL_MAX_INDEX = 6;


var zoomState = new Array( 0.5, 0.6, 0.8, 1.0, 2.0, 3.0, 4.0, 8.0, 16.0, 32.0 );

var initZoomStateIndex = 3;






function Point(x , y)
{
	this.x = x;
	this.y = y;
}

Point.prototype.setLocation = function ( x, y )
{
	this.x = x;
	this.y = y;
}

Point.prototype.translate = function ( x, y )
{
	this.x += x;
	this.y += y
}

Point.prototype.magnify = function ( scale )
{
	this.x = this.x * scale;
	this.y = this.y * scale;
}






function Rect(x, y, width, height )
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Rect.prototype.setRect = function ( x, y, width, height )
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Rect.prototype.setSize = function ( width, height )
{
	this.width = width;
	this.height = height;
}

Rect.prototype.setLocation = function ( x, y )
{
	this.x = x;
	this.y = y;
}

Rect.prototype.translate = function ( x, y )
{
	this.x += x;
	this.y += y;
}






function View()
{
	this.viewRect = new Rect(0,0,0,0);
	this.initFigRect = new Rect(0, 0, 0, 0);
	this.pOrg = new Point( 0, 0 );
	this.zoomStateIndex = initZoomStateIndex;
	this.fig = null;

	this.scrollBarSize = parseFloat(SCROLL_BAR_SIZE);
	
	

	this.fInner = false;
}

View.prototype.setFig = function ( fig )
{
	try{
		if( fig.svgRootNode == null )	return false;
		this.fig = fig;
	}
	catch(e){
		return false;
	}
	return true;
}

View.prototype.setViewRect = function ( obj )
{
	try{
		this.viewRect.setRect( 0, 0, obj.clientWidth - this.scrollBarSize, obj.clientHeight - this.scrollBarSize - MARGIN_HEIGHT );
		return false;
	}
	catch(e){
		return false;
	}
}

View.prototype.fitToWindow = function (mode)
{
	var bMode = 0;
	var ratio = 1;

	var ratioWidth = this.culcRatio("width");
	var ratioHeight = this.culcRatio("height");

	if( mode == null || mode == "" ) return;

	if( mode == "height" ){
		ratio = ratioHeight;
	}
	else{
		ratio = (ratioWidth < ratioHeight) ? ratioWidth: ratioHeight;
	}
	this.initFigRect.setSize( this.fig.width * ratio, this.fig.height * ratio );
	this.fig.setSize( this.initFigRect.width, this.initFigRect.height );

	this.zoomStateIndex = initZoomStateIndex;

}

View.prototype.culcRatio = function (mode)
{
	if( mode == "width" )	return parseFloat( this.viewRect.width / this.fig.width );
	else if( mode == "height" )	return parseFloat( this.viewRect.height / this.fig.height );
	return -1;
}

View.prototype.zoom = function ( mode )
{
	var nextIndex = this.zoomStateIndex;

	if( mode == "in" )	nextIndex++;
	else if( mode == "out" ) nextIndex--;
	else	return false;


	return this.setZoom( nextIndex );
}

View.prototype.setZoom = function (nZoomIndex)
{

	if( this.fInner ){
		if( nZoomIndex < 0 || nZoomIndex > zoomState.length - 1 )	return false;
	}
	else{
		if( nZoomIndex < 0 || nZoomIndex > NORMAL_MAX_INDEX ) return false;
	}
	
	
	this.zoomStateIndex = nZoomIndex;

	this.fig.setSize( this.initFigRect.width * Math.sqrt(zoomState[nZoomIndex]),
						this.initFigRect.height * Math.sqrt(zoomState[nZoomIndex]) );

	return true;
}

View.prototype.getCurrentZoom = function ()
{
	return zoomState[this.zoomStateIndex];
}

View.prototype.getZoomStateIndex = function ()
{
	return this.zoomStateIndex;
}

View.prototype.reculcTranslate = function ()
{
	var currentPos = this.fig.svgRootNode.getCurrentTranslate();
	var asvScale = this.fig.svgRootNode.currentScale;


	var pDiff = new Point( currentPos.getX(), currentPos.getY() );


	pDiff.magnify( 1/ asvScale );

	return pDiff;
}

View.prototype.culcZoomCenter = function ()
{
	var currentPos = this.fig.svgRootNode.getCurrentTranslate();
	var asvScale = this.fig.svgRootNode.currentScale;


	var pCenter = new Point( this.fig.width / 2 - currentPos.getX(), this.fig.height / 2 - currentPos.getY() );


	pCenter.magnify( (this.initFigRect.width / this.fig.width) / asvScale );

	return pCenter;
}



View.prototype.setLocation = function ( p )
{
	p.magnify( this.fig.width / this.initFigRect.width );
	confirm( this.fig.width / this.initFigRect.width );
	window.scrollTo(p.x, p.y );
}

View.prototype.getScrollCenterPosition = function ()
{
	return new Point( (this.initFigRect.width - this.viewRect.width) / 2, (this.initFigRect.height - this.viewRect.height) /2 );
}



View.prototype.centering = function ( pCenter )
{
	window.scrollTo( pCenter.x - this.viewRect.width / 2 , pCenter.y - this.viewRect.height / 2 );

}

View.prototype.scrollTo = function ( x, y )
{
	window.scrollTo( x, y );
}

