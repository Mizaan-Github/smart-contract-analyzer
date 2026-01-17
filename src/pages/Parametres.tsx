import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useContracts } from '@/contexts/ContractsContext';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Key, 
  HelpCircle,
  ChevronRight,
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

type SettingsSection = 'profil' | 'notifications' | 'securite' | 'apparence' | 'api' | 'aide';

const sections = [
  { id: 'profil' as const, icon: User, label: 'Profil', description: 'Gérer votre compte' },
  { id: 'notifications' as const, icon: Bell, label: 'Notifications', description: 'Préférences d\'alertes' },
  { id: 'securite' as const, icon: Shield, label: 'Sécurité', description: 'Mot de passe et accès' },
  { id: 'apparence' as const, icon: Palette, label: 'Apparence', description: 'Thème et affichage' },
  { id: 'api' as const, icon: Key, label: 'API', description: 'Clés et intégrations' },
  { id: 'aide' as const, icon: HelpCircle, label: 'Aide', description: 'Support et documentation' },
];

export default function Parametres() {
  const { contracts } = useContracts();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profil');

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar contracts={contracts} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader title="Paramètres" />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              
              {/* Sidebar Navigation */}
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                      activeSection === section.id 
                        ? 'bg-primary/8 text-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    )}
                  >
                    <section.icon className={cn(
                      'w-4 h-4 shrink-0',
                      activeSection === section.id ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{section.label}</p>
                      <p className="text-[10px] text-muted-foreground/70">{section.description}</p>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Content */}
              <div className="card-minimal p-6">
                {activeSection === 'profil' && <ProfilSection />}
                {activeSection === 'notifications' && <NotificationsSection />}
                {activeSection === 'securite' && <SecuriteSection />}
                {activeSection === 'apparence' && <ApparenceSection />}
                {activeSection === 'api' && <ApiSection />}
                {activeSection === 'aide' && <AideSection />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProfilSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Profil</h2>
        <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-xl font-semibold text-primary">JD</span>
        </div>
        <div>
          <button className="text-sm font-medium text-primary hover:underline">
            Changer la photo
          </button>
          <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG. Max 2MB</p>
        </div>
      </div>

      <div className="grid gap-4">
        <InputField label="Nom complet" defaultValue="Jean Dupont" />
        <InputField label="Email" defaultValue="jean.dupont@email.com" type="email" />
        <InputField label="Entreprise" defaultValue="Mon Entreprise" />
      </div>

      <button className="btn-clean px-4 py-2 text-sm">
        Enregistrer
      </button>
    </div>
  );
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    analysisComplete: true,
    weeklyReport: true,
    riskAlerts: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Notifications</h2>
        <p className="text-sm text-muted-foreground">Configurez vos préférences d'alertes</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Canaux</h3>
        <ToggleRow 
          icon={Mail} 
          label="Email" 
          description="Recevoir les notifications par email"
          checked={notifications.email}
          onChange={(v) => setNotifications(n => ({ ...n, email: v }))}
        />
        <ToggleRow 
          icon={Smartphone} 
          label="Push" 
          description="Notifications sur votre appareil"
          checked={notifications.push}
          onChange={(v) => setNotifications(n => ({ ...n, push: v }))}
        />
      </div>

      <div className="h-px bg-border/50" />

      <div className="space-y-4">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Types d'alertes</h3>
        <ToggleRow 
          label="Analyse terminée" 
          description="Quand un contrat est analysé"
          checked={notifications.analysisComplete}
          onChange={(v) => setNotifications(n => ({ ...n, analysisComplete: v }))}
        />
        <ToggleRow 
          label="Rapport hebdomadaire" 
          description="Résumé de vos analyses"
          checked={notifications.weeklyReport}
          onChange={(v) => setNotifications(n => ({ ...n, weeklyReport: v }))}
        />
        <ToggleRow 
          label="Alertes risques" 
          description="Clauses à risque élevé détectées"
          checked={notifications.riskAlerts}
          onChange={(v) => setNotifications(n => ({ ...n, riskAlerts: v }))}
        />
      </div>
    </div>
  );
}

function SecuriteSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Sécurité</h2>
        <p className="text-sm text-muted-foreground">Protégez votre compte</p>
      </div>

      <div className="space-y-4">
        <InputField label="Mot de passe actuel" type="password" placeholder="••••••••" />
        <InputField label="Nouveau mot de passe" type="password" placeholder="••••••••" />
        <InputField label="Confirmer" type="password" placeholder="••••••••" />
      </div>

      <button className="btn-clean px-4 py-2 text-sm">
        Mettre à jour
      </button>

      <div className="h-px bg-border/50" />

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Authentification à deux facteurs</h3>
        <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-colors text-left">
          <Shield className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Activer 2FA</p>
            <p className="text-[11px] text-muted-foreground">Sécurisez votre compte avec une app d'authentification</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function ApparenceSection() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Apparence</h2>
        <p className="text-sm text-muted-foreground">Personnalisez l'interface</p>
      </div>

      <div>
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Thème</h3>
        <div className="grid grid-cols-3 gap-3">
          <ThemeOption 
            icon={Sun} 
            label="Clair" 
            active={theme === 'light'} 
            onClick={() => setTheme('light')} 
          />
          <ThemeOption 
            icon={Moon} 
            label="Sombre" 
            active={theme === 'dark'} 
            onClick={() => setTheme('dark')} 
          />
          <ThemeOption 
            icon={Globe} 
            label="Système" 
            active={theme === 'system'} 
            onClick={() => setTheme('system')} 
          />
        </div>
      </div>
    </div>
  );
}

function ApiSection() {
  const [showKey, setShowKey] = useState(false);
  const apiKey = 'fth_xxxxxxxxxxxxxxxxxxxxxxxxx';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Clés API</h2>
        <p className="text-sm text-muted-foreground">Gérez vos intégrations</p>
      </div>

      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Clé Featherless AI</p>
          <button 
            onClick={() => setShowKey(!showKey)}
            className="text-[11px] text-primary hover:underline"
          >
            {showKey ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        <code className="text-[12px] text-muted-foreground font-mono">
          {showKey ? apiKey : '••••••••••••••••••••••••'}
        </code>
      </div>

      <InputField 
        label="Nouvelle clé API" 
        placeholder="fth_..." 
        type="password"
      />

      <button className="btn-clean px-4 py-2 text-sm">
        Enregistrer la clé
      </button>
    </div>
  );
}

function AideSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Aide & Support</h2>
        <p className="text-sm text-muted-foreground">Trouvez des réponses</p>
      </div>

      <div className="space-y-3">
        <HelpLink label="Documentation" description="Guides et tutoriels" />
        <HelpLink label="FAQ" description="Questions fréquentes" />
        <HelpLink label="Contacter le support" description="Assistance par email" />
        <HelpLink label="Changelog" description="Nouveautés et mises à jour" />
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-sm font-medium text-foreground mb-1">Contr'Act v1.0.0</p>
        <p className="text-[11px] text-muted-foreground">© 2024 Tous droits réservés</p>
      </div>
    </div>
  );
}

// Helper Components
function InputField({ 
  label, 
  defaultValue, 
  placeholder,
  type = 'text' 
}: { 
  label: string; 
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="input-clean w-full"
      />
    </div>
  );
}

function ToggleRow({ 
  icon: Icon, 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ThemeOption({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border text-center transition-all',
        active 
          ? 'border-primary bg-primary/5' 
          : 'border-border/50 hover:border-primary/30'
      )}
    >
      <Icon className={cn(
        'w-5 h-5 mx-auto mb-2',
        active ? 'text-primary' : 'text-muted-foreground'
      )} />
      <p className={cn(
        'text-sm font-medium',
        active ? 'text-primary' : 'text-muted-foreground'
      )}>{label}</p>
      {active && <Check className="w-3 h-3 text-primary mx-auto mt-2" />}
    </button>
  );
}

function HelpLink({ label, description }: { label: string; description: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors text-left">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
