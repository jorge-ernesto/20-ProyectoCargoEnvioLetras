<#assign params = input.data?eval>
<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:html="http://www.w3.org/TR/REC-html40">
    <ss:Styles>
        <ss:Style ss:ID="header">
            <ss:Alignment ss:Horizontal="Left" />
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
        </ss:Style>
        <ss:Style ss:ID="header-red">
            <ss:Alignment ss:Horizontal="Left" />
            <ss:Font ss:Bold="1" ss:Color="#ff0000" />
        </ss:Style>
        <ss:Style ss:ID="t1">
            <#--  <ss:Alignment ss:Horizontal="Left" />  -->
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <ss:Interior ss:Color="#E0E6EF" ss:Pattern="Solid" />
            <NumberFormat ss:Format="0.00" />
        </ss:Style>
        <ss:Style ss:ID="t1-percent">
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <ss:Interior ss:Color="#E0E6EF" ss:Pattern="Solid" />
            <NumberFormat ss:Format="0%" />
        </ss:Style>
        <ss:Style ss:ID="t1-number">
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <ss:Interior ss:Color="#E0E6EF" ss:Pattern="Solid" />
        </ss:Style>
        <ss:Style ss:ID="t1-currency">
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <ss:Interior ss:Color="#E0E6EF" ss:Pattern="Solid" />
            <#--  <NumberFormat ss:Format="Currency" />  -->
            <NumberFormat ss:Format="#,##0.00" />
        </ss:Style>
        <ss:Style ss:ID="t1-currency-0decimals">
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <ss:Interior ss:Color="#E0E6EF" ss:Pattern="Solid" />
            <NumberFormat ss:Format="S/ #,##0" /> <!-- Alternativa a "Currency" para eliminar decimales -->
        </ss:Style>
        <ss:Style ss:ID="t1-totales">
            <ss:Alignment ss:Horizontal="Right" />
            <ss:Font ss:Bold="1" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <ss:Interior ss:Color="#E0E6EF" ss:Pattern="Solid" />
            <NumberFormat ss:Format="0.00" />
        </ss:Style>
        <ss:Style ss:ID="background">
            <Alignment ss:Horizontal="Right" ss:Vertical="Bottom" />
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
            </Borders>
        </ss:Style>
        <ss:Style ss:ID="cell">
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <NumberFormat ss:Format="0.00" />
        </ss:Style>
        <ss:Style ss:ID="cell-percent">
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <NumberFormat ss:Format="0%" />
        </ss:Style>
        <ss:Style ss:ID="cell-currency">
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <#--  <NumberFormat ss:Format="Currency" />  -->
            <NumberFormat ss:Format="#,##0.00" />
        </ss:Style>
        <ss:Style ss:ID="cell-currency-0decimals">
            <Borders>
                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
            </Borders>
            <NumberFormat ss:Format="S/ #,##0" /> <!-- Alternativa a "Currency" para eliminar decimales -->
        </ss:Style>
    </ss:Styles>
    <Worksheet ss:Name="Reporte Comparativo">
        <Table ss:StyleID="background">

            <!-- Tamaño de columnas -->
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Column ss:Width="90" />
            <Row>
            </Row>

            <!-- Inicio de presentacion -->
            <Row>
                <Cell ss:StyleID="header-red">
                    <Data ss:Type="String">LABORATORIOS BIOMONT S.A.</Data>
                </Cell>
            </Row>
            <Row>
                <Cell ss:StyleID="header">
                    <Data ss:Type="String">Presentacion :</Data>
                </Cell>
                <Cell ss:StyleID="cell" ss:MergeAcross="2">
                    <Data ss:Type="String">${params.name}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell ss:StyleID="header">
                    <Data ss:Type="String">Fecha :</Data>
                </Cell>
                <Cell ss:StyleID="cell" ss:MergeAcross="2">
                    <Data ss:Type="String">Del ${params.dateFrom} al ${params.dateTo}</Data>
                </Cell>
            </Row>
            <!--
            <Row>
                <Cell ss:StyleID="header">
                    <Data ss:Type="String">Año :</Data>
                </Cell>
                <Cell ss:StyleID="cell" ss:MergeAcross="2">
                    <Data ss:Type="String">${context.year}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell ss:StyleID="header">
                    <Data ss:Type="String">Mes :</Data>
                </Cell>
                <Cell ss:StyleID="cell" ss:MergeAcross="2">
                    <Data ss:Type="String">${context.month}</Data>
                </Cell>
            </Row>
            -->
            <Row>
            </Row>

            <!-- Inicio de cabecera (tabla) -->
            <Row>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">ID INTERNO</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">T/D</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">N. DOCUMENTO</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">RUC</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">PROVEEDOR</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">FECHA REG.</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">FECHA DOC.</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">FECHA VCTO.</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">ESTADO</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">MONEDA</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">IMPORTE</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">PAGADO</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">SALDO</Data>
                </Cell>
                <Cell ss:StyleID="t1">
                    <Data ss:Type="String">ESTADO CARGO</Data>
                </Cell>
            </Row>

            <!-- Inicio de cuerpo (tabla) -->
            <#list params.transactions as documentos>
                <Row>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.id_interno}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.tipo.nombre}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.numero_documento}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.proveedor.ruc}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.proveedor.nombre}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.fecha_registro}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.fecha_emision}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.fecha_vencimiento}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.estado}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.moneda.nombre}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell-currency">
                        <Data ss:Type="Number">${documentos.importe_bruto_me}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell-currency">
                        <Data ss:Type="Number">${documentos.importe_pagado_me}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell-currency">
                        <Data ss:Type="Number">${documentos.importe_saldo_me}</Data>
                    </Cell>
                    <Cell ss:StyleID="cell">
                        <Data ss:Type="String">${documentos.estado_cargo.nombre}</Data>
                    </Cell>
                </Row>
            </#list>

        </Table>
    </Worksheet>
</Workbook>