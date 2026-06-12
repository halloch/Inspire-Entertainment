Sim. Pelo PDF, o professor ensina apenas:
Listas (vetores e matrizes)
for
if
range()
len()
Variáveis simples
Percorrer matrizes com laços aninhados
Ele não mostrou sum(), max(), enumerate() ou outras funções mais avançadas. �
Aula_Vetores_Matrizes_Python.pdf
Então eu faria as respostas assim:
1) Mostrar qual aluno teve a maior média
Python
notas = [
    [8, 7, 9, 6],
    [5, 10, 8, 7],
    [9, 8, 7, 10]
]

maior_media = 0
aluno_maior = 0

for i in range(len(notas)):
    soma = 0

    for nota in notas[i]:
        soma += nota

    media = soma / len(notas[i])

    if media > maior_media:
        maior_media = media
        aluno_maior = i + 1

print("Aluno com maior média:", aluno_maior)
print("Média:", maior_media)
2) Contar quantas notas foram maiores ou iguais a 7
Python
notas = [
    [8, 7, 9, 6],
    [5, 10, 8, 7],
    [9, 8, 7, 10]
]

contador = 0

for linha in notas:
    for nota in linha:
        if nota >= 7:
            contador += 1

print("Quantidade:", contador)
3) Exibir apenas as notas da segunda disciplina
Python
notas = [
    [8, 7, 9, 6],
    [5, 10, 8, 7],
    [9, 8, 7, 10]
]

for linha in notas:
    print(linha[1])
O acesso usando dois índices (matriz[linha][coluna]) é exatamente o que o PDF ensina. �
Aula_Vetores_Matrizes_Python.pdf
4) Calcular a média de cada disciplina (por coluna)
Python
notas = [
    [8, 7, 9, 6],
    [5, 10, 8, 7],
    [9, 8, 7, 10]
]

for coluna in range(4):
    soma = 0

    for linha in range(3):
        soma += notas[linha][coluna]

    media = soma / 3

    print("Disciplina", coluna + 1)
    print("Média =", media)
Essas soluções seguem o estilo mostrado na apostila, usando matrizes, laços for, índices e variáveis acumuladoras. �
Aula_Vetores_Matrizes_Python.pdf