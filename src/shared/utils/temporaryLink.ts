import jwt, { SignOptions } from 'jsonwebtoken';
/**
 * Gera um link temporário para acesso à atividade.
 *
 * @param activityId - ID da atividade que será acessada.
 * @param expiresIn - Tempo de expiração do token (padrão: '7d').
 * @returns Uma URL contendo o token de acesso temporário.
 */
export function generateTemporaryLink(activityId: number, expiresIn: string = '7d'): string {
    if (!process.env.TEMP_LINK_SECRET) {
      throw new Error("TEMP_LINK_SECRET is not defined in environment variables.");
    }
  
    // Cria o token contendo o ID da atividade
    const token = jwt.sign({ activityId }, process.env.TEMP_LINK_SECRET as string, { expiresIn } as SignOptions);
  
    // Define a URL base para acesso (use APP_URL ou outra variável de ambiente)
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  
    // Retorna a URL com o token como query parameter (exemplo: /access-activity?token=...)
    return `${baseUrl}/access-activity?token=${token}`;
  }
  
  /**
   * Verifica e decodifica o token de link temporário.
   *
   * @param token - Token recebido na URL.
   * @returns O payload decodificado, contendo por exemplo o activityId.
   * @throws Erro caso o token seja inválido ou expirado.
   */
  export function verifyTemporaryLink(token: string): { activityId: number } {
    if (!process.env.TEMP_LINK_SECRET) {
      throw new Error("TEMP_LINK_SECRET is not defined in environment variables.");
    }
  
    try {
      // Decodifica e valida o token usando a chave secreta
      const payload = jwt.verify(token, process.env.TEMP_LINK_SECRET) as { activityId: number };
      return payload;
    } catch (error) {
      throw new Error("Invalid or expired temporary link token.");
    }
  }