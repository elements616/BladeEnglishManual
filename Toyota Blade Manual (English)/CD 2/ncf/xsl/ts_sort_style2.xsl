<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <title>Sort</title>
      </head>
      <body>
      </body>
      <xsl:apply-templates select="document" />
    </html>
  </xsl:template>

<xsl:template match="document">
  <table border="1" cellspacing="0" cellpadding="2" width="95%" bordercolor="#FFFFFF">
    <tr>
      <th class="gray2" align="center">
        Part Name Code
        <input type="button" value="▼" onClick="sort1()" />
      </th>
      <th class="color2" align="center">
        SS Repair Items
        <input type="button" value="▼" onClick="sort2()" />
      </th>
      <th class="gray2" align="center">
        Manufacturer
        <input type="button" value="▼" onClick="sort3()" />
      </th>
    </tr>
    <xsl:for-each select="info">
      <xsl:sort select="category" data-type="text"/>
      <tr>
        <td class="gray3_dark" align="center">
          <xsl:if test="code/ptxt!=''"><xsl:apply-templates select="code/ptxt" /></xsl:if><xsl:if test="code/ptxt=''">&#160;</xsl:if>
        </td>
        <td class="gray3" align="center">
          <xsl:if test="category/ptxt!=''"><xsl:apply-templates select="category/ptxt" /></xsl:if><xsl:if test="category/ptxt=''">&#160;</xsl:if>
        </td>
        <td class="gray3_dark" align="center">
          <xsl:if test="maker/ptxt!=''"><xsl:apply-templates select="maker/ptxt" /></xsl:if><xsl:if test="maker/ptxt=''">&#160;</xsl:if>
        </td>
      </tr>
    </xsl:for-each>
  </table>
</xsl:template>

<xsl:template match="ptxt">
  <div>
    <xsl:apply-templates />
  </div>
</xsl:template>

</xsl:stylesheet>
