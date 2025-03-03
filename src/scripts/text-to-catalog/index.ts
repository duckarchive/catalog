import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import splitByConfessions from "./confessions";
import splitByArchives from "./archives";
import blockToData from "./lines";
import confessionTextToBlocks from "./blocks";
import cleanup from "./cleanup";

const DEBUG = process.env.DEBUG === "true";
const assetsFolder = path.join("assets");
const tempFolder = path.join("temp");
const catalogFolder = path.join("catalog");

const run = async () => {
  // Ensure the catalog directory exists
  if (!fsSync.existsSync(catalogFolder)) {
    await fs.mkdir(catalogFolder, { recursive: true });
  }

  // Ensure the temp directory exists DEBUG mode
  if (DEBUG && !fsSync.existsSync(tempFolder)) {
    await fs.mkdir(tempFolder, { recursive: true });
  }

  // Read all files from the assets folder
  const assetFiles = await fs.readdir(assetsFolder);

  // Filter out only the text files
  const textFiles = assetFiles.filter((file) => path.extname(file) === ".txt");

  if (!textFiles.length) {
    throw new Error(
      'No text files found in the assets folder. Run "parse:pdf-to-text" npm script to extract text from PDFs.'
    );
  }

  for (const textFile of textFiles) {
    // Read the content of the text file
    const textFilePath = path.join(assetsFolder, textFile);
    const textFileContent = await fs.readFile(textFilePath, "utf8");

    if (!textFileContent) {
      throw new Error(`Empty file: ${textFilePath}`);
    }

    // Split the text file content to archive chunks
    const archives = splitByArchives(textFileContent);

    for (const { archive, chunk: archiveChunk } of archives) {
      if (DEBUG) {
        const stepFolder = path.join(tempFolder, "001_archive-chunks");
        if (!fsSync.existsSync(stepFolder)) {
          await fs.mkdir(stepFolder, { recursive: true });
        }
        await fs.writeFile(
          path.join(stepFolder, `${archive}.txt`),
          archiveChunk,
          "utf8"
        );
      }

      // Clean up the archive chunk
      const archiveChunkCleanedUp = cleanup(archiveChunk);
      if (DEBUG) {
        const stepFolder = path.join(
          tempFolder,
          "002_archive-chunks-cleaned-up"
        );
        if (!fsSync.existsSync(stepFolder)) {
          await fs.mkdir(stepFolder, { recursive: true });
        }
        await fs.writeFile(
          path.join(stepFolder, `${archive}.txt`),
          archiveChunkCleanedUp,
          "utf8"
        );
      }

      const archiveResults: FullCode[][] = [];

      // Split the archive chunk to confessions
      const confessions = splitByConfessions(archiveChunkCleanedUp);
      for (const { confession, chunk: confessionChunk } of confessions) {
        if (DEBUG) {
          const stepFolder = path.join(
            tempFolder,
            "003_confession-chunks",
            archive
          );
          if (!fsSync.existsSync(stepFolder)) {
            await fs.mkdir(stepFolder, { recursive: true });
          }
          await fs.writeFile(
            path.join(stepFolder, `${confession}.txt`),
            confessionChunk,
            "utf8"
          );
        }

        // Convert the confession chunk to data blocks
        const [confessionBlocks, confessionErrors] =
          confessionTextToBlocks(confessionChunk);
        if (DEBUG) {
          if (confessionErrors.length) {
            const errorFolder = path.join(
              tempFolder,
              "000_errors",
              "004",
              archive
            );
            if (!fsSync.existsSync(errorFolder)) {
              await fs.mkdir(errorFolder, { recursive: true });
            }
            await fs.writeFile(
              path.join(errorFolder, `${confession}.json`),
              JSON.stringify(confessionErrors, null, 2),
              "utf8"
            );
          }
          const stepFolder = path.join(
            tempFolder,
            "004_confession-chunk-blocks",
            archive
          );
          if (!fsSync.existsSync(stepFolder)) {
            await fs.mkdir(stepFolder, { recursive: true });
          }
          await fs.writeFile(
            path.join(stepFolder, `${confession}.json`),
            JSON.stringify(confessionBlocks, null, 2),
            "utf8"
          );
        }

        // Convert the blocks to data
        const parseErrors: ParseError[] = [];
        const parseData = confessionBlocks
          .map((block) => {
            const filtered = blockToData(block, confession, archive).filter(
              Boolean
            ) as [FullCode[], ParseError[]][];
            return filtered
              .map(([data, error]) => {
                parseErrors.push(...error);
                return data;
              })
              .flat();
          })
          .flat();
        if (DEBUG) {
          if (parseErrors.length) {
            const errorFolder = path.join(
              tempFolder,
              "000_errors",
              "005",
              archive
            );
            if (!fsSync.existsSync(errorFolder)) {
              await fs.mkdir(errorFolder, { recursive: true });
            }
            await fs.writeFile(
              path.join(errorFolder, `${confession}.json`),
              JSON.stringify(parseErrors, null, 2),
              "utf8"
            );
          }
          const stepFolder = path.join(
            tempFolder,
            "005_confession-chunk-data",
            archive
          );
          if (!fsSync.existsSync(stepFolder)) {
            await fs.mkdir(stepFolder, { recursive: true });
          }
          await fs.writeFile(
            path.join(stepFolder, `${confession}.json`),
            JSON.stringify(parseData, null, 2),
            "utf8"
          );
        }

        // JSON to CSV
        archiveResults.push(parseData);
      }

      const flattedResults = archiveResults.flat();

      if (!flattedResults[0]) {
        continue
      }
      const csvHeader = Object.keys(flattedResults[0]).join(",");
      const csvData = flattedResults
        .map((d) => {
          return Object.values(d).join(",");
        })
        .join("\n");

      const csv = `${csvHeader}\n${csvData}`;
      const csvFilePath = path.join(
        catalogFolder,
        `${archive}.csv`
      );
      await fs.writeFile(csvFilePath, csv, "utf8");
    }
  }
};

run().catch((err) => {
  console.error("Error running script:", err);
});
