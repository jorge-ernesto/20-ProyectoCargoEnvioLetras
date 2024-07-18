/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Search', './Bio.Library.Helper', 'N'],

    function (objSearch, objHelper, N) {

        const { log } = N;
        const { serverWidget } = N.ui;

        const DATA = {
            'clientScriptModulePath': {
                'suiteletReport': './../Bio.Client.ControlCargoEnvioLetras.js',
                'suiteletDetail': './../Bio.Client.ControlCargoEnvioLetras.Detalle.js',
            }
        }

        /**
         * Centros de Costo
         *
         * 16: 4301 TECNOLOGÍAS DE LA INFORMACIÓN
         * 17: 4401 CONTABILIDAD
         * 18: 4601 FINANZAS
         */

        /****************** Suitelet Report ******************/
        function createFormReport() {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administracion y control de cargo de envio de letras`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath.suiteletReport;

            // Mostrar botones
            form.addSubmitButton({
                label: 'Consultar'
            });

            // Obtener datos
            let { user } = objHelper.getUser();
            let { centro_costo } = objHelper.getDataUser(user.id);

            if (centro_costo == 16 || centro_costo == 17) {
                form.addButton({
                    id: 'custpage_button_enviar',
                    label: 'Enviar',
                    functionName: 'enviar()'
                });
            }
            if (centro_costo == 16 || centro_costo == 18) {
                form.addButton({
                    id: 'custpage_button_recibir',
                    label: 'Recibir',
                    functionName: 'recibir()'
                });
                form.addButton({
                    id: 'custpage_button_rechazar',
                    label: 'Rechazar',
                    functionName: 'rechazar()'
                });
                form.addButton({
                    id: 'custpage_button_procesar',
                    label: 'Procesar',
                    functionName: 'procesar()'
                });
            }
            if (centro_costo == 16 || centro_costo == 17 || centro_costo == 18) {
                form.addButton({
                    id: 'custpage_button_descargar_excel',
                    label: 'Excel',
                    functionName: 'descargarExcel()'
                });
            }

            // Mostrar SubPestañas
            // form.addSubtab({
            //     id: 'custpage_subtab',
            //     label: 'Lista de letras'
            // });

            /******************  Filtros ******************/
            // Mostrar Grupo de Campos
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Filtros',
                // tab: 'custpage_subtab'
            });

            // Subsidiaria
            let fieldSubsidiary = form.addField({
                id: 'custpage_field_filter_subsidiary',
                label: 'Subsidiaria',
                type: 'select',
                source: 'subsidiary',
                container: 'custpage_group'
            });
            fieldSubsidiary.updateBreakType({ breakType: 'STARTCOL' })
            fieldSubsidiary.isMandatory = true;

            // Desde
            let fieldDateFrom = form.addField({
                id: 'custpage_field_filter_date_from',
                label: 'Desde',
                type: 'date',
                container: 'custpage_group'
            });
            fieldDateFrom.updateBreakType({ breakType: 'STARTCOL' })
            fieldDateFrom.isMandatory = true;

            // Hasta
            let fieldDateTo = form.addField({
                id: 'custpage_field_filter_date_to',
                label: 'Hasta',
                type: 'date',
                container: 'custpage_group'
            });
            fieldDateTo.updateBreakType({ breakType: 'STARTCOL' })
            fieldDateTo.isMandatory = true;

            // Estado
            let fieldEstadoCargo = form.addField({
                id: 'custpage_field_filter_estado_cargo',
                label: 'Estado',
                type: 'select',
                // source: 'customlist_bio_lis_estcar_concarenvlet',
                container: 'custpage_group'
            })
            fieldEstadoCargo.updateBreakType({ breakType: 'STARTCOL' })
            // fieldEstadoCargo.updateDisplaySize({ height: 60, width: 120 });
            // fieldEstadoCargo.isMandatory = true;
            setFieldReport(fieldEstadoCargo, 'fieldEstadoCargo');

            return { form, fieldSubsidiary, fieldDateFrom, fieldDateTo, fieldEstadoCargo }
        }

        function setFieldReport(field, name) {
            // Obtener datos por search
            let dataList = [];

            if (name == 'fieldEstadoCargo') {
                dataList = objSearch.getEstadoCargoList();
            }

            // Setear un primer valor vacio
            if (name == 'fieldEstadoCargo') {
                field.addSelectOption({
                    value: '',
                    text: ''
                });
                field.addSelectOption({
                    value: 'sin-estado',
                    text: 'Sin estado'
                });
            } else {
                field.addSelectOption({
                    value: '',
                    text: ''
                });
            }

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            dataList.forEach((element, i) => {
                field.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        function createSublist(form, dataLetrasPorPagar) {
            // Tipo de sublista
            sublistType = serverWidget.SublistType.LIST;

            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_lista_letras',
                type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                label: 'Lista de letras',
                // tab: 'custpage_subtab'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_tipo_checkbox', type: serverWidget.FieldType.CHECKBOX, label: 'Seleccionar' });
            sublist.addField({ id: 'custpage_id_interno', type: serverWidget.FieldType.TEXT, label: 'ID interno' });
            sublist.addField({ id: 'custpage_subsidiaria', type: serverWidget.FieldType.TEXT, label: 'Subsidiaria' });
            sublist.addField({ id: 'custpage_subsidiaria_nombre', type: serverWidget.FieldType.TEXT, label: 'Subsidiaria' });
            sublist.addField({ id: 'custpage_tipo_nombre', type: serverWidget.FieldType.TEXT, label: 'T/D' });
            sublist.addField({ id: 'custpage_numero_documento', type: serverWidget.FieldType.TEXT, label: 'N. Documento' });
            sublist.addField({ id: 'custpage_proveedor_ruc', type: serverWidget.FieldType.TEXT, label: 'RUC' });
            sublist.addField({ id: 'custpage_proveedor_nombre', type: serverWidget.FieldType.TEXT, label: 'Proveedor' });
            sublist.addField({ id: 'custpage_fecha_registro', type: serverWidget.FieldType.TEXT, label: 'Fecha Reg.' });
            sublist.addField({ id: 'custpage_fecha_emision', type: serverWidget.FieldType.TEXT, label: 'Fecha Doc' });
            sublist.addField({ id: 'custpage_fecha_vencimiento', type: serverWidget.FieldType.TEXT, label: 'Fecha Vcto.' });
            sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'Estado' });
            sublist.addField({ id: 'custpage_moneda_nombre', type: serverWidget.FieldType.TEXT, label: 'Moneda' });
            sublist.addField({ id: 'custpage_importe_bruto_me', type: serverWidget.FieldType.TEXT, label: 'Importe' });
            sublist.addField({ id: 'custpage_importe_pagado_me', type: serverWidget.FieldType.TEXT, label: 'Pagado' });
            sublist.addField({ id: 'custpage_importe_saldo_me', type: serverWidget.FieldType.TEXT, label: 'Saldo' });
            sublist.addField({ id: 'custpage_estado_cargo', type: serverWidget.FieldType.TEXT, label: 'Estado Cargo' });
            sublist.addField({ id: 'custpage_fecha_creacion', type: serverWidget.FieldType.TEXT, label: 'Fecha de creación' });
            sublist.addField({ id: 'custpage_ultima_modificacion', type: serverWidget.FieldType.TEXT, label: 'Ultima modificación' });
            sublist.addField({ id: 'custpage_ultima_modificacion_por', type: serverWidget.FieldType.TEXT, label: 'Ultima modificación por' });

            // Setear propiedades a sublista
            sublist.getField({ id: 'custpage_subsidiaria' }).updateDisplayType({ displayType: 'HIDDEN' });
            sublist.addMarkAllButtons();
            // sublist.addRefreshButton();

            // Setear los datos obtenidos a sublista
            if (Object.keys(dataLetrasPorPagar).length > 0) {
                dataLetrasPorPagar['detalle'].forEach((element, i) => {
                    if (element.id_interno) {
                        sublist.setSublistValue({ id: 'custpage_id_interno', line: i, value: element.id_interno });
                    }
                    if (element.subsidiaria.id) {
                        sublist.setSublistValue({ id: 'custpage_subsidiaria', line: i, value: element.subsidiaria.id });
                    }
                    if (element.subsidiaria.nombre) {
                        sublist.setSublistValue({ id: 'custpage_subsidiaria_nombre', line: i, value: element.subsidiaria.nombre });
                    }
                    if (element.tipo.nombre) {
                        sublist.setSublistValue({ id: 'custpage_tipo_nombre', line: i, value: element.tipo.nombre });
                    }
                    if (element.numero_documento) {
                        sublist.setSublistValue({ id: 'custpage_numero_documento', line: i, value: element.numero_documento });
                    }
                    if (element.proveedor.ruc) {
                        sublist.setSublistValue({ id: 'custpage_proveedor_ruc', line: i, value: element.proveedor.ruc });
                    }
                    if (element.proveedor.nombre) {
                        sublist.setSublistValue({ id: 'custpage_proveedor_nombre', line: i, value: element.proveedor.nombre });
                    }
                    if (element.fecha_registro) {
                        sublist.setSublistValue({ id: 'custpage_fecha_registro', line: i, value: element.fecha_registro });
                    }
                    if (element.fecha_emision) {
                        sublist.setSublistValue({ id: 'custpage_fecha_emision', line: i, value: element.fecha_emision });
                    }
                    if (element.fecha_vencimiento) {
                        sublist.setSublistValue({ id: 'custpage_fecha_vencimiento', line: i, value: element.fecha_vencimiento });
                    }
                    if (element.estado) {
                        sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado });
                    }
                    if (element.moneda.nombre) {
                        sublist.setSublistValue({ id: 'custpage_moneda_nombre', line: i, value: element.moneda.nombre });
                    }
                    if (element.importe_bruto_me || objHelper.isNumeric(element.importe_bruto_me)) {
                        sublist.setSublistValue({ id: 'custpage_importe_bruto_me', line: i, value: element.importe_bruto_me });
                    }
                    if (element.importe_pagado_me || objHelper.isNumeric(element.importe_pagado_me)) {
                        sublist.setSublistValue({ id: 'custpage_importe_pagado_me', line: i, value: element.importe_pagado_me });
                    }
                    if (element.importe_saldo_me || objHelper.isNumeric(element.importe_saldo_me)) {
                        sublist.setSublistValue({ id: 'custpage_importe_saldo_me', line: i, value: element.importe_saldo_me });
                    }
                    if (element.estado_cargo.nombre) {
                        sublist.setSublistValue({ id: 'custpage_estado_cargo', line: i, value: element.estado_cargo.nombre });
                    }
                    if (element.fecha_creacion) {
                        sublist.setSublistValue({ id: 'custpage_fecha_creacion', line: i, value: element.fecha_creacion });
                    }
                    if (element.ultima_modificacion) {
                        sublist.setSublistValue({ id: 'custpage_ultima_modificacion', line: i, value: element.ultima_modificacion });
                    }
                    if (element.ultima_modificacion_por) {
                        sublist.setSublistValue({ id: 'custpage_ultima_modificacion_por', line: i, value: element.ultima_modificacion_por });
                    }
                });
            }

            // Setear cantidad de registros
            var numLines = sublist.lineCount;
            numLines = numLines == -1 ? 0 : numLines;
            sublist.helpText = `Cantidad de registros: ${numLines}`;
        }

        return { createFormReport, createSublist }

    });