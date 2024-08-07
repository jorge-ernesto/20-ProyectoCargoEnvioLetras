// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Control Cargo Envio Letras (customscript_bio_sl_ctrl_car_env_let)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Process', './lib/Bio.Library.Widget', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objProcess, objWidget, objHelper, N) {

        const { log, redirect, runtime } = N;

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {

            if (scriptContext.request.method == 'GET') {

                // Crear formulario
                let { form, fieldSubsidiary, fieldDateFrom, fieldDateTo, fieldEstadoCargo } = objWidget.createFormReport();

                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let subsidiary = scriptContext.request.parameters['_subsidiary'];
                let dateFrom = scriptContext.request.parameters['_dateFrom'];
                let dateTo = scriptContext.request.parameters['_dateTo'];
                let estadoCargo = scriptContext.request.parameters['_estadoCargo'];

                if (button == 'consultar') {

                    // Debug
                    // objHelper.error_log('debug', { subsidiary, dateFrom, dateTo, estadoCargo });

                    // Setear datos al formulario
                    fieldSubsidiary.defaultValue = subsidiary;
                    fieldDateFrom.defaultValue = dateFrom;
                    fieldDateTo.defaultValue = dateTo;
                    fieldEstadoCargo.defaultValue = estadoCargo;

                    // Obtener datos por search
                    let dataLetrasPorPagar = objSearch.getDataLetrasPorPagar(subsidiary, dateFrom, dateTo, estadoCargo);
                    let dataLetrasPorPagar_Datos = objSearch.getDataLetrasPorPagar_Datos(subsidiary);
                    let dataLetrasPorPagar_Completo = objProcess.getDataLetrasPorPagar_Completo(dataLetrasPorPagar, dataLetrasPorPagar_Datos, estadoCargo)

                    // Debug
                    // objHelper.error_log('data', { dataLetrasPorPagar, dataDatosLetrasPorPagar });
                    // objHelper.error_log('data', { dataLetrasPorPagar_Completo });

                    // Crear sublista
                    objWidget.createSublist(form, dataLetrasPorPagar_Completo);
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST

                // Recuperar valores de los campos
                let subsidiary = scriptContext.request.parameters['custpage_field_filter_subsidiary'];
                let dateFrom = scriptContext.request.parameters['custpage_field_filter_date_from'];
                let dateTo = scriptContext.request.parameters['custpage_field_filter_date_to'];
                let estadoCargo = scriptContext.request.parameters['custpage_field_filter_estado_cargo'];

                // Debug
                // objHelper.error_log('debug', { subsidiary, dateFrom, dateTo, estadoCargo });

                // Redirigir a este mismo Suitelet (Redirigir a si mismo)
                redirect.toSuitelet({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    parameters: {
                        _button: 'consultar',
                        _subsidiary: subsidiary,
                        _dateFrom: dateFrom,
                        _dateTo: dateTo,
                        _estadoCargo: estadoCargo
                    }
                });
            }
        }

        return { onRequest }

    });
