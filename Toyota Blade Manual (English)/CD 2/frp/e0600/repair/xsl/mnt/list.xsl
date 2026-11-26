<!-- $Id: list.xsl,v 1.20 2004/04/26 07:23:43 s-okino Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:variable name="srvdataNo">10004_</xsl:variable>
<xsl:param name="dispmnt">true</xsl:param>
<xsl:param name="tablewidth">95%</xsl:param>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<table width="{$tablewidth}" border="1" cellspacing="0" cellpadding="0" bordercolor="#ffffff" style="word-break:break-all">
		<tr>
			<a name="{servcat/section[starts-with(@id, $srvdataNo)]/@id}"/>
			<th width="20%" class="tbl-head">Classification</th>
			<th width="40%" class="tbl-head">Title</th>
			<th width="40%" class="tbl-head">Main Text</th>
		</tr>
		<xsl:apply-templates select="servcat/section[starts-with(@id, $srvdataNo)]"/>
		<xsl:if  test="$dispmnt='true'">
			<xsl:call-template name="mnt.list"/>
		</xsl:if>
	</table>
</xsl:template>

<xsl:template match="section">
	<xsl:apply-templates select="ttl[para[string-length('@id')>0]]"/>
</xsl:template>

<xsl:template match="ttl">
	<xsl:choose>
		<xsl:when test="position()=1">
		<xsl:variable name="srvdata.srows" select="count(..//para)"/>
			<tr>
				<xsl:element name="td">
					<xsl:attribute name="rowspan">
						<xsl:value-of select="$srvdata.srows"/>
					</xsl:attribute>
					<xsl:attribute name="class">tbl-ttl</xsl:attribute>
					<xsl:value-of select="parent::section/name"/>
				</xsl:element>
				<xsl:variable name="srvdata.prows" select="count(.//para)"/>
				<xsl:element name="td">
					<xsl:attribute name="rowspan">
						<xsl:value-of select="$srvdata.prows"/>
					</xsl:attribute>
					<xsl:attribute name="class">tbl-ttl</xsl:attribute>
					<xsl:value-of select="name"/>
				</xsl:element>
				<td class="tbl-par">
					<xsl:element name="a">
						<xsl:attribute name="href">
							javascript:parent.selectTypedLocation('<xsl:value-of select="para[1]/@id"/>', '<xsl:value-of select="para[1]/@category"/>');
						</xsl:attribute>
						<xsl:attribute name="class">tbl-para</xsl:attribute>
						<xsl:value-of select="para[1]/name"/>
					</xsl:element>
				</td>
			</tr>
			<!-- 第2パラグラフ以降 -->
			<xsl:for-each select="para[position()>1]">
				<tr>
					<td class="tbl-par">
						<xsl:element name="a">
							<xsl:attribute name="href">
								javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
							</xsl:attribute>
							<xsl:attribute name="class">tbl-para</xsl:attribute>
							<xsl:value-of select="name"/>
						</xsl:element>
					</td>
				</tr>
			</xsl:for-each>
		</xsl:when>
		<xsl:otherwise>
 			<xsl:apply-templates select="para"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="para">
	<xsl:choose>
		<xsl:when test="position()=1">
			<xsl:variable name="srvdata.prows" select="count(..//para)"/>
			<tr>
				<xsl:element name="td">
					<xsl:attribute name="rowspan">
						<xsl:value-of select="$srvdata.prows"/>
					</xsl:attribute>
					<xsl:attribute name="class">tbl-ttl</xsl:attribute>
					<xsl:value-of select="parent::ttl/name"/>
				</xsl:element>
				<td class="tbl-par">
					<xsl:element name="a">
						<xsl:attribute name="href">
							javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
						</xsl:attribute>
						<xsl:attribute name="class">tbl-para</xsl:attribute>
						<xsl:value-of select="name"/>
					</xsl:element>
				</td>
			</tr>
		</xsl:when>
		<xsl:otherwise>
			<tr>
				<td class="tbl-par">
					<xsl:element name="a">
						<xsl:attribute name="href">
							javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
						</xsl:attribute>
						<xsl:attribute name="class">tbl-para</xsl:attribute>
						<xsl:value-of select="name"/>
					</xsl:element>
				</td>
			</tr>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="mnt.list">
	<xsl:variable name="mnt.srows" select="count(//para[@category='N'])"/>
	<xsl:for-each select="//para[@category='N']">
		<xsl:choose>
			<xsl:when test="position()=1">
				<tr>
					<xsl:element name="td">
						<xsl:attribute name="rowspan">
							<xsl:value-of select="$mnt.srows"/>
						</xsl:attribute>
						<xsl:attribute name="class">tbl-ttl</xsl:attribute>
						Maintenance
					</xsl:element>
					<xsl:variable name="mnt.prows" select="count(../para[@category='N'])"/>
					<xsl:element name="td">
						<xsl:attribute name="rowspan">
							<xsl:value-of select="$mnt.prows"/>
						</xsl:attribute>
						<xsl:attribute name="class">tbl-ttl</xsl:attribute>
						<xsl:value-of select="../name"/>
					</xsl:element>
					<td class="tbl-par">
						<xsl:element name="a">
							<xsl:attribute name="href">
								javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
							</xsl:attribute>
							<xsl:attribute name="class">tbl-para</xsl:attribute>
							<xsl:value-of select="name"/>
						</xsl:element>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<!--
					1. 同一タイトル内にメンテナンスパラが自パラグラフより前にある
							⇒ パラ名のみ
					2. 同一タイトル内にメンテナンスパラが自パラグラフより後にある
							⇒ タイトル名(rowspan付き) + パラ名
					3. 同一タイトル内にメンテナンスパラが単独で出現
							⇒ タイトル名 + パラ名
					-->
					<xsl:when test="preceding-sibling::para[@category='N']">
						<tr>
							<td class="tbl-par">
								<xsl:element name="a">
									<xsl:attribute name="href">
										javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
									</xsl:attribute>
									<xsl:attribute name="class">tbl-para</xsl:attribute>
									<xsl:value-of select="name"/>
								</xsl:element>
							</td>
						</tr>
					</xsl:when>
					<xsl:when test="following-sibling::para[@category='N']">
						<xsl:variable name="mnt.mrows" select="count(../para[@category='N'])"/>
						<tr>
							<xsl:element name="td">
								<xsl:attribute name="rowspan">
									<xsl:value-of select="$mnt.mrows"/>
								</xsl:attribute>
								<xsl:attribute name="class">tbl-ttl</xsl:attribute>
								<xsl:value-of select="../name"/>
							</xsl:element>
							<td class="tbl-par">
								<xsl:element name="a">
									<xsl:attribute name="href">
										javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
									</xsl:attribute>
									<xsl:attribute name="class">tbl-para</xsl:attribute>
									<xsl:value-of select="name"/>
								</xsl:element>
							</td>
						</tr>
					</xsl:when>
					<xsl:otherwise>
						<tr>
							<xsl:element name="td">
								<xsl:attribute name="class">tbl-ttl</xsl:attribute>
								<xsl:value-of select="../name"/>
							</xsl:element>
							<td class="tbl-par">
								<xsl:element name="a">
									<xsl:attribute name="href">
										javascript:parent.selectTypedLocation('<xsl:value-of select="@id"/>', '<xsl:value-of select="@category"/>');
									</xsl:attribute>
									<xsl:attribute name="class">tbl-para</xsl:attribute>
									<xsl:value-of select="name"/>
								</xsl:element>
							</td>
						</tr>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>