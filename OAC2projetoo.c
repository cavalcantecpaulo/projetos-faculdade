#include<stdio.h>
#include<stdlib.h>
#include<string.h>

char linha[100], mnemonico[10];
int operando,resultado;
unsigned char cabecalho, opcode, operandoByte;

unsigned char gerarOpCode(char *mnemonico) {
    if (strcmp(mnemonico, "NOP") == 0) return 0x00;
    if (strcmp(mnemonico, "STA") == 0) return 0x10;
    if (strcmp(mnemonico, "LDA") == 0) return 0x20;
    if (strcmp(mnemonico, "ADD") == 0) return 0x30;
    if (strcmp(mnemonico, "OR")  == 0) return 0x40;
    if (strcmp(mnemonico, "AND") == 0) return 0x50;
    if (strcmp(mnemonico, "NOT") == 0) return 0x60;
    if (strcmp(mnemonico, "JMP") == 0) return 0x80;
    if (strcmp(mnemonico, "JN")  == 0) return 0x90;
    if (strcmp(mnemonico, "JZ")  == 0) return 0xA0;
    if (strcmp(mnemonico, "HLT") == 0) return 0xF0;
    return 0xFF;
}
int main() {

    FILE *arquivodeentrada = fopen("prog1.asm", "r");
    if (arquivodeentrada == NULL) {
        printf("\nERRO AO ABRIR ARQUIVO!!!");
        return 1;
    }
    FILE *arquivodesaida = fopen("prog1.mem", "wb");
    if (arquivodesaida == NULL) {
        printf("\nERRO AO CRIAR ARQUIVO!!!");
        fclose(arquivodeentrada);
        return 1;
    }

unsigned char cabecalho[] = {0x03, 0x4E, 0x44, 0x52};
    fwrite(cabecalho, sizeof(cabecalho), 1, arquivodesaida);

    while (fgets(linha, sizeof(linha), arquivodeentrada)) {
        int resultado = sscanf(linha, "%s %x", mnemonico, &operando);
        unsigned char opcode = gerarOpCode(mnemonico);

        if (opcode == 0xFF) {
            printf("\nINSTRUÇÃO INVÁLIDA: %s", mnemonico);
            continue;
        }
        fwrite(&opcode, 1, 1, arquivodesaida);
        fwrite("\0", 1, 1, arquivodesaida);

        if (resultado == 2) {
            unsigned char operandoByte = (unsigned char)operando;
            fwrite(&operandoByte, 1, 1, arquivodesaida);
            fwrite("\0", 1, 1, arquivodesaida);
        }
    }
    fclose(arquivodeentrada);
    fclose(arquivodesaida);

    printf("\nArquivo'prog1.mem' gerado.");
    return 0;
}
