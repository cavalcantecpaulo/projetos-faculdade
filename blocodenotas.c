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

const char* nome_dia_da_semana(int dia_da_semana); 
void diadasemana(int dia, int mes, int ano, char *buffer);
int ano_bissexto(int ano);
void ajustar_data(int *dia, int *mes, int *ano, int incremento);
int vdiaspormes(int dia, int mes, int ano);
int digitardia();
int digitarmes();
int digitarano();
void loopdata();
void inserirData();

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
     } else { 
        dias_no_mes = 31;
     } 
        if (*dia > dias_no_mes) {
            *dia -= dias_no_mes;
           (*mes)++;
            if (*mes > 12) {
                *mes = 1;
                (*ano)++;//no limite de dias, ele avança ao próximo mês, e no limite de meses ele avança o ano.//
            }
        } else {
            break;
        }
    }
}
int vdiaspormes(int dia, int mes, int ano) {
    if (mes == 2) {
         dias_no_mes = ano_bissexto(ano) ? 29 : 28;
    } else if  (mes == 4 || mes==6 || mes==9 || mes == 11){ //verificação de meses com no máximo 30 dias//   
        dias_no_mes= 30;
    } else if (mes >= 1 && mes <= 12) {
        dias_no_mes = 31;
    } else {
    return 1;
    }
    return (dia < 1 || dia > dias_no_mes) ? 1 : 0;
}
  int digitardia(){
        while(1){
        printf ("\n\nDigite um dia de 1 a 31: ");
        scanf ( "%i", &dia );
    if ( dia>=1 && dia<=31 ) {
        return 0;
    }
        printf ("\n\nDIA INVÁLIDO!!!!!!!!!!");
    }
}
int digitarmes() {
        while(1){
        system("cls");
        printf("%.2i/ \b", dia);
        printf ("\n\nDigite um mês: "); 
        scanf ( "%i", &mes );
    if ( mes>=1 && mes<=12 ) {
        return 0;
    }
    printf ("\n\nMÊS INVÁLIDO!!!!!!!!!");
    }
}
int digitarano(){
    while(1){
        system("cls");
        printf("%.2i/%.2i/ \b", dia,mes);
        printf ("\n\nDigite um ano de 1900 a 3000: "); 
        scanf ( "%i", &ano );
    if ( ano>=1900 && ano<=3000 ) {
        return 0;  
    }   
    printf ("\n\nANO INVÁLIDO!!!!!!!!!!");
    }
}
void loopdata(){
    while (vdiaspormes(dia, mes, ano) != 0 || (dia == 29 && mes==2 && !ano_bissexto(ano))) {
         if (dia == 29 && mes == 2 && !ano_bissexto(ano)) {
                printf("\nESSE ANO NÃO É BISSEXTO, INSIRA NOVAMENTE!\n");
            } else {
                printf("\nDATA INVÁLIDA!!!\n");
            }

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

void inserirData(){
    printf("Seja bem-vindo ao programa de verificação de datas!");
    do {
        while (digitardia(&dia)!=0) {
        system("cls");
        printf("\nInsira um dia válido");
        }
        system("cls");
        printf("%.2i/ \b", dia);
    while (digitarmes(&mes)!=0) {
        system("cls");
        printf("%.2i/ \b", dia);
        printf("\nInsira um mês válido");
        }
        system("cls");
        printf("%.2i/%.2i/ \b", dia,mes);
    
    while (digitarano(&ano)!=0) {
        system("cls");
        printf("%.2i/%.2i/ \b", dia,mes);
        printf("\nInsira um ano válido");
    }
     system("cls");   
    printf("\nData Fornecida: %02i/%02i/%04i", dia, mes, ano);

    loopdata();
    } while (dia == 29 && mes == 2 && !ano_bissexto(ano));
}

int main() {

        setlocale(LC_ALL, "pt_BR.UTF-8");
        FILE *file = fopen("datastreinos.txt", "w");
    if (file == NULL) {
        printf("\nErro ao abrir o arquivo!");
        return 1;
    }
 inserirData();

//TABELA E FORMA QUE ELA SERÁ IMPRIMIDA //
    fprintf (file,"Data Fornecida: %02i/%02i/%04i; ", dia, mes, ano);
    fprintf (file, "\nOs esportes Atletismo, Natação, Rugby e Judô serão praticados no clube nas seguintes datas: ");
   	fprintf(file, "\n\n         ATLETISMO                    NATAÇÃO                       RUGBY                       JUDÔ\n");
    fprintf(file, "--------------------------    ----------------------------       -------------------          -----------------\n");
    
    int dia_atletismo = dia, mes_atletismo = mes, ano_atletismo = ano;
    int dia_natacao = dia, mes_natacao = mes, ano_natacao = ano;
    int dia_rugby = dia, mes_rugby = mes, ano_rugby = ano;//divisão de datas uma por uma para não haver problema//
    int dia_judo = dia, mes_judo = mes, ano_judo = ano;  //na execução do código pra não afetar datas//
    
    for (int i = 0; i < MAX_ATLETISMO || i< MAX_NATACAO || i < MAX_RUGBY || i < MAX_JUDO; i++) {

    if (i < MAX_ATLETISMO) {
        char dia_semana[15];
            diadasemana(dia_atletismo, mes_atletismo, ano_atletismo, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-15s ", dia_atletismo, mes_atletismo, ano_atletismo, dia_semana);
            ajustar_data ( &dia_atletismo, &mes_atletismo, &ano_atletismo, +2);
        } else {
        fprintf(file, "                    ");
        }
    if (i < MAX_NATACAO) {
        char dia_semana[15];    
            diadasemana(dia_natacao, mes_natacao, ano_natacao, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-15s ", dia_natacao, mes_natacao, ano_natacao, dia_semana);
            ajustar_data (&dia_natacao, &mes_natacao, &ano_natacao, +3);
        } else {
        fprintf(file, "                    ");
        }
    if (i < MAX_RUGBY) {
        char dia_semana[15];
            diadasemana(dia_rugby, mes_rugby, ano_rugby, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-15s ", dia_rugby, mes_rugby, ano_rugby, dia_semana);
            ajustar_data (&dia_rugby, &mes_rugby, &ano_rugby, +5);
        } else {
        fprintf(file, "                    ");
        }
    if (i < MAX_JUDO) {
        char dia_semana[15];
            diadasemana(dia_judo, mes_judo, ano_judo, dia_semana);
            fprintf(file, "%02i/%02i/%04i - %-15s\n", dia_judo, mes_judo, ano_judo, dia_semana);
            ajustar_data (&dia_judo, &mes_judo, &ano_judo, +9);
        } else {
        fprintf(file, "\n");
        }
    }
    fclose(file);
    printf("\n\n\nArquivo 'datastreinos.txt' gerado com sucesso!\n");
    return 0;
}
