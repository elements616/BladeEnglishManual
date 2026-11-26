<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8" />


<xsl:template match="/">
  <html>
    <head><link rel="stylesheet" href="/_runtime/legacy.css"/><script src="/_runtime/compat.js"></script>
      <title><xsl:value-of select="//TITLE[1]"/></title>
      <link rel="stylesheet" href="../css/main2.css" type="text/css" />
      <link rel="stylesheet" href="../css/style.css" />  
      <script language="JavaScript" src="../js/hidden.js" />
    </head>

    <body onload="printAndClose();setTab(0)">
      <form name="divValue">
        <INPUT TYPE="hidden" NAME="hid" VALUE="0"/>
        <INPUT TYPE="hidden" NAME="tm" VALUE="0"/>
      </form>

      <div align="left"><xsl:apply-templates /></div>
    </body>
  </html>
</xsl:template>

<!-- SCTITLE -->
<xsl:template match="SCTITLE"></xsl:template>

<!-- タイトル 2003.07.08.修正-->
<xsl:template match="PARA/TITLE">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr> 
    <xsl:choose>
    <xsl:when test="../@INFOTYPE[. = 'SYSTEM']">
      <td align="center" class="blue">
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td width="5%" class="blue"> </td>
            <td width="80%" class="blue" align="center"><xsl:apply-templates/></td>
            <td align="right" class="blue" width="15%"> </td>
          </tr>
        </table>
      </td>
    </xsl:when>
    <xsl:when test="../@INFOTYPE[. = 'PARTS']">
      <td align="center" class="gray">
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td width="5%" class="gray"> </td>
            <td width="80%" class="gray" align="center"><xsl:apply-templates/></td>
            <td align="right" class="gray" width="15%"> </td>
          </tr>
        </table>
      </td>
    </xsl:when>
    <xsl:when test="../@INFOTYPE[. = 'GENERAL']">
      <td align="center" class="gray">
        <xsl:apply-templates/>
      </td>
    </xsl:when>
    </xsl:choose>
    </tr>
  </table>
  <br/>
	<xsl:element name="form">
		<xsl:element name="input">
			<xsl:attribute name="type">radio</xsl:attribute>
			<xsl:attribute name="name">radiobutton1</xsl:attribute>
			<xsl:attribute name="value">radiobutton1</xsl:attribute>
			<xsl:attribute name="onClick">changeCold1()</xsl:attribute>
			Major Equipment List
		</xsl:element>
		<br/>
		<xsl:element name="input">
			<xsl:attribute name="type">radio</xsl:attribute>
			<xsl:attribute name="name">radiobutton1</xsl:attribute>
			<xsl:attribute name="value">radiobutton1</xsl:attribute>
			<xsl:attribute name="onClick">changeCold2()</xsl:attribute>
			<xsl:attribute name="checked" />
			Cold Area Specification List
		</xsl:element>
	</xsl:element>
</xsl:template>


<!-- PTXT -->
<xsl:template match="PTXT">
	<xsl:choose>
	<xsl:when test="parent::INFOSUB or parent::TOPIC">
		<table width="95%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td class="color1"><xsl:apply-templates /></td>
			</tr>
		</table>
		<br />
	</xsl:when>
	<xsl:otherwise>
		<xsl:if test="@ID">
			<xsl:element name="a">
				<xsl:attribute name="name"><xsl:value-of select="@ID" /></xsl:attribute>
			</xsl:element>
		</xsl:if>
		<div class="text">
			<xsl:apply-templates />
		</div>
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- SUP -->
<xsl:template match="SUP">
  <SUP>
    <xsl:apply-templates/>
  </SUP>
</xsl:template>

<!-- SUB -->
<xsl:template match="SUB">
  <SUB>
    <xsl:apply-templates/>
  </SUB>
</xsl:template>

<!-- 特別 -->
<xsl:template match="INFOSUB/TITLE">
  <table width="95%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="blue2">
        <xsl:apply-templates/>
      </td>
    </tr>
  </table>
</xsl:template>

<xsl:template match="INFOSUB">
 <br/>
  <table width="95%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="color1">
        <xsl:apply-templates/>
      </td>
    </tr>
  </table>
 <br/>
</xsl:template>

<xsl:template match="TABLE/TITLE">
  <table width="95%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="blue2">
        <xsl:apply-templates/>
      </td>
    </tr>
  </table>
</xsl:template>

<xsl:template match="MECA/TITLE">
  <table width="95%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td class="blue2">
        <xsl:apply-templates/>
      </td>
    </tr>
  </table>
</xsl:template>

<!-- HINT -->
<xsl:template match="HINT">
	<table width="95%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td class="blue2">HINT</td>
		</tr>
	</table>
	<xsl:apply-templates />
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
    <!--xsl:if test="descendant::ENTRY/@TYPE='ON'"-->
      <tr>
        <xsl:for-each select="ENTRY">
        <!--xsl:if test="@TYPE='ON'"-->
          <td>
            <xsl:call-template name="Attribute-table"/>
            <xsl:attribute name="class">color1</xsl:attribute>
<xsl:if test="@TYPE='ON'">
            <xsl:attribute name="style">background-color:#ffe4d8;font-weight:bold;</xsl:attribute>
</xsl:if>
            <xsl:call-template name="blank-cell"/>
          </td>
        <!--/xsl:if-->
        </xsl:for-each>
      </tr>
    <!--/xsl:if-->
    </xsl:for-each>
  </table>
  <br/>
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

<!-- ITEM -->
<xsl:template match="ITEM">
	<xsl:choose>
	<xsl:when test="ancestor::HINT">
		<xsl:variable name="HintID" select="descendant::PTXT/@ID" />
		<xsl:variable name="IDLength" select="string-length($HintID)" />
		<tr>
			<td width="27" align="center" valign="top" class="text">*<xsl:if test="preceding-sibling::ITEM or following-sibling::ITEM"><xsl:number /></xsl:if></td>
			<td class="text"><xsl:apply-templates /></td>
		</tr>
	</xsl:when>
	<xsl:otherwise>
		<br />
		<xsl:apply-templates />
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- LIST用テンプレート -->
<xsl:template name="List">
	<xsl:choose>
	<xsl:when test="ancestor::LIST1">
		<table width="100%" border="0" cellspacing="0" cellpadding="2">
			<xsl:apply-templates />
		</table>
	</xsl:when>
	<xsl:otherwise>
		<table width="95%" border="0" cellspacing="0" cellpadding="2">
			<xsl:apply-templates />
		</table>
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<!-- LIST -->
<xsl:template match="LIST1">
	<xsl:call-template name="List" />
</xsl:template>
<xsl:template match="LIST2">
	<tr>
		<td width="22"> </td>
		<td align="right">
			<xsl:call-template name="List" />
		</td>
	</tr>
</xsl:template>
<xsl:template match="LIST3">
	<tr>
		<td width="22"> </td>
		<td align="right">
			<xsl:call-template name="List" />
		</td>
	</tr>
</xsl:template>

<!-- HINTREF -->
<xsl:template match="HINTREF">
	<xsl:variable name="href"><xsl:value-of select="@REFID" /></xsl:variable>

	<!-- 表内の注 -->
	<xsl:choose>
	<xsl:when test="ancestor::TABLE">
		<xsl:for-each select="(ancestor::TABLE/following::HINT[1]/LIST1/ITEM) | (ancestor::TABLE/LEGEND/HINT[1]/LIST1/ITEM)">
			<xsl:if test="PTXT/@ID = $href">
				<a href="{concat('#',$href)}"><sup>*<xsl:if test="preceding-sibling::ITEM or following-sibling::ITEM"><xsl:number format="1" /></xsl:if></sup></a>
			</xsl:if>
		</xsl:for-each>
	</xsl:when>

	<!-- 本文中の注 -->
	<xsl:otherwise>
		<xsl:for-each select="parent::PTXT/following-sibling::HINT[1]/LIST1/ITEM | parent::PTXT/following-sibling::HINT[1]/PTXT | ancestor::LIST1/following-sibling::HINT[1]/LIST1/ITEM | ancestor::CAUTION//HINT[1]/LIST1/ITEM">
			<xsl:if test="PTXT/@ID = $href">
				<a href="{concat('#',$href)}"><sup>*
					<xsl:if test="preceding-sibling::ITEM or following-sibling::ITEM"><xsl:number /></xsl:if>
				</sup></a>
			</xsl:if>
		</xsl:for-each>
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>

</xsl:stylesheet>
