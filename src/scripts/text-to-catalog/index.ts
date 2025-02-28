import * as fs from 'fs';
import * as path from 'path';
import splitByConfessions from './confessions';

const assetsFolder = path.join('assets');
const outputFolder = path.join('temp/confessions');

// Ensure the output directory exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Read all txt files from the assets folder
fs.readdir(assetsFolder, (err, files) => {
  if (err) {
    console.error('Error reading assets folder:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.txt') {
      const filePath = path.join(assetsFolder, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', filePath, err);
          return;
        }

        const confessions = splitByConfessions(data);
        confessions.forEach(({ confession, chunk }) => {
          const outputFilePath = path.join(outputFolder, `${path.basename(file, '.txt')}_${confession}.txt`);
          fs.writeFile(outputFilePath, chunk, 'utf8', err => {
            if (err) {
              console.error('Error writing file:', outputFilePath, err);
            } else {
              console.log('File saved:', outputFilePath);
            }
          });
        });
      });
    }
  });
});