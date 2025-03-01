const cleanup = (text: string): string => {
  return text
    .replace(/\n\n\d+\nДержавний архів.+$/gm, "")
    .replace(/\n\n\d+\nМіжархівний довідник/gm, "")
    .replace(/покажчик\sнаселених\sпунктів(.|\n)+/igm, "")
    .replace(/^\s+(\d{1,2}\.)/gm, "$1")
    .replace(/\n((?!\d{1,2}\.).+)/g, "$1")
    .replace(/^(\s+)?\n/gm, "")
    .replace(/(\d{4})(,|;|\s|:)+ф(р|\.|,|\s|;)/gi, "$1: ф$3")
    .replace(/(;|,)+\s+оп\./gi, ", оп.")
    .replace(/(;|,)+\s+с?пр\./gi, ", спр.")
    .replace(/:\s+ф(,|\s|;)+/gi, ": ф.")
    .replace(/,\s+оп(,|\s|;)+/gi, ", оп.")
    .replace(/,\s+спр(,|\s|;)+/gi, ", спр.")
};

export default cleanup;
