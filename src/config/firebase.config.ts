import { ServiceAccount, cert, getApps, initializeApp } from "firebase-admin/app"
import serviceAccount from "../../resources/firebase/account-key.sample.json"
import { myLogger } from "./logger"

// * Rename account-key.sample.json to account-key.json
try {
    if (!getApps().length) {
        initializeApp({
            credential: cert(serviceAccount as ServiceAccount),
        })
        myLogger().info("Init firebase app")
    }
} catch (e) {
    myLogger().error(e)
}
