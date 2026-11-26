<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>
<xsl:param name="partsId"/>

<xsl:template match="/">
	<table width="100%" border="0" cellspacing="0" cellpadding="0" height="20">
		<tr>
			<td>
				<br/>
			</td>
		</tr>
		<tr>
			<td class="text">&lt; Function-Specific Repair Manual &gt;</td>
		</tr>
		<xsl:apply-templates select="tmc-service-db"/>
	</table>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:variable name="cnt.para" select="count(.//ttl[parts[@id!=$partsId]]/para[parts[@id=$partsId]]/name)"/>
	<xsl:variable name="cnt.ttl" select="count(.//ttl[parts[@id=$partsId]]/para/name)"/>
	<!-- 1件も該当しない場合は、ヘッダーだけを表示 -->
	<xsl:if test="$cnt.para=0 and $cnt.ttl=0">
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
	<xsl:apply-templates select="pub"/>
	
</xsl:template>

<xsl:template match="pub">
	<xsl:variable name="cnt.para" select="count(.//ttl[parts[@id!=$partsId]]/para[parts[@id=$partsId]]/name)"/>
	<xsl:variable name="cnt.ttl" select="count(.//ttl[parts[@id=$partsId]]/para/name)"/>
	<xsl:if test="$cnt.para>0 or $cnt.ttl>0">
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
					<xsl:apply-templates select="servcat"/>
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<br/>
			</td>
		</tr>
	</xsl:if>
</xsl:template>

<xsl:template match="servcat">
	<xsl:apply-templates select="section"/>
</xsl:template>

<xsl:template match="section">
	<xsl:variable name="list.spc" select="count(.//ttl[parts[@id!=$partsId]]/para[parts[@id=$partsId]]/name)"/>
	<xsl:variable name="list.stc" select="count(.//ttl[parts[@id=$partsId]]/para/name)"/>
	<xsl:choose>
		<!-- 検索部品名がpara内にのみ出現する時(ttlには含まれない) -->
		<xsl:when test="$list.spc > 0 and $list.stc = 0">
			<xsl:call-template name="paraOnly">
				<xsl:with-param name="spc" select="$list.spc"/>
			</xsl:call-template>
		</xsl:when>
		<!-- 検索部品名がttl内にのみ出現する時(paraには含まれない) -->
		<xsl:when test="$list.spc = 0 and $list.stc > 0">
			<xsl:call-template name="titleOnly">
				<xsl:with-param name="stc" select="$list.stc"/>
			</xsl:call-template>
		</xsl:when>
		<!-- 検索部品名がttl,para両方に出現する時 -->
		<xsl:when test="$list.spc > 0 and $list.stc > 0">
			<xsl:call-template name="both">
				<xsl:with-param name="spc" select="$list.spc"/>
				<xsl:with-param name="stc" select="$list.stc"/>
			</xsl:call-template>
		</xsl:when>
	</xsl:choose>
</xsl:template>

<xsl:template name="paraOnly">
	<xsl:param name="spc"/>
	<xsl:for-each select=".//ttl[parts[@id!=$partsId]]/para[parts[@id=$partsId]]/name">
		<xsl:choose>
			<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
			<xsl:when test="position()=1">
				<tr>
					<td class="tbl-ttl" rowspan="{$spc}">
						<xsl:value-of select="ancestor::section/name"/>
					</td>
					<xsl:element name="td">
						<xsl:attribute name="class">tbl-ttl</xsl:attribute>
						<!-- 同一ttl内に対象paraが複数含まれる場合 -->
						<xsl:if test="../following-sibling::para[parts[@id=$partsId]]/name or following-sibling::name">
							<xsl:attribute name="rowspan">
								<xsl:value-of select="count(../following-sibling::para[parts[@id=$partsId]]/name) + count(following-sibling::name) + 1"/>
							</xsl:attribute>
						</xsl:if>
						<xsl:value-of select="ancestor::ttl/name"/>
					</xsl:element>
					<td class="tbl-par">
						<xsl:call-template name="dispLink"/>
					</td>
				</tr>
			</xsl:when>
			<!-- 一つ目の以降の要素はpara(場合によりttlも)のみ表示する。 -->
			<xsl:otherwise>
				<tr>
					<!-- 同一ttl内に対象paraが複数含まれない場合 -->
					<xsl:if test="not(../preceding-sibling::para[parts[@id=$partsId]]/name or preceding-sibling::name)">
						<td class="tbl-ttl">
							<xsl:attribute name="rowspan">
								<xsl:value-of select="count(../following-sibling::para[parts[@id=$partsId]]/name) + count(following-sibling::name) + 1"/>
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

<xsl:template name="titleOnly">
	<xsl:param name="stc"/>
	<xsl:for-each select=".//ttl[parts[@id=$partsId]]/para/name">
		<xsl:choose>
			<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
			<xsl:when test="position()=1">
				<tr>
					<td class="tbl-ttl" rowspan="{$stc}">
						<xsl:value-of select="ancestor::section/name"/>
					</td>
					<td class="tbl-ttl">
						<xsl:attribute name="rowspan">
							<xsl:value-of select="count(../following-sibling::para/name) + count(following-sibling::name) + 1"/>
						</xsl:attribute>
						<xsl:value-of select="ancestor::ttl/name"/>
					</td>
					<td class="tbl-par">
						<xsl:call-template name="dispLink"/>
					</td>
				</tr>
			</xsl:when>
			<!-- 一つ目以降の要素はparaのみ表示する。 -->
			<xsl:otherwise>
				<tr>
					<!-- 同一ttl内に対象paraが複数含まれない場合 -->
					<xsl:if test="not(../preceding-sibling::para/name or preceding-sibling::name)">
						<td class="tbl-ttl">
							<xsl:attribute name="rowspan">
								<xsl:value-of select="count(../following-sibling::para/name) + count(following-sibling::name) + 1"/>
							</xsl:attribute>
							<xsl:value-of select="ancestor::ttl/name"/>
						</td>
					</xsl:if>
					<!-- 同一ttl内に対象paraが複数含まれない場合 -->
					<td class="tbl-par">
						<xsl:call-template name="dispLink"/>
					</td>
				</tr>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="both">
	<xsl:param name="spc"/>
	<xsl:param name="stc"/>
	<tr>
		<td class="tbl-ttl" rowspan="{$spc+$stc+1}">
			<xsl:value-of select="name"/>
		</td>
	</tr>
	<xsl:for-each select=".//ttl">
		<xsl:choose>
			<!-- タイトルに含まれる場合 -->
			<xsl:when test="parts[@id=$partsId]">
				<xsl:for-each select="para/name">
					<xsl:choose>
						<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
						<xsl:when test="position()=1">
							<tr>
								<td class="tbl-ttl">
									<xsl:attribute name="rowspan">
										<xsl:value-of select="count(../following-sibling::para/name) + count(following-sibling::name) + 1"/>
									</xsl:attribute>
									<xsl:value-of select="ancestor::ttl/name"/>
								</td>
								<td class="tbl-par">
									<xsl:call-template name="dispLink"/>
								</td>
							</tr>
						</xsl:when>
						<!-- 一つ目以降の要素はparaのみ表示する。 -->
						<xsl:otherwise>
							<tr>
								<!-- 同一ttl内に対象paraが複数含まれない場合 -->
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
			</xsl:when>
			<!-- paraに含まれる場合 -->
			<xsl:otherwise>
				<xsl:for-each select="para[parts[@id=$partsId]]/name">
					<xsl:choose>
						<!-- 一つ目の要素はsection,ttl,para全て表示する。 -->
						<xsl:when test="position()=1">
							<tr>
								<xsl:element name="td">
									<xsl:attribute name="class">tbl-ttl</xsl:attribute>
									<!-- 同一ttl内に対象paraが複数含まれる場合 -->
									<xsl:if test="../following-sibling::para[parts[@id=$partsId]]/name or following-sibling::name">
										<xsl:attribute name="rowspan">
											<xsl:value-of select="count(../following-sibling::para[parts[@id=$partsId]]/name) + count(following-sibling::name) + 1"/>
										</xsl:attribute>
									</xsl:if>
									<xsl:value-of select="ancestor::ttl/name"/>
								</xsl:element>
								<td class="tbl-par">
									<xsl:call-template name="dispLink"/>
								</td>
							</tr>
						</xsl:when>
						<!-- 一つ目の以降の要素はpara(場合によりttlも)のみ表示する。 -->
						<xsl:otherwise>
							<tr>
								<!-- 同一ttl内に対象paraが複数含まれない場合 -->
								<xsl:if test="not(../preceding-sibling::para[parts[@id=$partsId]]/name or preceding-sibling::name)">
									<td class="tbl-ttl">
										<xsl:attribute name="rowspan">
											<xsl:value-of select="count(../following-sibling::para[parts[@id=$partsId]]/name) + count(following-sibling::name) + 1"/>
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
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="dispLink">
	<xsl:variable name="dispName" select="."/>
	<xsl:variable name="dispFrom" select="parent::para/@from"/>
	<xsl:variable name="dispTo" select="parent::para/@to"/>
	<xsl:variable name="typeId" select="parent::para/@type-id"/>
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