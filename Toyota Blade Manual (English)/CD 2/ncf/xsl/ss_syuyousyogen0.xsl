<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="4.0" encoding="UTF-8" />


<xsl:template match="/">
<xsl:apply-templates />
</xsl:template>


<xsl:template match="title">
	<table border="0" cellspacing="0" cellpadding="2" width="100%">
		<tr> 
			<td class="gray" align="center"><xsl:apply-templates /></td>
		</tr>
	</table>
	<br />
</xsl:template>


<xsl:template match="pick">
	<form name="form">
		<table bordercolor="#FFFFFF" cellpadding="5" cellspacing="0" border="1" width="95%">
			<tr valign="top" align="center" class="gray3_dark_left">
				<td>Model Code (Designation No.)</td>
				<td>Classification</td>
				<td> </td>
			</tr>
			<tr valign="top" align="center" class="color1">
				<td>
					<xsl:call-template name="Listbox" />
				</td>
				<td>
					<xsl:call-template name="Pdf" />
					<br/>
				</td>
				<td>
					<xsl:element name="input">
						<xsl:attribute name="type">button</xsl:attribute>
						<xsl:attribute name="onClick">openPDF(document.form.katasiki.value)</xsl:attribute>
						<xsl:attribute name="value">Open PDF</xsl:attribute>
					</xsl:element>
				</td>
			</tr>
		</table>
	</form>
</xsl:template>


<xsl:template name="Listbox">
	<select name="katasiki" size="20" style="width:150px">
		<xsl:attribute name="onChange">showList();document.all(this[this.selectedIndex].value).style.display='block'</xsl:attribute>
		<xsl:for-each select="listbox">
			<option>
				<xsl:attribute name="value"><xsl:value-of select="@type"/></xsl:attribute>
				<xsl:choose>
				<xsl:when test="@selectno!=''">
					<xsl:value-of select="@type" />(<xsl:value-of select="@selectno" />)
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@type" />
				</xsl:otherwise>
				</xsl:choose>
			</option>
		</xsl:for-each>
	</select>
</xsl:template>

<xsl:template name="Pdf">
	<xsl:element name="div">
		<xsl:attribute name="style">display:block</xsl:attribute>
		<xsl:attribute name="id">empty</xsl:attribute>
		<select name="_empty" size="20" style="width:150px">
			<option> </option>
		</select>
	</xsl:element>
	<xsl:for-each select="listbox">
		<xsl:element name="div">
			<xsl:attribute name="style">display:none</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="@type" /></xsl:attribute>
			<select size="20" style="width:150px">
				<xsl:attribute name="name">_<xsl:value-of select="@type" /></xsl:attribute>
				<xsl:for-each select="PDF">
					<option>
						<xsl:attribute name="value"><xsl:value-of select="@FILE" /></xsl:attribute>
						<xsl:value-of select="@code" />
					</option>
				</xsl:for-each>
			</select>
		</xsl:element>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

