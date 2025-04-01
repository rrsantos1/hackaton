/**
 * Gera um caça‐palavras.
 * @param words Array de palavras a serem incluídas no puzzle.
 * @param rows Número de linhas do grid.
 * @param cols Número de colunas do grid.
 * @returns Um objeto contendo o grid (matriz de letras) e as posições das palavras.
 */
export function generateWordSearchPuzzle(
    words: string[],
    rows: number,
    cols: number
  ): { grid: string[][]; wordPositions: { word: string; row: number; col: number; direction: string }[] } {
    // Cria um grid vazio com null.
    let grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  
    // Função auxiliar para gerar uma letra aleatória.
    const randomLetter = (): string => {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return letters.charAt(Math.floor(Math.random() * letters.length));
    };
  
    // Array para guardar as posições das palavras.
    const wordPositions: { word: string; row: number; col: number; direction: string }[] = [];
  
    // Define as 8 direções possíveis.
    const directions = [
      { dx: 0, dy: 1, name: "right" },
      { dx: 1, dy: 0, name: "down" },
      { dx: 0, dy: -1, name: "left" },
      { dx: -1, dy: 0, name: "up" },
      { dx: 1, dy: 1, name: "down-right" },
      { dx: 1, dy: -1, name: "down-left" },
      { dx: -1, dy: 1, name: "up-right" },
      { dx: -1, dy: -1, name: "up-left" },
    ];
  
    // Verifica se é possível posicionar a palavra a partir de (row, col) na direção (dx, dy)
    const canPlaceWord = (word: string, row: number, col: number, dx: number, dy: number): boolean => {
      for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
          return false;
        }
        // Se já houver uma letra e for diferente, não pode colocar
        if (grid[newRow][newCol] !== null && grid[newRow][newCol] !== word[i]) {
          return false;
        }
      }
      return true;
    };
  
    // Tenta posicionar a palavra no grid
    const placeWord = (word: string): { row: number; col: number; direction: string } | null => {
      const maxAttempts = 100;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (canPlaceWord(word, row, col, direction.dx, direction.dy)) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i * direction.dx][col + i * direction.dy] = word[i];
          }
          return { row, col, direction: direction.name };
        }
      }
      return null;
    };
  
    // Tenta posicionar cada palavra (em maiúsculas)
    for (const rawWord of words) {
      const word = rawWord.toUpperCase();
      const placement = placeWord(word);
      if (placement) {
        wordPositions.push({ word, ...placement });
      }
    }
  
    // Preenche as células vazias com letras aleatórias
    const finalGrid = grid.map(row =>
      row.map(cell => (cell === null ? randomLetter() : cell))
    );
  
    return { grid: finalGrid, wordPositions };
  }    