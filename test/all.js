include('ringo/mailer');

const ADDRESS1 = 'hannes@helma.at';
const ADDRESS2 = 'ringojs@mailinator.com';
const SUBJECT = '[Foo] Bar';
const TEXT = 'Hi!\n\nThis is some text.\n\nCheers, Tester';

exports.testSendMail = function () {
    sendMail({from: ADDRESS1, to: ADDRESS2, subject: SUBJECT, text: TEXT});
    sendMail({to: ADDRESS2, subject: SUBJECT, text: TEXT});
    sendMail({from: ADDRESS1, to: ADDRESS2, text: TEXT});
    sendMail({from: ADDRESS1, to: ADDRESS2, subject: SUBJECT});
    sendMail({to: ADDRESS2}); // Testing different input options.
};

if (require.main == module.id) {
    require('ringo/unittest').run(exports);
}
