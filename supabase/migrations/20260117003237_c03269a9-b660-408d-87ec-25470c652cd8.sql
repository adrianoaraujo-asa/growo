
-- Insert test billing plans
INSERT INTO billing.plans (name, slug, description, features, price_monthly, price_yearly, trial_days, is_active, is_public, sort_order)
VALUES 
  ('Free', 'free', 'Perfeito para começar e explorar a plataforma', 
   '["1 projeto", "2 membros", "100MB de armazenamento", "Suporte por email"]'::jsonb, 
   0, 0, 0, true, true, 1),
  ('Starter', 'starter', 'Ideal para pequenas equipes e projetos em crescimento', 
   '["5 projetos", "10 membros", "5GB de armazenamento", "Suporte prioritário", "Relatórios básicos", "Integrações essenciais"]'::jsonb, 
   29.90, 299.00, 14, true, true, 2),
  ('Professional', 'professional', 'Para equipes que precisam de recursos avançados', 
   '["Projetos ilimitados", "50 membros", "50GB de armazenamento", "Suporte 24/7", "Relatórios avançados", "Todas as integrações", "API access", "Automações"]'::jsonb, 
   79.90, 799.00, 14, true, true, 3),
  ('Enterprise', 'enterprise', 'Solução completa para grandes organizações', 
   '["Tudo do Professional", "Membros ilimitados", "Armazenamento ilimitado", "Gerente de conta dedicado", "SLA garantido", "SSO/SAML", "Auditoria completa", "Deploy on-premise"]'::jsonb, 
   NULL, NULL, 30, true, true, 4)
ON CONFLICT (slug) DO NOTHING;
