<!-- $Id: _spec.xsl,v 1.19 2004/02/05 17:32:48 kato Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="spec">
 <xsl:if test="table">
	<xsl:variable name="table.fullwidth">
		<xsl:call-template name="fullWidth"><!--_table.xslに存在-->
			<xsl:with-param name="colwid" select="table/tgroup/colspec"/>
		</xsl:call-template>
	</xsl:variable>
  <xsl:if test="$table.fullwidth &gt; 4.5">
	   <br clear="all"/>
  </xsl:if>
 </xsl:if>
	<p>
	<dl class="spec">
		<dt class="spec"><xsl:value-of select="title"/></dt>
		<xsl:for-each select="child::*">
			<xsl:choose>
				<xsl:when test="name()='table'">
					<xsl:call-template name="spec.table"/>
				</xsl:when>
				<xsl:when test="name()='specitem'">
					<xsl:call-template name="spec.specitem"/>
				</xsl:when>
				<xsl:when test="name()='subtitle'">
					<xsl:call-template name="spec.subtitle"/>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</dl>
	</p>
</xsl:template>

<xsl:template name="spec.specitem">
	<dd class="spec">
		<xsl:for-each select="ptxt">
			<xsl:apply-templates select="."/>
			<br/>
		</xsl:for-each>
	</dd>
</xsl:template>

<xsl:template name="spec.table">
	<dd class="spec">
		<xsl:apply-templates select="."/>
	</dd>
</xsl:template>

<xsl:template name="spec.subtitle">
	<dd class="spec">
		<xsl:value-of select="."/>:
	</dd>
</xsl:template>

</xsl:stylesheet>