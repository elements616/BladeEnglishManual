<!-- $Id: contents.xsl,v 1.21 2004/02/12 16:02:37 kato Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>
<xsl:param name="No"/>       <!-- 表示を行う手順ID -->
<xsl:param name="hasNum"/>   <!-- 手順No.を表示しない場合はlength>0の文字列 -->
<xsl:variable name="First" select="//subpara[s-1][1]/s-1[1]/@id"/>

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
	<xsl:choose>
		<xsl:when test="($No='' or $No = $First) and $hasNum = ''">
			<xsl:apply-templates select="content3"/>
			<xsl:apply-templates select="s-1[@id=$First]"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:apply-templates select="s-1[@id=$No]"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="s-1">
	<br clear="all"/>
	<table width="100%" border="1" cellspacing="0" >
		<tr>
			<td>
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="ptxt[1]/xref">xrefcolor</xsl:when>
						<xsl:otherwise>s1</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:if test="$hasNum = ''">
					<xsl:number level="any" from="para" format="1"/>.
				</xsl:if>
				<xsl:apply-templates select="ptxt[1]"/>
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
	<xsl:apply-templates select="content6"/>
</xsl:template>

<xsl:include href="../utl/_content1.xsl"/>
<xsl:include href="../utl/_content3.xsl"/>
<xsl:include href="../utl/_content6.xsl"/>

<xsl:include href="../utl/_diag.xsl"/>
<xsl:include href="../utl/_testtitle.xsl"/>
<xsl:include href="../utl/_test1.xsl"/>
<xsl:include href="../utl/_results.xsl"/>

<xsl:include href="../utl/_table.xsl"/>
<xsl:include href="../utl/_figure.xsl"/>
<xsl:include href="../utl/_ptxt.xsl"/>
<xsl:include href="../utl/_list.xsl"/>
<xsl:include href="../utl/_sst.xsl"/>
<xsl:include href="../utl/_torque.xsl"/>
<xsl:include href="../utl/_atten.xsl"/>
<xsl:include href="../utl/_spec.xsl"/>
<xsl:include href="../utl/_xref.xsl"/>
<xsl:include href="../utl/_symbol.xsl"/>
<xsl:include href="../utl/_modifier.xsl"/>

</xsl:stylesheet>