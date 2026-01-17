import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '@/types/contracts';

interface AIChatProps {
  contractName: string;
  className?: string;
}

export function AIChat({ contractName, className }: AIChatProps) {
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

    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200);
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

function getAIResponse(q: string): string {
  const question = q.toLowerCase();
  if (question.includes('concurrence')) return "La clause de non-concurrence (24 mois, national) est excessive. Négociez 12 mois sur périmètre régional.";
  if (question.includes('préavis')) return "Préavis standard de 3 mois. Négociable avec accord mutuel.";
  if (question.includes('salaire')) return "Rémunération dans la moyenne. Vérifiez révision et bonus.";
  return "Je recommande de vérifier ce point avec attention avant signature.";
}
