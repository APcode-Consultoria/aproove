CREATE USER "aproove-dbuser" WITH SUPERUSER ENCRYPTED PASSWORD '***REMOVED***';
CREATE DATABASE "aproove-dbname" OWNER "aproove-dbuser";

CONNECT TO apsso-dbname;

INSERT INTO empresa (data_cadastro, usuario_cadastro, razao_social, nome_fantasia, cnpj) VALUES (now(), 'Arquiteto do Sistema', 'Stúdio Roove de Pilates', 'Roove', 111111111111122);

INSERT INTO sistema (data_cadastro, usuario_cadastro, identificador, nome, descricao, fk_empresa) VALUES (now(), 'Arquiteto do Sistema', 'com.github.andrepenteado.roove', 'AProove', 'Sistema de controle de pacientes', currval('empresa_id_seq'));
INSERT INTO public.oauth2_registered_client (
    id, client_name, url_acesso, uri_provider, tipo, fk_sistema, client_id, client_id_issued_at, client_secret, client_secret_expires_at, client_authentication_methods,
    authorization_grant_types, redirect_uris, post_logout_redirect_uris, scopes, client_settings, token_settings)
VALUES (
   gen_random_uuid(), 'Máquina Local', 'http://localhost:4200/roove/login', 'http://localhost:30000', 'LOCAL', currval('sistema_id_seq'), 'LOCAL-roove', '2023-01-01 00:00:00.000000',
   '{bcrypt}$2y$10$uVX3rDMu9VbU60KpcBxiHOj4eIdeEJX5KoJ0a5N8WMYcXzYwpylji', null, 'client_secret_basic',  'refresh_token,client_credentials,authorization_code',
   'http://localhost:8080/roove-backend/authorized,http://localhost:8080/roove-backend/login/oauth2/code/com.github.andrepenteado.roove', 'http://localhost:8080/roove-backend/oauth2/authorization/com.github.andrepenteado.roove', 'openid',
   '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":false}',
   '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":false,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"],"settings.token.access-token-time-to-live":["java.time.Duration",900.000000000],"settings.token.access-token-format":{"@class":"org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat","value":"self-contained"},"settings.token.refresh-token-time-to-live":["java.time.Duration",86400.000000000],"settings.token.authorization-code-time-to-live":["java.time.Duration",300.000000000],"settings.token.device-code-time-to-live":["java.time.Duration",300.000000000]}'
);
INSERT INTO public.oauth2_registered_client (
    id, client_name, url_acesso, uri_provider, tipo, fk_sistema, client_id, client_id_issued_at, client_secret, client_secret_expires_at, client_authentication_methods,
    authorization_grant_types, redirect_uris, post_logout_redirect_uris, scopes, client_settings, token_settings)
VALUES (
   gen_random_uuid(), 'Servidor de Produção', 'https://sistemas.apcode.com.br/roove/login', 'https://login.apcode.com.br', 'PRODUCAO', currval('sistema_id_seq'), 'PRODUCAO-roove', '2023-01-01 00:00:00.000000',
   '{bcrypt}$2y$10$fXrNPhMZB3Sn4ZaXY34asO.AuVpMsk7.FYWXrFh6FEV7YOYFOtCRK', null, 'client_secret_basic',  'refresh_token,client_credentials,authorization_code',
   'https://sistemas.apcode.com.br/roove-backend/authorized,https://sistemas.apcode.com.br/roove-backend/login/oauth2/code/com.github.andrepenteado.roove', 'https://sistemas.apcode.com.br/roove-backend/oauth2/authorization/com.github.andrepenteado.roove', 'openid',
   '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":false}',
   '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":false,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"],"settings.token.access-token-time-to-live":["java.time.Duration",900.000000000],"settings.token.access-token-format":{"@class":"org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat","value":"self-contained"},"settings.token.refresh-token-time-to-live":["java.time.Duration",86400.000000000],"settings.token.authorization-code-time-to-live":["java.time.Duration",300.000000000],"settings.token.device-code-time-to-live":["java.time.Duration",300.000000000]}'
);
INSERT INTO perfil_sistema (authority, fk_sistema, descricao)
VALUES ('ROLE_com.github.andrepenteado.roove_FISIOTERAPEUTA', currval('sistema_id_seq'), 'Fisioterapeuta');
INSERT INTO perfil_sistema (authority, fk_sistema, descricao)
VALUES ('ROLE_com.github.andrepenteado.roove_DIRETOR', currval('sistema_id_seq'), 'Diretor Clínico');

INSERT INTO authorities (username, authority) VALUES ('arquiteto', 'ROLE_com.github.andrepenteado.roove_FISIOTERAPEUTA');
INSERT INTO authorities (username, authority) VALUES ('arquiteto', 'ROLE_com.github.andrepenteado.roove_DIRETOR');
