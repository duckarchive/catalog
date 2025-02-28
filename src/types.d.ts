interface Block {
  country?: string;
  state: string;
  place: string;
  churchName: string;
  churchAdministration: string;
  lines: string[];
}

interface LineCode {
  f: string; // fund
  d: string; // description
  c: string; // case
  year: number;
  recordType: string;
}

interface FullCode extends LineCode, Omit<Block, 'lines'> {
  a: string; // archive
  confession: string;
}