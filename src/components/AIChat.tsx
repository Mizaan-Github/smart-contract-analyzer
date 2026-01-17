import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { Message } from '@/types/contracts';
import { askQuestion } from '@/services/featherlessApi';

interface AIChatProps {
  contractName: string;
  contractContext?: string;
  className?: string;
}

export function AIChat({ contractName, contractContext, className }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Bonjour ! Posez-moi vos questions sur "${contractName}".`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await askQuestion(input, contractContext || '');
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full glass-clean rounded-2xl overflow-hidden', className)}>
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">Assistant IA</h3>
            <p className="text-[10px] text-muted-foreground/70">Posez vos questions</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3 scroll-minimal">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex gap-2.5', msg.role === 'user' && 'flex-row-reverse')}>
            <div className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center shrink-0',
              msg.role === 'assistant' ? 'bg-primary/10' : 'bg-muted/60'
            )}>
              {msg.role === 'assistant' ? (
                <Bot className="w-3 h-3 text-primary" />
              ) : (
                <User className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
            <div className={cn(
              'max-w-[85%] rounded-xl px-3 py-2',
              msg.role === 'assistant' ? 'bg-muted/40' : 'gradient-primary text-white'
            )}>
              <p className="text-[12px] leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-muted/40 rounded-xl px-3 py-2.5">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-primary/50 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-primary/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 h-1 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-[11px] text-danger p-2 bg-danger/10 rounded-lg">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Votre question..."
            className="flex-1 h-9 input-clean text-[12px]"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="w-9 h-9 gradient-primary text-white border-0 rounded-lg shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
