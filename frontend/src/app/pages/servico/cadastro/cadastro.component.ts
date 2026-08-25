/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CadastroBaseComponent } from "@andre.penteado/ngx-apcore";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { ServicoService } from '../../../services/servico.service';
import { Servico } from "../../../domain/entities/servico";
import { Periodicidade, PERIODICIDADE_LABELS } from "../../../domain/enums/periodicidade";

// Mascara de moeda do ngx-mask, aplicada no template por binding. Fica aqui, e nao como
// literal no HTML, para o campo do cadastro e qualquer outra tela usarem exatamente a
// mesma configuracao.
export const MASCARA_MOEDA = "separator.2";

@Component({
  selector: 'roove-servico-cadastro',
  templateUrl: './cadastro.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgxMaskDirective
  ]
})
export class CadastroComponent extends CadastroBaseComponent<Servico> {

  protected readonly mascaraMoeda = MASCARA_MOEDA;

  protected readonly periodicidades = Object.values(Periodicidade);
  protected readonly periodicidadeLabels = PERIODICIDADE_LABELS;

  // Formulário do serviço
  id = new FormControl(null);
  dataCadastro = new FormControl(null);
  usuarioCadastro = new FormControl(null);
  dataUltimaAtualizacao = new FormControl(null);
  usuarioUltimaAtualizacao = new FormControl(null);
  nome = new FormControl(null, Validators.required);
  valor = new FormControl(null);
  duracao = new FormControl(null);
  frequencia = new FormControl(null);
  periodicidade = new FormControl(null);
  protected readonly form = new FormGroup({
    id: this.id,
    dataCadastro: this.dataCadastro,
    usuarioCadastro: this.usuarioCadastro,
    dataUltimaAtualizacao: this.dataUltimaAtualizacao,
    usuarioUltimaAtualizacao: this.usuarioUltimaAtualizacao,
    nome: this.nome,
    valor: this.valor,
    duracao: this.duracao,
    frequencia: this.frequencia,
    periodicidade: this.periodicidade
  });

  private servicoService = inject(ServicoService);

  protected readonly tituloGravar = "Gravar Serviço";
  protected readonly rotulo = 'serviço';

  protected buscar(id: number): Observable<Servico> {
    return this.servicoService.buscar(id);
  }

  protected incluirEntidade(valor: any): Observable<Servico> {
    return this.servicoService.incluir(valor);
  }

  protected alterarEntidade(valor: any): Observable<Servico> {
    return this.servicoService.alterar(valor, valor.id);
  }

  protected mensagemGravarSucesso(servico: Servico): string {
    return `Dados do serviço ${servico.nome} gravados com sucesso`;
  }

  protected override novaEntidade(): Servico {
    return new Servico();
  }

  tituloFormulario(): string {
    return this.incluir ? 'Novo serviço' : 'Editar serviço';
  }

  subtituloFormulario(): string {
    return 'Informe o nome do serviço, o valor cobrado na inscrição, quanto dura o atendimento e a frequência com que ele se repete.';
  }

}
