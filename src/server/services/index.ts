import "../../loadEnvironment";
import axios, { Method } from "axios";
import { SENDCLOUD_API } from "../../utils/constants";
import notifySlack from "./notifier";

interface RequestOptions {
  endpoint: string;
  method: Method;
  body?: CreateLabelExportBody;
}

const username = process.env.SENDCLOUD_PUBLIC_KEY;
const password = process.env.SENDCLOUD_SECRET_KEY;

export async function makeSendcloudRequest({
  endpoint,
  method,
  body,
}: RequestOptions) {
  try {
    const response = await axios({
      url: `${SENDCLOUD_API}${endpoint}`,
      method: method,
      data: body,
      auth: {
        username: username,
        password: password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error making the request:", error);
    notifySlack(`Request options:
      Endpoint: ${endpoint}
      Method: ${method},
      Body: ${body}`);
    throw error;
  }
}
