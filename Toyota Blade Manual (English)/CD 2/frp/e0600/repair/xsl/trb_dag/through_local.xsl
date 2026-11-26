<!-- $Id: through_local.xsl,v 1.6 2003/07/22 09:43:56 miya Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

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
	<ol class="s1menu">
		<xsl:apply-templates select="testgrp"/>
	</ol>
</xsl:template>

<xsl:template match="testgrp">
	<xsl:if test="string(res)">
		<li>
			<p>
				<xsl:element name="a">
					<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="href">
						contents.html#<xsl:value-of select="@id"/>
					</xsl:attribute>
					<xsl:attribute name="target">contents</xsl:attribute>
					<xsl:attribute name="onMouseOver">parent.over(this);</xsl:attribute>
					<xsl:attribute name="onMouseOut">parent.out(this);</xsl:attribute>
					<xsl:attribute name="onClick">parent.changeMode(this);</xsl:attribute>
					<xsl:value-of select="testtitle"/>
				</xsl:element>
			</p>
		</li>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>