<!-- $Id: local.xsl,v 1.20 2003/12/15 12:20:24 kato Exp $ -->
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
	<ol class="s1menu">
	<xsl:apply-templates select="subpara"/>
	</ol>
</xsl:template>

<xsl:template match="subpara">
		<xsl:apply-templates select="s-1"/>
</xsl:template>

<xsl:template match="s-1">
	<li>
		<p>
			<xsl:element name="a">
				<xsl:attribute name="href">JavaScript:selectId('<xsl:value-of select="@id"/>')</xsl:attribute>
				<xsl:attribute name="name">
						<xsl:value-of select="@id"/>
				</xsl:attribute>
				<xsl:attribute name="onClick">
						JavaScript:parent.changeMode(this)
				</xsl:attribute>
				<xsl:attribute name="onMouseover">
						JavaScript:parent.over(this);
				</xsl:attribute>
				<xsl:attribute name="onMouseout">
						JavaScript:parent.out(this);
				</xsl:attribute>
				<xsl:apply-templates select="ptxt[1]"/><br/>
			</xsl:element>
		</p>
	</li>
</xsl:template>

<xsl:include href="../utl/_modifier.xsl"/>
<xsl:include href="../utl/_ptxt_skel.xsl"/>
<xsl:include href="../utl/_symbol.xsl"/>

</xsl:stylesheet>