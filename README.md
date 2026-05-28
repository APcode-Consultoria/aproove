# Clínica PRO

Sistema customizado para uma clínica de fisioterapia e pilates, voltado ao cadastro de pacientes e ao controle de prontuários clínicos.

## Escopo

- `Paciente`: dados cadastrais, contatos e informações necessárias ao atendimento.
- `Prontuario`: registros clínicos vinculados ao acompanhamento terapêutico.
- `Exame`: informações e arquivos complementares associados ao histórico do paciente.
- `Dashboard`: visão inicial para navegação e acompanhamento operacional.

Pacientes, prontuários e exames devem ser tratados como dados sensíveis. Mudanças nessas áreas devem priorizar consistência, rastreabilidade, controle de acesso e preservação do histórico clínico.

## Estrutura

- `backend/`: API, domínio, serviços, persistência e configurações do servidor.
- `frontend/`: aplicação web usada pela clínica.
- `.specs/`: padrões técnicos compartilhados e instruções para IA.
- `.helm/`: configurações de deploy Kubernetes.
- `Makefile` e `Makefile.ps1`: comandos operacionais de build, teste, imagem e deploy.
- `mise.toml`: versões locais das ferramentas de desenvolvimento.

## Execução Local

Backend:

```bash
mvn clean package --file backend/pom.xml
mvn test --file backend/pom.xml
```

Frontend:

```bash
cd frontend
npm ci
npm start
```

Em desenvolvimento local, o frontend roda em `http://localhost:4200/roove`.

## Referências Técnicas

A stack, padrões de backend/frontend, convenções de código, critérios de aceite e orientações para IA ficam em `.specs/`.

Ao usar IA neste projeto, considere:

- este README como contexto de negócio;
- `.specs/` como referência técnica;
- instruções de CRUD em `.specs/` como mecanismo operacional, não como objetivo do produto.
