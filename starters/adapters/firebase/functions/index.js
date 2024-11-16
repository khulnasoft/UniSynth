import { https } from "firebase-functions";
import unisynthApp from './server/entry-firebase.mjs';


export const app = https.onRequest(unisynthApp)
