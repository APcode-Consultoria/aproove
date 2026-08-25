import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CampoMoedaComponent } from '@andre.penteado/ngx-apcore';
import { MASCARA_CEP, MASCARA_CPF, MASCARA_TELEFONE } from './cadastro.component';

/**
 * As máscaras do ngx-mask são validadores de diretiva: só existem com o template
 * renderizado, e o spec do CadastroComponent monta o componente sem template. Este host
 * reproduz apenas os campos mascarados, com as mesmas constantes e os mesmos atributos
 * que a tela usa.
 *
 * O que estes testes protegem: um valor que não fecha a máscara invalida o FormGroup
 * inteiro, e o `gravar()` da base recusa a gravação com a mensagem genérica de dados
 * obrigatórios. Foi o que aconteceu enquanto CPF, CEP e Telefone eram BIGINT no banco —
 * o zero à esquerda se perdia e o valor voltava curto demais para a máscara.
 */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, CampoMoedaComponent],
  template: `
    <form [formGroup]="form">
      <input formControlName="cpf" [mask]="mascaraCpf">
      <input formControlName="telefone" [mask]="mascaraTelefone">
      <input formControlName="cep" [mask]="mascaraCep">
      <apcore-campo-moeda inputId="moeda" formControlName="valor"></apcore-campo-moeda>
    </form>
  `
})
class CamposMascaradosHost {
  readonly mascaraCpf = MASCARA_CPF;
  readonly mascaraTelefone = MASCARA_TELEFONE;
  readonly mascaraCep = MASCARA_CEP;

  cpf = new FormControl<string | null>(null);
  telefone = new FormControl<string | null>(null);
  cep = new FormControl<string | null>(null);
  valor = new FormControl<any>(null);
  form = new FormGroup({ cpf: this.cpf, telefone: this.telefone, cep: this.cep, valor: this.valor });
}

describe('Máscaras do cadastro de paciente', () => {
  function validar(valores: Partial<Record<'cpf' | 'telefone' | 'cep', string | null>>): FormGroup {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CamposMascaradosHost],
      providers: [provideNgxMask()]
    });

    const fixture = TestBed.createComponent(CamposMascaradosHost);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue(valores);
    fixture.detectChanges();

    return fixture.componentInstance.form;
  }

  it('aceita CPF e CEP com zero à esquerda', () => {
    expect(validar({ cpf: '01234567890', cep: '01310100' }).valid).toBe(true);
  });

  it('aceita telefone fixo de 10 dígitos e celular de 11', () => {
    expect(validar({ telefone: '1133334444' }).valid).toBe(true);
    expect(validar({ telefone: '11987654321' }).valid).toBe(true);
  });

  it('aceita os campos em branco, todos opcionais', () => {
    expect(validar({ cpf: null, telefone: null, cep: null }).valid).toBe(true);
  });

  it('recusa valor que não completa a máscara', () => {
    expect(validar({ cpf: '0123456' }).get('cpf')?.hasError('mask')).toBe(true);
    expect(validar({ telefone: '113333444' }).get('telefone')?.hasError('mask')).toBe(true);
    expect(validar({ cep: '013101' }).get('cep')?.hasError('mask')).toBe(true);
  });
});

/**
 * O campo de moeda mora na ngx-apcore (`apcore-campo-moeda`), e não neste projeto: são
 * quatro configurações do ngx-mask que só funcionam juntas, e repeti-las à mão em cada
 * tela era a chance de errar uma delas. Sem `typeFromDecimals` o separador decimal tinha
 * que ser digitado, e quem digitava 15050 esperando R$ 150,50 gravava quinze mil e
 * cinquenta reais — ou trocava ponto por vírgula e recebia um valor mil vezes maior.
 *
 * Estes testes ficam aqui de propósito, mesmo o componente sendo de fora: eles protegem
 * o comportamento de que este projeto depende, e é a atualização da biblioteca que
 * poderia quebrá-lo sem ninguém perceber.
 */
describe('Campo de moeda do cadastro de paciente', () => {
  function montar() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CamposMascaradosHost],
      providers: [provideNgxMask()]
    });

    const fixture = TestBed.createComponent(CamposMascaradosHost);
    fixture.detectChanges();

    return fixture;
  }

  /**
   * Digita caractere a caractere no campo de moeda.
   *
   * <p>O `focus` inicial não é decoração: sem ele o ngx-mask engole a primeira tecla,
   * porque ainda está no estado de escrita do valor inicial.</p>
   */
  function digitar(fixture: ReturnType<typeof montar>, texto: string): HTMLInputElement {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#moeda');
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

  it('preenche os centavos primeiro, da direita para a esquerda', () => {
    const fixture = montar();
    expect(digitar(fixture, '15050').value).toBe('150,50');
    expect(fixture.componentInstance.valor.value).toBe(150.5);
  });

  it('ignora o ponto e a vírgula digitados, que não têm como trocar de papel', () => {
    expect(digitar(montar(), '150.50').value).toBe('150,50');
    expect(digitar(montar(), '150,50').value).toBe('150,50');
  });

  it('agrupa o milhar com ponto e separa os centavos com vírgula', () => {
    const fixture = montar();
    expect(digitar(fixture, '123456').value).toBe('1.234,56');
    expect(fixture.componentInstance.valor.value).toBe(1234.56);
  });

  it('entrega um number ao FormControl, e não a string mascarada', () => {
    const fixture = montar();
    digitar(fixture, '123456');

    expect(typeof fixture.componentInstance.valor.value).toBe('number');
  });

  it('completa as casas decimais do valor que chega do backend', () => {
    const fixture = montar();
    fixture.componentInstance.valor.setValue(1234.5);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#moeda').value).toBe('1.234,50');
  });

  it('devolve o campo vazio quando tudo é apagado', () => {
    const fixture = montar();
    const input = digitar(fixture, '15050');

    while (input.value.length) {
      input.value = input.value.slice(0, -1);
      input.setSelectionRange(input.value.length, input.value.length);
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    expect(input.value).toBe('');
    // Nulo, e não zero: valor não informado não é valor zero.
    expect(fixture.componentInstance.valor.value).toBeNull();
  });
});
