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
  // Check if the app is already initialized
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.firestore();
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (privateKey && projectId && clientEmail) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (e: any) {
      // This might happen in some environments, but we can often ignore it
      // if an app already exists.
      if (e.code !== 'app/duplicate-app') {
        console.error("Firebase Admin initialization failed:", e);
        throw e; // Re-throw critical errors
      }
    }
  } else {
    // This is a critical failure. The server cannot function without credentials.
    const errorMessage = "Firebase Admin credentials (FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL) are not set in environment variables. Server-side features will not work.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Return the Firestore instance from the now-initialized app.
  return admin.firestore();
}
