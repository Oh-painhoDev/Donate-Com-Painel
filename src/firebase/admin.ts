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
import 'dotenv/config';

let firestore: admin.firestore.Firestore | null = null;

// Ensure the app is initialized only once
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });
        // Get the firestore instance only if the app has been initialized.
        firestore = getFirestore();
    } catch (e) {
        console.error("Firebase Admin initialization failed:", e);
    }
  } else {
    // This will only run in a local dev environment if the .env file is missing
    // In production, the environment variables should be set.
    console.warn("Firebase Admin credentials not found. Skipping server-side Firestore initialization.");
  }
} else {
    // If the app is already initialized, just get the firestore instance.
    firestore = getFirestore();
}


export { firestore, admin };
