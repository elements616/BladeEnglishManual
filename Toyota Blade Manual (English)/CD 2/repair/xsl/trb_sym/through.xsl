<!-- $Id: through.xsl,v 1.18 2004/06/15 04:46:13 s-okino Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:param name="ref"/>
<xsl:param name="term"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-inc"/>
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
	<br clear="all"/>
	<xsl:element name="a">
		<xsl:attribute name="name"><xsl:value-of select="$ref"/></xsl:attribute>
	</xsl:element>
	<xsl:choose>
		<!-- 診断スルー -->
		<xsl:when test="(@category='C' or @category='J') and not(contains($ref, '_'))">
			<table width="100%" border="1" cellspacing="0" cellpadding="2">
				<tr><td class="para">
					<xsl:value-of select="dtcname"/>
				</td></tr>
			</table>
			<br/>
			<xsl:element name="a">
				<xsl:attribute name="href">javascript:parent.openNewWindow('../trb_dag/frame.html?parag=<xsl:value-of select="$ref"/>&amp;term=<xsl:value-of select="$term"/>', 'diag')</xsl:attribute>
				Go to Flow
			</xsl:element>
		</xsl:when>
		<!-- 診断手順 -->
		<xsl:when test="(@category='C' or @category='J') and contains($ref, '_')">
			<xsl:apply-templates select="//testgrp[@id=$ref]"/>
		</xsl:when>
		<!-- 脱着スルー -->
		<xsl:when test="(@category='A' or @category='G' or @category='N' or @category='M') and not(contains($ref, '_'))">
			<table width="100%" border="1" cellspacing="0" cellpadding="2">
				<tr>
					<td class="para">
						<xsl:value-of select="parent::ttl/name"/>
					</td>
				</tr>
			</table>
			<xsl:apply-templates select="//s-1"/>
		</xsl:when>
		<!-- 脱着手順 -->
		<xsl:when test="(@category='A' or @category='G' or @category='N' or @category='M') and contains($ref, '_')">
			<xsl:apply-templates select="//s-1[@id=$ref]"/>
		</xsl:when>
		<!-- その他(general) -->
		<xsl:when test="(@category='L' or @category='F' or @category='S' or @category='T' or @category='D' or @category='U' or @category='V')">
			<table width="100%" border="1" cellspacing="0" cellpadding="2">
				<tr>
					<td class="para">
						<xsl:value-of select="parent::ttl/name"/>
					</td>
				</tr>
			</table>
			<xsl:apply-templates select="//content5"/>
		</xsl:when>
		<!-- その他(構成図) -->
		<xsl:when test="(@category='K' or @category='R')">
			<table width="100%" border="1" cellspacing="0" cellpadding="2">
				<tr>
					<td class="para">
						<xsl:value-of select="parent::ttl/name"/>
					</td>
				</tr>
			</table>
			<xsl:apply-templates select="//content2"/>
		</xsl:when>
	</xsl:choose>
	<br/>
</xsl:template>

<xsl:template match="testgrp">
	<table width="100%" border="1" cellspacing="0" cellpadding="2">
		<tr>
			<td>
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="testtitle/xref and res">xrefcolor</xsl:when>
						<xsl:otherwise>s1</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:value-of select="testtitle"/>
			</td>
			<td align="right">
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="testtitle/xref and res">xrefcolor</xsl:when>
						<xsl:otherwise>s1</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:if test="@proc-id">
					<a href="javascript:parent.openMemo('{@id}','{@proc-id}');" style="visibility:hidden">
						<img src="../../img/memo.png" id="{@proc-id}" border="0" />
					</a>
				</xsl:if>
			</td>
		</tr>
	</table>
	<xsl:apply-templates select="content1"/>
	<xsl:apply-templates select="content6"/>
</xsl:template>

<xsl:template match="s-1">
	<table width="100%" border="1" cellspacing="0" cellpadding="2">
		<tr>
			<td>
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="ptxt[1]/xref">xrefcolor</xsl:when>
						<xsl:otherwise>s1</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:value-of select="ptxt[1]"/>
			</td>
			<td align="right">
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="ptxt[1]/xref">xrefcolor</xsl:when>
						<xsl:otherwise>s1</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:if test="@proc-id">
					<a href="javascript:parent.openMemo('{@id}','{@proc-id}');" style="visibility:hidden">
						<img src="../../img/memo.png" id="{@proc-id}" border="0" />
					</a>
				</xsl:if>
			</td>
		</tr>
	</table>
	<font class="ptxt">
		<xsl:for-each select="ptxt[position() &gt; 1]">
			<xsl:apply-templates select="."/><br/>
		</xsl:for-each>
	</font>
	<xsl:apply-templates select="content1"/>
</xsl:template>

<xsl:include href="../utl/_content1.xsl"/>
<xsl:include href="../utl/_content2.xsl"/>
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