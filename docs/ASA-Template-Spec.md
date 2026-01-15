# ASA.Template - Especificação de Telas

> Template SaaS multi-tenant que serve como base para múltiplos sistemas verticais.
> Módulos específicos: MoveZy, Condoma, EleVoPlus, Growo, ASA.Academy, ASAi

## Perfis de Acesso

| Role   | Slug   | Descrição           | Permissões                                   |
|--------|--------|---------------------|----------------------------------------------|
| Owner  | owner  | Dono da organização | Acesso total, pode deletar org               |
| Admin  | admin  | Administrador       | Gerenciar membros, billing, settings         |
| Member | member | Membro padrão       | Acesso básico, criar/editar próprio conteúdo |

## Mapa de Navegação

```
/                         # Landing Page (pública)
├── /login                # Login
├── /signup               # SignUp (6 steps)
│   ├── /signup/verify    # Step 2: Verificar email
│   ├── /signup/profile   # Step 3: Dados pessoais
│   ├── /signup/organization # Step 4: Dados empresa
│   ├── /signup/plan      # Step 5: Escolher plano
│   └── /signup/checkout  # Step 6: Pagamento
├── /forgot-password      # Recuperar senha
├── /reset-password       # Redefinir senha (via token)
├── /invite/:token        # Aceitar convite
│
├── /dashboard            # Dashboard principal (autenticado)
│
├── /docs                 # Documentos/Wiki
│   ├── /docs/:id         # Visualizar/Editar documento
│   └── /docs/:id/history # Histórico de versões
│
├── /profile              # Perfil do usuário
│   ├── /profile/security     # Segurança (senha, MFA)
│   ├── /profile/notifications # Preferências notificação
│   └── /profile/sessions     # Sessões ativas
│
├── /settings             # Configurações da organização
│   ├── /settings/organization # Dados da empresa
│   ├── /settings/addresses   # Endereços
│   ├── /settings/contacts    # Contatos
│   ├── /settings/billing     # Métodos pagamento
│   ├── /settings/subscription # Assinatura atual
│   ├── /settings/invoices    # Histórico faturas
│   ├── /settings/users       # Gestão usuários
│   │   ├── /settings/users/invite # Convidar
│   │   └── /settings/users/:id    # Detalhes usuário
│   ├── /settings/webhooks    # Webhooks
│   ├── /settings/api-keys    # Chaves API
│   └── /settings/preferences # Preferências
│
├── /onboarding           # Onboarding pós-convite
│   ├── /onboarding/profile   # Step 1: Completar perfil
│   ├── /onboarding/avatar    # Step 2: Upload avatar
│   ├── /onboarding/address   # Step 3: Endereço (opcional)
│   ├── /onboarding/contacts  # Step 4: Contatos
│   └── /onboarding/documents # Step 5: Documentos (opcional)
│
├── /notifications        # Central de notificações
│
├── /help                 # Central de ajuda
│   └── /help/contact     # Contato/Suporte
│
└── /admin                # Área administrativa (super admin)
    ├── /admin/organizations # Organizações
    ├── /admin/users      # Usuários
    ├── /admin/plans      # Planos
    ├── /admin/features   # Features
    └── /admin/logs       # Logs
```

## Área Pública

### Landing Page (/)
- Hero Section: Headline, subtítulo, CTAs "Começar Grátis" e "Ver Demo"
- Features Section: Grid 3x2 ou 4x2 com ícones
- Pricing Section: Cards de planos (Free, Pro, Enterprise)
- FAQ Section: Accordion com 6-8 perguntas
- Footer: Links institucionais, suporte, redes sociais

### Login (/login)
- Login com Email/Senha
- Login com Magic Link
- Login com SSO (Google, Microsoft)
- Link "Esqueci minha senha"
- Link "Criar conta"

### SignUp - 6 Steps
1. **Credenciais** (/signup): email, senha, confirmação, termos
2. **Verificação** (/signup/verify): código OTP 6 dígitos
3. **Dados Pessoais** (/signup/profile): nome, telefone, cargo
4. **Dados Empresa** (/signup/organization): nome, CNPJ/CPF, tamanho
5. **Seleção Plano** (/signup/plan): Free, Pro, Enterprise
6. **Checkout** (/signup/checkout): dados do cartão

## Área Autenticada

### Dashboard (/dashboard)
- Welcome Banner: "Bom dia, {nome}!"
- KPIs Cards: 4 cards com métricas
- Gráfico Principal: Line/Bar chart últimos 30 dias
- Atividade Recente: últimas 5-10 ações
- Quick Actions: atalhos frequentes
- Documentos Recentes: últimos 5 documentos
- Área de Conteúdo: Slot para módulos específicos do SaaS

### Configurações da Organização

#### Dados da Empresa (/settings/organization)
- Upload de logo
- Nome, nome fantasia, CNPJ/CPF
- Email, telefone, website

#### Endereços (/settings/addresses)
- Lista em cards com tipo (Matriz, Cobrança, Entrega)
- Modal com busca CEP via ViaCEP
- Definir principal

#### Contatos (/settings/contacts)
- Lista por tipo (telefone, email, whatsapp)
- Badge "Principal" por tipo

#### Métodos de Pagamento (/settings/billing)
- Lista de cartões salvos
- Bandeira, últimos 4 dígitos, validade
- Adicionar/remover cartão

#### Assinatura (/settings/subscription)
- Plano atual com preço e próxima cobrança
- Barras de progresso por recurso
- Upgrade/Downgrade/Cancelar

#### Faturas (/settings/invoices)
- Tabela: Número, Data, Valor, Status, Download PDF
- Filtros: período, status

#### Gestão de Usuários (/settings/users)
- Lista de membros com avatar, nome, email, role
- Aba de convites pendentes
- Modal para convidar novo membro

#### Webhooks (/settings/webhooks)
- Lista de endpoints
- Eventos disponíveis (user.*, subscription.*, invoice.*, payment.*, document.*)
- Logs de entrega

#### API Keys (/settings/api-keys)
- Lista de chaves (nome, prefixo, criada em, último uso)
- Criar/Revogar chaves

#### Preferências (/settings/preferences)
- Localização: timezone, idioma, formato data
- Notificações: emails de alertas
- Aparência: logo, cor primária, modo escuro

### Perfil do Usuário

#### Meu Perfil (/profile)
- Avatar com upload
- Nome, email (readonly), telefone, cargo, bio
- Timezone, idioma

#### Segurança (/profile/security)
- Alterar senha com indicador de força
- MFA (2FA) com QR Code
- Link para sessões ativas

#### Notificações (/profile/notifications)
- Toggles por categoria e canal (email, push, in-app)

#### Sessões Ativas (/profile/sessions)
- Lista: dispositivo, IP, localização, última atividade
- Encerrar sessão / Encerrar todas

### Onboarding Pós-Convite (5 steps)
1. Completar Perfil
2. Upload Avatar
3. Endereço (opcional)
4. Contatos
5. Documentos (opcional)

### Notificações (/notifications)
- Lista com scroll infinito
- Tabs: Todas, Não lidas
- Card: ícone, título, descrição, timestamp, indicador

### Ajuda (/help)
- Search bar
- Categorias de artigos
- Artigos mais acessados

## Módulo de Documentos (Wiki)

### Lista (/docs)
- Sidebar com pastas fixas: Meus Docs, Compartilhados, Favoritos, Lixeira
- Pastas customizadas com drag & drop
- Cards ou tabela de documentos
- Ações: Abrir, Favoritar, Compartilhar, Mover, Duplicar, Exportar, Deletar

### Editor (/docs/:id)
- Editor Markdown WYSIWYG
- Toolbar: texto, títulos, listas, blocos, inserir, avançado
- Outline/TOC automático
- Autosave

### Recursos do Editor
- Formatação: negrito, itálico, sublinhado, tachado, highlight
- Títulos H1-H6 com navegação por âncora
- Listas: bullet, numerada, checklist com progresso
- Blocos de código com syntax highlighting (50+ linguagens)
- Citações e Callouts (note, tip, warning, danger, info)
- Tabelas com alinhamento
- Imagens: drag & drop, paste, upload (armazenadas no R2)
- Links internos e externos
- Diagramas Mermaid (flowchart, sequence, class, ER, gantt, pie)
- Equações LaTeX/KaTeX
- Embeds: YouTube, Vimeo, Twitter, Google Maps, Figma, Loom
- Comandos Slash (/h1, /code, /table, /image, etc.)
- Menções @usuario e referências [[documento]]
- TOC automático [[toc]]

### Compartilhamento
- Níveis: Owner, Editor, Commenter, Viewer
- Link: apenas convidados, org (view/edit), público

### Histórico de Versões (/docs/:id/history)
- Lista com timestamp, autor, mensagem
- Visualizar, comparar, restaurar

### Busca Full-text
- Por conteúdo, título, autor, tags
- Filtros: pasta, data, tipo

### Exportação
- Formatos: MD, PDF, HTML, DOCX, TXT
- Documento único ou pasta (ZIP)

## Área Administrativa (Super Admin)

### Dashboard Admin (/admin)
- KPIs: total orgs, total users, MRR, churn rate, storage R2

### Organizações (/admin/organizations)
- Listar, filtrar, ver detalhes
- Suspender/reativar
- Impersonar (login como)

### Usuários (/admin/users)
- Listar, filtrar, ver detalhes
- Resetar senha, bloquear/desbloquear

### Planos (/admin/plans)
- CRUD de planos

## Componentes Globais

### Header
- Logo (link para dashboard)
- Search Bar global
- Notification Bell
- Organization Switcher
- User Menu (dropdown)

### Sidebar
- Dashboard
- Documentos (NOVO)
- Módulos do SaaS
- Configurações (Organização, Usuários, Billing, Integração)
- Ajuda
- User Mini Profile
- Collapse Button

### Footer (área pública)
- Copyright
- Links: Termos, Privacidade, Status
- Versão do sistema

## Storage de Arquivos

Todos os arquivos são armazenados no **Cloudflare R2**:
- Zero custo de egress (download)
- Compatível com API S3
- Organização por tenant: `tenants/{tenant_id}/...`
- URLs assinadas para acesso seguro
- Metadados armazenados no banco de dados
