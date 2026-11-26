<!-- $Id: _xref.xsl,v 1.12 2003/07/04 01:27:06 takeo Exp $ -->
<!--======================================================================-->
<!--  _xref.xsl                                                           -->
<!--======================================================================-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" exclude-result-prefixes="xlink" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="xref">
	<xsl:element name="a">
		<xsl:attribute name="href">
			#
		</xsl:attribute>
		<xsl:attribute name="onclick">
			javascript:parent.seePage('<xsl:value-of select="@href"/>');return false;
		</xsl:attribute>
		<xsl:if test="../../../s-1 or ../../../testgrp">
			(see
		</xsl:if>
		<img src="../../img/extxref.png" border="0"/>
		<xsl:if test="../../../s-1 or ../../../testgrp">
			)
		</xsl:if>
	</xsl:element>
</xsl:template>

<xsl:template match="xref-nonref">
	<xsl:element name="a">
		<xsl:attribute name="href">
			#
		</xsl:attribute>
		<xsl:attribute name="onclick">
			javascript:parent.seePage('<xsl:value-of select="@href"/>');return false;
		</xsl:attribute>
		<xsl:if test="../../../s-1 or ../../../testgrp">
			(see
		</xsl:if>
		<img src="../../img/extxref.png" border="0"/>
		<xsl:if test="../../../s-1 or ../../../testgrp">
			)
		</xsl:if>
	</xsl:element>
</xsl:template>

</xsl:stylesheet>