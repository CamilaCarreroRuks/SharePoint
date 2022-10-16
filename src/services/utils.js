import { storageGet } from './storage'
import { messaging, VAPID_KEY } from 'src/config/firebase'
import { getToken } from 'firebase/messaging'

export function getAuthHeaders (contentType) {
  return {
    headers: {
      Authorization: storageGet('access_token'),
      'content-type': contentType || 'application/json'
    }
  }
}

export async function getMessagingToken () {
  try {
    let tokenResponse = null
    if (location.hostname === 'localhost') {
      tokenResponse = await getToken(messaging, { vapidKey: VAPID_KEY })
    } else {
      const swRegistration = await navigator.serviceWorker.ready
      tokenResponse = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration
      })
    }
    return tokenResponse
  } catch (e) {
    console.error('Error Token', e)
    return null
  }
}

