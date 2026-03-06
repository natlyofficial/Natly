import { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function md5(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Request body required" }) };
    }

    const { email, honeypot, language } = JSON.parse(event.body);

    if (honeypot) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email" }) };
    }

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_AUDIENCE_ID) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const lang = typeof language === "string" ? language.toLowerCase() : "en";

    // Native Mailchimp language code (controls email language)
    const mailchimpLangCode = lang.startsWith("es") ? "es" : "en";

    // Human-readable label used for merge field and tags
    const languageTag = lang.startsWith("es") ? "Spanish" : "English";

    const subscriberHash = md5(normalizedEmail);
    const authHeader = `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`;

    const memberUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}`;

    const upsertRes = await fetch(memberUrl, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: normalizedEmail,
        status_if_new: "pending",
        language: mailchimpLangCode,
        merge_fields: {
          LANGUAGE: languageTag,
        },
      }),
    });

    const upsertData = await upsertRes.json();

    if (!upsertRes.ok) {
      console.error("Mailchimp upsert error:", upsertData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to process subscription. Please try again." }),
      };
    }

    const tagsUrl = `${memberUrl}/tags`;
    const tagRes = await fetch(tagsUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: [
          { name: languageTag, status: "active" },
          { name: "Natly Website", status: "active" },
        ],
      }),
    });

    if (!tagRes.ok) {
      const tagData = await tagRes.json();
      console.error("Mailchimp tag error:", tagData);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Successfully subscribed! Check your email to confirm.",
      }),
    };
  } catch (err) {
    console.error("Newsletter function error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  }
};