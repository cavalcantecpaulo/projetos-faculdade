/* Bibliotecas */
#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<locale.h>

#define maxAtletismo 183
#define maxNatacao 122
#define maxRugby 73
#define maxJudo 41

typedef struct {
    int dia, mes, ano;
    char dia_semana[15];
} data;

data atletismo[maxAtletismo];
data natacao[maxNatacao];
data rugby[maxRugby];
data judo[maxJudo];

int alocAtletismo = -1;
int alocNatacao = -1;
int alocRugby = -1;
int alocJudo = -1;
int dia, mes, ano, dias_no_mes;

/* Variáveis*/
//numero de linhas máximas pra cada esporte, dividindo 365 dias por 2,3,5 ou 9 dias = resultado igual ao numero de linahs máximas//

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
void mostrarDados();
void armazenarData();

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
if (vdiaspormes(dia, mes, ano) != 0 || (dia == 29 && mes==2 && !ano_bissexto(ano))) {
         if (dia == 29 && mes == 2 && !ano_bissexto(ano)) {
                printf("\nESSE ANO NÃO É BISSEXTO, INSIRA NOVAMENTE!\n");
            } else {
                printf("\nDATA INVÁLIDA!!!\n");
            }
            digitardia();
            digitarmes();
            digitarano();
        }
    }
void inserirData(){
    printf("Seja bem-vindo ao programa de verificação de datas!");
    while(1) {
        digitardia();
        digitarmes();
        digitarano();
        system("cls");   
        printf("\nData Fornecida: %02i/%02i/%04i", dia, mes, ano);
    loopdata();
    armazenarData();
    break;
    }
}
 void armazenarData(){
 if (alocAtletismo < maxAtletismo - 1) {
        alocAtletismo++;
            atletismo[alocAtletismo].dia = dia;
            atletismo[alocAtletismo].mes = mes;
            atletismo[alocAtletismo].ano = ano;
   	diadasemana(dia, mes, ano, atletismo[alocAtletismo].dia_semana);
	} else {
        printf("/nVetor Lotado.");
        getch();
    }
    if (alocNatacao < maxNatacao - 1) {
        alocNatacao++;
            natacao[alocNatacao].dia = dia;
            natacao[alocNatacao].mes = mes;
            natacao[alocNatacao].ano = ano;
   	diadasemana(dia, mes, ano, natacao[alocNatacao].dia_semana);
	} else {
        printf("/nVetor Lotado.");
        getch();
    }
    if (alocRugby < maxRugby - 1) {
        alocRugby++;
            rugby[alocRugby].dia = dia;
            rugby[alocRugby].mes = mes;
            rugby[alocRugby].ano = ano;
   	diadasemana(dia, mes, ano, rugby[alocRugby].dia_semana);
	} else {
        printf("/nVetor Lotado.");
        getch();
    }
    if (alocJudo < maxJudo - 1) {
        alocJudo++;
            judo[alocJudo].dia = dia;
            judo[alocJudo].mes = mes;
            judo[alocJudo].ano = ano;
   	diadasemana(dia, mes, ano, judo[alocJudo].dia_semana);
	} else {
        printf("/nVetor Lotado.");
        getch();
    }
    }
void mostrarDados() {
    FILE *file = fopen("datastreinos.txt", "w");
    if (file == NULL) {
        printf("\nErro ao abrir o arquivo!!!");
        return;
    }
        fprintf(file, "\n         Atletismo           |Natação                       |Rugby                         |Judô      ");
        fprintf(file, "\n----------------------------------------------------------------------------------------------------------------");

    int maxLinhas = alocAtletismo;
        if (alocNatacao > maxLinhas) maxLinhas = alocNatacao;
        if (alocRugby > maxLinhas) maxLinhas = alocRugby;
        if (alocJudo > maxLinhas) maxLinhas = alocJudo;

    for (int i = 0; i <= maxLinhas; i++) {

            if (i <= alocAtletismo) {
                fprintf(file, "\n%02i/%02i/%04i - %-15s", 
                    atletismo[i].dia, atletismo[i].mes, atletismo[i].ano, atletismo[i].dia_semana);
            } else {
                fprintf(file, " %-15s ");
            }
            fprintf(file, " | ");
    
            if (i <= alocNatacao) {
                fprintf(file, "%02i/%02i/%04i - %-15s", 
                    natacao[i].dia, natacao[i].mes, natacao[i].ano, natacao[i].dia_semana);
            } else {
                fprintf(file, " %-15s ");
            }
            fprintf(file, " | ");

            if (i <= alocRugby) {
                fprintf(file, "%02i/%02i/%04i - %-15s", 
                    rugby[i].dia, rugby[i].mes, rugby[i].ano, rugby[i].dia_semana);
            } else {
                fprintf(file, " %-15s ");
            }
            fprintf(file, " | ");

            if (i <= alocJudo) {
                fprintf(file, "%02i/%02i/%04i - %-15s", 
                        judo[i].dia, judo[i].mes, judo[i].ano, judo[i].dia_semana);
            } else {
                fprintf(file, " %-15s ");
            }
            fprintf(file, " |\n");
    }
        fclose(file);
}
int main() {
    setlocale(LC_ALL, "pt_BR.UTF-8");
    inserirData();
    mostrarDados();
    printf("\n\n\nArquivo 'datastreinos.txt' gerado com sucesso!\n");
    return 0;
}