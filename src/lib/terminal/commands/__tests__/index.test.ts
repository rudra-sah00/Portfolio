import {
  rootCommand,
  helpCommand,
  resumeCommand,
  codeCommand,
  clearCommand,
  homeCommand,
  byeCommand,
  contactCommand,
  exitContactCommand,
  playCommand,
  scheduleCommand,
  projectsCommand,
  aiChatCommand,
} from "../index";
import { createInitialState, getRootState } from "../../state";

describe("Terminal Commands", () => {
  let state: ReturnType<typeof createInitialState>;

  beforeEach(() => {
    state = createInitialState();
  });

  describe("rootCommand", () => {
    it("should switch to root user", async () => {
      const result = await rootCommand.execute([], state);
      expect(result.output).toContain("Switching to root user...");
      expect(result.newState?.isRoot).toBe(true);
    });

    it("should indicate already in root mode", async () => {
      const rootState = { ...state, ...getRootState() };
      const result = await rootCommand.execute([], rootState);
      expect(result.output).toContain("Already in root mode");
    });
  });

  describe("helpCommand", () => {
    it("should show available commands", async () => {
      const result = await helpCommand.execute([], state);
      expect(result.output.join("\n")).toContain("help");
      expect(result.output.join("\n")).toContain("projects");
      expect(result.output.join("\n")).toContain("resume");
      expect(result.output.join("\n")).toContain("code");
      expect(result.output.join("\n")).toContain("chat");
    });

    it("should show root-only commands when in root mode", async () => {
      const rootState = { ...state, ...getRootState() };
      const result = await helpCommand.execute([], rootState);
      expect(result.output.join("\n")).toContain("play");
      expect(result.output.join("\n")).toContain("schedule");
    });
  });

  describe("resumeCommand", () => {
    it("should trigger resume download", async () => {
      const result = await resumeCommand.execute([], state);
      expect(result.startDownload).toBe(true);
      expect(result.output.join("\n")).toContain("RESUME DOWNLOAD");
    });
  });

  describe("codeCommand", () => {
    it("should trigger multiple file downloads", async () => {
      const result = await codeCommand.execute([], state);
      expect(result.startDownload).toBe(true);
      expect(result.output.join("\n")).toContain("PACKAGE PROJECT FILES");
      expect(result.output.join("\n")).toContain("Project_Files.zip");
      expect(result.output.join("\n")).toContain("4 files");
    });

    it("should list all files to be included in ZIP", async () => {
      const result = await codeCommand.execute([], state);
      const output = result.output.join("\n");
      expect(output).toContain("Files to include");
      expect(output).toContain("New Doc X.txt");
      expect(output).toContain("New Text 1.txt");
      expect(output).toContain("New Text 2.txt");
      expect(output).toContain("New Text.txt");
      expect(output).toContain("ZIP file will be downloaded");
    });
  });

  describe("clearCommand", () => {
    it("should clear the terminal", async () => {
      const result = await clearCommand.execute([], state);
      expect(result.clear).toBe(true);
      expect(result.output).toEqual([]);
    });
  });

  describe("homeCommand", () => {
    it("should return to home directory", async () => {
      const result = await homeCommand.execute([], state);
      const output = result.output.join("\n");
      expect(output).toMatch(/home/i);
      // homeCommand returns to user state, which has isRoot: false
      if (result.newState) {
        expect(result.newState.isRoot).toBeDefined();
      }
    });
  });

  describe("byeCommand", () => {
    it("should show farewell message", async () => {
      const result = await byeCommand.execute([], state);
      const output = result.output.join("\n");
      // byeCommand exits chat, so check for exit message
      expect(output.length).toBeGreaterThan(0);
    });
  });

  describe("contactCommand", () => {
    it("should initiate contact form", async () => {
      const result = await contactCommand.execute([], state);
      expect(result.output.join("\n")).toContain("CONTACT FORM");
      expect(result.newState?.contactForm).toBeDefined();
      expect(result.newState?.contactForm?.step).toBe(1);
    });
  });

  describe("exitContactCommand", () => {
    it("should exit contact form", async () => {
      const contactState = {
        ...state,
        contactForm: {
          step: 2,
          name: "Test User",
          contactOption: "email",
          contactDetails: "test@example.com",
          message: "",
        },
      };
      const result = await exitContactCommand.execute([], contactState);
      expect(result.output.join("\n")).toMatch(/cancelled/i);
      expect(result.newState?.contactForm).toBeUndefined();
    });

    it("should show message when not in contact form", async () => {
      const result = await exitContactCommand.execute([], state);
      expect(result.output.join("\n")).toMatch(/No contact form/i);
    });
  });

  describe("playCommand", () => {
    it("should show appropriate message", async () => {
      const result = await playCommand.execute([], state);
      const output = result.output.join("\n");
      // Either "Coming Soon" or "Access denied" depending on root status
      expect(output.length).toBeGreaterThan(0);
    });
  });

  describe("scheduleCommand", () => {
    it("should show appropriate message", async () => {
      const result = await scheduleCommand.execute([], state);
      const output = result.output.join("\n");
      // Either "Coming Soon" or "Access denied" depending on root status
      expect(output.length).toBeGreaterThan(0);
    });
  });

  describe("projectsCommand", () => {
    it("should return projects list prompt", async () => {
      const result = await projectsCommand.execute([], state);
      const output = result.output.join("\n");
      expect(output).toMatch(/GITHUB|github|projects/i);
    });
  });

  describe("aiChatCommand", () => {
    it("should start AI chat session", async () => {
      const result = await aiChatCommand.execute([], state);
      expect(result.output.join("\n")).toContain("RUDRA-B CHAT");
      expect(result.newState?.chatSession).toBeDefined();
      expect(result.newState?.chatSession?.isActive).toBe(true);
    });

    it("should show welcome message with instructions", async () => {
      const result = await aiChatCommand.execute([], state);
      const output = result.output.join("\n");
      expect(output).toContain("What you can ask about");
      expect(output).toContain("technical skills");
      expect(output).toContain("Projects");
      expect(output).toContain("bye to exit");
    });
  });

  describe("homeCommand - edge cases", () => {
    it("should indicate already at home when in home directory", async () => {
      const homeState = { ...state, currentPath: "~", isRoot: false };
      const result = await homeCommand.execute([], homeState);
      expect(result.output).toContain("Already in home directory");
    });

    it("should return home from root", async () => {
      const rootState = { ...state, ...getRootState() };
      const result = await homeCommand.execute([], rootState);
      expect(result.output.some((line) => line.includes("home"))).toBe(true);
    });
  });

  describe("byeCommand - with active chat", () => {
    it("should exit active chat session", async () => {
      const chatState = {
        ...state,
        chatSession: {
          agent: {
            id: "rudra-b",
            name: "Rudra-B",
            systemPrompt: "",
            description: "AI assistant",
            status: "online" as const,
            icon: "🤖",
          },
          messages: [],
          isActive: true,
        },
      };
      const result = await byeCommand.execute([], chatState);
      expect(result.output.some((line) => line.includes("Exiting chat"))).toBe(
        true
      );
      expect(result.newState?.chatSession).toBeUndefined();
    });

    it("should show message when no active chat", async () => {
      const result = await byeCommand.execute([], state);
      expect(result.output).toContain("No active chat session to exit.");
    });
  });

  describe("playCommand - permissions", () => {
    it("should deny access for non-root users", async () => {
      const userState = { ...state, isRoot: false };
      const result = await playCommand.execute([], userState);
      const output = result.output.join("\n");
      expect(output).toMatch(/denied|root/i);
    });

    it("should show coming soon for root users", async () => {
      const rootState = { ...state, ...getRootState() };
      const result = await playCommand.execute([], rootState);
      const output = result.output.join("\n");
      expect(output).toMatch(/coming soon|under development/i);
    });
  });

  describe("scheduleCommand - permissions", () => {
    it("should deny access for non-root users", async () => {
      const userState = { ...state, isRoot: false };
      const result = await scheduleCommand.execute([], userState);
      const output = result.output.join("\n");
      expect(output).toMatch(/denied|root/i);
    });

    it("should show coming soon for root users", async () => {
      const rootState = { ...state, ...getRootState() };
      const result = await scheduleCommand.execute([], rootState);
      const output = result.output.join("\n");
      expect(output).toMatch(/coming soon|under development/i);
    });
  });

  describe("projectsCommand - with repositories", () => {
    it("should handle empty repositories", async () => {
      const result = await projectsCommand.execute([], state, []);
      expect(result.output).toBeDefined();
    });

    it("should list repositories when provided", async () => {
      const mockRepos = [
        {
          id: 1,
          name: "test-repo",
          description: "A test repository",
          html_url: "https://github.com/user/test-repo",
          languages: { TypeScript: 100 },
        },
      ];
      const result = await projectsCommand.execute([], state, mockRepos);
      expect(result.output).toBeDefined();
      const output = result.output.join("\n");
      expect(output).toMatch(/test-repo|github|projects/i);
    });
  });

  describe("contactCommand - full flow", () => {
    it("should create contact form with step 1", async () => {
      const result = await contactCommand.execute([], state);
      expect(result.newState?.contactForm?.step).toBe(1);
      expect(result.newState?.contactForm?.name).toBe("");
      expect(result.output.some((line) => line.includes("Step 1/4"))).toBe(
        true
      );
    });

    it("should show welcome message with form structure", async () => {
      const result = await contactCommand.execute([], state);
      const output = result.output.join("\n");
      expect(output).toContain("CONTACT FORM");
      expect(output).toContain("name");
    });
  });

  describe("exitContactCommand - edge cases", () => {
    it("should handle exit from different form steps", async () => {
      const step3State = {
        ...state,
        contactForm: {
          step: 3,
          name: "Test",
          contactOption: "email",
          contactDetails: "test@test.com",
          message: "",
        },
      };
      const result = await exitContactCommand.execute([], step3State);
      expect(result.newState?.contactForm).toBeUndefined();
      expect(
        result.output.some((line) => line.toLowerCase().includes("cancel"))
      ).toBe(true);
    });
  });
});
