<!-- $Id: list.xsl,v 1.14 2005/01/28 11:24:24 k-narumi Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>
<xsl:param name="partsId"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<xsl:apply-templates select="servcat"/>
</xsl:template>

<xsl:template match="servcat">
	<table width="100%" border="0" cellspacing="0" cellpadding="0" height="20">
		<tr>
			<td class="text">&lt; Repair Manual &gt;</td>
		</tr>
		<tr>
		  <td align="center">
				<table width="100%" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
					<tr class="tbl-head">
						<td width="20%">Section</td>
						<td width="40%">Title</td>
						<td width="40%">Main Text</td>
					</tr>
					<xsl:apply-templates select="section"/>
				</table>
			</td>
		</tr>
	</table>
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
						<xsl:element name="a">
							<xsl:attribute name="class">tbl-para</xsl:attribute>
							<xsl:attribute name="href">
								javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
							</xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:element>
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
						<xsl:element name="a">
							<xsl:attribute name="class">tbl-para</xsl:attribute>
							<xsl:attribute name="href">
								javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
							</xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:element>
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
						<xsl:element name="a">
							<xsl:attribute name="class">tbl-para</xsl:attribute>
							<xsl:attribute name="href">
								javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
							</xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:element>
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
						<xsl:element name="a">
							<xsl:attribute name="class">tbl-para</xsl:attribute>
							<xsl:attribute name="href">
								javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
							</xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:element>
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
									<xsl:element name="a">
										<xsl:attribute name="class">tbl-para</xsl:attribute>
										<xsl:attribute name="href">
											javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
										</xsl:attribute>
										<xsl:value-of select="."/>
									</xsl:element>
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
									<xsl:element name="a">
										<xsl:attribute name="class">tbl-para</xsl:attribute>
										<xsl:attribute name="href">
											javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
										</xsl:attribute>
										<xsl:value-of select="."/>
									</xsl:element>
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
									<xsl:element name="a">
										<xsl:attribute name="class">tbl-para</xsl:attribute>
										<xsl:attribute name="href">
											javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
										</xsl:attribute>
										<xsl:value-of select="."/>
									</xsl:element>
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
									<xsl:element name="a">
										<xsl:attribute name="class">tbl-para</xsl:attribute>
										<xsl:attribute name="href">
											javascript:parent.selectTypedLocation('<xsl:value-of select="../@id"/>', 'P<xsl:value-of select="../@category"/>');
										</xsl:attribute>
										<xsl:value-of select="."/>
									</xsl:element>
								</td>
							</tr>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>
