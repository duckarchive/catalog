const splitByArchives = (
  text: string
): { archive: string; chunk: string }[] => {
  const regex = /^Державний архів/gm;
  const lines = text.split('\n');
  const result: { archive: string; chunk: string }[] = [];

  let currentArchive = '';
  let currentChunk = '';

  for (const line of lines) {
    if (regex.test(line)) {
      if (currentArchive === line) {
        currentChunk += line + '\n';
        continue;
      }
      if (currentArchive) {
        result.push({ archive: currentArchive, chunk: currentChunk.trim() });
      }
      currentArchive = line;
      currentChunk = '';
    } else {
      currentChunk += line + '\n';
    }
  }

  if (currentArchive) {
    result.push({ archive: currentArchive, chunk: currentChunk.trim() });
  }

  return result;
};

export default splitByArchives;