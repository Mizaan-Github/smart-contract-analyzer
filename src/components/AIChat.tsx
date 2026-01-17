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
      content: `Bonjour ! Je suis votre assistant juridique. Posez-moi vos questions sur "${contractName}".`,
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
    }, 1500);
  };

  return (
    <div className={cn('flex flex-col h-full glass rounded-2xl overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Assistant IA</h3>
            <p className="text-[11px] text-muted-foreground">Posez vos questions</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
              message.role === 'assistant' 
                ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                : 'bg-muted'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-3.5 h-3.5 text-primary" />
              ) : (
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            <div className={cn(
              'max-w-[85%] rounded-2xl px-4 py-2.5',
              message.role === 'assistant' 
                ? 'bg-muted/50 text-foreground' 
                : 'btn-gradient text-white'
            )}>
              <p className="text-[13px] leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted/50 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez une question..."
            className="flex-1 input-refined h-10 text-sm"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="btn-gradient text-white border-0 h-10 w-10 rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('non-concurrence') || q.includes('concurrence')) {
    return "La clause de non-concurrence a une durée de 24 mois sur tout le territoire national. C'est excessif. Je recommande de négocier à 12 mois avec un périmètre régional.";
  }
  
  if (q.includes('préavis') || q.includes('démission')) {
    return "Le préavis standard est de 3 mois. Vous pouvez négocier une réduction ou une dispense partielle avec accord mutuel.";
  }
  
  if (q.includes('salaire') || q.includes('rémunération')) {
    return "La rémunération est dans la moyenne du marché. Vérifiez les modalités de révision salariale et les éventuels bonus mentionnés.";
  }
  
  return "D'après mon analyse, je vous recommande de vérifier les clauses liées à ce sujet. N'hésitez pas à demander des précisions écrites avant de signer.";
}
