import { isCodesLine } from "./lines";
import { parseChurchNameWithPlace } from "./parse";

const confessionTextToBlocks = (text: string): Block[] => {
  const lines = text.split("\n");
  const blocks: string[][] = [];
  let currentBlock: string[] = [];
  let prevNumber = -1;

  lines.forEach(line => {
    const match = line.match(/^(\d+)/);
    if (match) {
      const currNumber = parseInt(match[1]);
      if (prevNumber < currNumber) {
        currentBlock.push(line);
        prevNumber = currNumber;
      } else {
        blocks.push(currentBlock);
        currentBlock = [line];
        prevNumber = currNumber;
      }
    } else {
      currentBlock.push(line);
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks.map(blockLines => {
    const blockDataEndPos = blockLines.findIndex(isCodesLine);
    const result: Block = {
      country: "",
      state: "",
      place: "",
      churchName: "",
      churchAdministration: "",
      lines: []
    };
    if (blockDataEndPos === -1) {
      console.log("No data lines in block", blockLines);
      return result;
    }

    result.lines = blockLines.slice(blockDataEndPos, blockLines.length);
    const blockDataLines = blockLines.slice(0, blockDataEndPos).filter(Boolean);
    if (blockDataLines.length >= 4) {
      const [state, churchAdministration, churchNameWithPlace, additionalPlaces] = blockDataLines;
      const parsedChurch = parseChurchNameWithPlace(churchNameWithPlace);
      result.state = state;
      result.churchAdministration = churchAdministration;
      result.churchName = parsedChurch.churchName;
      result.place = parsedChurch.place;
    } else if (blockDataLines.length === 3) {
      const [state, churchAdministration, churchNameWithPlace] = blockDataLines;
      const parsedChurch = parseChurchNameWithPlace(churchNameWithPlace);
      result.state = state;
      result.churchAdministration = churchAdministration;
      result.churchName = parsedChurch.churchName;
      result.place = parsedChurch.place;
    } else {
      console.log("Unexpected block data lines", blockDataLines, blockLines);
    }

    return result;
  });
};

export default confessionTextToBlocks;
