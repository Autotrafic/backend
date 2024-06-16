import qrcode from 'qrcode-terminal';
import { Client, ClientSession, RemoteAuth } from 'whatsapp-web.js';
import { WhatsappSession } from '../../database/models/WhatsappSession/WhatsappSession';
import  MongoStore  from '../../types/MongoStore';

async function getSession(): Promise<Record<string, unknown> | null> {
  const session = await WhatsappSession.findOne({ _id: "whatsapp-session" });
  return session ? session.data : null;
}

async function saveSession(data: ClientSession): Promise<void> {
  await WhatsappSession.updateOne({ _id: "whatsapp-session" }, { data }, { upsert: true });
}

const store = new MongoStore();

const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
    ],
  },
  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
  authStrategy: new RemoteAuth({
    store: store,
    backupSyncIntervalMs: 300000,
  }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("authenticated", async (session) => {
  console.log("Authenticated");
  await saveSession(session);
});

(async () => {
  const session = await getSession();
  if (session) {
    (client as any).options.authStrategy.setup(client, { session });
  }
  client.initialize();
})();

export default client;
