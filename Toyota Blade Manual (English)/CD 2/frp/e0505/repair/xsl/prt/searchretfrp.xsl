<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="fcnt"/>
<xsl:param name="ecnt"/>
<xsl:param name="count"/>
<xsl:param name="prevLink"/>
<xsl:param name="nextLink"/>

<xsl:template match="/">
	<table width="100%" border="0" cellspacing="0" cellpadding="0" height="20">
		<tr>
			<td class="text">&lt; Function-Specific Repair Manual &gt;
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
		<!-- 0件の場合はヘッダーだけ表示する。 -->
		<xsl:if test="count(//pub) = 0">
			<tr>
				<td align="center">
					<table width="100%" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
						<tr class="tbl-head">
							<td width="20%">Section</td>
							<td width="40%">Title</td>
							<td width="40%">Main Text</td>
						</tr>
					</table>
				</td>
			</tr>
		</xsl:if>
		<xsl:apply-templates select="tmc-service-db/pub"/>
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

<xsl:template match="pub">
	<tr>
		<td class="text">
			<xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
			■<xsl:value-of select="@shortname"/>
		</td>
	</tr>
	<tr>
		<td align="center">
			<table width="100%" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
				<tr class="tbl-head">
					<td width="20%">Section</td>
					<td width="40%">Title</td>
					<td width="40%">Main Text</td>
				</tr>
				<xsl:apply-templates select=".//section"/>
			</table>
		</td>
	</tr>
	<xsl:if test="following-sibling::pub">
		<tr>
			<td>
				<br/>
			</td>
		</tr>	
	</xsl:if>
</xsl:template>

<xsl:template match="section">
	<xsl:variable name="para.cnt" select="count(.//ttl/para/name)"/>
	<xsl:for-each select=".//ttl/para/name">
		<xsl:choose>
			<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
			<xsl:when test="position()=1">
				<tr>
					<td class="tbl-ttl" rowspan="{$para.cnt}">
						<xsl:value-of select="ancestor::section/name"/>
					</td>
					<td class="tbl-ttl">
						<!-- 同一ttl内に対象paraが複数含まれる場合 -->
						<xsl:if test="../following-sibling::para/name or following-sibling::name">
							<xsl:attribute name="rowspan">
								<xsl:value-of select="count(../following-sibling::para/name) + count(following-sibling::name) + 1"/>
							</xsl:attribute>
						</xsl:if>
						<xsl:value-of select="ancestor::ttl/name"/>
					</td>
					<td class="tbl-par">
						<xsl:call-template name="dispLink"/>
					</td>
				</tr>
			</xsl:when>
			<!-- 一つ目の以降の要素はpara(場合によりttlも)のみ表示する。 -->
			<xsl:otherwise>
				<tr>
					<!-- 同一ttl内に先行paraがない場合 -->
					<xsl:if test="not(../preceding-sibling::para/name or preceding-sibling::name)">
						<td class="tbl-ttl">
							<xsl:attribute name="rowspan">
								<xsl:value-of select="count(../following-sibling::para/name) + count(following-sibling::name) + 1"/>
							</xsl:attribute>
							<xsl:value-of select="ancestor::ttl/name"/>
						</td>
					</xsl:if>
					<td class="tbl-par">
						<xsl:call-template name="dispLink"/>
					</td>
				</tr>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="dispLink">
	<xsl:variable name="dispName" select="."/>
	<xsl:variable name="dispFrom" select="../@from"/>
	<xsl:variable name="dispTo" select="../@to"/>
	<xsl:variable name="typeId" select="../@type-id"/>
	<xsl:element name="a">
		<xsl:attribute name="class">tbl-para</xsl:attribute>
		<xsl:attribute name="href">
			javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>', '<xsl:value-of select="ancestor::pub/@id"/>');
		</xsl:attribute>
		<xsl:choose>
			<xsl:when test ="../preceding-sibling::para/@type-id=$typeId or ../following-sibling::para/@type-id=$typeId">
				<xsl:choose>
					<xsl:when test="$dispFrom !='' and ($dispTo ='' or name($dispTo)='')">
						<xsl:value-of select="$dispName"/>(<xsl:value-of select="substring($dispFrom,1,4)"/>/<xsl:value-of select="substring($dispFrom,5,6)"/> - <xsl:text>&#160;&#160;&#160;&#160;&#160;&#160;&#160;</xsl:text>)
					</xsl:when>
					<xsl:when test="($dispFrom ='' or name($dispFrom)='') and $dispTo !=''">
						<xsl:value-of select="$dispName"/>(<xsl:text>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</xsl:text> - <xsl:value-of select="substring($dispTo,1,4)"/>/<xsl:value-of select="substring($dispTo,5,6)"/>)
					</xsl:when>
					<xsl:when test="$dispFrom !='' and $dispTo !=''">
						<xsl:value-of select="$dispName"/>(<xsl:value-of select="substring($dispFrom,1,4)"/>/<xsl:value-of select="substring($dispFrom,5,6)"/> - <xsl:value-of select="substring($dispTo,1,4)"/>/<xsl:value-of select="substring($dispTo,5,6)"/>)
					</xsl:when>
					<xsl:when test="($dispFrom ='' or name($dispFrom)='') and ($dispTo ='' or name($dispTo)='')">
						<xsl:value-of select="$dispName"/>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$dispName"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:element>
</xsl:template>

</xsl:stylesheet>
