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

/**
 * Initializes the Firebase Admin SDK if not already initialized,
 * and returns the Firestore instance. This function is idempotent.
 * @returns {admin.firestore.Firestore} The initialized Firestore instance.
 * @throws {Error} If Firebase Admin credentials are not set in environment variables.
 */
export function getAdminFirestore(): admin.firestore.Firestore {
  // Check if the app is already initialized to prevent re-initialization.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.firestore();
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // The credentials MUST be available in the environment.
  if (!privateKey || !projectId || !clientEmail) {
    const errorMessage = "Firebase Admin credentials (FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL) are not set in environment variables. Server-side features cannot work.";
    console.error(errorMessage);
    // Throw a specific, clear error. This is a critical failure.
    throw new Error(errorMessage);
  }

  // Initialize the app with the explicit credentials.
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      // Ensure newline characters are correctly interpreted.
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });

  // Return the Firestore instance from the now-initialized app.
  return admin.firestore();
}
