<?xml version="1.0" encoding="UTF-8"?> 
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	
	<xsl:output method="html" encoding="UTF-8" />
	
	<xsl:template match="/">
		<div id="gp_matrix">
			<xsl:apply-templates select="LoadList" /> 
		</div>
	</xsl:template>

	<xsl:template match="LoadList">
		<div id="div_header"></div>
		<input id="term" type="hidden" />
		<table style="margin: 10px;">
			<tr>
				<td class="loads_title">Ground Loads</td>
			</tr>
		</table>
		<TABLE class="p_table" style="margin: 40px">
			<TR>
				<TD class="gray2">Connector No.</TD><TD class="gray2">Name</TD><TD class="gray2">Wiring Diagram</TD><TD class="gray2">Routing Diagram</TD>
			</TR>
			<xsl:apply-templates select="GP" />
		</TABLE>
		<p> </p>
	</xsl:template>
	
	<xsl:template match="GP">
		<TR>
			<TD class="gray3"><xsl:value-of select="@code" /></TD>
			<TD class="gray3"><xsl:value-of select="name" /></TD>
			<TD class="gray4_no_text">
				<xsl:for-each select="refs/System">
					<div class="loads-link">
						<span class="loads_ref">
							<xsl:attribute name="onClick">call_runOnClickSystemProc('<xsl:value-of select="./@code"/>','<xsl:value-of select="../../@code"/>')</xsl:attribute>
							<xsl:attribute name="onMouseOver">call_runOnMouseOverProc(this)</xsl:attribute>
							<xsl:attribute name="onMouseOut">call_runOnMouseOutProc(this)</xsl:attribute>
							<xsl:value-of select="." />
						</span>
					</div>
				</xsl:for-each>
			</TD>
			<TD class="gray4_no_text">
				<xsl:for-each select="refs/Routing">
					<div class="loads-link">
						<span class="loads_ref">
							<xsl:attribute name="onClick">call_runOnClickRoutingProc('<xsl:value-of select="./@code"/>','<xsl:value-of select="../../@code"/>')</xsl:attribute>
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
