<!-- $Id: frp_list.xsl,v 1.15 2005/12/27 04:45:21 k-narumi Exp $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" version="4.0" encoding="UTF-8"/>

<xsl:template match="/">
	<xsl:apply-templates select="tmc-service-db"/>
</xsl:template>

<xsl:template match="tmc-service-db">
	<xsl:apply-templates select="pub"/>
</xsl:template>

<xsl:template match="pub">
	<table border="1" cellpadding="0" cellspacing="0" width="100%" bordercolor="#ffffff" style="word-break:break-all">
	<tr>
		<th width="20%" class="tbl-head">Section</th>
		<th width="40%" class="tbl-head">Title</th>
		<th width="40%" class="tbl-head">Main Text</th>
	</tr>
		<xsl:apply-templates select="*/section[not(starts-with(@id, '10003_') or starts-with(@id, '10001_') or starts-with(@id, '10035_') or starts-with(@id, '10036_') or starts-with(@id, '10037_') or starts-with(@id, '10038_') 
													or starts-with(@id, '10039_') or starts-with(@id, '10040_') or starts-with(@id, '10041_') or starts-with(@id, '10042_') or starts-with(@id, '11'))]">
			<xsl:sort select="seq/@no" data-type="number"/>
		</xsl:apply-templates>
	</table>
</xsl:template>

<xsl:template match="section">
	<xsl:variable name="pc" select="count(.//para[@category='C'])"/>
	<xsl:variable name="ps" select="count(.//para[@category='S'])"/>
	<xsl:variable name="pa" select="count(.//para)"/>
	<xsl:variable name="pt" select="count(.//ttl[para[@category='C' or @category='S']])"/>
	<xsl:variable name="rows" select="$pa - $pc - $ps + $pt" />
	<tr>
		<a name="{@id}"/>
		<td valign="middle" width="150" class="tbl-ttl" rowspan="{$rows}">
			<xsl:value-of select="name"/>
		</td>
		<xsl:apply-templates select="ttl"/>
	</tr>
</xsl:template>

<xsl:template match="ttl">
	<xsl:variable name="pc" select="count(.//para[@category='C'])"/>
	<xsl:variable name="ps" select="count(.//para[@category='S'])"/>
	<xsl:variable name="pa" select="count(.//para)"/>
	<xsl:variable name="rows">
		<xsl:choose>
		<xsl:when test=".//para[@category='C' or @category='S']">
			<xsl:value-of select="$pa - $pc - $ps + 1" />
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$pa - $pc - $ps" />
		</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:choose>
		<xsl:when test="position()!=1">
			<tr>
				<td valign="middle" class="tbl-ttl" rowspan="{$rows}">
					<xsl:value-of select="name"/>
				</td>
				<td class="tbl-par">
					<xsl:apply-templates select="para"/>
				</td>
			</tr>
		</xsl:when>
		<xsl:otherwise>
			<!--<tr>-->
			<td valign="middle" class="tbl-ttl" rowspan="{$rows}">
				<xsl:value-of select="name"/>
			</td>
			<td class="tbl-par">
				<xsl:apply-templates select="para"/>
			</td>
			<!--</tr>-->
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- ダイアグ一覧関連(C,S)のパラグラフ -->
<xsl:template match="para[@category='C' or @category='S']">
	<xsl:choose>
		<!-- C,Sで最初に出現したパラグラフを処理する -->
		<xsl:when test="not(preceding-sibling::para[@category='C' or @category='S'])">
			<xsl:choose>
				<xsl:when test="position()=1">
					<xsl:call-template name="dtc-table"/>
				</xsl:when>
				<xsl:otherwise>
					<tr>
						<td class="tbl-par">
							<xsl:call-template name="dtc-table"/>
						</td>
					</tr>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:when>
		<!-- C,Sで2回目以降に出現したパラグラフは処理しない -->
		<xsl:otherwise/>
	</xsl:choose>
</xsl:template>

<!-- C, S 以外の通常パラグラフ -->
<xsl:template match="para[not(@category='C') and not(@category='S')]">
	<xsl:choose>
		<xsl:when test="position()=1">
			<xsl:apply-templates select="name"/>
		</xsl:when>
		<xsl:otherwise>
			<tr>
				<td class="tbl-par">
					<xsl:apply-templates select="name"/>
				</td>
			</tr>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!--ダイアグコード一覧は１つのtableとして作成しtdの中に入れる -->
<xsl:template name="dtc-table">
	<!--ダイアグコード（category='C'）のデータの件数は表示時必要，変数として設定-->
	<xsl:variable name="dispNameRows" select="count(../para[@category='C']/name)"/>
	<!--ダイアグコード一覧全部データ表示  開始-->
	<table width="100%" border="0" cellspacing="0" cellpadding="0" bordercolor="#ffffff">
		<tr>
			<!--ダイアグコード一覧（category='S'）のデータ表示    開始-->
			<td width="40%">
				<xsl:choose>
					<xsl:when test="../para[@category='S']">
						<xsl:apply-templates select="../para[@category='S']/name"/>
					</xsl:when>
					<xsl:otherwise>
						Diagnostic Trouble Code Chart
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--ダイアグコード一覧（category='S'）のデータ表示    終了-->
			<!--兄弟レベルの ダイアグコード（category='Ｃ'）  データ左半分表示      開始 -->
			<td width="60%">
				<table width="100%" border="1" cellspacing="0" bordercolor="#ffffff">
					<xsl:variable name="ppp" select="../para[@category='C']/name" />
					<xsl:for-each select="../para[@category='C']/name">
						<xsl:if test="position() &lt;= ceiling($dispNameRows div 2)">
							<xsl:variable name="cur" select="position()" />
							<tr>
								<td width='50%' class="tbl-par">
									<xsl:apply-templates select="."/>
								</td>
								<td width='50%' class="tbl-par">
									<xsl:apply-templates select="$ppp[position()=$cur+ceiling($dispNameRows div 2)]" />
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
				</table>
			</td>
			<!--兄弟レベルの ダイアグコード（category='Ｃ'）  データ表示   終了 -->
		</tr>
	</table>
	<!--ダイアグコード一覧全部データ表示  終了    -->
</xsl:template>

<!--パラ名称をリンクとして表示 -->
<xsl:template match="name">
	<xsl:variable name="dispName" select="."/>
	<xsl:variable name="hashPara" select="parent::*/@id"/>
	<xsl:variable name="id"       select="parent::*/@id"/>
	<xsl:variable name="category" select="parent::*/@category"/>
	<xsl:variable name="pubId"    select="//pub/@id"/>

	<xsl:variable name="dispFrom" select="parent::para/@from"/>
	<xsl:variable name="dispTo"   select="parent::para/@to"/>
	<xsl:variable name="typeId"   select="parent::para/@type-id"/>

	<a name="{$hashPara}"/>
	<a href="javascript:parent.selectTypedLocation('{$id}', '{$category}', '{$pubId}');" class="tbl-para" target="_top">
		<xsl:choose>
			<xsl:when test ="parent::*/preceding-sibling::para/@type-id=$typeId or parent::*/following-sibling::para/@type-id=$typeId">
				<xsl:choose>
					<xsl:when test="$dispFrom !='' and ($dispTo ='' or name($dispTo)='')">
						<xsl:value-of select="$dispName"/>(<xsl:value-of select="substring($dispFrom,1,4)"/>/<xsl:value-of select="substring($dispFrom,5,6)"/> - <xsl:text>&#160;&#160;&#160;&#160;&#160;&#160;&#160;</xsl:text>)
					</xsl:when>
					<xsl:when test="($dispFrom ='' or name($dispFrom)='') and $dispTo !=''">
						<xsl:value-of select="$dispName"/>(<xsl:text>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</xsl:text> - <xsl:value-of select="substring($dispTo,1,4)"/>/<xsl:value-of select="substring($dispTo,5,6)"/>)
					</xsl:when>
					<xsl:when test="$dispFrom !='' and $dispTo !=''">
						<xsl:value-of select="$dispName"/>(<xsl:value-of select="substring($dispFrom,1,4)"/>/<xsl:value-of select="substring($dispFrom,5,6)"/> - <xsl:value-of select="substring($dispTo,1,4)"/>/<xsl:value-of select="substring($dispTo,5,6)"/>)
					</xsl:when>
					<xsl:when test="($dispFrom ='' or name($dispFrom)='') and ($dispTo ='' or name($dispTo)='')">
						<xsl:value-of select="$dispName"/>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$dispName"/>
			</xsl:otherwise>
		</xsl:choose>
	</a>
</xsl:template>

</xsl:stylesheet>
