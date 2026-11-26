<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="4.0" encoding="UTF-8" />

<xsl:template match="/">
	<html>
		<head><link rel="stylesheet" href="/_runtime/legacy.css"/><script src="/_runtime/compat.js"></script>
			<title>Major Equipment List</title>
		</head>
		<body>
		<xsl:apply-templates select="root" />
		</body>
	</html>
</xsl:template>

<!-- 項目ごとのタイトル -->
<xsl:template match="root/TITLE">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="gray" align="center">
        <xsl:apply-templates/>
      </td>
    </tr>
  </table>
</xsl:template>

<!-- 項目ごとのタイトル -->
<xsl:template match="TABLE/TITLE">
  <table width="95%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="blue2">
        <xsl:apply-templates/>
      </td>
    </tr>
  </table>
</xsl:template>

<!-- svg -->
<xsl:template match="svg">
	<br/>
  <table width="750" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="blue2">
        <xsl:value-of select="@title" />
      </td>
    </tr>
  </table>
  <br />
  <xsl:element name="a">
    <xsl:attribute name="href">javascript:openPDF('<xsl:value-of select="@file"/>');</xsl:attribute>
    <xsl:element name="img">
      <xsl:attribute name="border">0</xsl:attribute>
      <xsl:attribute name="src">../xml/grph_ent/<xsl:value-of select="@file"/>.png</xsl:attribute>
    </xsl:element>
  </xsl:element>
<!--
	<xsl:element name="iframe">
		<xsl:attribute name="onLoad">writeIFrame(<xsl:value-of select="@file"/>,'<xsl:value-of select="@file"/>')</xsl:attribute>
		<xsl:attribute name="src">about:blank</xsl:attribute>
		<xsl:attribute name="width">750</xsl:attribute>
		<xsl:attribute name="height">525</xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="@file"/></xsl:attribute>
	</xsl:element>
	<br/>
	<xsl:element name="input">
		<xsl:attribute name="type">submit</xsl:attribute>
		<xsl:attribute name="name">zoom</xsl:attribute>
		<xsl:attribute name="value">拡大</xsl:attribute>
		<xsl:attribute name="onClick">imgZoom('up',<xsl:value-of select="@file"/>)</xsl:attribute>
	</xsl:element>
	<xsl:element name="input">
		<xsl:attribute name="type">submit</xsl:attribute>
		<xsl:attribute name="name">down</xsl:attribute>
		<xsl:attribute name="value">縮小</xsl:attribute>
		<xsl:attribute name="onClick">imgZoom('down',<xsl:value-of select="@file"/>)</xsl:attribute>
	</xsl:element>
-->
	<br/>
	<br/>
</xsl:template>

<!-- 表 -->
<xsl:template match="TABLE/TGROUP">
  <br/>
  <table width="95%" border="1" cellspacing="0" cellpadding="0" bordercolor="#FFFFFF">
    <xsl:for-each select="THEAD/ROW">
      <tr>
        <xsl:for-each select="ENTRY">
          <td>
            <xsl:attribute name="class">gray3_dark</xsl:attribute>
            <xsl:call-template name="Attribute-table"/>
            <xsl:call-template name="blank-cell"/>
          </td>
        </xsl:for-each>
      </tr>
    </xsl:for-each>
    <xsl:for-each select="TBODY/ROW">
      <tr>
        <xsl:for-each select="ENTRY">
            <td>
              <xsl:attribute name="class">color1</xsl:attribute>
              <xsl:call-template name="Attribute-table"/>
              <xsl:call-template name="blank-cell"/>
            </td>
        </xsl:for-each>
      </tr>
    </xsl:for-each>
  </table>
  <br/>
</xsl:template> 



<!-- ptxt → div -->
<xsl:template match="ptxt">
	<div>
		<xsl:apply-templates />
	</div>
</xsl:template>

<!-- テーブル用テンプレート -->
<xsl:template name="Attribute-table">
	<xsl:variable name="COLNAME" select="@COLNAME"/>
	<xsl:if test="@NAMEST">
		<xsl:attribute name="colspan"><xsl:value-of select="@NAMEEND - @NAMEST + 1"/></xsl:attribute>
	</xsl:if>
	<xsl:if test="@MOREROWS">
		<xsl:attribute name="rowspan"><xsl:value-of select="@MOREROWS + 1"/></xsl:attribute>
	</xsl:if>
	<xsl:if test="@VALIGN">
		<xsl:attribute name="valign"><xsl:value-of select="@VALIGN"/></xsl:attribute>
	</xsl:if>
	<xsl:if test="@ALIGN">
		<xsl:attribute name="align"><xsl:value-of select="@ALIGN"/></xsl:attribute>
	</xsl:if>
	<xsl:attribute name="width"><xsl:value-of select="../../../COLSPEC/@COLWIDTH[../@COLNAME=$COLNAME]"/></xsl:attribute>
</xsl:template>
<xsl:template name="blank-cell">
	<xsl:if test=".!=''"><xsl:apply-templates /></xsl:if>
	<xsl:if test=".=''">&#160;</xsl:if>
</xsl:template>

</xsl:stylesheet>
