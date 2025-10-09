import {
  createInitialState,
  getRootState,
  getUserState,
  getGeminiChatState,
} from "../state";

describe("Terminal State", () => {
  describe("createInitialState", () => {
    it("should create initial state with correct defaults", () => {
      const state = createInitialState();

      expect(state.isRoot).toBe(false);
      expect(state.currentPath).toBe("~");
      expect(state.prompt).toBe("rudra@portfolio");
      expect(state.theme.promptColor).toBe("text-green-400");
      expect(state.theme.textColor).toBe("text-white");
      expect(state.theme.errorColor).toBe("text-red-400");
      expect(state.theme.successColor).toBe("text-green-400");
      expect(state.chatSession).toBeUndefined();
      expect(state.isTyping).toBe(false);
    });

    it("should create a new object each time", () => {
      const state1 = createInitialState();
      const state2 = createInitialState();

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });

  describe("getRootState", () => {
    it("should return root state configuration", () => {
      const rootState = getRootState();

      expect(rootState.isRoot).toBe(true);
      expect(rootState.currentPath).toBe("/");
      expect(rootState.prompt).toBe("root@portfolio");
      expect(rootState.theme?.promptColor).toBe("text-red-400");
    });

    it("should return partial state", () => {
      const rootState = getRootState();

      // Should not have all properties of TerminalState
      expect(rootState).not.toHaveProperty("chatSession");
    });
  });

  describe("getUserState", () => {
    it("should return user state configuration", () => {
      const userState = getUserState();

      expect(userState.isRoot).toBe(false);
      expect(userState.currentPath).toBe("~");
      expect(userState.prompt).toBe("rudra@portfolio");
      expect(userState.theme?.promptColor).toBe("text-green-400");
    });

    it("should match initial state values", () => {
      const userState = getUserState();
      const initialState = createInitialState();

      expect(userState.isRoot).toBe(initialState.isRoot);
      expect(userState.currentPath).toBe(initialState.currentPath);
      expect(userState.prompt).toBe(initialState.prompt);
    });
  });

  describe("getGeminiChatState", () => {
    it("should return Gemini chat state configuration", () => {
      const chatState = getGeminiChatState();

      expect(chatState.prompt).toBe("Rudra-B");
      expect(chatState.currentPath).toBe("");
      expect(chatState.theme?.promptColor).toBe("text-purple-400");
    });

    it("should have distinct prompt color for AI chat", () => {
      const chatState = getGeminiChatState();
      const userState = getUserState();
      const rootState = getRootState();

      expect(chatState.theme?.promptColor).not.toBe(
        userState.theme?.promptColor
      );
      expect(chatState.theme?.promptColor).not.toBe(
        rootState.theme?.promptColor
      );
    });

    it("should have empty current path", () => {
      const chatState = getGeminiChatState();

      expect(chatState.currentPath).toBe("");
    });
  });

  describe("State transitions", () => {
    it("should transition from user to root state", () => {
      const initialState = createInitialState();
      const rootState = getRootState();

      const newState = { ...initialState, ...rootState };

      expect(newState.isRoot).toBe(true);
      expect(newState.prompt).toBe("root@portfolio");
      expect(newState.theme.promptColor).toBe("text-red-400");
    });

    it("should transition from root to user state", () => {
      const initialState = createInitialState();
      const rootState = getRootState();
      const currentState = { ...initialState, ...rootState };

      const userState = getUserState();
      const newState = { ...currentState, ...userState };

      expect(newState.isRoot).toBe(false);
      expect(newState.prompt).toBe("rudra@portfolio");
      expect(newState.theme.promptColor).toBe("text-green-400");
    });

    it("should transition to chat state while preserving other properties", () => {
      const initialState = createInitialState();
      const chatState = getGeminiChatState();

      const newState = { ...initialState, ...chatState };

      expect(newState.prompt).toBe("Rudra-B");
      expect(newState.isTyping).toBe(false); // Preserved from initial state
    });
  });
});
