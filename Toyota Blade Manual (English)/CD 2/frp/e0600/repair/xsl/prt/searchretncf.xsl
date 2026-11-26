<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="fcnt"/>
<xsl:param name="ecnt"/>
<xsl:param name="count"/>
<xsl:param name="prevLink"/>
<xsl:param name="nextLink"/>
<xsl:param name="term"/>

<xsl:template match="/">

	<table width="100%" border="0" cellspacing="0" cellpadding="0" height="20">
		<tr>
			<td class="text">&lt; New Car Features &gt;
				<xsl:choose>
					<xsl:when test="not($count = 0)">
						<xsl:value-of select="$count" />items, showing <xsl:value-of select="$fcnt" /> - <xsl:value-of select="$ecnt" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$count" />items
					</xsl:otherwise>
				</xsl:choose>
			</td>
		</tr>
		<tr>
			<td align="center">
				<table width="100%" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
					<tr class="tbl-head">
						<td width="50%">Title</td>
						<td width="50%">Main Text</td>
					</tr>
					<xsl:apply-templates select="tmc-service-ncfewd//section"/>
				</table>
			</td>
		</tr>
		<tr>
			<td align='center'>
				<table width="100%" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
				<tr>
					<td width="40%"/>
					<td width="10%" align="center">
					<xsl:if test="boolean($prevLink)">
						<xsl:element name="a">
							<xsl:attribute name="class">pagelink</xsl:attribute>
							<xsl:attribute name="href"> # </xsl:attribute>
							<xsl:attribute name="onclick">javascript:displayPrev();</xsl:attribute>
							<b>
								<xsl:text disable-output-escaping="yes">&lt;&amp;nbsp;</xsl:text> Previous
							</b>
						</xsl:element>
					</xsl:if>
					</td>
					<td width="10%" align="center">
					<xsl:if test="boolean($nextLink)">
						<xsl:element name="a">
							<xsl:attribute name="class">pagelink</xsl:attribute>
							<xsl:attribute name="href"> # </xsl:attribute>
							<xsl:attribute name="onclick">javascript:displayNext();</xsl:attribute>
							<b>NEXT
								<xsl:text disable-output-escaping="yes">&amp;nbsp;&gt;</xsl:text>
							</b>
						</xsl:element>
					</xsl:if>
					</td>
					<td width="40%"/>
				</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<br/>
			</td>
		</tr>
	</table>
</xsl:template>

<xsl:template match="section">
	<xsl:variable name="para.cnt" select="count(.//para)"/>
	<xsl:variable name="paraName.cnt" select="count(.//para/name)"/>
	<!-- paraの名称が全部ある場合は -->
	<xsl:if test="$para.cnt=$paraName.cnt">
		<xsl:for-each select=".//para">
			<xsl:choose>
				<!-- 一つ目の要素はsection,para全て表示する。 -->
				<xsl:when test="position()=1">
					<tr>
						<td class="tbl-ttl" rowspan="{$para.cnt}">
							<xsl:value-of select="ancestor::section/name"/>
						</td>
						<td class="tbl-par">
							<xsl:call-template name="dispLink"/>
						</td>
					</tr>
				</xsl:when>
				<!-- 一つ目の以降の要素はparaのみ表示する。 -->
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
	<!-- paraの名称が全部ない場合は -->
	<xsl:if test="$para.cnt>$paraName.cnt">
		<xsl:for-each select=".//para">
			<xsl:choose>
				<!-- 一つ目の要素はsection,para全て表示する。 -->
				<xsl:when test="position()=1">
					<tr>
						<td class="tbl-ttl" rowspan="{$para.cnt}">
							<xsl:element name="a">
								<xsl:attribute name="class">tbl-para</xsl:attribute>
								<xsl:attribute name="href">
									javascript:openWindow('<xsl:value-of select="ancestor::section/@url"/>','ncf','<xsl:value-of select="$term"/>')
								</xsl:attribute>
								<xsl:value-of select="ancestor::section/name"/>
							</xsl:element>
						</td>
						<td class="tbl-par">
							<xsl:call-template name="dispLink"/>
						</td>
					</tr>
				</xsl:when>
				<!-- 一つ目の以降の要素はparaのみ表示する。 -->
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
		javascript:openWindow('<xsl:value-of select="@url"/>','ncf','<xsl:value-of select="$term"/>')
		</xsl:attribute>
		<xsl:value-of select="name"/>
	</xsl:element>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>
