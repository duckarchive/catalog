import { extractTextFromPDF } from './parser';
import * as fs from 'fs';
import * as path from 'path';

const assetsDir = path.join('assets');

fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.filter(file => path.extname(file).toLowerCase() === '.pdf').forEach(file => {
    const pdfFilePath = path.join(assetsDir, file);
    const txtFilePath = path.join(assetsDir, `${path.basename(pdfFilePath, '.pdf')}.txt`);

    fs.access(pdfFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File not found: ${pdfFilePath}`);
        return;
      }

      extractTextFromPDF(pdfFilePath)
        .then(text => {
          fs.writeFile(txtFilePath, text, (err) => {
            if (err) {
              console.error('Error writing file:', err);
              return;
            }
            console.log(`Text extracted and saved to: ${txtFilePath}`);
          });
        })
        .catch(error => {
          console.error('Error extracting text:', error);
        });
    });
  });
});