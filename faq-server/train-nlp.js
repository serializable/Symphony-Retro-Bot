const fs = require('fs');

module.exports = async function trainnlp(manager) {
  if (fs.existsSync('./model.nlp')) {
    manager.load('./model.nlp');
    return;
  }

  // Adding Document
  manager.addDocument('en', 'How do I install Intellij?', 'jetbrains.install');
  manager.addDocument('en', 'How do I set up jetbrains license?', 'jetbrains.license.help');
  manager.addDocument('en', 'JetProfile connection error: SSLHandshakeException: java.security.cert.CertificateException: java.security.SignatureException: Signature length not correct: got 256 but was expecting 512', 'jetbrains.license.error');
  manager.addDocument('en', 'java.security.cert.CertificateException: java.security.SignatureException: Signature does not match.', 'jetbrains.license.error');

  console.log('Training, please wait..');
  const hrstart = process.hrtime();
  await manager.train();
  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  console.log('Trained!');

  // Adding answers
  manager.addAnswer('en', 'jetbrains.install', "Please follow the instructions here: https://www.jetbrains.com/help/idea/installation-guide.html");
  manager.addAnswer('en', 'jetbrains.license.error', "Please follow the instructions here: " + "https://intellij-support.jetbrains.com/hc/en-us/articles/206544889-SignatureException-Signature-doesn-t-match-or-Signature-length-not-correct-got-256-but-was-expecting-512");

  manager.save('./model.nlp', true);
}