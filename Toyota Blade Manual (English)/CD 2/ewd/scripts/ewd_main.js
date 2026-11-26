/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/





function call_runOnLoadProc()
{
	try{
		var mode = getURLParam("imode");
		
		switch( mode ){

			case "category":
			self.window.location.assign( "category_frame.html" + window.location.search );
			break;
			

			case "parts":
			self.window.location.assign( "connector/parts.html" + window.location.search );
			break;
			

			case "loads":
			self.window.location.assign( "loads/matrix.html" + window.location.search );
			break;
			

			case "ewd":
			var ewdType = getURLParam("ewd_type")
			switch( ewdType ){
				case "system":
				self.window.location.assign( "system/system.html" + window.location.search );
				break;
				
				case "routing":
				self.window.location.assign( "routing/routing.html" + window.location.search );
				break;
				
				case "relay":
				self.window.location.assign( "routing/routing.html" + window.location.search );
				break;
			}

			break;
			
			default:
			var paramTable = makeParamTable(window.location.search);
			paramTable.put("category","system");
			self.window.location.assign( "category_frame.html" + makeParamString(paramTable) );
			break;
		}
	}
	catch( e ){
		window.alert(e.description);
	}
}
