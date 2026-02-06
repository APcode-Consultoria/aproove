![image](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![image](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![image](https://img.shields.io/badge/Ansible-000000?style=for-the-badge&logo=ansible&logoColor=white)
![image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

# AProove — Sistema de Gestão Clínica

O **AProove** é um sistema voltado para **clínicas de saúde em geral**, como **fisioterapia, pilates, consultórios médicos e multiprofissionais**, com foco no **cadastro, acompanhamento e controle clínico de pacientes**, centralizando informações de **prontuários terapêuticos**, atendimentos e histórico de tratamentos.

A plataforma foi projetada para apoiar o **fluxo assistencial**, garantindo organização, rastreabilidade e segurança das informações clínicas, alinhando tecnologia moderna às necessidades do ambiente de saúde.

---

## Funcionalidades Principais

* **Cadastro Clínico de Pacientes**
    * Dados pessoais, contatos e informações relevantes para o atendimento.
    * Histórico longitudinal do paciente.

* **Prontuário de Tratamento**
    * Registro de avaliações, evoluções e condutas terapêuticas.
    * Acompanhamento cronológico das sessões e procedimentos realizados.
    * Suporte a diferentes especialidades clínicas.

* **Gestão de Atendimentos**
    * Organização de sessões e registros clínicos.
    * Visualização clara do progresso terapêutico do paciente.

* **Segurança e Confiabilidade**
    * Controle de acesso baseado em perfis.
    * Persistência estruturada e segura dos dados clínicos.

---

## Arquitetura do Sistema

O AProove utiliza uma arquitetura moderna baseada em **separação clara de responsabilidades**, garantindo escalabilidade, manutenibilidade e segurança.

### Componentes Principais

* **Backend (Clinical Core):**  
  Desenvolvido em **Spring Boot**, concentra as **regras de negócio clínicas**, validações, persistência de dados e exposição de serviços **RESTful**. É responsável por garantir a integridade das informações do prontuário e do cadastro de pacientes.

* **Frontend (Clinical UI):**  
  Interface web desenvolvida como **Single Page Application (SPA)** com **Angular**, oferecendo uma experiência fluida para profissionais de saúde no registro e consulta de informações clínicas.

* **Banco de Dados (Clinical Data Store):**  
  Utiliza **PostgreSQL** como base relacional para armazenamento seguro dos dados de pacientes, prontuários e registros de atendimento.

---

## Stack Tecnológica

* **Backend:**  
  Java com [Spring Boot Framework](https://spring.io)

* **Frontend:**  
  [Angular SPA](https://angular.io)

* **Banco de Dados:**  
  [PostgreSQL](https://www.postgresql.org)

* **Containerização:**  
  [Docker](https://www.docker.com)

* **Automação e Infraestrutura:**  
  [Ansible](https://www.ansible.com)

---

## Deploy e Infraestrutura

O AProove conta com automação completa do ciclo de entrega:

* Build automatizado de aplicações backend e frontend.
* Geração e publicação de imagens Docker.
* Provisionamento e atualização de ambientes via **Kubernetes**.
* Scripts **Makefile** e **PowerShell** para padronização dos processos de build, deploy e operação.

Essa abordagem garante **padronização, reprodutibilidade e segurança**, facilitando a implantação do sistema em ambientes locais, homologação ou produção.

---

## Objetivo do Projeto

O AProove tem como objetivo **digitalizar e organizar o cuidado clínico**, oferecendo uma solução confiável para profissionais de saúde acompanharem seus pacientes de forma estruturada, segura e eficiente, respeitando a complexidade dos processos assistenciais
