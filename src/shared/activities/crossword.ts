// Define a interface para armazenar os dados de cada palavra posicionada
interface CrosswordPlacement {
    word: string;
    clue: string;
    row: number;
    col: number;
    direction: "across" | "down";
    number: number; // Número para identificação/pista
  }
  
  /**
   * Gera um puzzle de palavras cruzadas.
   * @param words Array de objetos contendo a palavra e sua pista.
   * @param rows Número de linhas do grid.
   * @param cols Número de colunas do grid.
   * @returns Objeto com o grid preenchido e um array de pistas com as posições.
   */
  export function generateCrosswordPuzzle(
    words: { word: string; clue: string }[],
    rows: number,
    cols: number
  ): { grid: string[][]; clues: CrosswordPlacement[] } {
    // Cria um grid (matriz) preenchido com espaços em branco
    const grid: string[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(" ")
    );
  
    // Array para armazenar as informações das palavras posicionadas (clues)
    const placements: CrosswordPlacement[] = [];
  
    // Função auxiliar para verificar se é possível posicionar uma palavra
    function canPlaceWord(
      word: string,
      startRow: number,
      startCol: number,
      direction: "across" | "down"
    ): boolean {
      if (direction === "across") {
        if (startCol < 0 || startCol + word.length > cols) return false;
        for (let j = 0; j < word.length; j++) {
          const cell = grid[startRow][startCol + j];
          if (cell !== " " && cell !== word[j]) return false;
        }
      } else { // down
        if (startRow < 0 || startRow + word.length > rows) return false;
        for (let j = 0; j < word.length; j++) {
          const cell = grid[startRow + j][startCol];
          if (cell !== " " && cell !== word[j]) return false;
        }
      }
      return true;
    }
  
    // Função auxiliar para posicionar a palavra no grid
    function placeWord(
      word: string,
      startRow: number,
      startCol: number,
      direction: "across" | "down"
    ): void {
      if (direction === "across") {
        for (let j = 0; j < word.length; j++) {
          grid[startRow][startCol + j] = word[j];
        }
      } else {
        for (let j = 0; j < word.length; j++) {
          grid[startRow + j][startCol] = word[j];
        }
      }
    }
  
    let clueNumber = 1;
  
    // Posiciona a primeira palavra no centro do grid (horizontalmente)
    if (words.length > 0) {
      const firstWord = words[0].word;
      const startCol = Math.floor((cols - firstWord.length) / 2);
      const startRow = Math.floor(rows / 2);
      if (canPlaceWord(firstWord, startRow, startCol, "across")) {
        placeWord(firstWord, startRow, startCol, "across");
        placements.push({
          word: firstWord,
          clue: words[0].clue,
          row: startRow,
          col: startCol,
          direction: "across",
          number: clueNumber++,
        });
      }
    }
  
    // Tenta posicionar as demais palavras buscando interseções com as palavras já posicionadas
    for (let i = 1; i < words.length; i++) {
      const currentWordObj = words[i];
      const currentWord = currentWordObj.word;
      let placed = false;
  
      // Tenta encontrar uma interseção para cada letra da palavra
      for (let pos = 0; pos < currentWord.length && !placed; pos++) {
        const letter = currentWord[pos];
        // Percorre o grid em busca da letra correspondente
        for (let r = 0; r < rows && !placed; r++) {
          for (let c = 0; c < cols && !placed; c++) {
            if (grid[r][c] === letter) {
              // Tenta posicionar verticalmente ("down")
              const startRow = r - pos;
              if (canPlaceWord(currentWord, startRow, c, "down")) {
                placeWord(currentWord, startRow, c, "down");
                placements.push({
                  word: currentWord,
                  clue: currentWordObj.clue,
                  row: startRow,
                  col: c,
                  direction: "down",
                  number: clueNumber++,
                });
                placed = true;
                break;
              }
              // Tenta posicionar horizontalmente ("across")
              const startCol = c - pos;
              if (canPlaceWord(currentWord, r, startCol, "across")) {
                placeWord(currentWord, r, startCol, "across");
                placements.push({
                  word: currentWord,
                  clue: currentWordObj.clue,
                  row: r,
                  col: startCol,
                  direction: "across",
                  number: clueNumber++,
                });
                placed = true;
                break;
              }
            }
          }
        }
      }
  
      // Se não encontrar interseção, tenta posicionar a palavra em uma linha vazia (across)
      if (!placed) {
        outer: for (let r = 0; r < rows; r++) {
          for (let c = 0; c <= cols - currentWord.length; c++) {
            if (canPlaceWord(currentWord, r, c, "across")) {
              placeWord(currentWord, r, c, "across");
              placements.push({
                word: currentWord,
                clue: currentWordObj.clue,
                row: r,
                col: c,
                direction: "across",
                number: clueNumber++,
              });
              placed = true;
              break outer;
            }
          }
        }
      }
  
      // Se mesmo assim não for possível posicionar a palavra, emite um aviso (ou trate conforme a necessidade)
      if (!placed) {
        console.warn(`Não foi possível posicionar a palavra: ${currentWord}`);
      }
    }
  
    return {
      grid,
      clues: placements,
    };
  }  