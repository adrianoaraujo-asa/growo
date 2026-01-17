-- Insert landing page configuration
INSERT INTO system.settings (key, value, description, is_public) VALUES
(
  'landing_page_logo',
  '{"url": null, "alt": "growo.app"}',
  'Logo da landing page. Se url for null, usa logo padrão.',
  true
),
(
  'landing_page_colors',
  '{
    "primary": "262.1 83.3% 57.8%",
    "primary_foreground": "210 20% 98%",
    "secondary": "220 14.3% 95.9%",
    "secondary_foreground": "220.9 39.3% 11%",
    "accent": "262.1 83.3% 57.8%",
    "accent_foreground": "210 20% 98%",
    "background": "0 0% 100%",
    "foreground": "224 71.4% 4.1%",
    "muted": "220 14.3% 95.9%",
    "muted_foreground": "220 8.9% 46.1%",
    "card": "0 0% 100%",
    "card_foreground": "224 71.4% 4.1%",
    "border": "220 13% 91%"
  }',
  'Cores da landing page em formato HSL',
  true
),
(
  'landing_page_social_links',
  '{
    "facebook": null,
    "twitter": null,
    "linkedin": null,
    "instagram": null,
    "youtube": null,
    "github": null
  }',
  'Links das redes sociais no footer da landing page',
  true
),
(
  'landing_page_company_info',
  '{
    "name": "growo.app",
    "description": "Plataforma de gestão de projetos de TI",
    "email": "contato@growo.app",
    "phone": null,
    "address": null
  }',
  'Informações da empresa na landing page',
  true
);