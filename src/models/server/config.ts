import env from "@/env";
import {
	Client,
	Avatars,
	Storage,
	Databases,
	Users,
	Account,
} from "node-appwrite";

let client = new Client();

client
	.setEndpoint(env.appwrite.endpoint) // Your API Endpoint
	.setProject(env.appwrite.projectId) // Your project ID
	.setKey(env.appwrite.apikey) // Your secret API key
	.setSession("");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const users = new Users(client);

export { client, account, databases, users, storage, avatars };
