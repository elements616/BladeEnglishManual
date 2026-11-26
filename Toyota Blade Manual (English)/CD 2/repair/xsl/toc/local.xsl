<!-- $Id: local.xsl,v 1.18 2006/01/11 08:48:08 k-narumi Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

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
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<xsl:choose>
				<xsl:when test="para/@category='L'">
					<td class="text">Precautions</td>
				</xsl:when>
				<xsl:when test="para/@category='F'">
					<td class="text">Introduction, etc.</td>
				</xsl:when>
				<xsl:when test="para/@category='H'">
					<td class="text">Periodic Inspection</td>
				</xsl:when>
				<xsl:when test="para/@category='S'">
					<td class="text">Diagnosis Contents (DTC)</td>
				</xsl:when>
				<xsl:when test="para/@category='T'">
					<td class="text">Diagnosis Contents (Symptom)</td>
				</xsl:when>
				<xsl:when test="para/@category='D'">
					<td class="text">Pre-check</td>
				</xsl:when>
				<xsl:when test="para/@category='U'">
					<td class="text">Inspection Data</td>
				</xsl:when>
				<xsl:when test="para/@category='V'">
					<td class="text">Diagnosis Procedure Navigation</td>
				</xsl:when>
				<xsl:otherwise>
					<td class="text"><xsl:value-of select="name"/></td>
				</xsl:otherwise>
			</xsl:choose>
		</tr>
	</table>
	<br/>
	<xsl:apply-templates select="para"/>
</xsl:template>

<xsl:template match="para">
	<p class="gentext"><xsl:value-of select="name"/></p>
	<xsl:apply-templates select="subpara"/>
</xsl:template>

<xsl:template match="subpara">
	<xsl:apply-templates select="content5"/>
</xsl:template>

<xsl:template match="content5">
	<xsl:variable name="ctt-id" select="position()"/>
	<p class="gencontent-title"><xsl:value-of select="title"/></p>
	<xsl:for-each select="child::*">
		<xsl:if test="name()='step1'">
			<xsl:element name="ol">
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="ancestor::para[@category='L'] or ancestor::para[@category='N']">step1-num</xsl:when>
						<xsl:otherwise>step1-disc</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:apply-templates select=".">
					<xsl:with-param name="ctt-id" select="$ctt-id"/>
				</xsl:apply-templates>
			</xsl:element>
		</xsl:if>
		<xsl:if test="name()='descript-diag'">
			<ol class="step1-num">
				<xsl:apply-templates select=".">
					<xsl:with-param name="ctt-id" select="$ctt-id"/>
				</xsl:apply-templates>
			</ol>
		</xsl:if>
	</xsl:for-each>
</xsl:template>

<xsl:template match="step1">
	<xsl:param name="ctt-id"/>
	<li>
		<xsl:if test="preceding-sibling::step1">
			<xsl:attribute name="value"><xsl:value-of select="count(preceding-sibling::step1)+1"/></xsl:attribute>
		</xsl:if>
		<p>
		<xsl:element name="a">
			<xsl:attribute name="href">gen_contents.html#<xsl:value-of select="ancestor::subpara/@proc-id"/><xsl:value-of select="$ctt-id"/><xsl:number level="any"/>step
			</xsl:attribute>
			<xsl:attribute name="onMouseover">
					JavaScript:parent.over(this);
			</xsl:attribute>
			<xsl:attribute name="onMouseout">
					JavaScript:parent.out(this);
			</xsl:attribute>
			<xsl:attribute name="onClick">
				parent.changeMode(this);
			</xsl:attribute>
			<xsl:attribute name="target">contents</xsl:attribute>
			<xsl:apply-templates select="ptxt[1]"/>
		</xsl:element>
		</p>
	</li>
</xsl:template>

<xsl:template match="descript-diag">
	<xsl:param name="ctt-id"/>
	<xsl:apply-templates select="descript-testgroup">
		<xsl:with-param name="ctt-id" select="$ctt-id"/>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="descript-testgroup">
	<xsl:param name="ctt-id"/>
	<li>
		<p>
		<xsl:element name="a">
			<xsl:attribute name="href">gen_contents.html#<xsl:value-of select="ancestor::subpara/@proc-id"/><xsl:value-of select="$ctt-id"/><xsl:number level="any"/></xsl:attribute>
			<xsl:attribute name="onMouseover">JavaScript:parent.over(this);</xsl:attribute>
			<xsl:attribute name="onMouseout">JavaScript:parent.out(this);</xsl:attribute>
			<xsl:attribute name="onClick">parent.changeMode(this);</xsl:attribute>
			<xsl:attribute name="target">contents</xsl:attribute>
<!--
			<xsl:value-of select="testtitle"/>
-->
			<xsl:apply-templates select="testtitle"/>
		</xsl:element>
		</p>
	</li>
</xsl:template>

<xsl:include href="../utl/_modifier.xsl"/>
<!--
<xsl:include href="../utl/_ptxt_skel.xsl"/>
-->
<xsl:include href="../utl/_symbol.xsl"/>
<xsl:include href="../utl/deleteSeePage.xsl"/>

</xsl:stylesheet>
