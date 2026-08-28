import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { CampoDataComponent, dataValida, entradaData, saidaData } from '@andre.penteado/ngx-apcore';

/**
 * O campo de data mora na ngx-apcore (`apcore-campo-data`), e não neste projeto: são
 * cinco configurações do ngx-mask que só funcionam juntas, e repeti-las à mão em cada
 * tela era a chance de errar uma delas.
 *
 * Estes testes ficam aqui de propósito, mesmo o componente sendo de fora — como os do
 * campo de moeda: eles protegem o comportamento de que este projeto depende, e é a
 * atualização da biblioteca que poderia quebrá-lo sem ninguém perceber.
 *
 * O que protegem: o campo trocou o `type="date"` — que no celular abria o calendário e
 * não deixava digitar — por um campo de texto mascarado. A troca só é invisível para o
 * resto do sistema enquanto o FormControl continuar falando ISO, que é o que o backend
 * recebe (`LocalDate`) e o que a tela compara e ordena como texto. O calendário nativo
 * também recusava 32/13 de graça; agora quem recusa é o validador.
 */
describe('Conversão entre a data digitada e o ISO do FormControl', () => {

  it('leva o ISO do backend para a tela como dígitos na ordem dd mm aaaa', () => {
    expect(entradaData('2026-08-28')).toBe('28082026');
  });

  it('tolera o ISO com hora, descartando a hora', () => {
    expect(entradaData('2026-08-28T13:45:00')).toBe('28082026');
  });

  it('devolve intacto o texto que já está mascarado na tela', () => {
    // O ngx-mask chama a transformação de entrada também a cada tecla, com o valor do
    // input: reescrevê-lo roubaria o cursor de quem está digitando.
    expect(entradaData('28/08/2026')).toBe('28/08/2026');
    expect(entradaData('28/0')).toBe('28/0');
  });

  it('leva a data digitada para o FormControl em ISO', () => {
    expect(saidaData('28082026')).toBe('2026-08-28');
  });

  it('devolve nulo quando o campo está vazio', () => {
    expect(saidaData('')).toBeNull();
    expect(saidaData(null)).toBeNull();
  });

  it('deixa a data incompleta como dígitos, sem completar o que falta', () => {
    // Virar ISO aqui inventaria o ano que não foi digitado, e a data ficaria válida por
    // acidente. É o validador quem reprova.
    expect(saidaData('2808')).toBe('2808');
  });

});

describe('Validação da data digitada', () => {

  function validar(valor: string | null): boolean {
    return dataValida(new FormControl(valor)) === null;
  }

  it('aceita data que existe no calendário', () => {
    expect(validar('2026-08-28')).toBe(true);
    expect(validar('1990-01-01')).toBe(true);
  });

  it('aceita campo vazio, porque exigir preenchimento é do required', () => {
    expect(validar(null)).toBe(true);
    expect(validar('')).toBe(true);
  });

  it('recusa dia e mês que não existem', () => {
    expect(validar('2026-13-01')).toBe(false);
    expect(validar('2026-01-32')).toBe(false);
    expect(validar('2026-00-10')).toBe(false);
    expect(validar('2026-02-30')).toBe(false);
  });

  it('recusa 29 de fevereiro fora do ano bissexto e aceita dentro dele', () => {
    expect(validar('2026-02-29')).toBe(false);
    expect(validar('2024-02-29')).toBe(true);
    // 1900 é divisível por 4 mas não é bissexto: século não múltiplo de 400.
    expect(validar('1900-02-29')).toBe(false);
    expect(validar('2000-02-29')).toBe(true);
  });

  it('recusa data incompleta', () => {
    expect(validar('2808')).toBe(false);
    expect(validar('28/08/20')).toBe(false);
  });

});

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CampoDataComponent],
  template: `
    <form [formGroup]="form">
      <apcore-campo-data inputId="nascimento" formControlName="nascimento"
                        autocomplete="bday"></apcore-campo-data>
      <apcore-campo-data inputId="pagamento" formControlName="pagamento"
                        [obrigatorio]="true"
                        mensagemObrigatorio="Data do pagamento é um campo obrigatório"></apcore-campo-data>
    </form>
  `
})
class CamposDataHost {
  nascimento = new FormControl<string | null>(null);
  pagamento = new FormControl<string | null>(null, Validators.required);
  form = new FormGroup({ nascimento: this.nascimento, pagamento: this.pagamento });
}

/**
 * A aba de contratação põe a data e o horário do atendimento no mesmo input-group, porque
 * são a mesma ocorrência. Como o grupo é do campo de data, o horário entra nele por
 * projeção de conteúdo — e o Bootstrap só arredonda as pontas certas se os dois forem
 * filhos diretos do grupo, o que é o que este host verifica.
 */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CampoDataComponent],
  template: `
    <form [formGroup]="form">
      <apcore-campo-data inputId="frequencia" formControlName="frequencia" [obrigatorio]="true">
        <span class="input-group-text"><i class="fa-regular fa-clock"></i></span>
        <input id="horario" type="time" class="form-control" [formControl]="horario" required>
      </apcore-campo-data>
    </form>
  `
})
class CampoDataComGrupoHost {
  frequencia = new FormControl<string | null>(null, Validators.required);
  horario = new FormControl<string | null>(null, Validators.required);
  form = new FormGroup({ frequencia: this.frequencia, horario: this.horario });
}

describe('Campo de data dividindo o input-group com outro campo', () => {

  it('põe o campo projetado como filho direto do grupo, depois da data', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CampoDataComGrupoHost],
      providers: [provideNgxMask()]
    });

    const fixture = TestBed.createComponent(CampoDataComGrupoHost);
    fixture.detectChanges();

    const grupo: HTMLElement = fixture.nativeElement.querySelector('.input-group');
    const filhos = Array.from(grupo.children).filter(filho => filho.tagName !== 'DIV');

    expect(filhos.map(filho => filho.id || filho.className))
      .toEqual(['frequencia', 'input-group-text', 'horario']);
  });

});

describe('Campo de data na tela', () => {

  function montar() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CamposDataHost],
      providers: [provideNgxMask()]
    });

    const fixture = TestBed.createComponent(CamposDataHost);
    fixture.detectChanges();

    return fixture;
  }

  /**
   * Digita caractere a caractere. O `focus` inicial não é decoração: sem ele o ngx-mask
   * engole a primeira tecla, porque ainda está no estado de escrita do valor inicial.
   */
  function digitar(fixture: ReturnType<typeof montar>, texto: string): HTMLInputElement {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#nascimento');
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    for (const caractere of texto) {
      input.value = input.value + caractere;
      input.setSelectionRange(input.value.length, input.value.length);
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    return input;
  }

  it('é um campo de texto numérico, e não o seletor de calendário nativo', () => {
    const input: HTMLInputElement = montar().nativeElement.querySelector('#nascimento');

    expect(input.type).toBe('text');
    expect(input.getAttribute('inputmode')).toBe('numeric');
    expect(input.placeholder).toBe('dd/mm/aaaa');
    expect(input.getAttribute('autocomplete')).toBe('bday');
  });

  it('põe as barras enquanto se digita e entrega o ISO ao FormControl', () => {
    const fixture = montar();

    expect(digitar(fixture, '28082026').value).toBe('28/08/2026');
    expect(fixture.componentInstance.nascimento.value).toBe('2026-08-28');
  });

  it('mostra em dd/mm/aaaa a data que chega do backend em ISO', () => {
    const fixture = montar();
    fixture.componentInstance.nascimento.setValue('1990-03-15');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#nascimento').value).toBe('15/03/1990');
  });

  it('invalida o formulário quando a data digitada não existe', () => {
    const fixture = montar();
    digitar(fixture, '32132026');

    expect(fixture.componentInstance.nascimento.hasError('data')).toBe(true);
    expect(fixture.componentInstance.form.valid).toBe(false);
  });

  it('invalida o formulário enquanto a data está incompleta', () => {
    const fixture = montar();
    digitar(fixture, '2808');

    expect(fixture.componentInstance.nascimento.hasError('data')).toBe(true);
  });

  it('aceita o campo opcional em branco', () => {
    const fixture = montar();
    fixture.componentInstance.pagamento.setValue('2026-08-28');
    fixture.detectChanges();

    expect(fixture.componentInstance.nascimento.valid).toBe(true);
    expect(fixture.componentInstance.form.valid).toBe(true);
  });

  it('aponta a data inexistente, e não o campo obrigatório, quando o campo tem as duas coisas', () => {
    const fixture = montar();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#pagamento');

    input.dispatchEvent(new Event('focus'));
    for (const caractere of '32132026') {
      input.value = input.value + caractere;
      input.setSelectionRange(input.value.length, input.value.length);
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    const grupo = input.closest('.input-group')!;
    expect(grupo.querySelector('.invalid-feedback')?.textContent?.trim())
      .toBe('Data inválida: use o formato dd/mm/aaaa');
  });

  it('cobra o preenchimento do campo obrigatório vazio', () => {
    const fixture = montar();
    const grupo = fixture.nativeElement.querySelector('#pagamento').closest('.input-group');

    expect(grupo.querySelector('.invalid-feedback').textContent.trim())
      .toBe('Data do pagamento é um campo obrigatório');
  });

  it('não deixa o has-validation no grupo sem mensagem, que arredondaria o ícone por dentro', () => {
    const fixture = montar();
    const grupo = fixture.nativeElement.querySelector('#nascimento').closest('.input-group');

    expect(grupo.classList.contains('has-validation')).toBe(false);
  });

  it('devolve o campo vazio ao FormControl quando tudo é apagado', () => {
    const fixture = montar();
    const input = digitar(fixture, '28082026');

    while (input.value.length) {
      input.value = input.value.slice(0, -1);
      input.setSelectionRange(input.value.length, input.value.length);
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    expect(fixture.componentInstance.nascimento.value).toBeNull();
    expect(fixture.componentInstance.nascimento.valid).toBe(true);
  });

});
