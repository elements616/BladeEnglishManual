<!-- $Id: _ptxt.xsl,v 1.6 2003/06/02 14:15:40 miya Exp $ -->
<!--======================================================================-->
<!--  _ptxt.xsl                                                           -->
<!--                                                                      -->
<!--  @see _modifier                                                      -->
<!--  @see _xref                                                          -->
<!--  @see _symbol                                                        -->
<!--======================================================================-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="ptxt">
	<xsl:for-each select="node()">
		<xsl:value-of select="self::text()"/>
		<xsl:apply-templates select="self::sub"/>
		<xsl:apply-templates select="self::sup"/>
		<xsl:if test="parent::node()/parent::node()/parent::node()[not(s-1 or testgrp)]">
			<xsl:apply-templates select="self::xref"/>
			<xsl:apply-templates select="self::xref-nonref"/>
		</xsl:if>
		<xsl:apply-templates select="self::symbol"/>
	</xsl:for-each>
<!--	<br/>-->
</xsl:template>

</xsl:stylesheet>