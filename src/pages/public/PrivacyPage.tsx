import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-8">Última atualização: 15 de Janeiro de 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              A growo.app ("nós", "nosso" ou "Empresa") está comprometida em proteger sua 
              privacidade. Esta Política de Privacidade explica como coletamos, usamos, 
              divulgamos e protegemos suas informações quando você utiliza nosso serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">2. Informações que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Coletamos informações que você nos fornece diretamente:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Dados de Conta:</strong> Nome, email, telefone, senha</li>
              <li><strong>Dados da Organização:</strong> Nome da empresa, CNPJ, endereço</li>
              <li><strong>Dados de Uso:</strong> Logs de acesso, interações com o sistema</li>
              <li><strong>Dados de Pagamento:</strong> Informações de cartão de crédito (processadas por terceiros)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">3. Como Usamos suas Informações</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar transações e enviar notificações relacionadas</li>
              <li>Enviar comunicações técnicas, atualizações e alertas de segurança</li>
              <li>Responder a comentários, perguntas e solicitações de suporte</li>
              <li>Monitorar e analisar tendências de uso</li>
              <li>Detectar e prevenir fraudes e abusos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">4. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground leading-relaxed">
              Não vendemos suas informações pessoais. Podemos compartilhar informações com:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Provedores de Serviço:</strong> Empresas que prestam serviços em nosso nome</li>
              <li><strong>Parceiros de Negócio:</strong> Com seu consentimento explícito</li>
              <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou ordem judicial</li>
              <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos e segurança</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">5. Segurança dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para 
              proteger suas informações pessoais, incluindo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Criptografia SSL/TLS para dados em trânsito</li>
              <li>Criptografia AES-256 para dados em repouso</li>
              <li>Controle de acesso baseado em funções (RBAC)</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e recuperação de desastres</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">6. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
              <li>Obter informações sobre compartilhamento de dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">7. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
              analisar o tráfego e personalizar conteúdo. Você pode gerenciar suas 
              preferências de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">8. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos suas informações pessoais pelo tempo necessário para fornecer nossos 
              serviços, cumprir obrigações legais, resolver disputas e fazer cumprir nossos 
              acordos. Após o encerramento da conta, os dados são retidos por até 5 anos 
              conforme exigências legais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">9. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
              você sobre mudanças significativas por email ou através de um aviso em nosso 
              site antes da mudança entrar em vigor.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">10. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
              entre em contato com nosso Encarregado de Proteção de Dados (DPO):
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-foreground font-medium">Encarregado de Proteção de Dados</p>
              <p className="text-muted-foreground">
                Email:{" "}
                <a href="mailto:dpo@growo.app" className="text-primary hover:underline">
                  dpo@growo.app
                </a>
              </p>
            </div>
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
