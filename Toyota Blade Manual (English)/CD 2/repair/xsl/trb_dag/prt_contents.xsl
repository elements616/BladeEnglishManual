<!-- $Id: prt_contents.xsl,v 1.6 2003/07/17 05:20:24 sugita Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>
<xsl:param name="testid"/>
<xsl:param name="testrs"/>
<xsl:param name="scanret"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-inc" />
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
	<xsl:apply-templates select="testgrp[@id=$testid]"/>
</xsl:template>

<xsl:template match="testgrp">
	<br/>
	<table>
		<xsl:attribute name="width">100%</xsl:attribute>
		<xsl:attribute name="border">1</xsl:attribute>
		<xsl:attribute name="cellspacing">0</xsl:attribute>
		<xsl:attribute name="cellpadding">0</xsl:attribute>
		<xsl:attribute name="id">ttl<xsl:value-of select="@id"/></xsl:attribute>
		<tr>
			<td width="10" class="img-back">
				<img src="../../img/b_icon1.png"/>
			</td>
			<td class="tbox_prt">
				<xsl:value-of select="testtitle"/>
			</td>
			<xsl:choose>
				<xsl:when test="string(res)">
					<td class="tres_prt" width="60">
						<xsl:value-of select="$testrs"/>
					</td>
				</xsl:when>
				<xsl:otherwise>
					<td class="tbold" width="60">END</td>
				</xsl:otherwise>
			</xsl:choose>
		</tr>
	</table>
	<div>
		<xsl:attribute name="id">scan<xsl:value-of select="$testid"/></xsl:attribute>
	</div>
</xsl:template>

</xsl:stylesheet>
