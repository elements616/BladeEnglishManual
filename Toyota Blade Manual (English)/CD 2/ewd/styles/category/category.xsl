<?xml version="1.0" encoding="UTF-8"?> 
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	
	<xsl:output method="html" encoding="UTF-8" />
	
	<xsl:template match="/">
		<xsl:apply-templates select="Category" />
	</xsl:template>
	
	<xsl:template match="Category">
		<div id="head" class="lblIndex">
			<xsl:if test="./Title = 'index'">
				Contents List
			</xsl:if>
			<xsl:if test="./Title = 'ewd'">
				Electrical Wiring Diagram
			</xsl:if>
		</div>
		<div id="info" class="category"
			onClick="call_runOnClickInfo()"
			onMouseOver="call_runOnMouseOverInfo()"
			onMouseOut="call_runOnMouseOutInfo()">Introduction</div>
		<div style="padding:20px"> </div>
		<div id="category" class="categorylist">
			<xsl:apply-templates select="CategoryInfo" />
		</div>
	</xsl:template>
	
	<xsl:template match="CategoryInfo">
		<xsl:call-template name="Table">
			<xsl:with-param name="code">cfe</xsl:with-param>
			<xsl:with-param name="name">Connector, Fuse, Ground</xsl:with-param>
		</xsl:call-template>
		<p class='space'></p>
		<xsl:apply-templates select="System" />
		<p class='space'></p>
		<xsl:apply-templates select="Routing" />
	</xsl:template>
	
	<xsl:template match="System">
		<xsl:for-each select="Item">
			<xsl:call-template name="Table">
				<xsl:with-param name="code" select="@code" />
				<xsl:with-param name="name" select="." />
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template match="Routing">
		<xsl:if test="@num != '0'">
			<xsl:call-template name="Table">
				<xsl:with-param name="code">routing</xsl:with-param>
				<xsl:with-param name="name">Routing Diagram</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="Table">
		<xsl:param name="code">No Code</xsl:param>
		<xsl:param name="name">No Name</xsl:param>
		<table cellspacing='0' cellpadding='0' class='list'>
			<tr>
				<td width='10' height='10'>
					<img src='../icon/b_icon0.png' width='10' height='100%' />
				</td>
				<td width='100%'>
					<div class='menu' onMouseOver='call_runOnMouseOver()' onMouseOut='call_runOnMouseOut()' onClick='call_runOnClick()'>
						<xsl:attribute name="id"><xsl:value-of select="$code"/></xsl:attribute>
						<xsl:value-of select="$name"/>
					</div>
				</td>
			</tr>
		</table>
	</xsl:template>
	
</xsl:stylesheet>
