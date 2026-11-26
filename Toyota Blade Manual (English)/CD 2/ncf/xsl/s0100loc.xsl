<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>


<xsl:template match="/">
	<html>
		<head><link rel="stylesheet" href="/_runtime/legacy.css"/><script src="/_runtime/compat.js"></script>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
		<link rel="stylesheet" href="../css/style.css" type="text/css"></link>
		<script language="JavaScript" src="../js/hidden.js"></script>
		<link rel="stylesheet" href="../css/left.css"></link>
		</head>
		<body bgcolor="#FFFFFF" leftmargin="5" topmargin="10" marginwidth="2" marginheight="2">
			<xsl:attribute name="onLoad">setTimeout('boVis(1)',1000);frameLoad('contents','<xsl:value-of select="//item/@default_url[1]" />');changeImg('<xsl:value-of select="substring-after(substring-after(substring-before(//item[1]/@default_url,'.xml'),'/'),'/')" />');</xsl:attribute>
			<script language="JavaScript">
<xsl:comment>
urlArray = ['<xsl:value-of select="//item/@default_url[1]" />','<xsl:value-of select="//item/@through_url[1]" />'];
itemNum = '<xsl:value-of select="count(cm_menu/commentary/item)" />';
</xsl:comment>
			</script>
			<xsl:apply-templates select="cm_menu"/>
		</body>
	</html>
</xsl:template>

<xsl:template match="commentary">
	<table cellpadding="5" cellspacing="0" border="0" width="195">
		<tr>
			<td class="text00"><nobr><xsl:apply-templates select="name" /></nobr></td>
		</tr>
	</table>
	<table cellpadding="5" cellspacing="0" border="0" width="195" style="display:block">
		<xsl:attribute name="id"><xsl:if test="contains(name,'Part') or contains(name,'part') or contains(name,'Component')">Parts</xsl:if><xsl:if test="contains(name,'System') or contains(name,'system')">System</xsl:if><xsl:if test="contains(name,'Part') or contains(name,'part') or contains(name,'Component')">Parts</xsl:if>1</xsl:attribute>
		<xsl:for-each select="item">
			<tr><td height="5"></td></tr>
			<xsl:call-template name="Iname1" />
		</xsl:for-each>
	</table>
	<table cellpadding="5" cellspacing="0" border="0" width="195" style="display:none">
		<xsl:attribute name="id"><xsl:if test="contains(name,'Part') or contains(name,'part') or contains(name,'Component')">Parts</xsl:if><xsl:if test="contains(name,'System') or contains(name,'system')">System</xsl:if><xsl:if test="contains(name,'Part') or contains(name,'part') or contains(name,'Component')">Parts</xsl:if>2</xsl:attribute>
		<xsl:for-each select="item">
			<tr><td height="5"></td></tr>
			<xsl:call-template name="Iname2" />
		</xsl:for-each>
	</table>
</xsl:template>

<xsl:template name="Iname1">
	<xsl:variable name="ID" select="substring-after(substring-after(substring-before(@default_url,'.xml'),'/'),'/')" />
	<xsl:variable name="DefaultID" select="@default_url" />
	<xsl:variable name="ThroughID" select="@through_url" />
	<tr>
		<td>
			<table cellpadding="0" cellspacing="0" border="0" width="100%">
				<tr>
					<td width="10" class="buttonbase">
						<xsl:attribute name="id">O<xsl:value-of select="$ID" /></xsl:attribute>
						<img src="../images/b_icon0.gif" width="10" height="20">
							<xsl:attribute name="id">I<xsl:value-of select="$ID" /></xsl:attribute>
						</img>
					</td>
					<td width="185">
						<div class="menu">
							<xsl:attribute name="id">C<xsl:value-of select="$ID" /></xsl:attribute>
							<xsl:attribute name="onClick">changeImg('<xsl:value-of select="$ID" />');contents_open('<xsl:value-of select="$DefaultID" />')</xsl:attribute>
							<xsl:attribute name="onMouseOver">mouseOverAndOut('<xsl:value-of select="$ID" />',0)</xsl:attribute>
							<xsl:attribute name="onMouseOut">mouseOverAndOut('<xsl:value-of select="$ID" />',1)</xsl:attribute>
							<xsl:attribute name="title"><xsl:apply-templates /></xsl:attribute>
							<xsl:apply-templates />
						</div>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</xsl:template>

<xsl:template name="Iname2">
	<xsl:variable name="ID" select="substring-before(@through_url,'.xml')" />
	<xsl:variable name="DefaultID" select="@default_url" />
	<xsl:variable name="ThroughID" select="@through_url" />
	<tr>
		<td>
			<table cellpadding="0" cellspacing="0" border="0" width="100%">
				<tr>
					<td width="10" class="buttonbase">
						<xsl:attribute name="id">O<xsl:value-of select="$ID" /><xsl:value-of select="@id" /></xsl:attribute>
						<img src="../images/b_icon0.gif" width="10" height="20">
							<xsl:attribute name="id">I<xsl:value-of select="$ID" /><xsl:value-of select="@id" /></xsl:attribute>
						</img>
					</td>
					<td width="185">
						<a class="menu">
							<xsl:attribute name="id">C<xsl:value-of select="$ID" /><xsl:value-of select="@id" /></xsl:attribute>
							<xsl:attribute name="onClick">changeImg('<xsl:value-of select="$ID" /><xsl:value-of select="@id" />')</xsl:attribute>
							<xsl:attribute name="onMouseOver">mouseOverAndOut('<xsl:value-of select="$ID" /><xsl:value-of select="@id" />',0)</xsl:attribute>
							<xsl:attribute name="onMouseOut">mouseOverAndOut('<xsl:value-of select="$ID" /><xsl:value-of select="@id" />',1)</xsl:attribute>
							<xsl:attribute name="title"><xsl:apply-templates /></xsl:attribute>
							<xsl:attribute name="href"><xsl:value-of select="$ThroughID" /></xsl:attribute>
							<xsl:attribute name="target">contents</xsl:attribute>
							<xsl:apply-templates />
						</a>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</xsl:template>



</xsl:stylesheet>

