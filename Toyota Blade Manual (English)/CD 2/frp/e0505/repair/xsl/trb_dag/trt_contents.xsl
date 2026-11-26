<!-- $Id: trt_contents.xsl,v 1.6 2003/05/28 13:53:38 miya Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="testid"/>
<xsl:variable name="fstid" select="//testgrp[1]/@id"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-inc" />
</xsl:template>

<xsl:template match="tmc-service-inc">
	<xsl:apply-templates select="pub"/>
	<br/>
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
	<xsl:if test="testgrp">
		<xsl:apply-templates select="testgrp"/>
	</xsl:if>
</xsl:template>

<xsl:template match="testgrp">
	<xsl:if test="res">
		<xsl:if test="position()=1">
			<xsl:apply-templates select="parent::subpara/content5"/>
		</xsl:if>
		<xsl:element name="a">
			<xsl:attribute name="name"><xsl:value-of select="@id"/></xsl:attribute>
		</xsl:element>
		<table width="100%" border="1" cellspacing="0" cellpadding="2">
			<tr>
				<td class="s1">
					<xsl:number format="1."/><xsl:value-of select="testtitle"/>
				</td>
			</tr>
		</table>
		<xsl:apply-templates select="content1"/>
		<xsl:apply-templates select="content6"/>
	</xsl:if>
	<xsl:apply-templates select="res"/>
</xsl:template>

<!-- 診断結果表示 -->
<xsl:template match="res">
	<table width="96%" border="0" cellspacing="0" cellpadding="4">
		<xsl:for-each select="right">
			<tr>
				<td width="50%">
					<table width="100%" border="0" cellspacing="0" cellpadding="0" height="28">
						<tr>
							<td width="60%"><br/></td>
							<td class="diag">
								<xsl:choose>
									<xsl:when test="@fin='true'">
										<xsl:attribute name="bgcolor">#ff0000</xsl:attribute>
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="bgcolor">#00ff00</xsl:attribute>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:value-of select="."/>
							</td>
							<td width="13" align="left">
								<xsl:choose>
									<xsl:when test="@fin='true'">
										<img src="../../img/fin_right.png" height="100%" width="13"/>
									</xsl:when>
									<xsl:otherwise>
										<img src="../../img/next_right.png" height="100%" width="13"/>
									</xsl:otherwise>
								</xsl:choose>
							</td>
						</tr>
					</table>
				</td>
				<td width="50%">
					<xsl:variable name="rightid" select="@ref"/>
					<table width="100%" border="1" cellspacing="0" cellpadding="2">
						<tr>
							<td class="s1">
								<xsl:choose>
									<xsl:when test="@fin='true'">
										<xsl:value-of select="//testgrp[@id=$rightid]/testtitle"/>
									</xsl:when>
									<xsl:otherwise>
										<!-- 手順番号を出す場合 -->
										<xsl:variable name="rightpos">
											<xsl:call-template name="getPosition">
												<xsl:with-param name="tests" select="//testgrp[child::res]"/>
												<xsl:with-param name="posid" select="$rightid"/>
											</xsl:call-template>
										</xsl:variable>
										Go to step <xsl:value-of select="$rightpos"/>
									</xsl:otherwise>
								</xsl:choose>
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr><td height="4px"></td></tr>
		</xsl:for-each>
	</table>
	<table width="96%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td width="20%" class="diag">
				<xsl:choose>
					<xsl:when test="down[@fin='true']">
						<xsl:attribute name="bgcolor">#ff0000</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="bgcolor">#00ff00</xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:value-of select="down"/>
			</td>
			<td width="80%"><br/></td>
		</tr>
		<tr>
			<td width="20%" align="center" valign="top">
				<xsl:choose>
					<xsl:when test="down[@fin='true']">
						<img src="../../img/fin_down.png" width="100%" height="13"/>
					</xsl:when>
					<xsl:otherwise>
						<img src="../../img/next_down.png" width="100%" height="13" />
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td width="80%"><br/></td>
		</tr>
		<xsl:if test="down[@fin='true']">
			<xsl:variable name="downid" select="down/@ref"/>
			<tr>
				<td colspan="2">
					<table width="100%" border="1" cellspacing="0" cellpadding="2">
						<tr>
							<td class="s1">
								<xsl:value-of select="//testgrp[@id=$downid]/testtitle"/>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</xsl:if>
	</table>
	<xsl:variable name="nextTestId" select="parent::*/following-sibling::testgrp[child::res][1]/@id"/>
	<xsl:variable name="downTestId" select="down/@ref"/>
	<xsl:if test="$nextTestId!=$downTestId">
		<table width="100%" border="1" cellspacing="0" cellpadding="2">
			<tr>
				<td class="s1">
					<xsl:variable name="downpos">
						<xsl:call-template name="getPosition">
							<xsl:with-param name="tests" select="//testgrp[child::res]"/>
							<xsl:with-param name="posid" select="$downTestId"/>
						</xsl:call-template>
					</xsl:variable>
					Go to step <xsl:value-of select="$downpos"/>
				</td>
			</tr>
		</table>
		<br/>
	</xsl:if>
</xsl:template>

<!-- 診断結果表示内容を｢手順〜へ｣と表示する場合の手順No.を取得する。 -->
<xsl:template name="getPosition">
	<xsl:param name="tests"/>
	<xsl:param name="posid"/>
	<xsl:choose>
		<xsl:when test="$tests[@id=$posid]">
			<xsl:variable name="recur">
				<xsl:call-template name="getPosition">
				<xsl:with-param name="tests" select="$tests[position()>1]"/>
				<xsl:with-param name="posid" select="$posid"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:value-of select="1+$recur"/>
		</xsl:when>
		<xsl:otherwise>0</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:include href="../utl/_content1.xsl"/>
<xsl:include href="../utl/_content5.xsl"/>
<xsl:include href="../utl/_content6.xsl"/>

<xsl:include href="../utl/_diag.xsl"/>
<xsl:include href="../utl/_testtitle.xsl"/>
<xsl:include href="../utl/_test1.xsl"/>
<xsl:include href="../utl/_results.xsl"/>

<xsl:include href="../utl/_table.xsl"/>
<xsl:include href="../utl/_ptxt.xsl"/>
<xsl:include href="../utl/_list.xsl"/>
<xsl:include href="../utl/_sst.xsl"/>
<xsl:include href="../utl/_torque.xsl"/>
<xsl:include href="../utl/_atten.xsl"/>
<xsl:include href="../utl/_spec.xsl"/>
<xsl:include href="../utl/_xref.xsl"/>
<xsl:include href="../utl/_figure.xsl"/>
<xsl:include href="../utl/_symbol.xsl"/>
<xsl:include href="../utl/_modifier.xsl"/>

</xsl:stylesheet>