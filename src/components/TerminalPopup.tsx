"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalEngine } from "@/lib/terminal";
import { GitHubRepo } from "@/types";

interface TerminalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  repositories: GitHubRepo[];
  loading: boolean;
}

const TerminalPopup = ({
  isOpen,
  onClose,
  repositories,
}: TerminalPopupProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalEngine] = useState(() => new TerminalEngine());
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Update terminal engine with repositories when they change
  useEffect(() => {
    if (repositories && repositories.length > 0) {
      // Store repositories in terminal engine for use in commands
      terminalEngine.setRepositories(repositories);
    }
  }, [repositories, terminalEngine]);

  // Function to format terminal text with proper styling
  const formatTerminalText = (text: string) => {
    if (text.startsWith("🤖 Rudra-B:")) {
      // Remove the prefix for processing
      const content = text.replace("🤖 Rudra-B: ", "");

      // Split the text into lines for better processing
      const lines = content.split("\n");
      const processedLines = lines.map((line, lineIndex) => {
        // Skip empty lines
        if (line.trim() === "") {
          return <div key={lineIndex} className="h-2"></div>;
        }

        // Handle numbered list items (1., 2., etc.)
        const numberedMatch = line.match(/^(\d+)\.\s+\*\*([^*]+)\*\*:\s*(.+)$/);
        if (numberedMatch) {
          const [, number, projectName, description] = numberedMatch;
          return (
            <div key={lineIndex} className="mt-2 flex">
              <span className="mr-2 min-w-[1.5rem] font-bold text-yellow-400">
                {number}.
              </span>
              <div>
                <span className="font-bold text-cyan-400">{projectName}:</span>
                <span className="ml-2 text-gray-300">{description}</span>
              </div>
            </div>
          );
        }

        // Handle bullet points with bold text
        const bulletMatch = line.match(/^\s*•\s+\*\*([^*]+)\*\*:\s*(.+)$/);
        if (bulletMatch) {
          const [, projectName, description] = bulletMatch;
          return (
            <div key={lineIndex} className="mt-1 ml-4 flex">
              <span className="mr-2 text-blue-400">•</span>
              <div>
                <span className="font-bold text-cyan-400">{projectName}:</span>
                <span className="ml-2 text-gray-300">{description}</span>
              </div>
            </div>
          );
        }

        // Handle regular bullet points
        if (line.trim().startsWith("•")) {
          return (
            <div key={lineIndex} className="mt-1 ml-4">
              <span className="mr-2 text-blue-400">•</span>
              <span className="text-gray-300">
                {line.replace(/^\s*•\s*/, "")}
              </span>
            </div>
          );
        }

        // Split each line into parts for bold formatting
        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        return (
          <div key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                // Bold text - technical terms and important words
                const boldText = part.slice(2, -2);
                return (
                  <span key={partIndex} className="font-bold text-green-400">
                    {boldText}
                  </span>
                );
              } else {
                // Regular text
                return (
                  <span key={partIndex} className="text-gray-200">
                    {part}
                  </span>
                );
              }
            })}
          </div>
        );
      });

      return (
        <div>
          <div className="mb-2 flex items-center">
            <span className="mr-2 text-xl text-cyan-400">🤖</span>
            <span className="text-lg font-bold text-purple-400">Rudra-B:</span>
          </div>
          <div className="ml-6 leading-relaxed">{processedLines}</div>
        </div>
      );
    }

    // Return regular text for non-AI responses
    return <span>{text}</span>;
  };

  const executeCommand = async (command: string) => {
    if (command.trim()) {
      setCommandHistory((prev) => [...prev, command]);
    }

    // Show user input immediately
    const prompt = terminalEngine.getPrompt();
    setHistory((prev) => [...prev, `${prompt} ${command}`]);

    setCurrentInput("");
    setHistoryIndex(-1);

    // Check if we're in chat mode and it's a direct message
    if (
      terminalEngine.getState().chatSession?.isActive &&
      !command.startsWith("/") &&
      !command.startsWith("!") &&
      command.trim() !== "clear"
    ) {
      // Handle direct chat messages
      setIsTyping(true);

      // Don't add the typing indicator to history, just show it in UI

      try {
        const result = await terminalEngine.executeCommand(command);
        setIsTyping(false);

        // Add the AI response to history
        setHistory((prev) => [...prev, ...result.output, ""]);

        // Scroll to bottom after adding response
        setTimeout(() => {
          if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTo({
              top: terminalBodyRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);

        // Restore focus to input after response
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 200);
      } catch {
        setIsTyping(false);
        setHistory((prev) => [
          ...prev,
          "Error: Failed to get response from Gemini",
          "",
        ]);

        // Scroll to bottom after error
        setTimeout(() => {
          if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTo({
              top: terminalBodyRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);

        // Restore focus to input after error
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 200);
      }
    } else {
      // Handle regular commands
      try {
        const result = await terminalEngine.executeCommand(command);

        if (result.clear) {
          setHistory([
            "Welcome to Rudra's Terminal!",
            "Type help for available commands.",
            "",
          ]);
        } else {
          setHistory((prev) => [...prev, ...result.output, ""]);

          // Handle download animation and trigger
          if (result.startDownload) {
            // Determine if it's code or resume command
            const isCodeCommand = command.trim() === "code";

            // Create smooth, granular progress animation
            let currentProgress = 0;
            const totalDuration = 4000; // 4 seconds total
            const updateInterval = 80; // Update every 80ms
            const totalSteps = totalDuration / updateInterval;
            const progressIncrement = 100 / totalSteps;

            const progressMessages = isCodeCommand
              ? [
                  { range: [0, 10], message: "Initializing..." },
                  { range: [10, 25], message: "Connecting to server..." },
                  { range: [25, 40], message: "Fetching project files..." },
                  { range: [40, 60], message: "Compressing files..." },
                  { range: [60, 80], message: "Creating ZIP archive..." },
                  { range: [80, 95], message: "Preparing download..." },
                  { range: [95, 100], message: "Finalizing package..." },
                ]
              : [
                  { range: [0, 10], message: "Initializing..." },
                  { range: [10, 25], message: "Connecting to server..." },
                  { range: [25, 40], message: "Locating resume file..." },
                  { range: [40, 60], message: "Downloading resume data..." },
                  { range: [60, 80], message: "Processing document..." },
                  { range: [80, 95], message: "Preparing file transfer..." },
                  { range: [95, 100], message: "Finalizing download..." },
                ];

            const getCurrentMessage = (progress: number) => {
              const messageObj = progressMessages.find(
                (msg) => progress >= msg.range[0] && progress < msg.range[1]
              );
              return messageObj ? messageObj.message : "Downloading...";
            };

            const updateProgress = () => {
              currentProgress += progressIncrement;

              if (currentProgress > 100) {
                currentProgress = 100;
              }

              setHistory((prev) => {
                const updatedHistory = [...prev];
                const progressLineIndex = updatedHistory.findIndex(
                  (line) => line.includes("░") || line.includes("█")
                );

                if (progressLineIndex !== -1) {
                  const totalBlocks = 50;
                  const filledBlocks = Math.floor(
                    (currentProgress / 100) * totalBlocks
                  );
                  const emptyBlocks = totalBlocks - filledBlocks;
                  const progressBar =
                    "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
                  const percentage = Math.floor(currentProgress);
                  const message = getCurrentMessage(currentProgress);

                  updatedHistory[progressLineIndex] =
                    `<span class="text-blue-300">│</span> <span class="text-purple-300">${progressBar}</span>     <span class="text-blue-300">│</span>`;
                  updatedHistory[progressLineIndex + 1] =
                    `<span class="text-blue-300">│</span> <span class="text-yellow-400">${percentage}%</span> <span class="text-gray-400">${message}</span>                                   <span class="text-blue-300">│</span>`;
                }
                return updatedHistory;
              });

              if (currentProgress < 100) {
                setTimeout(updateProgress, updateInterval);
              } else {
                // Complete download
                setTimeout(() => {
                  setHistory((prev) => {
                    const updatedHistory = [...prev];
                    const progressLineIndex = updatedHistory.findIndex(
                      (line) => line.includes("█") || line.includes("░")
                    );
                    if (progressLineIndex !== -1) {
                      updatedHistory[progressLineIndex + 1] =
                        '<span class="text-blue-300">│</span> <span class="text-green-400">100%</span> <span class="text-gray-300">Downloaded</span>                                       <span class="text-blue-300">│</span>';
                    }

                    if (isCodeCommand) {
                      return [
                        ...updatedHistory,
                        "",
                        '<span class="text-green-400">✅ Project files packaged successfully!</span>',
                        '<span class="text-cyan-300">� Check your Downloads folder for: <span class="text-yellow-300">Project_Files.zip</span></span>',
                        '<span class="text-gray-400">💡 Extract the ZIP to access all 4 files in one folder</span>',
                        "",
                      ];
                    } else {
                      return [
                        ...updatedHistory,
                        "",
                        '<span class="text-green-400">✅ Resume download initiated!</span>',
                        '<span class="text-cyan-300">📁 Check your Downloads folder for: <span class="text-yellow-300">Rudra_Narayana_Sahoo_Resume.pdf</span></span>',
                        "",
                      ];
                    }
                  });

                  // Trigger actual download
                  if (isCodeCommand) {
                    // Download all files as a ZIP
                    import("jszip").then(async (JSZip) => {
                      const zip = new JSZip.default();

                      const files = [
                        {
                          href: "/downloads/New Doc X.txt",
                          name: "New Doc X.txt",
                        },
                        {
                          href: "/downloads/New Text 1.txt",
                          name: "New Text 1.txt",
                        },
                        {
                          href: "/downloads/New Text 2.txt",
                          name: "New Text 2.txt",
                        },
                        {
                          href: "/downloads/New Text.txt",
                          name: "New Text.txt",
                        },
                      ];

                      // Fetch all files and add to ZIP
                      for (const file of files) {
                        try {
                          const response = await fetch(file.href);
                          const blob = await response.blob();
                          zip.file(file.name, blob);
                        } catch (error) {
                          console.error(`Error fetching ${file.name}:`, error);
                        }
                      }

                      // Generate ZIP and download
                      const content = await zip.generateAsync({
                        type: "blob",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(content);
                      link.download = "Project_Files.zip";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(link.href);
                    });
                  } else {
                    // Download resume
                    const link = document.createElement("a");
                    link.href = "/resume_rns.pdf";
                    link.download = "Rudra_Narayana_Sahoo_Resume.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }, 500);
              }
            };

            // Start the progressive animation after initial delay
            setTimeout(updateProgress, 800);
          }

          // Handle submitting animation and completion
          if (result.startSubmitting) {
            // Create smooth, granular submission animation
            let currentProgress = 0;
            const totalDuration = 3500; // 3.5 seconds total
            const updateInterval = 70; // Update every 70ms
            const totalSteps = totalDuration / updateInterval;
            const progressIncrement = 100 / totalSteps;

            const submissionMessages = [
              { range: [0, 15], message: "Initializing..." },
              { range: [15, 30], message: "Validating contact info..." },
              { range: [30, 50], message: "Formatting message..." },
              { range: [50, 75], message: "Sending notification..." },
              { range: [75, 90], message: "Processing submission..." },
              { range: [90, 100], message: "Finalizing contact..." },
            ];

            const getCurrentSubmissionMessage = (progress: number) => {
              const messageObj = submissionMessages.find(
                (msg) => progress >= msg.range[0] && progress < msg.range[1]
              );
              return messageObj ? messageObj.message : "Submitting...";
            };

            const updateSubmissionProgress = () => {
              currentProgress += progressIncrement;

              if (currentProgress > 100) {
                currentProgress = 100;
              }

              setHistory((prev) => {
                const updatedHistory = [...prev];
                const progressLineIndex = updatedHistory.findIndex(
                  (line) => line.includes("░") || line.includes("█")
                );

                if (progressLineIndex !== -1) {
                  const totalBlocks = 50;
                  const filledBlocks = Math.floor(
                    (currentProgress / 100) * totalBlocks
                  );
                  const emptyBlocks = totalBlocks - filledBlocks;
                  const progressBar =
                    "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
                  const percentage = Math.floor(currentProgress);
                  const message = getCurrentSubmissionMessage(currentProgress);

                  updatedHistory[progressLineIndex] =
                    `<span class="text-blue-300">│</span> <span class="text-purple-300">${progressBar}</span>     <span class="text-blue-300">│</span>`;
                  updatedHistory[progressLineIndex + 1] =
                    `<span class="text-blue-300">│</span> <span class="text-yellow-400">${percentage}%</span> <span class="text-gray-400">${message}</span>                                   <span class="text-blue-300">│</span>`;
                }
                return updatedHistory;
              });

              if (currentProgress < 100) {
                setTimeout(updateSubmissionProgress, updateInterval);
              } else {
                // Complete submission - get the completed form data from engine state
                setTimeout(() => {
                  const engineState = terminalEngine.getState();
                  const completedForm = engineState.completedContactForm;

                  setHistory((prev) => {
                    const updatedHistory = [...prev];
                    const progressLineIndex = updatedHistory.findIndex(
                      (line) => line.includes("█") || line.includes("░")
                    );
                    if (progressLineIndex !== -1) {
                      updatedHistory[progressLineIndex + 1] =
                        '<span class="text-blue-300">│</span> <span class="text-green-400">100%</span> <span class="text-gray-300">Submitted</span>                                       <span class="text-blue-300">│</span>';
                    }

                    const completionMessages = [
                      "",
                      '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
                      '<span class="text-cyan-400">║</span>                    <span class="text-green-300 font-bold">CONTACT SUBMITTED</span>                          <span class="text-cyan-400">║</span>',
                      '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
                      "",
                      '<span class="text-green-400">📧 Thank you for reaching out!</span>',
                      "",
                      '<span class="text-yellow-300">Contact Summary:</span>',
                    ];

                    if (completedForm) {
                      completionMessages.push(
                        `<span class="text-cyan-300">  • Name:</span> <span class="text-white">${completedForm.name}</span>`,
                        `<span class="text-cyan-300">  • Contact Method:</span> <span class="text-white">${completedForm.contactOption}</span>`,
                        `<span class="text-cyan-300">  • Contact Details:</span> <span class="text-white">${completedForm.contactDetails}</span>`,
                        `<span class="text-cyan-300">  • Message:</span> <span class="text-white">${completedForm.message}</span>`
                      );
                    }

                    completionMessages.push(
                      "",
                      '<span class="text-purple-300">🚀 I\'ll get back to you soon! You can also reach me directly at:</span>',
                      '<span class="text-blue-300">  📧 Email: rudranarayanaknr@gmail.com</span>',
                      '<span class="text-blue-300">  💼 LinkedIn: https://www.linkedin.com/in/rudra-narayana-sahoo-695342288/</span>',
                      '<span class="text-blue-300">  📱 GitHub: github.com/rudra-sah00</span>',
                      "",
                      '<span class="text-green-400">🏠 Returning to home directory...</span>',
                      ""
                    );

                    return [...updatedHistory, ...completionMessages];
                  });
                }, 500);
              }
            };

            // Start the submission animation after initial delay
            setTimeout(updateSubmissionProgress, 800);
          }
        }
      } catch {
        setHistory((prev) => [...prev, "Error: Command execution failed", ""]);
      }
    }

    // Auto-scroll to bottom
    setTimeout(() => {
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop =
          terminalBodyRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const clearTerminal = () => {
    terminalEngine.resetState();
    setHistory([
      "Welcome to Rudra's Terminal!",
      "Type help for available commands.",
      "",
    ]);
    setCurrentInput("");
    setCommandHistory([]);
    setHistoryIndex(-1);
  };

  const handleClose = () => {
    // Clear all history when closing
    clearTerminal();
    onClose();
  };

  const handleMinimize = () => {
    // Just toggle minimize state, keep history intact
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (isOpen) {
      setHistory([
        "Welcome to Rudra's Terminal!",
        "Type help for available commands.",
        "",
      ]);
      // Focus the input when terminal opens
      setTimeout(() => {
        if (inputRef.current && !isMinimized) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    // Auto-focus input when not minimized
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  // Prevent body scrolling when terminal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow style
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      // Get current scroll position
      const scrollY = window.scrollY;

      // Disable scrolling on the body with multiple methods
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Prevent mobile zoom on input focus
      const viewport = document.querySelector("meta[name=viewport]");
      const originalViewport = viewport?.getAttribute("content");

      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        );
      }

      // Add touch event listeners to prevent scrolling - but be more selective
      const preventTouchMove = (e: TouchEvent) => {
        // Only prevent if the target is the backdrop or body
        const target = e.target as Element;

        // Allow all events within the terminal component tree
        if (target.closest(".terminal-container")) {
          return;
        }

        // Prevent only on backdrop
        if (
          target.classList.contains("terminal-backdrop") ||
          target === document.body
        ) {
          e.preventDefault();
        }
      };

      const preventWheel = (e: WheelEvent) => {
        // Only prevent wheel events on the backdrop
        const target = e.target as Element;

        // Allow all events within the terminal component tree
        if (target.closest(".terminal-container")) {
          return;
        }

        // Prevent only on backdrop
        if (
          target.classList.contains("terminal-backdrop") ||
          target === document.body
        ) {
          e.preventDefault();
        }
      };

      // Add event listeners with passive: false only where needed
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });
      document.addEventListener("wheel", preventWheel, { passive: false });

      // Cleanup function to restore scrolling and viewport when terminal closes
      return () => {
        // Restore body styles first
        document.body.style.overflow = originalOverflow || "";
        document.body.style.position = originalPosition || "";
        document.body.style.top = originalTop || "";
        document.body.style.width = originalWidth || "";

        // Remove event listeners
        document.removeEventListener("touchmove", preventTouchMove);
        document.removeEventListener("wheel", preventWheel);

        // Restore viewport
        if (viewport && originalViewport) {
          viewport.setAttribute("content", originalViewport);
        }

        // Restore scroll position after styles are reset
        setTimeout(() => {
          window.scrollTo(0, scrollY);
          // Failsafe: always re-enable scrolling
          document.body.style.overflow = "";
        }, 0);
      };
    }
  }, [isOpen]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalBodyRef.current) {
      const scrollToBottom = () => {
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop =
            terminalBodyRef.current.scrollHeight;
        }
      };

      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(scrollToBottom);
    }
  }, [history, isTyping]);

  // Smooth scroll to bottom when typing state changes
  useEffect(() => {
    if (terminalBodyRef.current && isTyping) {
      const scrollToBottom = () => {
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTo({
            top: terminalBodyRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      };

      // Small delay to ensure content is rendered
      setTimeout(scrollToBottom, 50);
    }
  }, [isTyping]);

  if (!isOpen) return null;

  const prompt = terminalEngine.getPrompt();
  const promptColor = terminalEngine.getPromptColor();

  return (
    <div className="terminal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`terminal-container flex w-full max-w-4xl flex-col rounded-lg bg-black shadow-2xl transition-all duration-300 ${
          isMinimized ? "h-12" : "h-[70vh]"
        }`}
      >
        {/* Terminal Header - Mac Style */}
        <div className="flex items-center justify-between rounded-t-lg bg-black px-4 py-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClose}
              className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600"
              title="Close and Clear History"
            ></button>
            <button
              onClick={handleClose}
              className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
              title="Close and Clear History"
            ></button>
            <button
              onClick={handleMinimize}
              className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600"
              title="Minimize"
            ></button>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-white">
              Terminal — rudra@portfolio
            </span>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
          <div className="flex flex-1 flex-col overflow-hidden rounded-b-lg bg-black">
            {/* Terminal Output */}
            <div
              ref={terminalBodyRef}
              className="scrollbar-hide flex-1 overflow-auto p-4 font-mono text-sm text-white"
            >
              {history.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line.includes("<span") ? (
                    <div dangerouslySetInnerHTML={{ __html: line }} />
                  ) : line.startsWith("🤖 Rudra-B:") ? (
                    // Special formatting for AI responses
                    <div className="my-2">{formatTerminalText(line)}</div>
                  ) : (
                    <span
                      className={
                        line.startsWith("Error:")
                          ? "text-red-400"
                          : line.startsWith("👋")
                            ? "text-yellow-300"
                            : line.startsWith("🌟 Connected")
                              ? "text-green-400"
                              : line.startsWith("✨")
                                ? "text-purple-300"
                                : line.includes("$") && !line.startsWith("🌟")
                                  ? "text-blue-300"
                                  : "text-white"
                      }
                    >
                      {line}
                    </span>
                  )}
                </div>
              ))}
              {/* Typing Indicator */}
              {isTyping && (
                <div className="mb-2 flex items-center space-x-1">
                  <span className="animate-pulse text-cyan-400">●</span>
                  <span className="animate-pulse text-purple-400 delay-100">
                    ●
                  </span>
                  <span className="animate-pulse text-yellow-400 delay-200">
                    ●
                  </span>
                  <span className="animate-pulse text-green-400 delay-300">
                    ●
                  </span>
                  <span className="ml-2 text-blue-300">
                    Rudra-B thinking...
                  </span>
                </div>
              )}
              {/* Current Input Line - Only show when not typing */}
              {!isTyping && (
                <div className="flex items-center">
                  <span className={`${promptColor} mr-2`}>{prompt}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border-none bg-transparent text-base text-white outline-none"
                    style={{
                      caretColor: "white",
                      fontSize: "16px", // Prevents zoom on iOS
                      WebkitAppearance: "none",
                      borderRadius: 0,
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPopup;
