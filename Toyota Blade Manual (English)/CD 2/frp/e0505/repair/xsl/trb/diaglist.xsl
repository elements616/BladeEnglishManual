<!-- $Id: diaglist.xsl,v 1.15 2006/01/31 00:57:58 k-narumi Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xlink="http://www.w3.org/1999/xlink" 
	exclude-result-prefixes="xlink"
	version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-inc"/>
</xsl:template>

<xsl:template match="tmc-service-inc">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<xsl:apply-templates select="servcat"/>
</xsl:template>

<xsl:template match="servcat">
	<xsl:apply-templates select="section"/>
</xsl:template>

<xsl:template match="section">
	<xsl:apply-templates select="ttl"/>
</xsl:template>

<xsl:template match="ttl">
	<xsl:apply-templates select="para"/>
</xsl:template>

<xsl:template match="para">
	<xsl:apply-templates select="subpara"/>
</xsl:template>

<xsl:template match="subpara">
	<xsl:apply-templates select="content5"/>
</xsl:template>

<xsl:template match="content5">
	<xsl:apply-templates select="descendant::table"/>
</xsl:template>

<xsl:template match="table">
	<table border="1" cellpadding="0" cellspacing="0" width="100%" bordercolor="#ffffff">
		<caption class="tbl-title"><xsl:value-of select="title"/></caption>
		<tr>
			<th width="25%" class="tbl-head">Diagnostic Trouble Code (DTC)</th>
			<th width="75%" class="tbl-head">Diagnosis Item</th>
		</tr>
		<xsl:apply-templates select="tgroup"/>
	</table>
	<br/>
</xsl:template>

<xsl:template match="tgroup">
	<xsl:apply-templates select="tbody"/>
</xsl:template>

<xsl:template match="tbody">
	<xsl:apply-templates select="row"/>
</xsl:template>

<xsl:template match="row">
	<tr>
		<td class="tbl-par">
			<a class="tbl-para" target='_top'>
				<xsl:if test="string(child::entry/child::ptxt/xref/@href)">
					<xsl:attribute name="href">
						javascript:selectTypedLocation('<xsl:value-of select="child::entry/child::ptxt/xref/@href"/>', 'C')
					</xsl:attribute>
				</xsl:if>
				<xsl:for-each select="entry[1]//ptxt">
					<xsl:value-of select="."/><br/>
				</xsl:for-each>
			</a>
		</td>
		<td class="tbl-ttl">
			<xsl:for-each select="entry[2]//ptxt">
				<xsl:value-of select="."/><br/>
			</xsl:for-each>
		</td>
	</tr>
</xsl:template>

</xsl:stylesheet>