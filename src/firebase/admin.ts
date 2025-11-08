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
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Ensure the app is initialized only once
if (!admin.apps.length) {
  try {
    // Attempt to initialize with Application Default Credentials in a server environment
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.GCLOUD_PROJECT, // Use environment variable for server-side
    });
  } catch (e) {
    console.error("Firebase Admin initialization with Application Default Credentials failed, falling back.", e);
    // Fallback for local development or environments without ADC or env var
    admin.initializeApp({
      projectId: process.env.GCLOUD_PROJECT,
    });
  }
}

const firestore = getFirestore();

export { firestore, admin };
