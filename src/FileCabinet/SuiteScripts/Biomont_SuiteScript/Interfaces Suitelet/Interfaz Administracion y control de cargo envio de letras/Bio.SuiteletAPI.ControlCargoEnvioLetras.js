// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL API Ctrl Cargo Envio Letras (customscript_bio_sl_api_ctrl_car_env_let)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objHelper, N) {

        const { log, record, runtime, format, url } = N;

        const scriptId = 'customscript_bio_sl_ctrl_car_env_let';
        const deployId = 'customdeploy_bio_sl_ctrl_car_env_let';

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // Debug
            // scriptContext.response.setHeader('Content-type', 'application/json');
            // scriptContext.response.write(JSON.stringify(scriptContext));
            // return;

            // Debug
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameters', scriptContext.request.parameters);
            // log.debug('body', scriptContext.body);
            // return;

            if (scriptContext.request.method == 'POST') {

                // Obtener datos enviados por peticion HTTP
                let data = JSON.parse(scriptContext.request.body);
                let method = data._method || null;
                let method_id = data._method_id || null;

                if (method && method_id) {

                    // Declarar variables
                    let setLetrasProcesadas = new Set();
                    let arrayLetrasProcesadas = [];

                    // Obtener datos
                    // Filtros
                    let id_subsidiaria = data._id_subsidiaria || null;
                    let fecha_desde = data._fecha_desde || null;
                    let fecha_hasta = data._fecha_hasta || null;
                    let estado_cargo = data._estado_cargo || null;
                    // Letras por pagar seleccionadas
                    let data_letras_por_pagar_seleccionadas = data._data_letras_por_pagar_seleccionadas || [];
                    let data_letras_por_pagar_datos = objSearch.getDataLetrasPorPagar_Datos(id_subsidiaria);

                    // Obtener el usuario logueado
                    let user = runtime.getCurrentUser();

                    // Respuesta
                    let response = {
                        code: '400',
                        status: 'error',
                        method: method
                    };

                    // El control de errores comienza aca para tener acceso a method y response
                    try {
                        // Debug
                        // objHelper.error_log('test err', response);

                        if (method == 'enviar' || method == 'recibir' || method == 'rechazar') {

                            // Recorrer data - Letras por pagar seleccionadas
                            data_letras_por_pagar_seleccionadas.forEach((value_LPP_SELECT, key_LPP_SELECT) => {

                                // Declarar variables
                                let es_editar = false;

                                // Obtener data
                                let letra_id_seleccionado = value_LPP_SELECT.custpage_id_interno;
                                let subsidiaria_id_seleccionado = value_LPP_SELECT.custpage_subsidiaria;

                                // Recorrer data - Datos de letras por pagar
                                data_letras_por_pagar_datos.forEach((value_LPP_Datos, key_LPP_Datos) => {

                                    // Obtener data
                                    let letra_id_letras_pagar_record = value_LPP_Datos.id_letras_pagar;
                                    let subsidiaria_id_record = value_LPP_Datos.subsidiaria.id;

                                    // Actualizar o crear registro
                                    if (letra_id_seleccionado == letra_id_letras_pagar_record && subsidiaria_id_seleccionado == subsidiaria_id_record) {

                                        es_editar = true;

                                        // Editar registro
                                        if (es_editar) {
                                            let datosLetrasPorPagarRecord = record.load({ type: 'customrecord_bio_dat_let_pag', id: value_LPP_Datos.id_interno });
                                            datosLetrasPorPagarRecord.setValue('custrecord_bio_let_pag_estado_cargo', method_id);
                                            let datosLetrasPorPagarId = datosLetrasPorPagarRecord.save();

                                            // Letras procesadas
                                            if (datosLetrasPorPagarId) {
                                                setLetrasProcesadas.add(value_LPP_SELECT.custpage_numero_documento);
                                            }
                                        }
                                    }
                                });

                                // Crear registro
                                if (!es_editar) {
                                    let newRecord = record.create({ type: 'customrecord_bio_dat_let_pag' });
                                    newRecord.setValue('custrecord_bio_let_pag_subsidiaria', subsidiaria_id_seleccionado);
                                    newRecord.setValue('custrecord_bio_let_pag_id_letras_pagar', letra_id_seleccionado);
                                    newRecord.setValue('custrecord_bio_let_pag_estado_cargo', method_id);
                                    let recordId = newRecord.save();

                                    // Letras procesadas
                                    if (recordId) {
                                        setLetrasProcesadas.add(value_LPP_SELECT.custpage_numero_documento);
                                    }
                                }
                            });

                            // Obtener url del Suitelet
                            let suitelet = url.resolveScript({
                                deploymentId: deployId,
                                scriptId: scriptId,
                                params: {
                                    _button: 'consultar',
                                    _subsidiary: id_subsidiaria,
                                    _dateFrom: fecha_desde,
                                    _dateTo: fecha_hasta,
                                    _estadoCargo: estado_cargo
                                }
                            });

                            // Convertir set en array
                            arrayLetrasProcesadas = [...setLetrasProcesadas]; // Array.from(setLetrasProcesadas)

                            // Enviar email
                            if (method == 'rechazar') {
                                if (Object.keys(arrayLetrasProcesadas).length > 0) {
                                    objHelper.sendEmail_NotificarRechazo(arrayLetrasProcesadas, user);
                                }
                            }

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                method_id: method_id,
                                // Filtros
                                id_subsidiaria: id_subsidiaria,
                                fecha_desde: fecha_desde,
                                fecha_hasta: fecha_hasta,
                                estado_cargo: estado_cargo,
                                // Letras por pagar seleccionadas
                                data_letras_por_pagar_seleccionadas: data_letras_por_pagar_seleccionadas,
                                data_letras_por_pagar_datos: data_letras_por_pagar_datos,
                                suitelet: suitelet,
                                // Letras procesadas
                                arrayLetrasProcesadas: arrayLetrasProcesadas
                            };
                            log.debug('response', response);
                        }
                    } catch (err) {
                        // Convertir set en array
                        arrayLetrasProcesadas = [...setLetrasProcesadas]; // Array.from(setLetrasProcesadas)

                        // Enviar email
                        if (method == 'rechazar') {
                            if (Object.keys(arrayLetrasProcesadas).length > 0) {
                                objHelper.sendEmail_NotificarRechazo(arrayLetrasProcesadas, user);
                            }
                        }

                        // Respuesta
                        response = {
                            code: '400',
                            status: 'error',
                            method: method,
                            method_id: method_id,
                            err: err,
                            // Letras procesadas
                            arrayLetrasProcesadas: arrayLetrasProcesadas
                        };
                        log.debug('response', response);
                    }

                    // Respuesta
                    scriptContext.response.setHeader('Content-type', 'application/json');
                    scriptContext.response.write(JSON.stringify(response));
                }
            }
        }

        return { onRequest }

    });
