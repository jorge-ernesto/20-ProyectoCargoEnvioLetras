
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, runtime, record, url, email } = N;

        const scriptId = 'customscript_bio_sl_ctrl_car_env_let';
        const deployId = 'customdeploy_bio_sl_ctrl_car_env_let';

        /******************/

        function getUser() {
            let user = runtime.getCurrentUser();
            return { user };
        }

        function error_log(title, data) {
            throw `${title} -- ${JSON.stringify(data)}`;
        }

        function error_message(message) {
            throw new Error(`${message}`);
        }

        /****************** Validacion ******************/

        function getDataUser(userId) {
            // Cargar el registro del empleado
            var employeeRecord = record.load({
                type: record.Type.EMPLOYEE,
                id: userId
            });

            // Obtener datos del empleado
            var centro_costo = employeeRecord.getValue('class');

            return { centro_costo };
        }

        /****************** Email ******************/

        function getUrlSuitelet() {

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId
            })

            return { suitelet };
        }

        function sendEmail_NotificarRechazo(arrayLetrasProcesadas, user) {

            let arrayLetras = arrayLetrasProcesadas.map(value => `- ${value}`);
            let { suitelet } = getUrlSuitelet();

            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: ['contabilidad@biomont.com.pe', 'finanzas@biomont.com.pe'],
                subject: `[Cargo de envio de letras] Notificación de rechazo`,
                body: `
                    El usuario <b>"${user.name}"</b> ha rechazado letras por pagar.<br /><br />
                    Link: <a href="${suitelet}">${suitelet}</a>
                `
                // body: `
                //     El usuario <b>"${user.name}"</b> ha rechazado las siguientes letras por pagar:<br /><br />
                //     ${arrayLetras.join('<br />')}
                // `
            });
        }

        /****************** Helper ******************/

        function decimalAdjust(type, value, exp) {
            // Si el exp no está definido o es cero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // Si el valor no es un número o el exp no es un entero...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }

        // Decimal round
        if (!Math.round10) {
            Math.round10 = function (value, exp) {
                return decimalAdjust('round', value, exp);
            };
        }
        // Decimal floor
        if (!Math.floor10) {
            Math.floor10 = function (value, exp) {
                return decimalAdjust('floor', value, exp);
            };
        }
        // Decimal ceil
        if (!Math.ceil10) {
            Math.ceil10 = function (value, exp) {
                return decimalAdjust('ceil', value, exp);
            };
        }

        // Determinar si una string es numérico en JavaScript
        // Referencia: https://www.techiedelight.com/es/determine-string-numeric-javascript/
        function isNumeric(n) {
            return !isNaN(n);
        }

        return { getUser, error_log, error_message, getDataUser, sendEmail_NotificarRechazo, isNumeric }

    });
