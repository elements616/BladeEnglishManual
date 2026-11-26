<!-- $Id: deleteSeePage.xsl,v 1.2 2006/01/11 09:54:51 k-narumi Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="ptxt">
	<xsl:element name="ptxt">
		<xsl:for-each select="node()">
			<xsl:if test="self::text()">
				<xsl:variable name="txt" select="normalize-space(self::text())"/>
				<xsl:variable name="txt2" select="normalize-space(preceding-sibling::node()[position()=2])"/>
				<!-- English cross-references read "(see <xref/>)"; drop them for printing -->
				<xsl:variable name="a" select="starts-with(name(preceding-sibling::node()[position()=1]), 'xref') and starts-with($txt, ')') and substring($txt2, string-length($txt2)-3)='(see'"/>
				<xsl:variable name="t1" select="substring($txt, 1 + number($a))"/>
				<xsl:variable name="b" select="starts-with(name(following-sibling::node()[position()=1]), 'xref') and substring($t1, string-length($t1)-3)='(see'"/>
				<xsl:choose>
					<xsl:when test="$a or $b"><xsl:value-of select="substring($t1, 1, string-length($t1) - 4*number($b))"/></xsl:when>
					<xsl:otherwise><xsl:apply-templates select="current()"/></xsl:otherwise>
				</xsl:choose>
			</xsl:if>
			<xsl:apply-templates select="self::sub"/>
			<xsl:apply-templates select="self::sup"/>
			<xsl:apply-templates select="self::symbol"/>
		</xsl:for-each>
	</xsl:element>
</xsl:template>

<xsl:template match="testtitle">
	<xsl:element name="testtitle">
		<xsl:for-each select="node()">
			<xsl:if test="self::text()">
				<xsl:variable name="txt" select="normalize-space(self::text())"/>
				<xsl:variable name="txt2" select="normalize-space(preceding-sibling::node()[position()=2])"/>
				<!-- English cross-references read "(see <xref/>)"; drop them for printing -->
				<xsl:variable name="a" select="starts-with(name(preceding-sibling::node()[position()=1]), 'xref') and starts-with($txt, ')') and substring($txt2, string-length($txt2)-3)='(see'"/>
				<xsl:variable name="t1" select="substring($txt, 1 + number($a))"/>
				<xsl:variable name="b" select="starts-with(name(following-sibling::node()[position()=1]), 'xref') and substring($t1, string-length($t1)-3)='(see'"/>
				<xsl:choose>
					<xsl:when test="$a or $b"><xsl:value-of select="substring($t1, 1, string-length($t1) - 4*number($b))"/></xsl:when>
					<xsl:otherwise><xsl:apply-templates select="current()"/></xsl:otherwise>
				</xsl:choose>
			</xsl:if>
		</xsl:for-each>
	</xsl:element>
</xsl:template>

</xsl:stylesheet>
