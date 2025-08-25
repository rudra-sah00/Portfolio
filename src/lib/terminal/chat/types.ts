export interface ChatAgent {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  icon: string;
}

export interface ChatSession {
  agent: ChatAgent;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  isActive: boolean;
}

export const availableAgents: ChatAgent[] = [
  {
    id: 'rudra-b',
    name: 'Rudra-B',
    description: 'AI representing Rudra Narayana Sahoo for portfolio discussions',
    status: 'online',
    icon: '🤖'
  }
];

export const getAgentById = (id: string): ChatAgent | undefined => {
  return availableAgents.find(agent => agent.id === id);
};
