import "../../loadEnvironment";
import axios from "axios";

const slackWebhook = process.env.SLACK_WEBHOOK_URL;

export default async function notifySlack(message: string) {
    const notifyMessage = message ?? 'Unknown message error.';
    
    try {
        await axios.post(slackWebhook, {
            text: notifyMessage,
        });
    } catch (error) {
        console.error("Error sending notification to Slack:", error);
    }
};
