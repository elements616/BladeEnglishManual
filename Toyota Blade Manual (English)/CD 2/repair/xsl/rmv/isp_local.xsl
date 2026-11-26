<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
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
	<ol class="ttlmenu-rmv">
		<li>
			<p>
				<xsl:element name="a">
					<xsl:attribute name="href">JavaScript:selectTop()</xsl:attribute>
					<xsl:attribute name="name"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="onMouseover">JavaScript:parent.over(this);</xsl:attribute>
					<xsl:attribute name="onMouseout">JavaScript:parent.out(this);</xsl:attribute>
					<xsl:attribute name="onClick">parent.changeMode(this);</xsl:attribute>
					<xsl:value-of select="name"/>
				</xsl:element>
			</p>
		</li>
	</ol>
</xsl:template>
</xsl:stylesheet>
