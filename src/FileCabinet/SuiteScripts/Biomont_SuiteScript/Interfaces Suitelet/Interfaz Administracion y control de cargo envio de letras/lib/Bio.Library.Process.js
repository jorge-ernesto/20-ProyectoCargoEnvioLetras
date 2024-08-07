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

            // Procesar informacion
            // ...

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
                        if (value_LPP_Datos.estado_cargo.id) dataLetrasPorPagar[key_LPP_Datos]['estado_cargo'] = value_LPP_Datos.estado_cargo;
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
            let fDecimal = 2;
            dataLetrasPorPagar_.forEach((value, key) => {
                dataLetrasPorPagar_[key]['importe_bruto_me'] = Math.round10(value.importe_bruto_me, -fDecimal).toFixed(fDecimal);
                dataLetrasPorPagar_[key]['importe_pagado_me'] = Math.round10(value.importe_pagado_me, -fDecimal).toFixed(fDecimal);
                dataLetrasPorPagar_[key]['importe_saldo_me'] = Math.round10(value.importe_saldo_me, -fDecimal).toFixed(fDecimal);
            });

            // objHelper.error_log('getDataLetrasPorPagar_Completo', dataLetrasPorPagar_);
            return dataLetrasPorPagar_;
        }

        return { getDataLetrasPorPagar_Completo }

    });
