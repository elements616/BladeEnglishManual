<!-- $Id: servcat.xsl,v 1.15 2004/04/26 07:21:26 s-okino Exp $ -->
<!-- edited with XML Spy v3.5 NT (http://www.xmlspy.com) by szg (Kawatetsu Systems, Inc.) -->
<!--======================================================================-->
<!--            トラブルシュート一覧を表示する             -->
<!--            servcat.xsl                              -->
<!--            @return  トラブルシュート一覧HTML         -->
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
		<xsl:when test="( ./section/ttl/para[@category='S']  or ./section/ttl/para[@category='T'] )">
			<tr>
				<td>
					<table cellspacing="0" cellpadding="0" class="menubox">
						<tr>
							<td class="imgbox">
								<img class="png" src="../../img/bg_icon0.png"/>
							</td>
							<td class="whitebox">
								<a href="#" class="menu" onClick="dispSubMenu(this, p0{position()}.innerHTML)" id="popspan{position()}">
									<xsl:value-of select="shortname"/>
								</a>
								<div id="p0{position()}" style="display:none">
									<div class="popup">
										<xsl:apply-templates select="section"/>
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

<xsl:template match="section">
	<xsl:apply-templates select="ttl"/>
</xsl:template>

<xsl:template match="ttl">
	<xsl:choose>
		<xsl:when test="( para[@category='S'] and  para[@category='T'] )">
			<xsl:call-template name="dispItem">
<!--			<xsl:with-param name="paracat">ST</xsl:with-param>-->
				<xsl:with-param name="paracat">S</xsl:with-param>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:choose>
				<xsl:when test="( para[@category='S'] )">
					<xsl:call-template name="dispItem">
						<xsl:with-param name="paracat">S</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="( para[@category='T'] )">
							<xsl:call-template name="dispItem">
								<xsl:with-param name="paracat">T</xsl:with-param>
							</xsl:call-template>
						</xsl:when>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="dispItem">
	<xsl:param name="paracat">S</xsl:param>
	<a class="list" href="#" id="content.html?servcat={../../@id}&amp;section={../@id}&amp;ttl={@id}&amp;parag={para[@category=substring($paracat,1,1)]/@id}&amp;status={./name}&amp;paracat={$paracat}">
		<xsl:value-of select="./name"/>
	</a>
	<br/>
</xsl:template>

</xsl:stylesheet>
