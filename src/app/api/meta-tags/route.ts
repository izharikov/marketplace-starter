import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const { page, content } = await req.json();

    const result = await generateText({
        system: `Generate meta tags content (title, description and keywords) for the given page.
        Don't use current year. 
        Output as markdown, but don't use code blocks.`,
        model: openai('gpt-4.1'),
        messages: [
            { role: 'user' as const, content: `Page name: ${page.name}\nPage Content: ${JSON.stringify(content)}` },
        ],
    })

    return new Response(JSON.stringify({ result: result.text }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};
