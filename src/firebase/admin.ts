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
import { firebaseConfig } from './config';

// Ensure the app is initialized only once
if (!admin.apps.length) {
  try {
    // Attempt to initialize with Application Default Credentials
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId
    });
  } catch (e) {
    console.error("Firebase Admin initialization with Application Default Credentials failed, falling back.", e);
    // Fallback for local development or environments without ADC
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
}

const firestore = getFirestore();

export { firestore, admin };
