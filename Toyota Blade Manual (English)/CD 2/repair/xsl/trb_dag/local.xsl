<!-- $Id: local.xsl,v 1.12 2003/11/04 13:28:37 kato Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>
<xsl:param name="testid"/>
<xsl:param name="testrs"/>
<xsl:param name="scan"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-inc" />
</xsl:template>

<xsl:template match="tmc-service-inc">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<xsl:apply-templates select="servcat"/>
</xsl:template>

<xsl:template match="servcat">
	<xsl:apply-templates select="section"/>
</xsl:template>

<xsl:template match="section">
	<xsl:apply-templates select="ttl"/>
</xsl:template>

<xsl:template match="ttl">
	<xsl:apply-templates select="para"/>
</xsl:template>

<xsl:template match="para">
	<xsl:apply-templates select="subpara"/>
</xsl:template>

<xsl:template match="subpara">
	<xsl:apply-templates select="testgrp[@id=$testid]"/>
</xsl:template>

<xsl:template match="testgrp">
	<table>
		<xsl:attribute name="width">100%</xsl:attribute>
		<xsl:attribute name="border">0</xsl:attribute>
		<xsl:attribute name="cellspacing">0</xsl:attribute>
		<xsl:attribute name="cellpadding">0</xsl:attribute>
		<xsl:attribute name="id">ttl<xsl:value-of select="@id"/></xsl:attribute>
		<tr><td><br/></td></tr>
		<tr>
			<td width="10" class="img-back">
				<img src="../../img/b_icon1.png"/>
			</td>
			<td class="tbox">
				<xsl:element name="a">
					<xsl:attribute name="href">
						javascript:parent.displayContents('<xsl:value-of select="@id"/>', true)
					</xsl:attribute>
					<xsl:attribute name="class">tmenu</xsl:attribute>
					<xsl:value-of select="testtitle"/>
				</xsl:element>
			</td>
			<xsl:choose>
				<xsl:when test="string(res)">
					<td class="tres" width="30">
						<xsl:element name="a">
							<xsl:attribute name="href">javascript:parent.getCache('<xsl:value-of select="@id"/>')</xsl:attribute>
							<xsl:value-of select="$testrs"/>
						</xsl:element>
					</td>
					<td class="tres" width="30">
						<xsl:choose>
							<xsl:when test="$scan = 'true'">
								<xsl:element name="a">
									<xsl:attribute name="href">javascript:parent.displayContents('<xsl:value-of select="@id"/>', true)</xsl:attribute>
									<img src="../../img/scantool.png"><xsl:attribute name="border">0</xsl:attribute></img>
								</xsl:element>
							</xsl:when>
							<xsl:otherwise><br/></xsl:otherwise>
						</xsl:choose>
					</td>
				</xsl:when>
				<xsl:otherwise>
					<td class="tbold" width="60">END</td>
				</xsl:otherwise>
			</xsl:choose>
		</tr>
	</table>
	<xsl:if test="$testrs='' and string(res)">
		<xsl:variable name="res.children" select="count(res/child::*)"/>
		<xsl:variable name="res.wid" select="100 div $res.children"/>
		<xsl:variable name="res.down">
			<xsl:choose>
				<xsl:when test="string(res/down)"><xsl:value-of select="res/down"/></xsl:when>
				<xsl:otherwise>NEXT</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<table>
			<xsl:attribute name="width">100%</xsl:attribute>
			<xsl:attribute name="border">0</xsl:attribute>
			<xsl:attribute name="cellspacing">0</xsl:attribute>
			<xsl:attribute name="cellpadding">0</xsl:attribute>
			<xsl:attribute name="id">res<xsl:value-of select="@id"/></xsl:attribute>
			<tr>
				<xsl:if test="res/down">
					<xsl:element name="td">
						<xsl:attribute name="width">
							<xsl:value-of select="$res.wid"/>%
						</xsl:attribute>
						<xsl:attribute name="class">tres</xsl:attribute>
						<xsl:element name="a">
							<xsl:attribute name="class">tmenu</xsl:attribute>
							<xsl:attribute name="href">
								#
							</xsl:attribute>
							<xsl:attribute name="onClick">
								javascript:parent.result('<xsl:value-of select="@id"/>', '<xsl:value-of select="res/down/@ref"/>', '<xsl:value-of select="$res.down"/>');
							</xsl:attribute>
							<xsl:value-of select="$res.down"/>
						</xsl:element>
					</xsl:element>
				</xsl:if>
				<xsl:for-each select="res/right">
					<xsl:element name="td">
						<xsl:attribute name="width">
							<xsl:value-of select="$res.wid"/>%
						</xsl:attribute>
						<xsl:attribute name="class">tres</xsl:attribute>
						<xsl:element name="a">
							<xsl:attribute name="class">tmenu</xsl:attribute>
							<xsl:attribute name="href">
							#
						</xsl:attribute>
							<xsl:attribute name="onClick">
							javascript:parent.result('<xsl:value-of select="ancestor::testgrp/@id"/>', '<xsl:value-of select="@ref"/>', '<xsl:value-of select="."/>');
						</xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:element>
					</xsl:element>
				</xsl:for-each>
			</tr>
		</table>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>