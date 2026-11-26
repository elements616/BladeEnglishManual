<!-- $Id: servcat.xsl,v 1.13 2004/04/26 07:21:26 s-okino Exp $ -->
<!-- edited with XML Spy v3.5 NT (http://www.xmlspy.com) by szg (Kawatetsu Systems, Inc.) -->
<!--======================================================================-->
<!--            点検要領一覧を表示する            -->
<!--            servcat.xsl                      -->
<!--            @return  点検要領一覧HTML         -->
<!--======================================================================-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<table class="box" cellspacing="0" cellpadding="6">
		<xsl:apply-templates select="servcat"/>
	</table>
</xsl:template>

<xsl:template match="servcat">
	<xsl:choose>
		<xsl:when test="( ./section/ttl/para[@category='R'] )">
			<tr>
				<td>
					<table cellspacing="0" cellpadding="0" class="menubox">
						<tr>
							<td class="imgbox">
								<img class="png" src="../../img/bg_icon0.png" />
							</td>
							<td class="whitebox">
								<a href="#" class="menu" onClick="dispSubMenu(this, p0{position()}.innerHTML)" id="popspan{position()}">
									<xsl:value-of select="shortname"/>
								</a>
								<div id="p0{position()}" style="display:none">
									<div class="popup">
										<xsl:apply-templates select="section/ttl/para[@category='R']"/>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</xsl:when>
		<xsl:otherwise/>
	</xsl:choose>
</xsl:template>

<xsl:template match="para">
	<a class="list" href="#" id="content.html?servcat={../../../@id}&amp;section={../../@id}&amp;sectionvar={../../@variety}&amp;ttl={../@id}&amp;ttlvar={../@variety}&amp;parag={@id}&amp;status={../name}">
		<xsl:value-of select="../name"/>
	</a>
	<br/>
</xsl:template>

</xsl:stylesheet>
