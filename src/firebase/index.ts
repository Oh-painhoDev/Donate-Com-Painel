/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
import { initializeFirebase } from './client-sdk';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
// This file is now a re-exporter for client-side functionality.
// The initializeFirebase function is now defined in client-sdk.ts to ensure
// a clean separation between client and server environments.

export * from './provider';
export * from './client-provider';
export * from './errors';
export * from './error-emitter';
export { initializeFirebase };
