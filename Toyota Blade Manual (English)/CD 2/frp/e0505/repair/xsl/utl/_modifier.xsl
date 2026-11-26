<!-- $Id: _modifier.xsl,v 1.4 2003/05/28 09:07:27 miya Exp $ -->
<!--======================================================================-->
<!--      _modifier.xsl                                                   -->
<!--======================================================================-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="sub">
	<sub><xsl:value-of select="."/></sub>
</xsl:template>

<xsl:template match="sup">
	<sup><xsl:value-of select="."/></sup>
</xsl:template>

</xsl:stylesheet>