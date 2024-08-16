/* Bibliotecas */
#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include <locale.h>
#include <conio.h>

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

void ajustar_data(int *dia, int *mes, int *ano, int incremento) { //ajustar meses//
        *dia += incremento;
    while (*dia > 28) {
        if (*mes == 2) {
            dias_no_mes = ano_bissexto(*ano) ? 29 : 28;
            } else if (*mes == 4 || *mes == 6 || *mes == 9 || *mes == 11) {
            dias_no_mes = 30;
      } dias_no_mes = 31; //no limite de dias, ele avança ao próximo mês, e no limite de meses ele avança o ano.//

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
int vdiaspormes(){
    if (mes == 2) {
         dias_no_mes = ano_bissexto(ano) ? 29 : 28;
        if (dia > dias_no_mes) {
                getch();
                system("cls");
                return 2;
            }
        }
    if  ((mes == 4 || mes==6 || mes==9 || mes == 11) && dia > 30) { //verificação de meses com no máximo 30 dias//   
        printf("\n\nDIA INVÁLIDO, ESSE MÊS TEM APENAS 30 DIAS!!!!!!!!!!");
        getch();
        system("cls");
        return 2;
    }
       printf ("\nMÊS VÁLIDO!");
       return 0;
}
  int digitardia(){
        printf ("\n\nDigite um dia de 1 a 31: ");
        scanf ( "%i", &dia );
    if ( dia<1  || dia>31 ) {
        printf ("\n\nDIA INVÁLIDO!!!!!!!!!!");
        return 1;
    } else {
        printf ("\nDIA VÁLIDO!");
        return 0;
    }
 } 
int digitarmes(){
        system("cls");
        printf("%.2i/ \b", dia);
        printf ("\n\nDigite um mês: "); 
        scanf ( "%i", &mes );
    if ( mes<1  || mes>12 ) {
        printf ("\n\nMÊS INVÁLIDO!!!!!!!!!");
        return 1;
    }
    printf ("\n\nMÊS VÁLIDO!!!!!!!!!");
        return 0;
}
int digitarano(){
        system("cls");
        printf("%.2i/%.2i/ \b", dia,mes);
        printf ("\n\nDigite um ano de 1900 a 3000: "); 
        scanf ( "%i", &ano );
    if ( ano<1900  || ano>3000 ) {
        printf ("\n\nANO INVÁLIDO!!!!!!!!!!");
        return 1;
    } else {
        printf ("\nANO VÁLIDO!");
        getch();
        return 0;
    }
}
int inserirData(){
    printf("Seja bem-vindo ao programa de verificação de datas!");
    do {
        while (digitardia()!=0) {
    
        system("cls");
        printf("\nInsira um dia válido");
        }

        system("cls");
        printf("%.2i/ \b", dia);
    while (digitarmes()!=0) {
        system("cls");
        printf("%.2i/ \b", dia);
        printf("\nInsira um mês válido");
        }
        system("cls");
        printf("%.2i/%.2i/ \b", dia,mes);
    
    while (digitarano()!=0) {
        system("cls");
        printf("%.2i/%.2i/ \b", dia,mes);
        printf("\nInsira um ano válido");
    }
     system("cls");   
    printf("\nData Fornecida: %02i/%02i/%04i", dia, mes, ano);
    
while (dia == 29 && mes == 2 && !ano_bissexto(ano)) {
            printf("\n\nESSE ANO NÃO É BISSEXTO, INSIRA NOVAMENTE!");
            ////////arrumar/////
            while (digitardia() != 0) {
                system("cls");
                printf("\nInsira um dia válido");
            }
            system("cls");
            printf("%.2i/ \b", dia);
            while (digitarmes() != 0) {
                system("cls");
                printf("%.2i/ \b", dia);
                printf("\nInsira um mês válido");
            }
            system("cls");
            printf("%.2i/%.2i/ \b", dia, mes);
            while (digitarano() != 0) {
                system("cls");
                printf("%.2i/%.2i/ \b", dia, mes);
                printf("\nInsira um ano válido");
            }
            system("cls");
            printf("%.2i/%.2i/%04i", dia, mes, ano);
        }
        }
 while (dia == 29 && mes == 2 && !ano_bissexto(ano));
}

int main () {

 setlocale(LC_ALL, "pt_BR.UTF-8");

 FILE *file = fopen("datastreinos.txt", "w"); // Abre o arquivo para escrita

    if (file == NULL) {
        printf("\nErro ao abrir o arquivo!");
        return 1;
    }
//DIGITAÇÃO DA DATA//
 inserirData();

//TABELA E FORMA QUE ELA SERÁ IMPRIMIDA //
    fprintf (file,"Data Fornecida: %02i/%02i/%04i; ", dia, mes, ano);
    fprintf (file, "\nOs esportes Atletismo, Natação, Rugby e Judô serão praticados no clube nas seguintes datas: ");
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
    printf("\n\n\nArquivo 'datastreinos.txt' gerado com sucesso!\n");
    return 10;
}