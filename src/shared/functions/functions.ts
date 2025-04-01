/**
 * Função para gerar um slug a partir de uma string.
 * Converte para minúsculas, remove espaços extras e caracteres indesejados.
 */
export function slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // substitui espaços por hífen
      .replace(/[^\w\-]+/g, '');   // remove caracteres não alfanuméricos, exceto hífen
}