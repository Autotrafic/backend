import "../../loadEnvironment";
import axios from "axios";

const slackWebhook = process.env.SLACK_WEBHOOK_URL;

const notifySlack = async (message: string) => {
    try {
        await axios.post(slackWebhook, {
            text: `Error occurred: ${message}`,
        });
    } catch (error) {
        console.error("Error sending notification to Slack:", error);
    }
};

export default notifySlack;
