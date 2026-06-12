# Atividade Prática - Matrizes em Python

## 1. Mostrar qual aluno teve a maior média

```python
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
```

---

## 2. Contar quantas notas foram maiores ou iguais a 7

```python
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
```

---

## 3. Exibir apenas as notas da segunda disciplina

```python
notas = [
    [8, 7, 9, 6],
    [5, 10, 8, 7],
    [9, 8, 7, 10]
]

for linha in notas:
    print(linha[1])
```

### Saída

```text
7
10
8
```

---

## 4. Calcular a média de cada disciplina (por coluna)

```python
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
```

### Saída

```text
Disciplina 1
Média = 7.333333333333333

Disciplina 2
Média = 8.333333333333334

Disciplina 3
Média = 8.0

Disciplina 4
Média = 7.666666666666667
```