const fs = require('fs');
const path = require('path');

function loadLanguage(locale) {
  const supportedLocales = ['EN', 'JP', 'CN', 'KR'];
  if (!supportedLocales.includes(locale)) {
    locale = 'EN'; // Default to English if locale is not supported
  }
  const filePath = path.join(__dirname, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'EN.json'), 'utf8')); // Default to English
  }
}

function getAvailableLanguages() {
  const files = fs.readdirSync(__dirname);
  return files.filter(file => file.endsWith('.json')).map(file => path.basename(file, '.json'));
}

module.exports = { loadLanguage, getAvailableLanguages };
