import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
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
      content: `Bonjour ! Je suis votre assistant juridique. Posez-moi vos questions sur le contrat "${contractName}".`,
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

    // Simulation de réponse IA
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
    <div className={cn('flex flex-col h-full bg-card rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistant Juridique IA</h3>
            <p className="text-xs text-muted-foreground">Posez vos questions</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
              message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-2.5',
              message.role === 'assistant' 
                ? 'bg-muted text-foreground' 
                : 'gradient-primary text-primary-foreground'
            )}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez une question..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="gradient-primary border-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Réponses simulées pour la démo
function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('non-concurrence') || q.includes('concurrence')) {
    return "La clause de non-concurrence dans ce contrat a une durée de 24 mois et couvre tout le territoire national. C'est particulièrement restrictif. Je vous conseille de négocier une réduction à 12 mois avec un périmètre régional.";
  }
  
  if (q.includes('préavis') || q.includes('démission')) {
    return "Le préavis standard pour ce type de contrat est de 3 mois. Vous pouvez négocier une réduction en cas de démission, ou une dispense partielle avec accord mutuel.";
  }
  
  if (q.includes('salaire') || q.includes('rémunération')) {
    return "La rémunération indiquée est dans la moyenne du marché. N'oubliez pas de vérifier les modalités de révision salariale et les éventuels bonus ou primes mentionnés dans le contrat.";
  }
  
  return "Je comprends votre question. D'après mon analyse du contrat, je vous recommande de bien vérifier les clauses liées à ce sujet. N'hésitez pas à demander des précisions écrites à l'employeur avant de signer.";
}
