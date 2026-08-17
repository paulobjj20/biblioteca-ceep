/* =========================================
   BIBLIOTECA ESCOLAR
   Sistema de gerenciamento
========================================= */


/* =========================================
   DADOS
========================================= */

let livros =
    JSON.parse(localStorage.getItem("livros")) || [];

let emprestimos =
    JSON.parse(localStorage.getItem("emprestimos")) || [];


/* =========================================
   ELEMENTOS DO HTML
========================================= */

const formLivro =
    document.getElementById("formLivro");

const formEmprestimo =
    document.getElementById("formEmprestimo");

const listaLivros =
    document.getElementById("listaLivros");

const listaEmprestimos =
    document.getElementById("listaEmprestimos");

const livroEmprestimo =
    document.getElementById("livroEmprestimo");


/* =========================================
   CADASTRAR LIVRO
========================================= */

formLivro.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome =
        document.getElementById("nomeLivro").value.trim();

    const autor =
        document.getElementById("autorLivro").value.trim();


    const livro = {

        id: Date.now(),

        nome: nome,

        autor: autor

    };


    livros.push(livro);


    salvarDados();


    formLivro.reset();


    atualizarTela();

});


/* =========================================
   CADASTRAR EMPRÉSTIMO
========================================= */

formEmprestimo.addEventListener("submit", function (event) {

    event.preventDefault();


    const livroId =
        Number(
            document.getElementById(
                "livroEmprestimo"
            ).value
        );


    const aluno =
        document.getElementById(
            "nomeAluno"
        ).value.trim();


    const turma =
        document.getElementById(
            "turma"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const dias =
        Number(
            document.getElementById(
                "tempoEmprestimo"
            ).value
        );


    /* -------------------------
       DATAS
    ------------------------- */

    const dataEmprestimo = new Date();


    const dataDevolucao =
        new Date(dataEmprestimo);


    dataDevolucao.setDate(
        dataDevolucao.getDate() + dias
    );


    /* -------------------------
       NOVO EMPRÉSTIMO
    ------------------------- */

    const emprestimo = {

        id: Date.now(),

        livroId: livroId,

        aluno: aluno,

        turma: turma,

        email: email,

        dataEmprestimo:
            dataEmprestimo.toISOString(),

        dataDevolucao:
            dataDevolucao.toISOString(),

        ativo: true

    };


    emprestimos.push(emprestimo);


    salvarDados();


    formEmprestimo.reset();


    atualizarTela();

});


/* =========================================
   SALVAR DADOS
========================================= */

function salvarDados() {

    localStorage.setItem(
        "livros",
        JSON.stringify(livros)
    );


    localStorage.setItem(
        "emprestimos",
        JSON.stringify(emprestimos)
    );

}


/* =========================================
   ATUALIZAR TODA A INTERFACE
========================================= */

function atualizarTela() {

    atualizarLivros();

    atualizarSelectLivros();

    atualizarEmprestimos();

    atualizarDashboard();

}


/* =========================================
   MOSTRAR LIVROS
========================================= */

function atualizarLivros() {

    listaLivros.innerHTML = "";


    if (livros.length === 0) {

        listaLivros.innerHTML =
            `<div class="vazio">
                Nenhum livro cadastrado.
            </div>`;

        return;
    }


    livros.forEach(function (livro) {

        const item =
            document.createElement("div");


        item.className = "item";


        item.innerHTML = `

            <strong>
                ${escaparHTML(livro.nome)}
            </strong>

            <p>
                Autor:
                ${escaparHTML(livro.autor)}
            </p>

            <div class="acoes">

                <button
                    class="btn-excluir"
                    onclick="excluirLivro(${livro.id})"
                >
                    Excluir
                </button>

            </div>

        `;


        listaLivros.appendChild(item);

    });

}


/* =========================================
   ATUALIZAR SELECT DOS LIVROS
========================================= */

function atualizarSelectLivros() {

    livroEmprestimo.innerHTML = `

        <option value="">
            Selecione um livro
        </option>

    `;


    livros.forEach(function (livro) {

        const option =
            document.createElement("option");


        option.value = livro.id;


        option.textContent =
            `${livro.nome} - ${livro.autor}`;


        livroEmprestimo.appendChild(option);

    });

}


/* =========================================
   MOSTRAR EMPRÉSTIMOS
========================================= */

function atualizarEmprestimos() {

    listaEmprestimos.innerHTML = "";


    if (emprestimos.length === 0) {

        listaEmprestimos.innerHTML =
            `<div class="vazio">
                Nenhum empréstimo registrado.
            </div>`;

        return;
    }


    emprestimos.forEach(function (emprestimo) {

        const livro =
            livros.find(
                livro =>
                    livro.id === emprestimo.livroId
            );


        const diasRestantes =
            calcularDiasRestantes(
                emprestimo.dataDevolucao
            );


        let classePrazo = "prazo";

        let mensagem = "";


        /* -------------------------
           SITUAÇÃO DO EMPRÉSTIMO
        ------------------------- */

        if (diasRestantes < 0) {

            classePrazo =
                "prazo vencido";


            mensagem =
                `⚠️ Empréstimo vencido há
                ${Math.abs(diasRestantes)}
                dia(s).`;

        }


        else if (diasRestantes === 0) {

            classePrazo =
                "prazo vencido";


            mensagem =
                "⚠️ O empréstimo vence hoje!";

        }


        else if (diasRestantes === 1) {

            classePrazo =
                "prazo ultimo-dia";


            mensagem =
                "⚠️ Falta apenas 1 dia para a devolução.";

        }


        else {

            mensagem =
                `⏳ Faltam
                ${diasRestantes}
                dias para a devolução.`;

        }


        /* -------------------------
           CRIAR ITEM
        ------------------------- */

        const item =
            document.createElement("div");


        item.className = "item";


        item.innerHTML = `

            <strong>
                ${livro
                    ? escaparHTML(livro.nome)
                    : "Livro removido"
                }
            </strong>

            <p>
                👨‍🎓 Aluno:
                ${escaparHTML(emprestimo.aluno)}
            </p>

            <p>
                🏫 Turma:
                ${escaparHTML(emprestimo.turma)}
            </p>

            <p>
                ✉️ E-mail:
                ${escaparHTML(emprestimo.email)}
            </p>

            <p>
                📅 Data do empréstimo:
                ${formatarData(
                    emprestimo.dataEmprestimo
                )}
            </p>

            <p>
                📅 Data de devolução:
                ${formatarData(
                    emprestimo.dataDevolucao
                )}
            </p>

            <div class="${classePrazo}">
                ${mensagem}
            </div>

            <div class="acoes">

                <button
                    class="btn-excluir"
                    onclick="excluirEmprestimo(${emprestimo.id})"
                >
                    Excluir
                </button>

            </div>

        `;


        listaEmprestimos.appendChild(item);

    });

}


/* =========================================
   CALCULAR DIAS RESTANTES
========================================= */

function calcularDiasRestantes(data) {

    const agora =
        new Date();


    const devolucao =
        new Date(data);


    const diferenca =
        devolucao.getTime() -
        agora.getTime();


    const dias =
        Math.ceil(
            diferenca /
            (1000 * 60 * 60 * 24)
        );


    return dias;

}


/* =========================================
   FORMATAR DATA
========================================= */

function formatarData(data) {

    return new Date(data)
        .toLocaleDateString("pt-BR");

}


/* =========================================
   EXCLUIR LIVRO
========================================= */

function excluirLivro(id) {

    const possuiEmprestimo =
        emprestimos.some(
            emprestimo =>
                emprestimo.livroId === id
        );


    if (possuiEmprestimo) {

        alert(
            "Este livro possui um empréstimo registrado e não pode ser excluído."
        );

        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente excluir este livro?"
        );


    if (!confirmar) {
        return;
    }


    livros =
        livros.filter(
            livro =>
                livro.id !== id
        );


    salvarDados();


    atualizarTela();

}


/* =========================================
   EXCLUIR EMPRÉSTIMO
========================================= */

function excluirEmprestimo(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este empréstimo?"
        );


    if (!confirmar) {
        return;
    }


    emprestimos =
        emprestimos.filter(
            emprestimo =>
                emprestimo.id !== id
        );


    salvarDados();


    atualizarTela();

}


/* =========================================
   DASHBOARD
========================================= */

function atualizarDashboard() {

    document.getElementById(
        "totalLivros"
    ).textContent = livros.length;


    document.getElementById(
        "totalEmprestimos"
    ).textContent = emprestimos.length;


    const ativos =
        emprestimos.filter(
            emprestimo =>
                calcularDiasRestantes(
                    emprestimo.dataDevolucao
                ) >= 0
        );


    document.getElementById(
        "emprestimosAtivos"
    ).textContent = ativos.length;

}


/* =========================================
   PROTEÇÃO CONTRA HTML
========================================= */

function escaparHTML(texto) {

    const div =
        document.createElement("div");


    div.textContent = texto;


    return div.innerHTML;

}


/* =========================================
   ATUALIZAÇÃO DO CONTADOR
========================================= */

setInterval(function () {

    atualizarEmprestimos();

    atualizarDashboard();

}, 60000);


/* =========================================
   INICIALIZAÇÃO
========================================= */

atualizarTela();