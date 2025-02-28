import * as fs from 'fs';
import * as path from 'path';
import splitByConfessions from './confessions';
import splitByArchives from './archives';
import mergePages from './merge-pages';
import blockToData from './lines';
import confessionTextToBlocks from './blocks';

const assetsFolder = path.join('assets');
const outputFolder = path.join('temp');

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

  files.slice(0,2).forEach(file => {
    if (path.extname(file) === '.txt') {
      const filePath = path.join(assetsFolder, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', filePath, err);
          return;
        }
        const archives = splitByArchives(data);
        archives.forEach(({ archive, chunk: archiveChunk }) => {
          const archiveFolder = path.join(outputFolder, archive);
          if (!fs.existsSync(archiveFolder)) {
            fs.mkdirSync(archiveFolder, { recursive: true });
          }

          const archiveChunkMergedPages = mergePages(archiveChunk);
          const confessions = splitByConfessions(archiveChunkMergedPages);
          confessions.forEach(({ confession, chunk: confessionChunk }) => {
            const outputFilePath = path.join(archiveFolder, `${confession}.txt`);
            fs.writeFile(outputFilePath, confessionChunk, 'utf8', err => {
              if (err) {
                console.error('Error writing file:', outputFilePath, err);
              } else {
                console.log('File saved:', outputFilePath);
              }
            });
            const outputDataFilePath = path.join(archiveFolder, `${confession}.json`);
            const confessionBlocks = confessionTextToBlocks(confessionChunk).map(block => blockToData(block, confession, archive));
            fs.writeFile(outputDataFilePath, JSON.stringify(confessionBlocks, null, 2), 'utf8', err => {
              if (err) {
                console.error('Error writing json file:', outputDataFilePath, err);
              } else {
                console.log('File json saved:', outputDataFilePath);
              }
            });
          });
        });
      });
    }
  });
});