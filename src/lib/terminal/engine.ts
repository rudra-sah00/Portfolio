import { Command, CommandResult, TerminalState, ContactForm } from './types';
import { createInitialState, getRootState } from './state';
import { rootCommand, helpCommand, resumeCommand, clearCommand, aiChatCommand, homeCommand, byeCommand, contactCommand, exitContactCommand, playCommand, scheduleCommand } from './commands';
import { GeminiAPI } from './chat/gemini';

const geminiAPI = new GeminiAPI('AIzaSyA_dv4JMDA8FWaiiib_lx4Hqrjwe91JbVo');

export class TerminalEngine {
  private commands: Map<string, Command> = new Map();
  private state: TerminalState;

  constructor() {
    this.state = createInitialState();
    this.registerCommands();
  }

  private registerCommands(): void {
    const commands = [rootCommand, helpCommand, resumeCommand, clearCommand, aiChatCommand, homeCommand, byeCommand, contactCommand, exitContactCommand, playCommand, scheduleCommand];
    commands.forEach(cmd => {
      this.commands.set(cmd.name, cmd);
    });
  }

  public async executeCommand(input: string): Promise<CommandResult> {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      return { output: [] };
    }

    const parts = trimmedInput.split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);

    // Handle password prompt
    if (this.state.passwordPrompt && this.state.passwordPrompt.isActive) {
      const prompt = this.state.passwordPrompt;
      
      if (trimmedInput === prompt.expectedPassword) {
        // Password correct
        if (prompt.command === 'root') {
          this.state.passwordPrompt = undefined;
          const result = {
            output: [
              '<span class="text-green-400">✅ Authentication successful</span>',
              'Switching to root user...',
              '⚠️  You now have root privileges'
            ],
            newState: getRootState()
          };
          this.state = { ...this.state, ...result.newState };
          return result;
        }
      } else {
        // Password incorrect
        this.state.passwordPrompt = undefined;
        return {
          output: [
            '<span class="text-red-400">❌ Authentication failed</span>',
            '<span class="text-red-300">su: Authentication failure</span>',
            '<span class="text-gray-400">Incorrect password</span>'
          ]
        };
      }
    }

    // Handle contact form flow
    if (this.state.contactForm) {
      // Check if user wants to exit
      if (trimmedInput === 'exit') {
        const command = this.commands.get('exit');
        if (command) {
          const result = await command.execute(args, this.state);
          if (result.newState) {
            this.state = { ...this.state, ...result.newState };
          }
          return result;
        }
      }

      // Handle contact form steps
      const contactForm = this.state.contactForm;
      
      if (contactForm.step === 1) {
        // Step 1: Collecting name
        this.state.contactForm = {
          ...contactForm,
          name: trimmedInput,
          step: 2
        };
        
        return {
          output: [
            `<span class="text-green-400">✓</span> <span class="text-cyan-300">Name:</span> <span class="text-white">${trimmedInput}</span>`,
            '',
            '<span class="text-cyan-300">Step 2/4: What is your preferred contact method?</span>',
            '<span class="text-yellow-200">  (e.g., email, LinkedIn, phone, WhatsApp, etc.)</span>',
            ''
          ]
        };
      } else if (contactForm.step === 2) {
        // Step 2: Collecting contact option
        this.state.contactForm = {
          ...contactForm,
          contactOption: trimmedInput,
          step: 3
        };
        
        let contactPrompt = '';
        const lowerInput = trimmedInput.toLowerCase();
        
        if (lowerInput.includes('email')) {
          contactPrompt = 'Please provide your email address:';
        } else if (lowerInput.includes('linkedin')) {
          contactPrompt = 'Please provide your LinkedIn profile URL or username:';
        } else if (lowerInput.includes('phone')) {
          contactPrompt = 'Please provide your phone number:';
        } else if (lowerInput.includes('whatsapp')) {
          contactPrompt = 'Please provide your WhatsApp number:';
        } else if (lowerInput.includes('telegram')) {
          contactPrompt = 'Please provide your Telegram username:';
        } else if (lowerInput.includes('discord')) {
          contactPrompt = 'Please provide your Discord username:';
        } else {
          contactPrompt = `Please provide your ${trimmedInput} details:`;
        }
        
        return {
          output: [
            `<span class="text-green-400">✓</span> <span class="text-cyan-300">Contact Method:</span> <span class="text-white">${trimmedInput}</span>`,
            '',
            `<span class="text-cyan-300">Step 3/4: ${contactPrompt}</span>`,
            '<span class="text-yellow-200">  (Please share your contact details)</span>',
            ''
          ]
        };
      } else if (contactForm.step === 3) {
        // Step 3: Collecting actual contact details
        this.state.contactForm = {
          ...contactForm,
          contactDetails: trimmedInput,
          step: 4
        };
        
        return {
          output: [
            `<span class="text-green-400">✓</span> <span class="text-cyan-300">Contact Details:</span> <span class="text-white">${trimmedInput}</span>`,
            '',
            '<span class="text-cyan-300">Step 4/4: What\'s your message?</span>',
            '<span class="text-yellow-200">  (Tell me what you\'d like to discuss)</span>',
            ''
          ]
        };
      } else if (contactForm.step === 4) {
        // Step 4: Collecting message and show submitting animation
        const submittingAnimation = [
          `<span class="text-green-400">✓</span> <span class="text-cyan-300">Message:</span> <span class="text-white">${trimmedInput}</span>`,
          '',
          '<span class="text-cyan-400">╔══════════════════════════════════════════════════════════════╗</span>',
          '<span class="text-cyan-400">║</span>                    <span class="text-yellow-300 font-bold">SUBMITTING CONTACT</span>                        <span class="text-cyan-400">║</span>',
          '<span class="text-cyan-400">╚══════════════════════════════════════════════════════════════╝</span>',
          '',
          '<span class="text-green-400">� Processing your contact request...</span>',
          '',
          '<span class="text-blue-300">┌─────────────────────────────────────────────────────────────┐</span>',
          '<span class="text-blue-300">│</span> <span class="text-yellow-300">Status:</span> <span class="text-yellow-400">Preparing submission...</span>                      <span class="text-blue-300">│</span>',
          '<span class="text-blue-300">│</span>                                                             <span class="text-blue-300">│</span>',
          '<span class="text-blue-300">│</span> <span class="text-gray-500">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span>     <span class="text-blue-300">│</span>',
          '<span class="text-blue-300">│</span> <span class="text-yellow-400">0%</span> <span class="text-gray-400">Initializing...</span>                                    <span class="text-blue-300">│</span>',
          '<span class="text-blue-300">└─────────────────────────────────────────────────────────────┘</span>',
          ''
        ];

        // Store the completed form data temporarily
        const completedForm = {
          ...contactForm,
          message: trimmedInput
        };

        // Reset contact form and store completed data
        this.state.contactForm = undefined;
        this.state.completedContactForm = completedForm;

        // Send email in background
        this.sendContactEmail(completedForm);

        return {
          output: submittingAnimation,
          startSubmitting: true
        };
      }
    }

    // Check if we're in chat mode and it's not a special command
    if (this.state.chatSession && this.state.chatSession.isActive && 
        !trimmedInput.startsWith('/') && !trimmedInput.startsWith('!') && 
        commandName !== 'clear') {
      
      // Handle direct message to AI agent
      if (this.state.chatSession.agent.id === 'rudra-b') {
        try {
          const response = await geminiAPI.generateResponse(trimmedInput);
          
          // Add both messages to chat session
          this.state.chatSession.messages.push(
            {
              role: 'user',
              content: trimmedInput,
              timestamp: new Date()
            },
            {
              role: 'assistant', 
              content: response,
              timestamp: new Date()
            }
          );
          
          return {
            output: [
              `<span class="text-cyan-400">🤖</span> <span class="text-purple-400 font-semibold">Rudra-B:</span> <span class="text-green-300">${response}</span>`
            ]
          };
        } catch (error) {
          return {
            output: [
              'Sorry, I encountered an error while processing your request.',
              'Please try again.'
            ]
          };
        }
      }
    }

    const command = this.commands.get(commandName);
    
    // If in chat mode, only allow bye command or direct messages
    if (this.state.chatSession && this.state.chatSession.isActive && commandName !== 'bye') {
      return {
        output: [
          '<span class="text-yellow-400">⚠️  Chat mode is active!</span>',
          '<span class="text-cyan-300">• Send direct messages to chat with Rudra-B</span>',
          '<span class="text-cyan-300">• Type <span class="text-red-400">bye</span> to exit chat and use other commands</span>',
          ''
        ]
      };
    }
    
    if (!command) {
      return {
        output: [
          `Command not found: ${commandName}`,
          'Type !help for available commands.'
        ]
      };
    }

    const result = await command.execute(args, this.state);
    
    // Update state if provided
    if (result.newState) {
      this.state = { ...this.state, ...result.newState };
    }

    return result;
  }

  public getState(): TerminalState {
    return { ...this.state };
  }

  public resetState(): void {
    this.state = createInitialState();
  }

  public getPrompt(): string {
    return `${this.state.prompt}:${this.state.currentPath}$`;
  }

  public getPromptColor(): string {
    return this.state.theme.promptColor;
  }

  private async sendContactEmail(contactForm: ContactForm): Promise<void> {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          contactOption: contactForm.contactOption,
          contactDetails: contactForm.contactDetails,
          message: contactForm.message,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send contact email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending contact email:', error);
    }
  }
}
