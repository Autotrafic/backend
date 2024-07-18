import "../../loadEnvironment";
import axios from "axios";

const slackWebhook = process.env.SLACK_WEBHOOK_URL;

export default async function notifySlack(message: string) {
    try {
        await axios.post(slackWebhook, {
            text: message,
        });
    } catch (error) {
        console.error("Error sending notification to Slack:", error);
    }
};
