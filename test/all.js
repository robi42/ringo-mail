var mail = require('ringo/mail');

const ADDRESS_1 = 'hannes@helma.at';
const ADDRESS_2 = 'ringojs@mailinator.com';
const ADDRESS_3 = 'commonjs@mailinator.com';
const SUBJECT = '[Foo] Bar';
const TEXT = 'Hi!\n\nThis is some text.\n\nCheers, Tester';

exports.testSendingMailWithVariousInputOptions = function () {
    mail.send({from: ADDRESS_1, to: ADDRESS_2, subject: SUBJECT, text: TEXT});
    mail.send({from: ADDRESS_1, to: ADDRESS_2, text: TEXT});
    mail.send({from: ADDRESS_1, to: ADDRESS_2, subject: SUBJECT});
    mail.send({from: ADDRESS_1, to: [ADDRESS_2, ADDRESS_3]});
    mail.send({from: ADDRESS_1, to: ADDRESS_2});
};

if (require.main == module.id) {
    require('ringo/unittest').run(exports);
}
