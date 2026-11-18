import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Maps raw Firebase Auth SDK error codes into clean, human-readable messages.
 */
export function formatFirebaseAuthError(err, email = '') {
  const code = err?.code || '';
  const platformLabel = email ? email.split('@')[1] || 'email' : 'email';

  switch (code) {
    case 'auth/operation-not-allowed':
      return `Inbox link sign-up for @${platformLabel} requires Firebase Email/Password authentication to be enabled in Firebase Console. You can register immediately with an active Gmail or Google Workspace account present on your device.`;
    case 'auth/popup-closed-by-user':
      return 'Verification popup was closed before confirming ownership of your email account.';
    case 'auth/popup-blocked':
      return 'Browser blocked the verification popup. Please allow popups for this site and try again.';
    case 'auth/cancelled-popup-request':
      return 'Another verification window was opened. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error while verifying your email account. Please check your connection and retry.';
    case 'auth/too-many-requests':
      return 'Too many verification attempts. Please wait a minute and try again.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid active email address.';
    case 'auth/user-disabled':
      return 'This email account is currently disabled in authentication records.';
    default: {
      const msg = String(err?.message || '').replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^)]+\)\.?$/i, '').trim();
      return msg || 'Could not verify this email account. Please use an active email present on your device.';
    }
  }
}

/**
 * Triggers Google OAuth Sign-Up popup via Firebase Auth (client-side only)
 */
export async function signInWithGooglePopup() {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const firebaseIdToken = await result.user.getIdToken();
  const googleAccessToken = credential?.accessToken || '';

  return {
    firebaseIdToken,
    googleAccessToken,
    profile: {
      email: result.user.email || '',
      fullName: result.user.displayName || '',
      avatarUrl: result.user.photoURL || '',
      emailVerified: Boolean(result.user.emailVerified)
    }
  };
}

/**
 * Verifies real ownership of a typed Gmail / Google Workspace email via Google popup with login_hint.
 * Prevents fake or non-existent emails (like datdsa@gmail.com) or mismatched account selection.
 */
export async function verifyEmailOwnershipWithGooglePopup(expectedEmail) {
  const cleanEmail = String(expectedEmail || '').trim().toLowerCase();
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.setCustomParameters({
    prompt: 'select_account',
    login_hint: cleanEmail
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const verifiedEmail = String(result.user?.email || '').trim().toLowerCase();

    if (!verifiedEmail || verifiedEmail !== cleanEmail) {
      await signOut(auth).catch(() => { });
      throw new Error(
        `Account mismatch: you signed into "${verifiedEmail || 'unknown'}" instead of "${cleanEmail}". You must verify the exact active email address you entered.`
      );
    }

    if (!result.user.emailVerified) {
      throw new Error(`Your Google email "${cleanEmail}" is not marked as verified.`);
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const firebaseIdToken = await result.user.getIdToken(true);
    const googleAccessToken = credential?.accessToken || '';

    return {
      email: verifiedEmail,
      emailVerified: true,
      verificationSent: false,
      firebaseIdToken,
      googleAccessToken
    };
  } catch (err) {
    if (err?.code) {
      throw new Error(formatFirebaseAuthError(err, cleanEmail));
    }
    throw err;
  }
}

/**
 * Verifies and registers an active email identity:
 * - For Gmail / Google Workspace emails: verifies real device/Google ownership immediately via popup.
 * - For non-Google emails (Yahoo, Outlook, iCloud, etc.): sends Firebase email verification link when enabled.
 * Fake or non-existent addresses cannot complete either check.
 */
export async function registerFirebaseEmailAccount({ email, password, displayName, preferGoogleOwnership = false }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const domain = cleanEmail.split('@')[1] || '';
  const isDirectGmail = domain === 'gmail.com' || domain === 'googlemail.com';

  if (isDirectGmail || preferGoogleOwnership) {
    return verifyEmailOwnershipWithGooglePopup(cleanEmail);
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName: displayName.trim() }).catch(() => { });
    }
    await sendEmailVerification(credential.user);
    return {
      email: credential.user.email || cleanEmail,
      emailVerified: Boolean(credential.user.emailVerified),
      verificationSent: true,
      firebaseIdToken: credential.user.emailVerified ? await credential.user.getIdToken(true) : '',
      googleAccessToken: ''
    };
  } catch (err) {
    if (err?.code === 'auth/operation-not-allowed') {
      throw new Error(formatFirebaseAuthError(err, cleanEmail));
    }

    if (err?.code === 'auth/email-already-in-use') {
      try {
        const existingCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        await existingCred.user.reload();
        if (existingCred.user.emailVerified) {
          return {
            email: existingCred.user.email || cleanEmail,
            emailVerified: true,
            verificationSent: false,
            firebaseIdToken: await existingCred.user.getIdToken(true),
            googleAccessToken: ''
          };
        }
        await sendEmailVerification(existingCred.user);
        return {
          email: existingCred.user.email || cleanEmail,
          emailVerified: false,
          verificationSent: true,
          firebaseIdToken: '',
          googleAccessToken: ''
        };
      } catch (signInErr) {
        if (signInErr?.code === 'auth/wrong-password' || signInErr?.code === 'auth/invalid-credential') {
          throw new Error(
            'This email already exists in authentication records. Please use Login with your password, or verify with a different active email.'
          );
        }
        throw new Error(formatFirebaseAuthError(signInErr, cleanEmail));
      }
    }

    throw new Error(formatFirebaseAuthError(err, cleanEmail));
  }
}

export async function resendFirebaseVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error('No pending registration session found. Please submit your details again.');
  }
  await auth.currentUser.reload();
  if (auth.currentUser.emailVerified) {
    return {
      emailVerified: true,
      firebaseIdToken: await auth.currentUser.getIdToken(true),
      email: auth.currentUser.email || ''
    };
  }
  await sendEmailVerification(auth.currentUser);
  return {
    emailVerified: false,
    firebaseIdToken: '',
    email: auth.currentUser.email || ''
  };
}

export async function checkAndCompleteFirebaseEmailVerification() {
  if (!auth.currentUser) {
    return { emailVerified: false, firebaseIdToken: '', email: '' };
  }
  await auth.currentUser.reload();
  const isVerified = Boolean(auth.currentUser.emailVerified);
  return {
    emailVerified: isVerified,
    firebaseIdToken: isVerified ? await auth.currentUser.getIdToken(true) : '',
    email: auth.currentUser.email || ''
  };
}

export async function signOutFirebaseGoogle() {
  try {
    await signOut(auth);
  } catch {
    // Ignore if already signed out
  }
}
