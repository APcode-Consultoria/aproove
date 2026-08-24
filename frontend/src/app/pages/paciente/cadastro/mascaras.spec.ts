import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MASCARA_CEP, MASCARA_CPF, MASCARA_TELEFONE } from './cadastro.component';

/**
 * As máscaras do ngx-mask são validadores de diretiva: só existem com o template
 * renderizado, e o spec do CadastroComponent monta o componente sem template. Este host
 * reproduz apenas os três campos mascarados, com as mesmas constantes que a tela usa.
 *
 * O que estes testes protegem: um valor que não fecha a máscara invalida o FormGroup
 * inteiro, e o `gravar()` da base recusa a gravação com a mensagem genérica de dados
 * obrigatórios. Foi o que aconteceu enquanto CPF, CEP e Telefone eram BIGINT no banco —
 * o zero à esquerda se perdia e o valor voltava curto demais para a máscara.
 */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  template: `
    <form [formGroup]="form">
      <input formControlName="cpf" [mask]="mascaraCpf">
      <input formControlName="telefone" [mask]="mascaraTelefone">
      <input formControlName="cep" [mask]="mascaraCep">
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
  form = new FormGroup({ cpf: this.cpf, telefone: this.telefone, cep: this.cep });
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
