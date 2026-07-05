import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProject } from "../data";

export default defineTool({
  name: "get_project",
  title: "Get case study",
  description: "Return the full case study for a given slug, including the full body content, metrics, and public URL.",
  inputSchema: {
    slug: z.string().min(1).describe("The project slug, e.g. 'meera-ai'. Use list_projects to discover slugs."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const project = await fetchProject(slug);
    if (!project) {
      return {
        content: [{ type: "text", text: `No project found with slug "${slug}".` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
      structuredContent: { project },
    };
  },
});
