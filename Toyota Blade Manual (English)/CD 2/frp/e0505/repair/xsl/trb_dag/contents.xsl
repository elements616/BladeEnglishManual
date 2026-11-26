<!-- $Id: contents.xsl,v 1.21 2005/09/15 07:13:49 k-narumi Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="testid"/>
<xsl:variable name="fstid" select="//testgrp[1]/@id"/>

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
	<xsl:if test="testgrp">
		<xsl:apply-templates select="testgrp"/>
	</xsl:if>
</xsl:template>

<xsl:template match="testgrp">
	<xsl:if test="@id=$testid">
		<xsl:if test="position()=1">
			<xsl:apply-templates select="parent::subpara/preceding::subpara[position()=1]/content5"/>
		</xsl:if>
		<table width="100%" border="1" cellspacing="0" cellpadding="2">
			<tr>
				<td>
					<xsl:attribute name="class">
						<xsl:choose>
<!--							<xsl:when test="testtitle/xref and string(res)">xrefcolor</xsl:when>-->
							<xsl:when test="testtitle/xref or testtitle/xref-nonref">
								<xsl:choose>
									<!-- 
									resのないtestgrpには手順参照埋込時にシミュレーションとの区別の
									ためwebエレメントが挿入されている
									-->
									<!-- 20050915 追加 START
									xrefにlabel属性が設定されているのは
									リザルト手順に要領参照が設定されている場合
									-->
									<xsl:when test="testtitle/xref/@label">s1</xsl:when>
									<!-- 20050915 追加 END -->
									<xsl:when test="web">s1</xsl:when>
									<xsl:otherwise>xrefcolor</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>s1</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>

					<!--
					xrefにlabel属性が設定されているのは
					リザルト手順に要領参照が設定されている場合
					-->
					<xsl:choose>
						<xsl:when test="testtitle/xref/@label">
							<xsl:apply-templates select="testtitle"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="testtitle"/>
						</xsl:otherwise>
					</xsl:choose>
				</td>
<!-- 20050915 リザルトでもメモ表示
				<xsl:if test="child::res">
-->
				<td align="right">
					<xsl:attribute name="class">
						<xsl:choose>
<!--							<xsl:when test="testtitle/xref and string(res)">xrefcolor</xsl:when>-->
							<xsl:when test="testtitle/xref or testtitle/xref-nonref">
								<xsl:choose>
									<!-- 
									resのないtestgrpには手順参照埋込時にシミュレーションとの区別の
									ためwebエレメントが挿入されている
									-->
									<!-- 20050915 追加 START
									xrefにlabel属性が設定されているのは
									リザルト手順に要領参照が設定されている場合
									-->
									<xsl:when test="testtitle/xref/@label">s1</xsl:when>
									<!-- 20050915 追加 END -->
									<xsl:when test="web">s1</xsl:when>
									<xsl:otherwise>xrefcolor</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>s1</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:if test="@proc-id">
						<a href="javascript:parent.openMemo('{@id}','{@proc-id}');" style="visibility:hidden">
							<img src="../../img/memo.png" id="{@proc-id}" border="0" />
						</a>
					</xsl:if>
				</td>
<!-- 20050915 リザルトでもメモ表示
				</xsl:if>
-->
			</tr>
		</table>
<!--		<xsl:if test="string(res)">-->
		<xsl:apply-templates select="content1"/>
		<xsl:apply-templates select="content6"/>
<!--		</xsl:if>-->
	</xsl:if>
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