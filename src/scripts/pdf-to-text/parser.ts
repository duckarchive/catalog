import fs from 'fs';
import pdf from 'pdf-parse';

export const extractTextFromPDF = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const dataBuffer = fs.readFileSync(filePath);
        pdf(dataBuffer).then(data => {
            resolve(data.text);
        }).catch(error => {
            reject(error);
        });
    });
};