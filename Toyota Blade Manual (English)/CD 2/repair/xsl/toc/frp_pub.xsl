<!-- $Id: frp_pub.xsl,v 1.7 2004/03/09 04:25:47 s-okino Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<br/>
	<table class="box" cellspacing="0" cellpadding="3">
		<xsl:apply-templates select="pub"/>
	</table>
</xsl:template>

<xsl:template match="pub">
	<xsl:apply-templates select="shortname"/>
</xsl:template>

<xsl:template match="shortname">
	<tr>
		<td>
			<table cellspacing="0" cellpadding="0" class="menubox">
				<tr>
					<td class="imgbox">
						<img class="png" src="../../img/bg_icon0.png"/>
					</td>
					<td class="whitebox">
						<xsl:element name="a">
							<xsl:attribute name="href">#</xsl:attribute>
							<xsl:attribute name="class">menu</xsl:attribute>
							<xsl:attribute name="onClick">
								parent.getFrpList('<xsl:value-of select="parent::pub/@id"/>');
							</xsl:attribute>
							<xsl:attribute name="title"><xsl:value-of select="../longname"/></xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:element>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</xsl:template>

</xsl:stylesheet>
