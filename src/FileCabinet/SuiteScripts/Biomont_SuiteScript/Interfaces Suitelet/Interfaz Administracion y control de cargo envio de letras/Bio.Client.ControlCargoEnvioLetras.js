/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, currentRecord, url, https, http } = N;

        const scriptId = 'customscript_bio_sl_api_ctrl_car_env_let';
        const deployId = 'customdeploy_bio_sl_api_ctrl_car_env_let';

        const scriptDownloadId = 'customscript_bio_sl_ctrl_car_env_let_des';
        const deployDownloadId = 'customdeploy_bio_sl_ctrl_car_env_let_des';

        /******************/

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        /****************** Funcionalidad en campos ******************/

        function getDataLetrasPorPagar_Seleccionadas(recordContext) {

            // Declarar variables
            let arrayListaLetrasPorPagar = [];

            // Obtener el currentRecord
            // let recordContext = currentRecord.get();

            // Lista de letras
            let sublistName = 'custpage_sublist_reporte_lista_letras';
            let lineCount = recordContext.getLineCount({ sublistId: sublistName });
            let itemSublist = recordContext.getSublist({ sublistId: sublistName });

            // Debug
            // console.log('data', { sublistName, lineCount, itemSublist })

            for (let i = 0; i < lineCount; i++) {
                // console.log('i', i)

                let custpage_tipo_checkbox = recordContext.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custpage_tipo_checkbox',
                    line: i
                });
                let custpage_id_interno = recordContext.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custpage_id_interno',
                    line: i
                });
                let custpage_subsidiaria = recordContext.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custpage_subsidiaria',
                    line: i
                });
                let custpage_numero_documento = recordContext.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custpage_numero_documento',
                    line: i
                });
                if (custpage_tipo_checkbox) {
                    arrayListaLetrasPorPagar.push({
                        custpage_tipo_checkbox,
                        custpage_id_interno,
                        custpage_subsidiaria,
                        custpage_numero_documento
                    });
                }
            }

            // Retornar array
            return arrayListaLetrasPorPagar;
        }

        /****************** Solicitud HTTP ******************/

        function loadSweetAlertLibrary() {
            return new Promise(function (resolve, reject) {
                var sweetAlertScript = document.createElement('script');
                sweetAlertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
                sweetAlertScript.onload = resolve;
                document.head.appendChild(sweetAlertScript);
            });
        }

        function getUrlSuitelet() {

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId
            });

            return suitelet;
        }

        function sendRequestWrapper({ method, method_id }) {

            // Cargar Sweet Alert
            loadSweetAlertLibrary().then(function () {

                // Ejecutar confirmacion
                Swal.fire({
                    title: "¿Está seguro?",
                    text: "¡Debe confirmar la acción!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Enviar"
                }).then((result) => {
                    if (result.isConfirmed) {

                        // Ejecutar peticion
                        let responseData = sendRequest({ method, method_id });
                        if (responseData.status == 'success' && responseData.suitelet) {
                            // refreshPage(responseData);
                        }
                    }
                });
            });
        }

        function sendRequest({ method, method_id }) {

            // Obtener data
            let recordContext = currentRecord.get();
            // Filtros
            let id_subsidiaria = recordContext.getValue('custpage_field_filter_subsidiary');
            let fecha_desde = recordContext.getText('custpage_field_filter_date_from');
            let fecha_hasta = recordContext.getText('custpage_field_filter_date_to');
            let estado_cargo = recordContext.getValue('custpage_field_filter_estado_cargo');
            // Letras por pagar seleccionadas
            let data_letras_por_pagar_seleccionadas = getDataLetrasPorPagar_Seleccionadas(recordContext);

            // Debug
            console.log('debug', { method, method_id, id_subsidiaria, fecha_desde, fecha_hasta, estado_cargo, data_letras_por_pagar_seleccionadas });
            // return;

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = getUrlSuitelet();

            // Solicitud HTTP
            let response = https.post({
                url: suitelet,
                body: JSON.stringify({
                    _method: method,
                    _method_id: method_id,
                    // Filtros
                    _id_subsidiaria: id_subsidiaria,
                    _fecha_desde: fecha_desde,
                    _fecha_hasta: fecha_hasta,
                    _estado_cargo: estado_cargo,
                    // Letras por pagar seleccionadas
                    _data_letras_por_pagar_seleccionadas: data_letras_por_pagar_seleccionadas
                })
            });
            let responseData = JSON.parse(response.body);
            console.log('responseData', responseData);

            return responseData;
        }

        function refreshPage(responseData) {

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = responseData.suitelet;
        }

        /****************** Mostrar botones ******************/

        function enviar() {

            sendRequestWrapper({ method: 'enviar', method_id: '1' });
        }

        function recibir() {

            sendRequestWrapper({ method: 'recibir', method_id: '2' });
        }

        function rechazar() {

            sendRequestWrapper({ method: 'rechazar', method_id: '3' });
        }

        function descargarExcel() {

            // Obtener data
            let recordContext = currentRecord.get();
            // Filtros
            let id_subsidiaria = recordContext.getValue('custpage_field_filter_subsidiary');
            let fecha_desde = recordContext.getText('custpage_field_filter_date_from');
            let fecha_hasta = recordContext.getText('custpage_field_filter_date_to');
            let estado_cargo = recordContext.getValue('custpage_field_filter_estado_cargo');

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployDownloadId,
                scriptId: scriptDownloadId,
                params: {
                    _button: 'excel',
                    _id_subsidiaria: id_subsidiaria,
                    _fecha_desde: fecha_desde,
                    _fecha_hasta: fecha_hasta,
                    _estado_cargo: estado_cargo
                }
            });

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Abrir url
            window.open(suitelet);
        }

        return {
            pageInit: pageInit,
            enviar: enviar,
            recibir: recibir,
            rechazar: rechazar,
            descargarExcel: descargarExcel
        };

    });
