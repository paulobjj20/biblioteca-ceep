// =========================================
// NAVEGAÇÃO DA BARRA LATERAL
// =========================================
const navLinks = document.querySelectorAll('.sidebar-nav a');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');

const pageInfo = {
    dashboard: { title: '📊 Painel', subtitle: 'Visão geral do sistema' },
    livros: { title: '📖 Livros', subtitle: 'Gerenciar livros da biblioteca' },
    emprestimos: { title: '🔄 Empréstimos', subtitle: 'Gerenciar empréstimos' },
    alunos: { title: '👥 Alunos', subtitle: 'Gerenciar alunos' },
    configuracoes: { title: '⚙️ Configurações', subtitle: 'Configurações do sistema' }
};

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        const page = this.dataset.page;
        
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');
        
        if (pageInfo[page]) {
            pageTitle.textContent = pageInfo[page].title;
            pageSubtitle.textContent = pageInfo[page].subtitle;
        }
    });
});

// =========================================
// LOGIN
// =========================================
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    if (user === 'admin' && pass === '1234') {
        loginOverlay.classList.add('hidden');
        loginError.style.display = 'none';
    } else {
        loginError.style.display = 'block';
    }
});

// =========================================
// DADOS (adaptados para as estruturas do banco)
// =========================================
let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
let livros = JSON.parse(localStorage.getItem('livros')) || [];
let emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];

// =========================================
// ELEMENTOS
// =========================================
const formAluno = document.getElementById('formAluno');
const formLivro = document.getElementById('formLivro');
const formEmprestimo = document.getElementById('formEmprestimo');
const listaAlunos = document.getElementById('listaAlunos');
const listaLivros = document.getElementById('listaLivros');
const listaEmprestimos = document.getElementById('listaEmprestimos');
const alunoEmprestimo = document.getElementById('alunoEmprestimo');
const livroEmprestimo = document.getElementById('livroEmprestimo');

// =========================================
// CADASTRAR ALUNO
// =========================================
formAluno.addEventListener('submit', function(e) {
    e.preventDefault();
    const NOME = document.getElementById('nomeAlunoCadastro').value.trim();
    const TURMA = document.getElementById('turmaAluno').value.trim();
    const TELEFONE = document.getElementById('telefoneAluno').value.trim();
    const EMAIL = document.getElementById('emailAluno').value.trim();

    if (!NOME || !TURMA || !EMAIL) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const aluno = { 
        ALUNO_ID: Date.now(), 
        NOME, 
        TURMA, 
        TELEFONE, 
        EMAIL,
        DATA_CADASTRO: new Date().toISOString()
    };
    alunos.push(aluno);
    salvarDados();
    formAluno.reset();
    atualizarTela();
});

// =========================================
// CADASTRAR LIVRO
// =========================================
formLivro.addEventListener('submit', function(e) {
    e.preventDefault();
    const TITULO = document.getElementById('tituloLivro').value.trim();
    const AUTOR = document.getElementById('autorLivro').value.trim();
    const CATEGORIA = document.getElementById('categoriaLivro').value;

    if (!TITULO || !AUTOR || !CATEGORIA) {
        alert('Preencha todos os campos!');
        return;
    }

    const livro = { 
        LIVRO_ID: Date.now(), 
        TITULO, 
        AUTOR, 
        CATEGORIA,
        DATA_CADASTRO: new Date().toISOString()
    };
    livros.push(livro);
    salvarDados();
    formLivro.reset();
    atualizarTela();
});

// =========================================
// CADASTRAR EMPRÉSTIMO
// =========================================
formEmprestimo.addEventListener('submit', function(e) {
    e.preventDefault();

    const ALUNO_ID = Number(document.getElementById('alunoEmprestimo').value);
    const LIVRO_ID = Number(document.getElementById('livroEmprestimo').value);
    const DATA_EMPRESTIMO = document.getElementById('dataEmprestimo').value;
    const DATA_PREVISAO_DEVOLUCAO = document.getElementById('dataPrevisao').value;
    const OBSERVACAO = document.getElementById('observacao').value.trim();

    if (!ALUNO_ID || !LIVRO_ID || !DATA_EMPRESTIMO || !DATA_PREVISAO_DEVOLUCAO) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    // Verifica se a data de devolução é posterior à data de empréstimo
    if (new Date(DATA_PREVISAO_DEVOLUCAO) <= new Date(DATA_EMPRESTIMO)) {
        alert('A data de devolução deve ser posterior à data de empréstimo!');
        return;
    }

    const emprestimo = {
        ID: Date.now(),
        ALUNO_ID,
        LIVRO_ID,
        DATA_EMPRESTIMO,
        DATA_PREVISAO_DEVOLUCAO,
        DATA_DEVOLUCAO: null,
        STATUS: 'ATIVO',
        OBSERVACAO: OBSERVACAO || null
    };
    emprestimos.push(emprestimo);
    salvarDados();
    formEmprestimo.reset();
    document.getElementById('observacao').value = '';
    atualizarTela();
});

// =========================================
// SALVAR
// =========================================
function salvarDados() {
    try {
        localStorage.setItem('alunos', JSON.stringify(alunos));
        localStorage.setItem('livros', JSON.stringify(livros));
        localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
    } catch (e) {
        console.error('Erro ao salvar:', e);
    }
}

// =========================================
// ATUALIZAR TELA
// =========================================
function atualizarTela() {
    atualizarAlunos();
    atualizarSelectAlunos();
    atualizarLivros();
    atualizarSelectLivros();
    atualizarEmprestimos();
    atualizarDashboard();
    atualizarConfiguracoes();
}

// =========================================
// ALUNOS
// =========================================
function atualizarAlunos() {
    listaAlunos.innerHTML = '';
    if (alunos.length === 0) {
        listaAlunos.innerHTML = `<div class="vazio">Nenhum aluno cadastrado.</div>`;
        return;
    }
    alunos.forEach(function(aluno) {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <strong>${escaparHTML(aluno.NOME)}</strong>
            <p>🏫 Turma: ${escaparHTML(aluno.TURMA)}</p>
            <p>✉️ E-mail: ${escaparHTML(aluno.EMAIL)}</p>
            ${aluno.TELEFONE ? `<p>📱 Telefone: ${escaparHTML(aluno.TELEFONE)}</p>` : ''}
            <p style="font-size: 11px; color: #555; margin-top: 8px;">
                📅 Cadastro: ${formatarData(aluno.DATA_CADASTRO)}
            </p>
            <div class="acoes">
                <button class="btn-excluir" onclick="excluirAluno(${aluno.ALUNO_ID})">Excluir</button>
            </div>
        `;
        listaAlunos.appendChild(item);
    });
}

// =========================================
// SELECT ALUNOS
// =========================================
function atualizarSelectAlunos() {
    alunoEmprestimo.innerHTML = `<option value="">Selecione um aluno</option>`;
    alunos.forEach(function(aluno) {
        const option = document.createElement('option');
        option.value = aluno.ALUNO_ID;
        option.textContent = `${aluno.NOME} - ${aluno.TURMA}`;
        alunoEmprestimo.appendChild(option);
    });
}

// =========================================
// LIVROS
// =========================================
function atualizarLivros() {
    listaLivros.innerHTML = '';
    if (livros.length === 0) {
        listaLivros.innerHTML = `<div class="vazio">Nenhum livro cadastrado.</div>`;
        return;
    }
    livros.forEach(function(livro) {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <strong>${escaparHTML(livro.TITULO)}</strong>
            <p>✍️ Autor: ${escaparHTML(livro.AUTOR)}</p>
            <p>📂 Categoria: ${escaparHTML(livro.CATEGORIA)}</p>
            <p style="font-size: 11px; color: #555; margin-top: 8px;">
                📅 Cadastro: ${formatarData(livro.DATA_CADASTRO)}
            </p>
            <div class="acoes">
                <button class="btn-excluir" onclick="excluirLivro(${livro.LIVRO_ID})">Excluir</button>
            </div>
        `;
        listaLivros.appendChild(item);
    });
}

// =========================================
// SELECT LIVROS
// =========================================
function atualizarSelectLivros() {
    livroEmprestimo.innerHTML = `<option value="">Selecione um livro</option>`;
    livros.forEach(function(livro) {
        const option = document.createElement('option');
        option.value = livro.LIVRO_ID;
        option.textContent = `${livro.TITULO} - ${livro.AUTOR}`;
        livroEmprestimo.appendChild(option);
    });
}

// =========================================
// EMPRÉSTIMOS
// =========================================
function atualizarEmprestimos() {
    listaEmprestimos.innerHTML = '';
    if (emprestimos.length === 0) {
        listaEmprestimos.innerHTML = `<div class="vazio">Nenhum empréstimo registrado.</div>`;
        return;
    }
    emprestimos.forEach(function(emprestimo) {
        const aluno = alunos.find(a => a.ALUNO_ID === emprestimo.ALUNO_ID);
        const livro = livros.find(l => l.LIVRO_ID === emprestimo.LIVRO_ID);
        
        // Atualiza status automaticamente
        const hoje = new Date();
        const dataPrevisao = new Date(emprestimo.DATA_PREVISAO_DEVOLUCAO);
        const dataDevolucao = emprestimo.DATA_DEVOLUCAO ? new Date(emprestimo.DATA_DEVOLUCAO) : null;
        
        let status = emprestimo.STATUS;
        if (status === 'ATIVO' && dataDevolucao) {
            status = 'DEVOLVIDO';
        } else if (status === 'ATIVO' && hoje > dataPrevisao && !dataDevolucao) {
            status = 'ATRASADO';
        }
        
        // Calcula dias restantes ou atraso
        let diasInfo = '';
        let classePrazo = 'prazo';
        let mensagem = '';
        
        if (status === 'DEVOLVIDO') {
            mensagem = '✅ Devolvido';
            classePrazo = 'prazo';
        } else if (status === 'ATRASADO') {
            const diasAtraso = Math.ceil((hoje - dataPrevisao) / (1000 * 60 * 60 * 24));
            mensagem = `⚠️ Atrasado há ${diasAtraso} dia(s)`;
            classePrazo = 'prazo vencido';
        } else if (status === 'ATIVO') {
            const diasRestantes = Math.ceil((dataPrevisao - hoje) / (1000 * 60 * 60 * 24));
            if (diasRestantes === 0) {
                mensagem = '⚠️ Vence hoje!';
                classePrazo = 'prazo vencido';
            } else if (diasRestantes === 1) {
                mensagem = '⚠️ Falta 1 dia!';
                classePrazo = 'prazo ultimo-dia';
            } else if (diasRestantes < 0) {
                mensagem = `⚠️ Vencido há ${Math.abs(diasRestantes)} dia(s)`;
                classePrazo = 'prazo vencido';
            } else {
                mensagem = `⏳ Faltam ${diasRestantes} dias`;
                classePrazo = 'prazo';
            }
        }

        const item = document.createElement('div');
        item.className = 'item';
        
        // Define a classe de status
        let statusClass = '';
        if (status === 'ATIVO') statusClass = 'status-ativo';
        else if (status === 'DEVOLVIDO') statusClass = 'status-devolvido';
        else if (status === 'ATRASADO') statusClass = 'status-atrasado';
        
        item.innerHTML = `
            <strong>📚 ${livro ? escaparHTML(livro.TITULO) : 'Livro removido'}</strong>
            <p>👨‍🎓 Aluno: ${aluno ? escaparHTML(aluno.NOME) : 'Aluno removido'}</p>
            <p>🏫 Turma: ${aluno ? escaparHTML(aluno.TURMA) : '-'}</p>
            <p>📅 Empréstimo: ${formatarData(emprestimo.DATA_EMPRESTIMO)}</p>
            <p>📅 Previsão: ${formatarData(emprestimo.DATA_PREVISAO_DEVOLUCAO)}</p>
            ${emprestimo.DATA_DEVOLUCAO ? `<p>✅ Devolução: ${formatarData(emprestimo.DATA_DEVOLUCAO)}</p>` : ''}
            ${emprestimo.OBSERVACAO ? `<p style="color: #666; font-style: italic;">📝 ${escaparHTML(emprestimo.OBSERVACAO)}</p>` : ''}
            <div style="margin-top: 8px;">
                <span class="status ${statusClass}">${status}</span>
            </div>
            <div class="${classePrazo}">${mensagem}</div>
            <div class="acoes">
                ${status === 'ATIVO' ? `<button class="btn-excluir" style="background: #1a3a1a; color: #4caf50; border-color: #2a5a2a;" onclick="devolverLivro(${emprestimo.ID})">✅ Devolver</button>` : ''}
                <button class="btn-excluir" onclick="excluirEmprestimo(${emprestimo.ID})">Excluir</button>
            </div>
        `;
        listaEmprestimos.appendChild(item);
    });
}

// =========================================
// DEVOLVER LIVRO
// =========================================
function devolverLivro(id) {
    if (!confirm('Confirmar devolução deste livro?')) return;
    
    const emprestimo = emprestimos.find(e => e.ID === id);
    if (emprestimo) {
        emprestimo.DATA_DEVOLUCAO = new Date().toISOString().split('T')[0];
        emprestimo.STATUS = 'DEVOLVIDO';
        salvarDados();
        atualizarTela();
        alert('✅ Livro devolvido com sucesso!');
    }
}

// =========================================
// AUXILIARES
// =========================================
function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

function escaparHTML(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// =========================================
// EXCLUIR ALUNO
// =========================================
function excluirAluno(id) {
    const possuiEmprestimo = emprestimos.some(e => e.ALUNO_ID === id && e.STATUS === 'ATIVO');
    if (possuiEmprestimo) {
        alert('Este aluno possui empréstimos ativos e não pode ser excluído!');
        return;
    }
    if (!confirm('Deseja realmente excluir este aluno?')) return;
    alunos = alunos.filter(a => a.ALUNO_ID !== id);
    salvarDados();
    atualizarTela();
}

// =========================================
// EXCLUIR LIVRO
// =========================================
function excluirLivro(id) {
    const possuiEmprestimo = emprestimos.some(e => e.LIVRO_ID === id && e.STATUS === 'ATIVO');
    if (possuiEmprestimo) {
        alert('Este livro possui empréstimos ativos e não pode ser excluído!');
        return;
    }
    if (!confirm('Deseja realmente excluir este livro?')) return;
    livros = livros.filter(l => l.LIVRO_ID !== id);
    salvarDados();
    atualizarTela();
}

// =========================================
// EXCLUIR EMPRÉSTIMO
// =========================================
function excluirEmprestimo(id) {
    if (!confirm('Deseja realmente excluir este empréstimo?')) return;
    emprestimos = emprestimos.filter(e => e.ID !== id);
    salvarDados();
    atualizarTela();
}

// =========================================
// DASHBOARD
// =========================================
function atualizarDashboard() {
    document.getElementById('totalLivros').textContent = livros.length;
    document.getElementById('totalEmprestimos').textContent = emprestimos.length;
    const ativos = emprestimos.filter(e => e.STATUS === 'ATIVO');
    document.getElementById('emprestimosAtivos').textContent = ativos.length;
    document.getElementById('totalAlunos').textContent = alunos.length;
}

// =========================================
// CONFIGURAÇÕES
// =========================================
function atualizarConfiguracoes() {
    document.getElementById('configTotalLivros').textContent = livros.length;
    document.getElementById('configTotalEmprestimos').textContent = emprestimos.length;
    document.getElementById('configTotalAlunos').textContent = alunos.length;
}

// =========================================
// LIMPAR DADOS
// =========================================
function limparDados() {
    if (!confirm('⚠️ Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita!')) {
        return;
    }
    
    if (!confirm('⚠️ ÚLTIMA CHANCE! Apagar tudo mesmo?')) {
        return;
    }
    
    alunos = [];
    livros = [];
    emprestimos = [];
    salvarDados();
    atualizarTela();
    alert('✅ Todos os dados foram apagados com sucesso!');
}

// =========================================
// AUTO UPDATE A CADA 60s
// =========================================
setInterval(function() {
    alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    livros = JSON.parse(localStorage.getItem('livros')) || [];
    emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
    atualizarEmprestimos();
    atualizarDashboard();
    atualizarConfiguracoes();
}, 60000);

// =========================================
// INICIALIZAÇÃO
// =========================================
atualizarTela();