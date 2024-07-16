/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, search } = N;

        /**
         * Tipos de documentos
         *
         * VendBill  : Factura de Compra
         * Custom122 : Letras por Pagar
         * VendCred  : Crédito de Factura
         */

        /******************/

        function getDataLetrasPorPagar(subsidiary, dateFrom, dateTo, estadoCargo = '') {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'transaction',
                columns: [
                    search.createColumn({ name: "internalid", label: "Internal ID" }),
                    search.createColumn({
                        name: "number",
                        join: "account",
                        // sort: search.Sort.ASC,
                        label: "CUENTA (NUMERO)"
                    }),
                    search.createColumn({
                        name: "description",
                        join: "account",
                        label: "CUENTA (DESCRIPCION)"
                    }),
                    search.createColumn({
                        name: "vatregnumber",
                        join: "vendorLine",
                        label: "RUC"
                    }),
                    search.createColumn({ name: "entity", label: "PROVEEDOR" }),
                    search.createColumn({ name: "datecreated", label: "FECHA DE REGISTRO" }),
                    search.createColumn({
                        name: "trandate",
                        // sort: search.Sort.ASC,
                        label: "FECHA DE EMISION"
                    }),
                    search.createColumn({
                        name: "formuladate",
                        formula: "NVL({duedate}, {custbody_ns_lt_fech_venc})",
                        sort: search.Sort.DESC,
                        label: "FECHA DE VENCIMIENTO"
                    }),
                    search.createColumn({ name: "typecode", label: "Código de tipo" }),
                    search.createColumn({ name: "type", label: "Tipo" }),
                    search.createColumn({ name: "custbody_ns_document_type", label: "NS Tipo de Documento" }),
                    search.createColumn({ name: "tranid", label: "Número de documento" }),
                    search.createColumn({
                        name: "currency",
                        sort: search.Sort.ASC,
                        label: "Moneda"
                    }),
                    search.createColumn({ name: "fxgrossamount", label: "Importe bruto (moneda extranjera)" }),
                    search.createColumn({ name: "fxamountpaid", label: "Importe pagado (moneda extranjera)" }),
                    search.createColumn({ name: "statusref", label: "Estado" }),
                    // Otros
                    search.createColumn({ name: "subsidiary", label: "Subsidiaria" })
                ],
                filters: [
                    ["subsidiary", "anyof", subsidiary],
                    "AND",
                    ["mainline", "is", "T"],
                    "AND",
                    [
                        [["type", "anyof", "Custom122"], "AND", ["account.number", "startswith", "42"], "AND", ["creditamount", "greaterthan", "0.00"]]
                    ],
                    "AND",
                    ["grossamount", "notequalto", "0.00"],
                    "AND",
                    ["trandate", "within", dateFrom, dateTo]
                ]
            }

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataCertificacionesAnalisis');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let id_interno = row.getValue(columns[0]);
                    let cuenta_numero = row.getValue(columns[1]);
                    let cuenta_descripcion = row.getValue(columns[2]);
                    let proveedor_ruc = row.getValue(columns[3]);
                    let proveedor_id_interno = row.getValue(columns[4]);
                    let proveedor_nombre = row.getText(columns[4]);
                    let fecha_registro = row.getValue(columns[5]);
                    let fecha_emision = row.getValue(columns[6]);
                    let fecha_vencimiento = row.getValue(columns[7]);
                    let tipo_codigo = row.getValue(columns[8]);
                    let tipo = row.getValue(columns[9]);
                    let tipo_nombre = row.getText(columns[9]);
                    let ns_tipo_documento = row.getValue(columns[10]);
                    let ns_tipo_documento_nombre = row.getText(columns[10]);
                    let numero_documento = row.getValue(columns[11]);
                    let moneda = row.getValue(columns[12]);
                    let moneda_nombre = row.getText(columns[12]);
                    let importe_bruto_me = row.getValue(columns[13]); // Importe bruto (moneda extranjera)
                    let importe_pagado_me = row.getValue(columns[14]); // Importe pagado (moneda extranjera)
                    let estado = row.getText(columns[15]); // Estado
                    // Otros
                    let subsidiaria = row.getValue(columns[16]);
                    let subsidiaria_nombre = row.getText(columns[16]);

                    // Procesar informacion
                    importe_bruto_me = parseFloat(importe_bruto_me);
                    importe_pagado_me = parseFloat(importe_pagado_me);

                    // Insertar informacion en array
                    resultTransaction.push({
                        id_interno: id_interno,
                        cuenta: { numero: cuenta_numero, descripcion: cuenta_descripcion },
                        proveedor: { ruc: proveedor_ruc, id_interno: proveedor_id_interno, nombre: proveedor_nombre },
                        fecha_registro: fecha_registro,
                        fecha_emision: fecha_emision,
                        fecha_vencimiento: fecha_vencimiento,
                        tipo: { codigo: tipo_codigo, id: tipo, nombre: tipo_nombre },
                        ns_tipo_documento: { id: ns_tipo_documento, nombre: ns_tipo_documento_nombre },
                        numero_documento: numero_documento,
                        moneda: { id: moneda, nombre: moneda_nombre },
                        importe_bruto_me: importe_bruto_me,
                        importe_pagado_me: importe_pagado_me,
                        estado: estado,
                        // Otros
                        subsidiaria: { id: subsidiaria, nombre: subsidiaria_nombre },
                        estado_cargo: { id: '', nombre: '' }
                    });
                });
            });

            // objHelper.error_log('getDataLetrasPorPagar', resultTransaction);
            return resultTransaction;
        }

        function getDataLetrasPorPagar_Datos(subsidiary) {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_bio_dat_let_pag',
                columns: [
                    search.createColumn({ name: "internalid", label: "ID interno" }),
                    search.createColumn({ name: "custrecord_bio_let_pag_subsidiaria", label: "Subsidiaria" }),
                    search.createColumn({ name: "custrecord_bio_let_pag_id_letras_pagar", label: "ID Letras por Pagar" }),
                    search.createColumn({ name: "custrecord_bio_let_pag_estado_cargo", label: "Estado Cargo" }),
                    // Otros
                    search.createColumn({ name: "created", label: "Fecha de creación" }),
                    search.createColumn({ name: "lastmodified", label: "Ultima modificación" }),
                    search.createColumn({ name: "lastmodifiedby", label: "Ultima modificación por" })
                ],
                filters: [
                    // ["isinactive", "is", "F"], // No importa si esta activo o inactivo, si existe el registro, lo actualiza
                    // "AND",
                    ["custrecord_bio_let_pag_subsidiaria", "anyof", subsidiary]
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // log.debug('', 'getDataConf_CentroCosto_Empleado');
            // log.debug('', count);

            // Recorrer search
            searchContext.run().each(node => {
                // Obtener informacion
                let columns = node.columns;
                let id_interno = node.getValue(columns[0]); // Id interno
                let subsidiaria = node.getValue(columns[1]); // Subsidiaria
                let subsidiaria_nombre = node.getText(columns[1]); // Subsidiaria
                let id_letras_pagar = node.getValue(columns[2]); // ID Letras por Pagar
                let estado_cargo = node.getValue(columns[3]); // Estado Cargo
                let estado_cargo_nombre = node.getText(columns[3]); // Estado Cargo
                // Otros
                let fecha_creacion = node.getValue(columns[4]); // Fecha de creación
                let ultima_modificacion = node.getValue(columns[5]); // Ultima modificación
                let ultima_modificacion_por = node.getText(columns[6]); // Ultima modificación por

                // Insertar informacion en array
                resultTransaction.push({
                    id_interno: id_interno,
                    subsidiaria: { id: subsidiaria, nombre: subsidiaria_nombre },
                    id_letras_pagar: id_letras_pagar,
                    estado_cargo: { id: estado_cargo, nombre: estado_cargo_nombre },
                    // Otros
                    fecha_creacion: fecha_creacion,
                    ultima_modificacion: ultima_modificacion,
                    ultima_modificacion_por: ultima_modificacion_por
                });

                return true; // La funcion each debes indicarle si quieres que siga iterando o no
            })

            // objHelper.error_log('getDataLetrasPorPagar', resultTransaction);
            return resultTransaction;
        }

        // Suitelet Report
        function getEstadoCargoList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_bio_lis_estcar_concarenvlet',
                columns: [
                    { name: 'internalid', sort: search.Sort.ASC },
                    'name'
                ]
            });

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
        }

        return { getDataLetrasPorPagar, getDataLetrasPorPagar_Datos, getEstadoCargoList }

    });
