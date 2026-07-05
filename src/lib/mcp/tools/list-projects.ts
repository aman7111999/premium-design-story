import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProjects } from "../data";

export default defineTool({
  name: "list_projects",
  title: "List case studies",
  description: "List published product design case studies with title, company, role, category, summary, and key metrics.",
  inputSchema: {
    featuredOnly: z.boolean().optional().describe("If true, return only featured projects."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ featuredOnly }) => {
    const items = await fetchProjects({ featuredOnly });
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { projects: items },
    };
  },
});
