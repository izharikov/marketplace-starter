import { NextRequest } from "next/server";

const DEFAULT_TOKEN_URL = process.env.SITECORE_TOKEN_URL || "https://auth.sitecorecloud.io/oauth/token";
const DEPLOYMENTS_URL =
	"https://xmclouddeploy-api.sitecorecloud.io/api/deployments/v3?pageNumber=1&pageSize=10&statuses=0&statuses=1&statuses=2&statuses=3&statuses=4";

async function getSitecoreToken(clientId: string, clientSecret: string, tokenUrl = DEFAULT_TOKEN_URL) {
	const body = new URLSearchParams();
	body.set("grant_type", "client_credentials");
	body.set("client_id", clientId);
	body.set("client_secret", clientSecret);
    body.set("audience", "https://api.sitecorecloud.io");

	const res = await fetch(tokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: body.toString(),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`token request failed: ${res.status} ${res.statusText} ${text}`);
	}

	const json = await res.json();
	if (!json.access_token) throw new Error("no access_token in token response");
	return json.access_token as string;
}

async function fetchDeployments(bearerToken: string) {
	const res = await fetch(DEPLOYMENTS_URL, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${bearerToken}`,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`deployments request failed: ${res.status} ${res.statusText} ${text}`);
	}

	return res.json();
}

export const GET = async (req: NextRequest) => {
	try {
		const clientId = process.env.SITECORE_CLIENT_ID;
		const clientSecret = process.env.SITECORE_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			return new Response(JSON.stringify({ error: "Missing SITECORE_CLIENT_ID or SITECORE_CLIENT_SECRET" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const token = await getSitecoreToken(clientId, clientSecret);
		const deployments = await fetchDeployments(token);

		return new Response(JSON.stringify(deployments), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		const message = err?.message || String(err);
		return new Response(JSON.stringify({ error: message }), {
			status: 502,
			headers: { "Content-Type": "application/json" },
		});
	}
};
