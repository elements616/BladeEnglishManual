<!-- $Id: listewd.xsl,v 1.7 2003/09/05 06:48:57 kato Exp $ -->
<!-- edited with XML Spy v3.5 NT (http://www.xmlspy.com) by szg (Kawatetsu Systems, Inc.) -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="partsId"/>
<xsl:param name="servcatId"/>
<xsl:param name="servcatName"/>
<xsl:param name="term"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-ncfewd"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<xsl:apply-templates select="servcat"/>
</xsl:template>

<xsl:template match="servcat">
	<xsl:if test="name=$servcatName">
		<table width="100%" border="0" cellspacing="0" cellpadding="0" height="20">
			<tr>
				<td>
					<br/>
				</td>
			</tr>
			<tr>
				<td class="text">&lt; Electrical Wiring Diagram &gt;</td>
			</tr>
			<tr>
				<td align="center">
					<table width="100%" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
						<tr class="tbl-head">
							<td width="50%">Title</td>
							<td width="50%">Main Text	</td>
						</tr>
						<xsl:apply-templates select="section"/>
					</table>
				</td>
			</tr>
		</table>
	</xsl:if>
</xsl:template>

<xsl:template match="section">
	<xsl:variable name="paraCount" select="count(.//para[((number(@from) &lt;= number($term) and not(string(@to))) or (number(@from) &lt;= number($term) and number(@to) &gt; number($term)) or (not(string(@from)) and number(@to) &gt; number($term)) or (not(string(@from)) and not(string(@to)))) and parts[@id=$partsId]])"/>
	<!-- 検索部品名がpara内にのみ出現する時(ttlには含まれない) -->
	<xsl:if test="$paraCount > 0">
		<xsl:call-template name="paraOnly">
			<xsl:with-param name="paraCount" select="$paraCount"/>
		</xsl:call-template>
	</xsl:if>
</xsl:template>

<xsl:template name="paraOnly">
	<!-- paraの件数 -->
	<xsl:param name="paraCount"/>
	<!-- paraに名称の件数 -->
	<xsl:variable name="paraNameCount" select="count(.//para[((number(@from) &lt;= number($term) and not(string(@to))) or (number(@from) &lt;= number($term) and number(@to) &gt; number($term)) or (not(string(@from)) and number(@to) &gt; number($term)) or (not(string(@from)) and not(string(@to)))) and parts[@id=$partsId]]/name)"/>
	<!-- paraの名称が全部ある場合は -->
	<xsl:if test="$paraCount=$paraNameCount">
		<xsl:for-each select=".//para[((number(@from) &lt;= number($term) and not(string(@to))) or (number(@from) &lt;= number($term) and number(@to) &gt; number($term)) or (not(string(@from)) and number(@to) &gt; number($term)) or (not(string(@from)) and not(string(@to)))) and parts[@id=$partsId]]">
			<xsl:choose>
				<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
				<xsl:when test="position()=1">
					<tr>
						<td class="tbl-ttl" rowspan="{$paraCount}">
							<xsl:value-of select="ancestor::section/name"/>
						</td>
						<td class="tbl-par">
							<xsl:call-template name="dispLink"/>
						</td>
					</tr>
				</xsl:when>
				<!-- 一つ目の以降の要素はpara(場合によりttlも)のみ表示する。 -->
				<xsl:otherwise>
					<tr>
						<td class="tbl-par">
							<xsl:call-template name="dispLink"/>
						</td>
					</tr>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:if>
	<!-- paraの名称が含まれてないケース場合は -->
	<xsl:if test="$paraCount>$paraNameCount">
		<xsl:for-each select=".//para[((number(@from) &lt;= number($term) and not(string(@to))) or (number(@from) &lt;= number($term) and number(@to) &gt; number($term)) or (not(string(@from)) and number(@to) &gt; number($term)) or (not(string(@from)) and not(string(@to)))) and parts[@id=$partsId]]">
			<xsl:choose>
				<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
				<xsl:when test="position()=1">
					<tr>
						<td class="tbl-ttl" rowspan="{$paraCount}">
							<xsl:element name="a">
								<xsl:attribute name="class">tbl-para</xsl:attribute>
								<xsl:attribute name="href">
									javascript:openWindow('<xsl:value-of select="ancestor::section/@url"/>','ewd','<xsl:value-of select="$term"/>')
								</xsl:attribute>
								<xsl:value-of select="ancestor::section/name"/>
							</xsl:element>
						</td>
						<td class="tbl-par">
							<xsl:call-template name="dispLink"/>
						</td>
					</tr>
				</xsl:when>
				<!-- 一つ目の以降の要素はpara(場合によりttlも)のみ表示する。 -->
				<xsl:otherwise>
					<tr>
						<td class="tbl-par">
							<xsl:call-template name="dispLink"/>
						</td>
					</tr>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:if>
</xsl:template>

<xsl:template name="dispLink">
	<xsl:if test="string-length(./name)>0">
	<xsl:element name="a">
		<xsl:attribute name="class">tbl-para</xsl:attribute>
		<xsl:attribute name="href">
		javascript:openWindow('<xsl:value-of select="@url"/>','ewd','<xsl:value-of select="$term"/>')
		</xsl:attribute>
		<xsl:value-of select="name"/>
	</xsl:element>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>
