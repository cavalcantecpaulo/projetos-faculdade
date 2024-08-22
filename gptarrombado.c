#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <locale.h>

#define MAX_ATLETISMO 183
#define MAX_NATACAO 122
#define MAX_RUGBY 73
#define MAX_JUDO 41

typedef struct {
    int dia, mes, ano;
    char dia_semana[15];
} datas;

// Define uma estrutura com 4 colunas: uma para cada esporte
typedef struct {
    datas atletismo[MAX_ATLETISMO];
    datas natacao[MAX_NATACAO];
    datas rugby[MAX_RUGBY];
    datas judo[MAX_JUDO];
} tabela_sports;

tabela_sports tabela;
int aloc_atletismo = -1;
int aloc_natacao = -1;
int aloc_rugby = -1;
int aloc_judo = -1;

const char* nome_dia_da_semana(int dia_da_semana) {
    switch (dia_da_semana) {
        case 0: return "Domingo";
        case 1: return "Segunda-feira";
        case 2: return "Terça-feira";
        case 3: return "Quarta-feira";
        case 4: return "Quinta-feira";
        case 5: return "Sexta-feira";
        case 6: return "Sábado";
        default: return "Erro";
    }
}

void diadasemana(int dia, int mes, int ano, char *buffer) {
    setlocale(LC_TIME, "pt_BR.UTF-8");
    struct tm data = {0};
    data.tm_mday = dia;
    data.tm_mon = mes - 1;
    data.tm_year = ano - 1900;
    mktime(&data);
    int dia_da_semana = data.tm_wday;
    snprintf(buffer, 40, "%s", nome_dia_da_semana(dia_da_semana));
}

int ano_bissexto(int ano) {
    return (ano % 4 == 0 && ano % 100 != 0) || (ano % 400 == 0);
}

void ajustar_data(int *dia, int *mes, int *ano, int incremento) {
    *dia += incremento;
    while (1) {
        int dias_no_mes;
        if (*mes == 2) {
            dias_no_mes = ano_bissexto(*ano) ? 29 : 28;
        } else if (*mes == 4 || *mes == 6 || *mes == 9 || *mes == 11) {
            dias_no_mes = 30;
        } else {
            dias_no_mes = 31;
        }

        if (*dia > dias_no_mes) {
            *dia -= dias_no_mes;
            (*mes)++;
            if (*mes > 12) {
                *mes = 1;
                (*ano)++;
            }
        } else {
            break;
        }
    }
}

void gerar_datas(int inicio_dia, int inicio_mes, int inicio_ano, int intervalo, int max_datas, datas *tabela, int *aloc) {
    int dia = inicio_dia;
    int mes = inicio_mes;
    int ano = inicio_ano;

    for (int i = 0; i < max_datas; i++) {
        (*aloc)++;
        tabela[*aloc].dia = dia;
        tabela[*aloc].mes = mes;
        tabela[*aloc].ano = ano;
        diadasemana(dia, mes, ano, tabela[*aloc].dia_semana);

        // Ajustar a data
        ajustar_data(&dia, &mes, &ano, intervalo);

        // Verificar se o próximo índice está dentro do limite
        if (*aloc >= MAX_ATLETISMO + MAX_NATACAO + MAX_RUGBY + MAX_JUDO - 1) break;
    }
}

void salvar_dados(const char *nome_arquivo) {
    FILE *file = fopen(nome_arquivo, "w");
    if (file == NULL) {
        printf("Erro ao abrir o arquivo!\n");
        return;
    }

    fprintf(file, "Atletismo\t\t\t\t\tNatacao\t\t\t\t\tRugby\t\t\t\t\tJudo\n");
    fprintf(file, "-----------------------------\t\t-----------------------------\t\t-----------------------------\t\t-----------------------------\n");

    int max_linhas = (aloc_atletismo > aloc_natacao) ? aloc_atletismo : aloc_natacao;
    max_linhas = (max_linhas > aloc_rugby) ? max_linhas : aloc_rugby;
    max_linhas = (max_linhas > aloc_judo) ? max_linhas : aloc_judo;

    for (int i = 0; i <= max_linhas; i++) {
        if (i <= aloc_atletismo) {
            fprintf(file, "\n%02i/%02i/%04i - %15s", tabela.atletismo[i].dia, tabela.atletismo[i].mes, tabela.atletismo[i].ano, tabela.atletismo[i].dia_semana);
        } else {
            fprintf(file, "                    ");
        }

        if (i <= aloc_natacao) {
            fprintf(file, "%02i/%02i/%04i - %15s", tabela.natacao[i].dia, tabela.natacao[i].mes, tabela.natacao[i].ano, tabela.natacao[i].dia_semana);
        } else {
            fprintf(file, "                    ");
        }
        if (i <= aloc_rugby) {
            fprintf(file, "%02i/%02i/%04i - %15s", tabela.rugby[i].dia, tabela.rugby[i].mes, tabela.rugby[i].ano, tabela.rugby[i].dia_semana);
        } else {
            fprintf(file, "                    ");
        }

        if (i <= aloc_judo) {
            fprintf(file, "%02i/%02i/%04i - %15s\n", tabela.judo[i].dia, tabela.judo[i].mes, tabela.judo[i].ano, tabela.judo[i].dia_semana);
        } else {
            fprintf(file, "                    ");
        }
    }

    fclose(file);
    printf("Arquivo '%s' gerado com sucesso!\n", nome_arquivo);
}

int main() {
    setlocale(LC_ALL, "pt_BR.UTF-8");

    // Gerar datas para os quatro esportes com intervalos diferentes
    gerar_datas(1, 1, 2024, 2, MAX_ATLETISMO, tabela.atletismo, &aloc_atletismo);  // Atletismo
    gerar_datas(1, 1, 2024, 3, MAX_NATACAO, tabela.natacao, &aloc_natacao);    // Natação
    gerar_datas(1, 1, 2024, 5, MAX_RUGBY, tabela.rugby, &aloc_rugby);      // Rugby
    gerar_datas(1, 1, 2024, 9, MAX_JUDO, tabela.judo, &aloc_judo);       // Judô

    salvar_dados("datastreinos.txt");

    return 0;
}
