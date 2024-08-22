/* Bibliotecas */
#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<locale.h>

/* Variáveis*/
#define maxAtletismo 183                //numero de linhas máximas pra cada esporte//
#define maxNatacao 122                 //dividindo 365 dias por 2,3,5 ou 9 dias//
#define maxRugby 73                    //resultado igual ao numero de linhas máximas por esporte//
#define maxJudo 41

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
void mostrarDatas();
void digitarData();

const char* nome_dia_da_semana(int dia_da_semana) {
    switch (dia_da_semana) {
        case 0: return "Domingo";
        case 1: return "Segunda-feira";
        case 2: return "Terca-feira";
        case 3: return "Quarta-feira";
        case 4: return "Quinta-feira";
        case 5: return "Sexta-feira";
        case 6: return "Sabado";
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
    snprintf(buffer, 15, "%s", nome_dia_da_semana(dia_da_semana));
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
    } else if  (mes == 4 || mes==6 || mes==9 || mes == 11){   
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
        printf ("\nDigite um dia de 1 a 31: ");
        scanf ( "%i", &dia );
    if ( dia>=1 && dia<=31 ) {
        return 0;
    }
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
    }
}
void digitarData() {
    digitardia();
    digitarmes();
    digitarano();
}
void loopdata(){
    while (vdiaspormes(dia, mes, ano) != 0 || (dia == 29 && mes==2 && !ano_bissexto(ano))) {
         if (dia == 29 && mes == 2 && !ano_bissexto(ano)) {
                printf("\nESSE ANO NÃO É BISSEXTO, INSIRA NOVAMENTE!\n");
            } else {
                printf("\nDATA INVÁLIDA!!!\n");
            } 
            digitarData();
            }
        }
void verificarData(){
    do {
        printf("Seja bem-vindo ao programa de verificação de datas!");
        digitarData();
        loopdata();
    } while (dia == 29 && mes == 2 && !ano_bissexto(ano));
    system("cls"); 
    printf("Data Fornecida: %02i/%02i/%04i", dia, mes, ano);
}
void mostrarDatas(){
    FILE *arquivo = fopen("datastreinos.txt", "w");
    if (arquivo == NULL) {
        printf("\nErro ao abrir o arquivo!");
        return;
    }
    fprintf (arquivo,"Data Fornecida: %02i/%02i/%04i; ", dia, mes, ano);
    fprintf(arquivo, "\nOs esportes Atletismo, Natação, Rugby e Judô serão praticados no clube nas seguintes datas: ");
    fprintf(arquivo, "\n\n-----------------------------------------------------------------------------------------------------------------------\n");
    fprintf(arquivo, "|         ATLETISMO         ||           NATAÇÃO          ||           RUGBY            ||            JUDÔ            |\n");
    fprintf(arquivo, "-----------------------------------------------------------------------------------------------------------------------\n");
    
    int dia_atletismo = dia, mes_atletismo = mes, ano_atletismo = ano;
    int dia_natacao = dia, mes_natacao = mes, ano_natacao = ano;
    int dia_rugby = dia, mes_rugby = mes, ano_rugby = ano;	//divisão de datas uma por uma para não haver problema//
    int dia_judo = dia, mes_judo = mes, ano_judo = ano;  	//na execução do código pra não afetar datas//
    
    for (int i = 0; i < maxAtletismo || i<maxNatacao || i <maxRugby || i <maxJudo; i++) {
    if (i < maxAtletismo) {
        char dia_semana[14];
            diadasemana(dia_atletismo, mes_atletismo, ano_atletismo, dia_semana);
            fprintf(arquivo, " %02i/%02i/%04i - %-13s || ", dia_atletismo, mes_atletismo, ano_atletismo, dia_semana);
            ajustar_data ( &dia_atletismo, &mes_atletismo, &ano_atletismo, +2);
        } else {
        fprintf(arquivo, "                    ");
        }

    if (i < maxNatacao) {
        char dia_semana[14];    
            diadasemana(dia_natacao, mes_natacao, ano_natacao, dia_semana);
            fprintf(arquivo, "%02i/%02i/%04i - %-13s || ", dia_natacao, mes_natacao, ano_natacao, dia_semana);
            ajustar_data (&dia_natacao, &mes_natacao, &ano_natacao, +3);
        } else {
        fprintf(arquivo, "                    ");
        }
    if (i < maxRugby) {
        char dia_semana[14];
            diadasemana(dia_rugby, mes_rugby, ano_rugby, dia_semana);
            fprintf(arquivo, "%02i/%02i/%04i - %-13s || ", dia_rugby, mes_rugby, ano_rugby, dia_semana);
            ajustar_data (&dia_rugby, &mes_rugby, &ano_rugby, +5);
        } else {
        fprintf(arquivo, "                    ");
        }

    if (i < maxJudo) {
        char dia_semana[14];
            diadasemana(dia_judo, mes_judo, ano_judo, dia_semana);
            fprintf(arquivo, "%02i/%02i/%04i - %-13s |\n", dia_judo, mes_judo, ano_judo, dia_semana);
            ajustar_data (&dia_judo, &mes_judo, &ano_judo, +9);
        } else {
        fprintf(arquivo, "\n");
        }
    }
    fclose(arquivo);
    printf("\n\nArquivo 'datastreinos.txt' gerado com sucesso!Obrigado!\n\n");
}
int main() {
    setlocale(LC_ALL, "pt_BR.UTF-8");
    verificarData();
    mostrarDatas();
    return 10;
}