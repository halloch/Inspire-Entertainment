```python
notas = []

print("=== CONTROLE DE NOTAS ===")

for aluno in range(3):
    print(f"\nAluno {aluno + 1}")

    linha = []

    for disciplina in range(4):
        nota = float(input(f"Digite a nota da disciplina {disciplina + 1}: "))
        linha.append(nota)

    notas.append(linha)

print("\n=== TABELA DE NOTAS ===")

for i in range(len(notas)):
    print(f"Aluno {i + 1}: {notas[i]}")

print("\n=== MÉDIA DE CADA ALUNO ===")

medias = []

for i in range(len(notas)):
    soma = 0

    for nota in notas[i]:
        soma += nota

    media = soma / len(notas[i])
    medias.append(media)

    print(f"Aluno {i + 1}: Média = {media:.2f}")

maior_nota = notas[0][0]

for linha in notas:
    for nota in linha:
        if nota > maior_nota:
            maior_nota = nota

print(f"\nMaior nota da turma: {maior_nota}")

maior_media = medias[0]
aluno_maior_media = 1

for i in range(len(medias)):
    if medias[i] > maior_media:
        maior_media = medias[i]
        aluno_maior_media = i + 1

print(f"\nAluno com a maior média: Aluno {aluno_maior_media}")
print(f"Média: {maior_media:.2f}")

contador = 0

for linha in notas:
    for nota in linha:
        if nota >= 7:
            contador += 1

print(f"\nQuantidade de notas maiores ou iguais a 7: {contador}")

print("\nNotas da segunda disciplina:")

for i in range(len(notas)):
    print(f"Aluno {i + 1}: {notas[i][1]}")

print("\nMédia de cada disciplina:")

for disciplina in range(4):
    soma = 0

    for aluno in range(3):
        soma += notas[aluno][disciplina]

    media = soma / 3

    print(f"Disciplina {disciplina + 1}: {media:.2f}")
```