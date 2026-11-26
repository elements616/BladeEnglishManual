<!-- $Id: add_local.xsl,v 1.5 2003/05/12 07:18:19 miya Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<br/>
	<ol class="subwindow-s1menu">
		<xsl:apply-templates select="servcat"/>
	</ol>
</xsl:template>

<xsl:template match="servcat">
	<xsl:apply-templates select="section"/>
</xsl:template>

<xsl:template match="section">
	<xsl:apply-templates select="ttl"/>
</xsl:template>

<xsl:template match="ttl">
	<xsl:apply-templates select="para[@category='M']"/>
</xsl:template>

<xsl:template match="para">
	<li>
		<xsl:element name="a">
			<xsl:attribute name="href">
				javascript:selectTitle('<xsl:value-of select="@id"/>');
			</xsl:attribute>
			<xsl:attribute name="class">subwindow-s1menu</xsl:attribute>
			<xsl:attribute name="onMouseOver">parent.over(this);</xsl:attribute>
			<xsl:attribute name="onMouseOut">parent.out(this);</xsl:attribute>
			<xsl:attribute name="onClick">parent.changeMode(this);</xsl:attribute>
			<xsl:value-of select="parent::ttl/name"/>
		</xsl:element>
	</li><br/>
</xsl:template>

</xsl:stylesheet>