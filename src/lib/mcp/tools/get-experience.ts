import { defineTool } from "@lovable.dev/mcp-js";
import { fetchExperience } from "../data";

export default defineTool({
  name: "get_experience",
  title: "Work experience",
  description: "Return work experience — roles, companies, timelines, and descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const experience = await fetchExperience();
    return {
      content: [{ type: "text", text: JSON.stringify(experience, null, 2) }],
      structuredContent: { experience },
    };
  },
});
