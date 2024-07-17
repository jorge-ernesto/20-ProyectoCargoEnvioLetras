/**
 * @NApiVersion 2.1
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        /**
         * Tipos de documentos
         *
         * VendBill  : Factura de Compra
         * Custom122 : Letras por Pagar
         * VendCred  : Crédito de Factura
         */

        /******************/

        function getDataLetrasPorPagar_Completo(dataLetrasPorPagar, dataLetrasPorPagar_Datos, estadoCargo) {

            // Agregar arreglos vacios / Agregar JSON vacios
            dataLetrasPorPagar.forEach((value, key) => {
                dataLetrasPorPagar[key]['estado_cargo'] = dataLetrasPorPagar[key]['estado_cargo'] || {};
            });

            /****************** OBTENER DATA ******************/
            // Obtener saldo pendiente
            dataLetrasPorPagar.forEach((value, key) => {
                if (value.tipo.codigo == 'VendBill' || value.tipo.codigo == 'Custom122') {
                    dataLetrasPorPagar[key]['importe_saldo_me'] = value['importe_bruto_me'] - value['importe_pagado_me'];
                } else if (value.tipo.codigo == 'VendCred') {
                    dataLetrasPorPagar[key]['importe_saldo_me'] = value['importe_bruto_me'] + value['importe_pagado_me'];
                }
            });

            // Obtener estado
            dataLetrasPorPagar.forEach((value_LPP, key_LPP) => {
                dataLetrasPorPagar[key_LPP]['estado_cargo'] = { id: 'sin-estado', nombre: 'Sin estado' };
                dataLetrasPorPagar_Datos.forEach((value_LPP_Datos, key_LPP_Datos) => {
                    if (value_LPP.id_interno == value_LPP_Datos.id_letras_pagar && value_LPP.subsidiaria.id == value_LPP_Datos.subsidiaria.id) {
                        if (value_LPP_Datos.estado_cargo.id) {
                            dataLetrasPorPagar[key_LPP]['estado_cargo'] = value_LPP_Datos.estado_cargo;
                        }
                        if (value_LPP_Datos.fecha_creacion) {
                            dataLetrasPorPagar[key_LPP]['fecha_creacion'] = value_LPP_Datos.fecha_creacion;
                        }
                        if (value_LPP_Datos.ultima_modificacion) {
                            dataLetrasPorPagar[key_LPP]['ultima_modificacion'] = value_LPP_Datos.ultima_modificacion;
                        }
                        if (value_LPP_Datos.ultima_modificacion_por) {
                            dataLetrasPorPagar[key_LPP]['ultima_modificacion_por'] = value_LPP_Datos.ultima_modificacion_por;
                        }
                    }
                });
            });

            /****************** FILTRO ******************/
            // Filtras por estado
            let dataLetrasPorPagar_ = [];
            if (estadoCargo) {
                dataLetrasPorPagar.forEach((value, key) => {
                    if (estadoCargo == value.estado_cargo.id) {
                        dataLetrasPorPagar_.push(value);
                    }
                });
            } else {
                dataLetrasPorPagar_ = dataLetrasPorPagar;
            }

            // Procesar reporte
            // let fDecimal = 2;
            // dataLetrasPorPagar_.forEach((value, key) => {
            //     dataLetrasPorPagar_[key]['importe_bruto_me'] = Math.round10(value.importe_bruto_me, -fDecimal).toFixed(fDecimal);
            //     dataLetrasPorPagar_[key]['importe_pagado_me'] = Math.round10(value.importe_pagado_me, -fDecimal).toFixed(fDecimal);
            //     dataLetrasPorPagar_[key]['importe_saldo_me'] = Math.round10(value.importe_saldo_me, -fDecimal).toFixed(fDecimal);
            // });

            // objHelper.error_log('getDataLetrasPorPagar_Completo', dataLetrasPorPagar_);
            return dataLetrasPorPagar_;
        }

        function agruparLetrasPorPagar(dataLetrasPorPagar) {

            // Obtener data en formato agrupado
            let dataAgrupada = {}; // * Audit: Util, manejo de JSON

            dataLetrasPorPagar.forEach(element => {

                // Obtener variables
                let moneda = element.moneda.nombre;

                // Agrupar data
                dataAgrupada['detalle'] = dataAgrupada['detalle'] || [];
                // Agrupar data
                dataAgrupada['totales'] = dataAgrupada['totales'] || {};
                dataAgrupada['totales'][moneda] = dataAgrupada['totales'][moneda] || {};
                dataAgrupada['totales'][moneda]['importe_bruto_me'] = dataAgrupada['totales'][moneda]['importe_bruto_me'] || 0;
                dataAgrupada['totales'][moneda]['importe_pagado_me'] = dataAgrupada['totales'][moneda]['importe_pagado_me'] || 0;
                dataAgrupada['totales'][moneda]['importe_saldo_me'] = dataAgrupada['totales'][moneda]['importe_saldo_me'] || 0;

                // detalle
                dataAgrupada['detalle'].push(element);

                // totales generales
                dataAgrupada['totales'][moneda]['importe_bruto_me'] += parseFloat(element.importe_bruto_me);
                dataAgrupada['totales'][moneda]['importe_pagado_me'] += parseFloat(element.importe_pagado_me);
                dataAgrupada['totales'][moneda]['importe_saldo_me'] += parseFloat(element.importe_saldo_me);
            });

            return dataAgrupada;
        }

        function getReporteFreeMarker(dataReporte) {

            // Procesar reporte
            /**
             * En el método `forEach` de los arrays, el primer parámetro que se recibe en la función de callback es el elemento del array en cada iteración.
             * En el caso de `Object.entries()`, el primer elemento del array retornado es la clave y el segundo elemento es el valor correspondiente.
             * Por eso, al utilizar `Object.entries()`, la clave se asigna al primer elemento (en este caso `keyMon`) y el valor al segundo elemento (en este caso `valueMon`).
             * Esto es una característica de `Object.entries()` para trabajar con objetos en JavaScript.
             */
            if (Object.keys(dataReporte).length > 0) {
                let fDecimal = 2;
                dataReporte['detalle'].forEach((value, key) => {
                    dataReporte['detalle'][key]['importe_bruto_me'] = Math.round10(value.importe_bruto_me, -fDecimal).toFixed(fDecimal);
                    dataReporte['detalle'][key]['importe_pagado_me'] = Math.round10(value.importe_pagado_me, -fDecimal).toFixed(fDecimal);
                    dataReporte['detalle'][key]['importe_saldo_me'] = Math.round10(value.importe_saldo_me, -fDecimal).toFixed(fDecimal);
                });
                Object.entries(dataReporte['totales']).forEach(([keyMon, valueMon]) => {
                    dataReporte['totales'][keyMon]['importe_bruto_me'] = Math.round10(valueMon.importe_bruto_me, -fDecimal).toFixed(fDecimal);
                    dataReporte['totales'][keyMon]['importe_pagado_me'] = Math.round10(valueMon.importe_pagado_me, -fDecimal).toFixed(fDecimal);
                    dataReporte['totales'][keyMon]['importe_saldo_me'] = Math.round10(valueMon.importe_saldo_me, -fDecimal).toFixed(fDecimal);
                });
            }

            // Convertir valores nulos en un objeto JavaScript a string - Al parecer FreeMarker no acepta valores nulos
            // dataReporte = Helper.convertObjectValuesToStrings(dataReporte);

            return dataReporte;
        }

        return { getDataLetrasPorPagar_Completo, agruparLetrasPorPagar, getReporteFreeMarker }

    });
