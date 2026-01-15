import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              G
            </div>
            growo
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto px-4 py-12"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Termos de Uso</h1>
          <p className="text-muted-foreground mb-8">Última atualização: 15 de Janeiro de 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar o growo.app ("Serviço"), você concorda em estar vinculado a estes 
              Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá 
              acessar o Serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              O growo.app é uma plataforma SaaS de gestão de projetos de TI que oferece:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Gestão de profissionais e skills</li>
              <li>Alocação de recursos em projetos</li>
              <li>Controle de timesheet e horas trabalhadas</li>
              <li>Gestão de clientes e contratos</li>
              <li>Relatórios e analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">3. Contas de Usuário</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para utilizar determinados recursos do Serviço, você deve criar uma conta. 
              Você é responsável por manter a confidencialidade de sua conta e senha, 
              bem como por restringir o acesso ao seu computador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">4. Uso Aceitável</h2>
            <p className="text-muted-foreground leading-relaxed">
              Você concorda em não usar o Serviço para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Transmitir conteúdo ilegal, difamatório ou ofensivo</li>
              <li>Interferir ou interromper o Serviço ou servidores</li>
              <li>Tentar obter acesso não autorizado a sistemas</li>
              <li>Coletar dados de outros usuários sem consentimento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão 
              propriedade exclusiva do growo.app e seus licenciadores. O Serviço é protegido por 
              direitos autorais, marcas registradas e outras leis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">6. Pagamentos e Assinaturas</h2>
            <p className="text-muted-foreground leading-relaxed">
              Alguns recursos do Serviço são oferecidos mediante pagamento. Os termos de 
              pagamento, incluindo renovação automática, cancelamento e reembolso, são 
              detalhados no momento da contratação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">7. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Serviço é fornecido "como está" e "conforme disponível". Não garantimos que 
              o Serviço será ininterrupto, seguro ou livre de erros. Em nenhum caso seremos 
              responsáveis por danos indiretos, incidentais ou consequenciais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">8. Modificações</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. 
              Notificaremos sobre alterações significativas através do email cadastrado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">9. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre estes Termos, entre em contato conosco em{" "}
              <a href="mailto:legal@growo.app" className="text-primary hover:underline">
                legal@growo.app
              </a>
            </p>
          </section>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 growo.app. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/terms" className="hover:text-primary">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-primary">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
