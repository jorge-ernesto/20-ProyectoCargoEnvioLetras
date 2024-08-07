// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Ctrl Car Env Let Des Arc (customscript_bio_sl_ctrl_car_env_let_des)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Process', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objProcess, objHelper, N) {

        const { log, file, render, encode, record } = N;

        /******************/

        // Crear XLS
        function createXLSFile(content) {

            let base64fileEncodedString = encode.convert({
                string: content,
                inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64
            });

            return file.create({
                name: 'Reporte.xls',
                fileType: file.Type.EXCEL,
                encoding: file.Encoding.UTF_8,
                contents: base64fileEncodedString,
            })
        }

        // Crear Excel
        function createExcel(transactionList, dateFrom, dateTo) {
            // Nombre del archivo
            let typeRep = 'reporteCargoEnvioLetras';
            let titleDocument = 'Reporte de cargo de envio de letras';

            // Crear Excel - Contenido dinamico
            let xlsContent = file.load('./freemarker/CtaCorrienteProv.ftl').getContents();
            let renderer = render.create();
            renderer.templateContent = xlsContent;

            // Enviar datos a Excel
            renderer.addCustomDataSource({
                format: render.DataSource.OBJECT,
                alias: "input",
                data: {
                    data: JSON.stringify({
                        name: titleDocument,
                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        transactions: transactionList
                    })
                }
            });

            // Crear XLS
            let rendererString = renderer.renderAsString();
            let xlsFile = createXLSFile(rendererString);

            // Reescribir datos de Excel
            xlsFile.name = `biomont_${typeRep}_${dateFrom}_${dateTo}.xls`;

            return { xlsFile };
        }

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameteres', scriptContext.request.parameters);

            if (scriptContext.request.method == 'GET') {
                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let subsidiary = scriptContext.request.parameters['_id_subsidiaria'];
                let dateFrom = scriptContext.request.parameters['_fecha_desde'];
                let dateTo = scriptContext.request.parameters['_fecha_hasta'];
                let estadoCargo = scriptContext.request.parameters['_estado_cargo'];

                if (button == 'excel') {

                    // Obtener datos por search
                    let dataLetrasPorPagar = objSearch.getDataLetrasPorPagar(subsidiary, dateFrom, dateTo, estadoCargo);
                    let dataLetrasPorPagar_Datos = objSearch.getDataLetrasPorPagar_Datos(subsidiary);
                    let dataLetrasPorPagar_Completo = objProcess.getDataLetrasPorPagar_Completo(dataLetrasPorPagar, dataLetrasPorPagar_Datos, estadoCargo)

                    // Debug
                    // objHelper.error_log('data', { dataLetrasPorPagar, dataDatosLetrasPorPagar });
                    // objHelper.error_log('data', { dataLetrasPorPagar_Completo });

                    // Procesar reporte
                    let dataReporte = dataLetrasPorPagar_Completo;

                    // Crear Excel
                    let { xlsFile } = createExcel(dataReporte, dateFrom, dateTo);

                    // Descargar Excel
                    scriptContext.response.writeFile({
                        file: xlsFile
                    });
                }
            }
        }

        return { onRequest }

    });
