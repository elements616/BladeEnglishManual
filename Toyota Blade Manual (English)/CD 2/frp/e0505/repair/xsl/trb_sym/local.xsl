<!-- $Id:$ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	exclude-result-prefixes="xlink"
	version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="rowpos"/>
<xsl:param name="tbl"/>

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
	<xsl:apply-templates select="content5"/>
</xsl:template>

<xsl:template match="content5">
	<xsl:apply-templates select="descendant::table[position()=$tbl]"/>
</xsl:template>

<xsl:template match="table">
	<xsl:apply-templates select="tgroup"/>
</xsl:template>

<xsl:template match="tgroup">
	<xsl:apply-templates select="tbody"/>
</xsl:template>

<xsl:template match="tbody">
	<xsl:apply-templates select="row[position()=$rowpos]"/>
</xsl:template>

<xsl:template match="row">
	<xsl:variable name="itemPos">
		<xsl:choose>
			<xsl:when test="count(child::entry)=3">2</xsl:when>
			<xsl:otherwise>1</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<li>
		<p>
			<xsl:element name="a">
				<xsl:attribute name="id"><xsl:value-of select="entry[position()=number($itemPos)+1]//xref/@href"/></xsl:attribute>
				<xsl:attribute name="href">
					<xsl:choose>
						<xsl:when test="entry[position()=number($itemPos)+1]//xref/@href!=''">contents.html#<xsl:value-of select="entry[position()=number($itemPos)+1]//xref/@href"/></xsl:when>
						<xsl:otherwise>contents.html#_</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:attribute name="target">contents</xsl:attribute>
				<xsl:attribute name="onClick">javascript:parent.changeMode(this)</xsl:attribute>
				<xsl:attribute name="onMouseover">javascript:parent.over(this)</xsl:attribute>
				<xsl:attribute name="onMouseout">javascript:parent.out(this)</xsl:attribute>
				<xsl:value-of select="entry[position()=$itemPos]/ptxt"/>
			</xsl:element>
		</p>
	</li>
</xsl:template>

</xsl:stylesheet>