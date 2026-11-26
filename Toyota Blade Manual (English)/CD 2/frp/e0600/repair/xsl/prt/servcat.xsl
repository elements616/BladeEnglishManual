<!-- $Id: servcat.xsl,v 1.9 2004/03/09 04:25:47 s-okino Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>
<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<table class="box" cellspacing="0" cellpadding="3">
		<xsl:apply-templates select="servcat"/>
	</table>
</xsl:template>

<xsl:template match="servcat">
	<xsl:if test="(number(substring(@id,1,1))) &gt; -1">
		<tr>
			<td>
				<table cellspacing="0" cellpadding="0" class="menubox">
					<tr>
						<td><img class="png" src="../../img/bg_icon0.png"/></td>
						<td class="whitebox">
							<xsl:element name="a">
								<xsl:attribute name="href">#p1</xsl:attribute>
								<xsl:attribute name="class">menu</xsl:attribute>
								<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
								<xsl:attribute name="onClick">parent.listParts(this.id)</xsl:attribute>
								<xsl:value-of select="shortname"/>
							</xsl:element>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>
