/**
 * @fileOverview Simple interface to javax.mail for sending mail.
 */

importPackage(javax.mail);
importPackage(javax.mail.internet);
importClass(java.util.Properties);

var log = require('ringo/logging').getLogger(module.id);

/**
 * Does the actual job of sending mail.
 *
 * @param {Object} data the data of mail to send
 */
exports.send = function(data) {
    var transport, message, session, props = new Properties();
    try {
        props.put('mail.transport.protocol', 'smtp');
        props.put('mail.smtp.host', data.host || 'localhost');
        props.put('mail.smtp.auth', data.user && data.password);
        props.put('mail.smtp.port', String(data.port || 25));
        props.put('mail.smtp.starttls.enable', 'false'); // TODO: support TLS.
        props.put('mail.mime.charset', 'UTF-8');
        session = Session.getInstance(props);
        message = new MimeMessage(session); // Enable skipping data.from.
        message.setFrom(new InternetAddress(data.from));
        if (data.to instanceof Array) { // Enable multiple recipients.
            for each (var recipient in data.to) {
                message.addRecipient(Message.RecipientType.TO,
                        new InternetAddress(recipient));
            }
        } else { // Single recipient case.
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(
                    data.to));
        }
        if (typeof data.subject === 'string') { // Enable empty subjects.
            message.setSubject(MimeUtility.encodeWord(data.subject));
        }
        message.setText(data.text || ''); // Enable "empty" content.
        message.setSentDate(new Date());
        transport = session.getTransport('smtp');
        if (data.user && data.password) {
            transport.connect(data.user, data.password);
        } else {
            transport.connect();
        }
        message.saveChanges();
        transport.sendMessage(message, message.getAllRecipients());
        log.info('Sent mail with following data:', JSON.stringify(data));
    } catch (error) {
        log.error('Something went wrong while trying to send mail; data:', JSON.
                stringify(data));
        throw error;
    } finally {
        if (transport && transport.isConnected()) {
            transport.close();
        }
    }
};
