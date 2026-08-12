

// =====================================================
// BANCO DE DADOS LOCAL
// =====================================================

let livros = JSON.parse(localStorage.getItem("livros")) || [];

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

let emprestimos =
    JSON.parse(localStorage.getItem("emprestimos")) || [];


// =====================================================
// NAVEGAÇÃO
// =====================================================

function mostrarPagina(pagina) {

    document.querySelectorAll(".pagina").forEach(secao => {
        secao.classList.remove("ativa");
    });

    document.getElementById(pagina).classList.add("ativa");


    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.classList.remove("active");
    });


    const botoes = document.querySelectorAll(".menu-btn");

    if (pagina === "inicio") {
        botoes[0].classList.add("active");
        document.getElementById("tituloPagina").textContent = "Início";
    }

    if (pagina === "livros") {
        botoes[1].classList.add("active");
        document.getElementById("tituloPagina").textContent = "Livros";
    }

    if (pagina === "alunos") {
        botoes[2].classList.add("active");
        document.getElementById("tituloPagina").textContent = "Alunos";
    }

    if (pagina === "emprestimos") {
        botoes[3].classList.add("active");
        document.getElementById("tituloPagina").textContent = "Empréstimos";
    }


    atualizarSistema();
}



// =====================================================
// MODAIS
// =====================================================

function abrirModalLivro() {
    document.getElementById("modalLivro")
        .classList.add("ativo");
}


function abrirModalAluno() {
    document.getElementById("modalAluno")
        .classList.add("ativo");
}


function abrirModalEmprestimo() {

    atualizarSelects();

    document.getElementById("modalEmprestimo")
        .classList.add("ativo");
}


function fecharModais() {

    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("ativo");
    });

}



// =====================================================
// LIVROS
// =====================================================

function adicionarLivro(event) {

    event.preventDefault();


    const livro = {

        id: Date.now(),

        titulo:
            document.getElementById("tituloLivro").value,

        autor:
            document.getElementById("autorLivro").value,

        categoria:
            document.getElementById("categoriaLivro").value,

        disponivel: true

    };


    livros.push(livro);


    salvarDados();


    event.target.reset();

    fecharModais();

    atualizarSistema();
}


function excluirLivro(id) {

    const livroEmprestado =
        emprestimos.some(
            emprestimo =>
                emprestimo.livroId === id &&
                emprestimo.status === "Emprestado"
        );


    if (livroEmprestado) {

        alert(
            "Este livro está emprestado e não pode ser excluído."
        );

        return;
    }


    if (confirm("Deseja excluir este livro?")) {

        livros =
            livros.filter(livro => livro.id !== id);

        salvarDados();

        atualizarSistema();
    }
}



// =====================================================
// ALUNOS
// =====================================================

function adicionarAluno(event) {

    event.preventDefault();


    const aluno = {

        id: Date.now(),

        nome:
            document.getElementById("nomeAluno").value,

        matricula:
            document.getElementById("matriculaAluno").value,

        turma:
            document.getElementById("turmaAluno").value

    };


    alunos.push(aluno);


    salvarDados();


    event.target.reset();

    fecharModais();

    atualizarSistema();
}


function excluirAluno(id) {

    const possuiEmprestimo =
        emprestimos.some(
            emprestimo =>
                emprestimo.alunoId === id &&
                emprestimo.status === "Emprestado"
        );


    if (possuiEmprestimo) {

        alert(
            "Este aluno possui um livro emprestado."
        );

        return;
    }


    if (confirm("Deseja excluir este aluno?")) {

        alunos =
            alunos.filter(aluno => aluno.id !== id);

        salvarDados();

        atualizarSistema();
    }
}



// =====================================================
// EMPRÉSTIMOS
// =====================================================

function adicionarEmprestimo(event) {

    event.preventDefault();


    const alunoId =
        Number(
            document.getElementById("alunoEmprestimo").value
        );


    const livroId =
        Number(
            document.getElementById("livroEmprestimo").value
        );


    const dataDevolucao =
        document.getElementById("dataDevolucao").value;


    const livro =
        livros.find(livro => livro.id === livroId);


    if (!livro || !livro.disponivel) {

        alert("Este livro não está disponível.");

        return;
    }


    const emprestimo = {

        id: Date.now(),

        alunoId: alunoId,

        livroId: livroId,

        data:
            new Date().toLocaleDateString("pt-BR"),

        dataDevolucao:
            dataDevolucao,

        status: "Emprestado"

    };


    emprestimos.push(emprestimo);


    livro.disponivel = false;


    salvarDados();


    event.target.reset();

    fecharModais();

    atualizarSistema();
}



// =====================================================
// DEVOLVER LIVRO
// =====================================================

function devolverLivro(id) {

    const emprestimo =
        emprestimos.find(
            item => item.id === id
        );


    if (!emprestimo) return;


    emprestimo.status = "Devolvido";


    const livro =
        livros.find(
            livro =>
                livro.id === emprestimo.livroId
        );


    if (livro) {
        livro.disponivel = true;
    }


    salvarDados();


    atualizarSistema();
}



// =====================================================
// ATUALIZAR TABELA DE LIVROS
// =====================================================

function atualizarLivros() {

    const tabela =
        document.getElementById("tabelaLivros");


    tabela.innerHTML = "";


    livros.forEach(livro => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>${livro.id}</td>

            <td>
                <strong>${livro.titulo}</strong>
            </td>

            <td>${livro.autor}</td>

            <td>${livro.categoria}</td>

            <td>

                ${
                    livro.disponivel

                    ? `<span class="status disponivel">
                        Disponível
                       </span>`

                    : `<span class="status emprestado">
                        Emprestado
                       </span>`
                }

            </td>

            <td>

                <button
                    class="btn-excluir"
                    onclick="excluirLivro(${livro.id})"
                >
                    Excluir
                </button>

            </td>
        `;


        tabela.appendChild(linha);

    });

}



// =====================================================
// ATUALIZAR TABELA DE ALUNOS
// =====================================================

function atualizarAlunos() {

    const tabela =
        document.getElementById("tabelaAlunos");


    tabela.innerHTML = "";


    alunos.forEach(aluno => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>${aluno.id}</td>

            <td>
                <strong>${aluno.nome}</strong>
            </td>

            <td>${aluno.matricula}</td>

            <td>${aluno.turma}</td>

            <td>

                <button
                    class="btn-excluir"
                    onclick="excluirAluno(${aluno.id})"
                >
                    Excluir
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}



// =====================================================
// ATUALIZAR TABELA DE EMPRÉSTIMOS
// =====================================================

function atualizarEmprestimos() {

    const tabela =
        document.getElementById(
            "tabelaEmprestimos"
        );


    tabela.innerHTML = "";


    emprestimos.forEach(emprestimo => {

        const aluno =
            alunos.find(
                aluno =>
                    aluno.id === emprestimo.alunoId
            );


        const livro =
            livros.find(
                livro =>
                    livro.id === emprestimo.livroId
            );


        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${aluno ? aluno.nome : "Aluno removido"}
            </td>

            <td>
                ${livro ? livro.titulo : "Livro removido"}
            </td>

            <td>
                ${emprestimo.data}
            </td>

            <td>
                ${formatarData(emprestimo.dataDevolucao)}
            </td>

            <td>

                ${
                    emprestimo.status === "Emprestado"

                    ? `<span class="status emprestado">
                        Emprestado
                       </span>`

                    : `<span class="status disponivel">
                        Devolvido
                       </span>`
                }

            </td>

            <td>

                ${
                    emprestimo.status === "Emprestado"

                    ? `
                        <button
                            class="btn-devolver"
                            onclick="devolverLivro(${emprestimo.id})"
                        >
                            Devolver
                        </button>
                      `

                    : "-"
                }

            </td>

        `;


        tabela.appendChild(linha);

    });

}



// =====================================================
// SELECTS DO EMPRÉSTIMO
// =====================================================

function atualizarSelects() {

    const selectAluno =
        document.getElementById(
            "alunoEmprestimo"
        );


    const selectLivro =
        document.getElementById(
            "livroEmprestimo"
        );


    selectAluno.innerHTML =
        `<option value="">
            Selecione um aluno
        </option>`;


    selectLivro.innerHTML =
        `<option value="">
            Selecione um livro
        </option>`;


    alunos.forEach(aluno => {

        selectAluno.innerHTML += `

            <option value="${aluno.id}">
                ${aluno.nome} - ${aluno.matricula}
            </option>

        `;

    });


    livros
        .filter(livro => livro.disponivel)
        .forEach(livro => {

            selectLivro.innerHTML += `

                <option value="${livro.id}">
                    ${livro.titulo}
                </option>

            `;

        });

}



// =====================================================
// PESQUISA
// =====================================================

function pesquisarLivro() {

    const pesquisa =
        document
            .getElementById("pesquisaLivro")
            .value
            .toLowerCase();


    const linhas =
        document.querySelectorAll(
            "#tabelaLivros tr"
        );


    linhas.forEach(linha => {

        const texto =
            linha.textContent.toLowerCase();


        linha.style.display =
            texto.includes(pesquisa)
                ? ""
                : "none";

    });

}



// =====================================================
// DASHBOARD
// =====================================================

function atualizarDashboard() {

    const total =
        livros.length;


    const emprestados =
        livros.filter(
            livro => !livro.disponivel
        ).length;


    const disponiveis =
        livros.filter(
            livro => livro.disponivel
        ).length;


    document.getElementById(
        "totalLivros"
    ).textContent = total;


    document.getElementById(
        "totalAlunos"
    ).textContent = alunos.length;


    document.getElementById(
        "totalEmprestados"
    ).textContent = emprestados;


    document.getElementById(
        "totalDisponiveis"
    ).textContent = disponiveis;


    atualizarRecentes();
}



// =====================================================
// EMPRÉSTIMOS RECENTES
// =====================================================

function atualizarRecentes() {

    const tabela =
        document.getElementById(
            "tabelaRecentes"
        );


    tabela.innerHTML = "";


    emprestimos
        .slice(-5)
        .reverse()
        .forEach(emprestimo => {

            const aluno =
                alunos.find(
                    aluno =>
                        aluno.id === emprestimo.alunoId
                );


            const livro =
                livros.find(
                    livro =>
                        livro.id === emprestimo.livroId
                );


            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    ${aluno ? aluno.nome : "-"}
                </td>

                <td>
                    ${livro ? livro.titulo : "-"}
                </td>

                <td>
                    ${emprestimo.data}
                </td>

                <td>

                    ${
                        emprestimo.status === "Emprestado"

                        ? `<span class="status emprestado">
                            Emprestado
                           </span>`

                        : `<span class="status disponivel">
                            Devolvido
                           </span>`
                    }

                </td>

            `;


            tabela.appendChild(linha);

        });

}



// =====================================================
// FORMATAÇÃO DE DATA
// =====================================================

function formatarData(data) {

    if (!data) return "-";


    const partes =
        data.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}



// =====================================================
// SALVAR DADOS
// =====================================================

function salvarDados() {

    localStorage.setItem(
        "livros",
        JSON.stringify(livros)
    );


    localStorage.setItem(
        "alunos",
        JSON.stringify(alunos)
    );


    localStorage.setItem(
        "emprestimos",
        JSON.stringify(emprestimos)
    );

}



// =====================================================
// ATUALIZA TODO O SISTEMA
// =====================================================

function atualizarSistema() {

    atualizarLivros();

    atualizarAlunos();

    atualizarEmprestimos();

    atualizarDashboard();

}



// =====================================================
// INICIALIZAÇÃO
// =====================================================

atualizarSistema();
