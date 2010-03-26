/**
 * @fileOverview Simple interface to javax.mail for sending email.
 */

importPackage(javax.mail);
importPackage(javax.mail.internet);

export('send');

var log = require('ringo/logging').getLogger(module.id);
var session;

/**
 * Does the actual job of sending mail.
 *
 * @param {Object} data the data of mail to send
 */
function send(data) {
    try {
        session = Session.getInstance(createProps(data));
        var msg = createMsg(data);
        var transport = session.getTransport('smtp');
        data.user && data.password ? // Enable SMTP auth.
                transport.connect(data.user, data.password) :
                transport.connect();
        transport.sendMessage(msg, msg.getAllRecipients());
        log.info('Sent mail with following input data:', JSON.stringify(data));
    } catch (error) {
        log.error('Something went wrong while trying to send mail; input data:',
                JSON.stringify(data));
        throw error;
    } finally {
        if (transport && transport.isConnected()) {
            transport.close();
        }
    }
}

/**
 * Creates props to be used by javax.mail session.
 *
 * @param {Object} data the data of mail to send
 * @returns props the props to be used by session
 */
function createProps(data) {
    var props = new java.util.Properties();
    props.put('mail.smtp.host', data.host || 'localhost');
    props.put('mail.smtp.auth', data.user && data.password);
    props.put('mail.smtp.port', String(data.port || 25));
    props.put('mail.smtp.starttls.enable', 'false'); // TODO: support TLS.
    props.put('mail.mime.charset', 'UTF-8');
    return props;
}

/**
 * Creates javax.mail message of mail to send.
 *
 * @param {Object} data the data of mail to send
 * @returns msg the message of mail to send
 */
function createMsg(data) {
    var msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress(data.from));
    msg.setRecipients(Message.RecipientType.TO, data.to instanceof Array ?
            data.to.toString() : data.to);
    if (data.cc) {
        msg.addRecipients(Message.RecipientType.CC, data.cc instanceof Array ?
                data.cc.toString() : data.cc);
    }
    if (data.bcc) {
        msg.addRecipients(Message.RecipientType.BCC, data.bcc instanceof Array ?
                data.bcc.toString() : data.bcc);
    }
    if (typeof data.subject === 'string') { // Enable empty subjects.
        msg.setSubject(MimeUtility.encodeWord(data.subject));
    }
    msg.setText(data.text || ''); // Enable "empty" content.
    msg.setSentDate(new Date());
    return msg;
}
