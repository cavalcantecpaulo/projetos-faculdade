/* Bibliotecas */
#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include <locale.h>


/* Variáveis*/
//numero de linhas máximas pra cada esporte, dividindo 365 dias por 2,3,5 ou 9 dias = resultado igual ao numero de linahs máximas//
#define MAX_ATLETISMO 183
#define MAX_NATACAO 122
#define MAX_RUGBY 73
#define MAX_JUDO 41

int dia, mes, ano, dias_no_mes;


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
    data.tm_mon = mes -1;
    data.tm_year = ano -1900;
    mktime(&data);
    int dia_da_semana = data.tm_wday;
    snprintf(buffer, 40, "%s", nome_dia_da_semana(dia_da_semana));
}
/* Corpo do programa */
int ano_bissexto(int ano) {
    return (ano %4 == 0 && ano % 100 != 0) || (ano %400 == 0);
    }
///////////////////////ajustar meses///////////////////////////////////////
        void ajustar_data(int *dia, int *mes, int *ano, int incremento) {
        *dia += incremento;

   while (*dia > 28) {
        if (*mes == 2) {
            dias_no_mes = ano_bissexto(*ano) ? 29 : 28;
            } else if (*mes == 4 || *mes == 6 || *mes == 9 || *mes == 11) {
            dias_no_mes = 30;
      } else 
        dias_no_mes = 31;
/////no limite de dias, ele avança ao próximo mês, e no limite de meses ele avança o ano.//

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

int main (void) {

 setlocale(LC_ALL, "pt_BR.UTF-8");

 FILE *file = fopen("saidadedata.txt", "w"); // Abre o arquivo para escrita

    if (file == NULL) {
        printf("Erro ao abrir o arquivo!\n");
        return 1;
    }
//DIGITAÇÃO DA DATA, PADRÃO//

        printf("Seja bem-vindo ao programa de verifica%c%co de datas!", 135, 198);
        printf ("\nDigite um dia de 1 a 31: ");
        scanf ( "%i", &dia );
    if ( dia<1  || dia>31 ) {
        printf ("\n\nDIA INV%cLIDO!!!!!!!!!!\a\a", 181);
        fclose(file);
        return 1;
        }

        printf ("\n\nDigite um mes: "); 
        scanf ( "%i", &mes );
    if ( mes<1  || mes>12 ) {
        printf ("\n\nM%cS INV%cLIDO!!!!!!!!!\a\a", 210, 181);
        fclose(file);
        return 1;
    }
   /////verificação de meses com no máximo 30 dias///    
   else if  ((mes == 4 || mes==6 || mes==9 || mes == 11) && dia > 30) {
        printf("\n\nDIA INV%cLIDO, ESSE M%cS TEM APENAS 30 DIAS!!!!!!!!!!\a\a", 181, 210);
        fclose(file);
        return 1;
    }
   // Verificar se dia é válido para o mês de fevereiro//
    else if (mes == 2 && dia > (ano_bissexto(ano) ? 29 : 28)) {
        printf("\n\nDIA INV%cLIDO PARA O M%cS DE FEVEREIRO!!!!!!!!!!\a\a", 181, 210);
        fclose(file);
        return 1;
       }
       printf ("\nM%cS VaLIDO!\a\a", 210, 181);

        printf ("\n\nDigite um ano de 1 a 9999: "); 
        scanf ( "%i", &ano );
    if ( ano<1500  || ano>9999 ) {
        printf ("\n\nANO INV%cLIDO!!!!!!!!!!\a\a", 181);
        fclose(file);
        return 1;
    }else 
    printf ("\nANO V%cLIDO!\a\a", 181);

//TABELA E FORMA QUE ELA SERÁ IMPRIMIDA //
    fprintf (file," Data Fornecida: %02i/%02i/%04i; ", dia, mes, ano);
    fprintf (file, "\nOs esportes Atletismo, Natação, Rugby e Judô ser%co praticados no clube nas respectivas datas: ");
   	fprintf(file, "\n\n         ATLETISMO                    NATAÇÃO                       RUGBY                       JUDÔ\n");
    fprintf(file, "--------------------------    ----------------------------       -------------------          -----------------\n");
    
//divisão de datas uma por uma para não haver problema na execução do código pra não afetar datas//
    int dia_atletismo = dia, mes_atletismo = mes, ano_atletismo = ano;
    int dia_natacao = dia, mes_natacao = mes, ano_natacao = ano;
    int dia_rugby = dia, mes_rugby = mes, ano_rugby = ano;
    int dia_judo = dia, mes_judo = mes, ano_judo = ano;
    
    for (int i = 0; i < MAX_ATLETISMO || i< MAX_NATACAO || i < MAX_RUGBY || i < MAX_JUDO; i++) {

    if (i < MAX_ATLETISMO) {
        char dia_semana[40];
            diadasemana(dia_atletismo, mes_atletismo, ano_atletismo, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-18s ", dia_atletismo, mes_atletismo, ano_atletismo, dia_semana);
            ajustar_data ( &dia_atletismo, &mes_atletismo, &ano_atletismo, +2);
        } else {
        fprintf(file, "                    ");
        }
    if (i < MAX_NATACAO) {
        char dia_semana[40];    
            diadasemana(dia_natacao, mes_natacao, ano_natacao, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-18s ", dia_natacao, mes_natacao, ano_natacao, dia_semana);
            ajustar_data (&dia_natacao, &mes_natacao, &ano_natacao, +3);
        } else {
        fprintf(file, "                    ");
        }
    if (i < MAX_RUGBY) {
        char dia_semana[40];
            diadasemana(dia_rugby, mes_rugby, ano_rugby, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-18s ", dia_rugby, mes_rugby, ano_rugby, dia_semana);
            ajustar_data (&dia_rugby, &mes_rugby, &ano_rugby, +5);
        } else {
        fprintf(file, "                    ");
        }
    if (i < MAX_JUDO) {
        char dia_semana[40];
            diadasemana(dia_judo, mes_judo, ano_judo, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-18s\n", dia_judo, mes_judo, ano_judo, dia_semana);
            ajustar_data (&dia_judo, &mes_judo, &ano_judo, +9);
        } else {
        fprintf(file, "\n");
        }
        }
    fclose(file);
    printf("\n\n\nArquivo 'saidadedata.txt' gerado com sucesso!\n");
    return 10;
}