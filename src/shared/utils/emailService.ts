// src/shared/utils/emailService.ts
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Cria e configura o transporter do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia um e-mail de verificação para o usuário.
 *
 * @param email - E-mail do destinatário.
 * @param userId - ID do usuário (string).
 * @param name - Nome do usuário (para personalizar a mensagem).
 */
export async function sendVerificationEmail(
  email: string,
  userId: string,
  name: string
): Promise<void> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  // Gera o token de verificação
  const token = jwt.sign({ userId, name }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  // Define a URL base usando a variável APP_URL ou um padrão para desenvolvimento
  const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';
  const verificationLink = `${baseUrl}/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Validação de Cadastro',
      html: `<p>Olá, ${name}!</p>
             <p>Seja bem-vindo(a) ao Hackaton! Para continuar, é necessário validar a sua conta.</p>
             <p>Clique no link abaixo para isso:</p>
             <a href="${verificationLink}">Validar Conta</a>
             <p>Se você não se cadastrou no TimetoLearn, por favor responda este e-mail para retirarmos do nosso cadastro.</p>
             <p>Atenciosamente, Equipe Hackaton</p>`,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.log('Erro ao enviar e-mail de validação', { error, email });
    throw error;
  }
}

/**
 * Envia um e-mail com o link de acesso à atividade.
 *
 * @param email - E-mail do destinatário.
 * @param userId - ID do usuário (string).
 * @param name - Nome do usuário.
 * @param accessLink - Link que direciona para a atividade pública.
 */
export async function sendActivityAccessEmail(
  email: string,
  userId: string,
  name: string,
  accessLink: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Acesso à Atividade - TimetoLearn',
      html: `<p>Olá, ${name}!</p>
             <p>Você recebeu um link para acessar a atividade sem precisar de cadastro.</p>
             <p>Clique no link abaixo para abrir a atividade:</p>
             <a href="${accessLink}">Acessar Atividade</a>
             <p>O link é válido por 7 dias.</p>
             <p>Atenciosamente, Equipe TimetoLearn</p>`,
    });
    console.log(`E-mail de acesso enviado para ${email}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail de acesso', { error, email });
    throw error;
  }
}