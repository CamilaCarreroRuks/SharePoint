import { functions } from 'src/config/firebase/index'
import { httpsCallable } from 'firebase/functions'

const cFunctions = {
  notifyTooManyRequest: data => httpsCallable(functions, 'notifyTooManyRequest')(data)
}

export { cFunctions }
