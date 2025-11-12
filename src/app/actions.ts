// This file is being deprecated for PIX generation.
// The logic has been moved to an API route at /api/create-vision/route.ts
// to avoid server/client context conflicts.
// The trackSale logic has been removed as tracking should be handled by the payment gateway via webhooks.

'use server';

import { getAdminFirestore } from '@/firebase/admin-sdk';
