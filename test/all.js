var mail = require('ringo/mail');

const ADDRESS1 = 'hannes@helma.at';
const ADDRESS2 = 'ringojs@mailinator.com';
const SUBJECT = '[Foo] Bar';
const TEXT = 'Hi!\n\nThis is some text.\n\nCheers, Tester';

exports.testSendMail = function () {
    mail.send({from: ADDRESS1, to: ADDRESS2, subject: SUBJECT, text: TEXT});
    mail.send({from: ADDRESS1, to: ADDRESS2, text: TEXT});
    mail.send({from: ADDRESS1, to: ADDRESS2, subject: SUBJECT});
    mail.send({from: ADDRESS1, to: ADDRESS2}); // Testing various input options.
};

if (require.main == module.id) {
    require('ringo/unittest').run(exports);
}
