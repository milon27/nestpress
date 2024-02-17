import { getMessaging } from "firebase-admin/messaging"
import { EnvConfig } from "../../../config/env.config"
import { myLogger } from "../../../config/logger"
import { BadRequestError } from "../../model/error.model"

// firebase notification service doc: https://firebase.google.com/docs/cloud-messaging/send-message
export const FCMService = {
    sendPushNotification: async (
        by: "token" | "topic",
        topicOrTokenList: string[], // topic or token or token array
        title: string,
        body: string,
        extra?: object
    ) => {
        if (EnvConfig.NODE_ENV === "test") {
            return
        }
        const payload = {
            data: {
                title,
                body,
                ...extra,
            },
        }
        // this is for when by is topic or token is single
        if (topicOrTokenList.length === 1 || by === "topic") {
            const singleTargetUser =
                by === "token" ? { token: topicOrTokenList[0] } : { topic: topicOrTokenList[0] }

            await getMessaging().send({
                ...singleTargetUser,
                data: {
                    ...payload.data,
                },
                android: {
                    priority: "high",
                    ttl: 60 * 60 * 24,
                },
            })
            return
        }

        // this is only when we are using token list for sending multi
        await getMessaging().sendEachForMulticast({
            tokens: topicOrTokenList,
            data: {
                ...payload.data,
            },
            android: {
                priority: "high",
                ttl: 60 * 60 * 24,
            },
        })
    },
    subscribeToTopic: async (topic: string, registrationToken: string[]) => {
        if (EnvConfig.NODE_ENV === "test") {
            return
        }
        try {
            if (registrationToken.length > 1000) {
                throw new BadRequestError("token list should be less than 1000")
            }
            await getMessaging().subscribeToTopic(registrationToken, topic)
            // console.log(`Successfully removed device ${registrationToken} from topic ${topic}`)
        } catch (error) {
            myLogger().error(`Error subscribe to ${topic}:`, error)
        }
    },
    unsubscribeFromTopic: async (topic: string, registrationToken: string[]) => {
        if (EnvConfig.NODE_ENV === "test") {
            return
        }
        try {
            if (registrationToken.length > 1000) {
                throw new BadRequestError("token list should be less than 1000")
            }
            await getMessaging().unsubscribeFromTopic(registrationToken, topic)
        } catch (error) {
            myLogger().error(`Error unsubscribe from topic ${topic}:`, error)
        }
    },
}
