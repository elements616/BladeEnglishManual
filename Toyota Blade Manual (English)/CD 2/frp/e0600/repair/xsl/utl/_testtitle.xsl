<!-- $Id: _testtitle.xsl,v 1.7 2003/07/04 02:49:46 takeo Exp $ -->
<!--======================================================================-->
<!--  _testtile.xsl                                                       -->
<!--                                                                      -->
<!--  @see _xref                                                          -->
<!--======================================================================-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="testtitle">
	<xsl:choose>
		<xsl:when test="not(string(../res))">
			<xsl:for-each select="node()">
				<xsl:value-of select="self::text()"/>
				<xsl:apply-templates select="self::xref"/>
				<xsl:apply-templates select="self::xref-nonref"/>
			</xsl:for-each>
		</xsl:when>
		<xsl:otherwise>
			<xsl:for-each select="node()">
				<xsl:value-of select="self::text()"/>
				<xsl:if test="parent::node()/parent::node()/parent::node()[not(s-1 or testgrp)]">
					<xsl:apply-templates select="self::xref"/>
					<xsl:apply-templates select="self::xref-nonref"/>
				</xsl:if>
			</xsl:for-each>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

</xsl:stylesheet>