import { defineTool } from "@lovable.dev/mcp-js";
import { fetchSiteInfo, fetchSkills } from "../data";

export default defineTool({
  name: "get_about",
  title: "About the site owner",
  description: "Return profile info: name, tagline, bio, location, email, socials, and skill groups.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const [siteInfo, skills] = await Promise.all([fetchSiteInfo(), fetchSkills()]);
    const about = { ...siteInfo, skills };
    return {
      content: [{ type: "text", text: JSON.stringify(about, null, 2) }],
      structuredContent: { about },
    };
  },
});
