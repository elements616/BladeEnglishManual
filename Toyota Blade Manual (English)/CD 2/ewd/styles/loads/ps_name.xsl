<?xml version="1.0" encoding="UTF-8"?> 
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	
	<xsl:output method="html" encoding="UTF-8" />
	
	<xsl:template match="/">
		<div id="ps_matrix">
			<xsl:apply-templates select="LoadList" /> 
		</div>
	</xsl:template>

	<xsl:template match="LoadList">
		<div id="div_header"></div>
		<input id="term" type="hidden" />
		<table style="margin: 10px">
			<tr>
				<td class="loads_title">Fuse Loads</td>
				<td width="100"></td>
				<td style="color: #666666;  font-size: 12pt;">
					<input type="radio" name="sort" id="optCapacity" onClick="call_runOnClickOrder('capacity');" />
					By Capacity
				</td>
				<td style="color: #666666;  font-size: 12pt;">
					<input type="radio" name="sort" id="optName" onClick="call_runOnClickOrder('name');" />
					By Fuse Name
				</td>
			</tr>
		</table>
		
		<table class="p_table" style="margin: 40px">
			<xsl:apply-templates select="Block" /> 
		</table>
	</xsl:template>

	<xsl:template match="Block">
		<tr>
			<td colspan="4" class="gray">
				<input type="button" class="button1">
				<xsl:attribute name="id"><xsl:value-of select="@code" /></xsl:attribute>
				<xsl:attribute name="onClick">call_runOnClickRelayProc('<xsl:value-of select="@code" />')</xsl:attribute>
				<xsl:attribute name="value"><xsl:value-of select="blockname" /></xsl:attribute>
				</input>
			</td>
		</tr>
		<tr>
			<td class="gray2" colspan="2">Fuse</td>
			<td class="gray2">Wiring Diagram</td>
		</tr>
		<xsl:apply-templates select="Fuse">
			<xsl:sort select="name" order="ascending" data-type="text"/>
		</xsl:apply-templates>
		<tr><td colspan="4"> </td></tr>
	</xsl:template>

	<xsl:template match="Fuse">
		<TR>
			<TD class="gray3" width="50"><xsl:value-of select="@capacity" />A</TD>
			<TD class="gray3" width="100"><xsl:value-of select="name" /></TD>
			<TD class="gray4_no_text" width="400">
				<xsl:for-each select="refs/System">
					<div class="loads-link">
						<span class="loads_ref">
							<xsl:attribute name="onClick">call_runOnClickSystemProc('<xsl:value-of select="./@code"/>','')</xsl:attribute>
							<xsl:attribute name="onMouseOver">call_runOnMouseOverProc(this)</xsl:attribute>
							<xsl:attribute name="onMouseOut">call_runOnMouseOutProc(this)</xsl:attribute>
							<xsl:value-of select="." />
						</span>
					</div>
				</xsl:for-each>
			</TD>
		</TR>
	</xsl:template>
</xsl:stylesheet>
