// ===== CONFIGURAÇÃO =====
const API_URL = '/api'; // ALTERE PARA A URL DO SEU BACKEND

// ===== VERIFICAR AUTENTICAÇÃO =====
const token = localStorage.getItem('token');
if (!token) {
    // Se não estiver logado, redireciona para o login
    window.location.href = 'login.html';
}

// ===== ELEMENTOS DOM =====
const formMovimento = document.getElementById('formMovimento');
const descricao = document.getElementById('descricao');
const valor = document.getElementById('valor');
const tipo = document.getElementById('tipo');
const categoria = document.getElementById('categoria');
const data = document.getElementById('data');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

const totalEntradas = document.getElementById('totalEntradas');
const totalSaidas = document.getElementById('totalSaidas');
const saldoAtual = document.getElementById('saldoAtual');
const maiorCategoria = document.getElementById('maiorCategoria');

const filtroDescricao = document.getElementById('filtroDescricao');
const filtroCategoria = document.getElementById('filtroCategoria');
const periodoGrafico = document.getElementById('periodoGrafico');

// ===== ESTADO =====
let movimentacoes = [];
let modoEdicao = false;
let idEditando = null;
let chartEvolucao = null;
let chartEntradasCat = null;
let chartSaidasCat = null;

// ===== FUNÇÃO DE LOGOUT =====
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// ===== API HELPER =====
async function apiRequest(endpoint, method = 'GET', body = null) {
    const opts = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${endpoint}`, opts);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro na requisição');
    }
    if (res.status === 204) return null;
    return res.json();
}

// ===== CARREGAR MOVIMENTAÇÕES =====
async function carregarMovimentacoes() {
    try {
        const params = new URLSearchParams();
        if (filtroDescricao.value) params.append('descricao', filtroDescricao.value);
        if (filtroCategoria.value) params.append('categoria', filtroCategoria.value);
        const query = params.toString();
        movimentacoes = await apiRequest(`/movimentacoes?${query}`);
        atualizarDashboard();
    } catch (err) {
        mostrarToast('Erro ao carregar dados: ' + err.message, 'error');
    }
}

// ===== SALVAR (criar ou editar) =====
async function salvar(e) {
    e.preventDefault();

    const mov = {
        descricao: descricao.value.trim(),
        valor: Number(valor.value),
        tipo: tipo.value,
        categoria: categoria.value,
        data: data.value
    };

    try {
        if (modoEdicao) {
            await apiRequest(`/movimentacoes/${idEditando}`, 'PUT', mov);
            mostrarToast('Movimentação atualizada!');
        } else {
            await apiRequest('/movimentacoes', 'POST', mov);
            mostrarToast('Movimentação adicionada!');
        }
        cancelarEdicao();
        await carregarMovimentacoes();
    } catch (err) {
        mostrarToast('Erro: ' + err.message, 'error');
    }
}

// ===== EDITAR =====
function editar(id) {
    const m = movimentacoes.find(x => x.id === id);
    if (!m) return;
    descricao.value = m.descricao;
    valor.value = m.valor;
    tipo.value = m.tipo;
    categoria.value = m.categoria;
    data.value = m.data.split('T')[0];
    modoEdicao = true;
    idEditando = id;
    btnSalvar.textContent = 'Atualizar';
    btnCancelar.style.display = 'inline-block';
}

function cancelarEdicao() {
    modoEdicao = false;
    idEditando = null;
    formMovimento.reset();
    btnSalvar.textContent = 'Salvar';
    btnCancelar.style.display = 'none';
}

// ===== REMOVER =====
async function remover(id) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
        await apiRequest(`/movimentacoes/${id}`, 'DELETE');
        mostrarToast('Movimentação removida!');
        await carregarMovimentacoes();
    } catch (err) {
        mostrarToast('Erro: ' + err.message, 'error');
    }
}

// ===== CÁLCULOS =====
function entradas(lista) {
    return lista.filter(i => i.tipo === 'entrada').reduce((a, b) => a + b.valor, 0);
}
function saidas(lista) {
    return lista.filter(i => i.tipo === 'saida').reduce((a, b) => a + b.valor, 0);
}
function saldo(lista) {
    return entradas(lista) - saidas(lista);
}
function maiorCategoriaGasto(lista) {
    const gastos = {};
    lista.forEach(item => {
        if (item.tipo === 'saida') {
            gastos[item.categoria] = (gastos[item.categoria] || 0) + item.valor;
        }
    });
    let maior = '-';
    let valorMaior = 0;
    for (let cat in gastos) {
        if (gastos[cat] > valorMaior) {
            valorMaior = gastos[cat];
            maior = cat;
        }
    }
    return maior;
}

// ===== ATUALIZAR DASHBOARD =====
function atualizarDashboard() {
    const lista = movimentacoes;
    const ent = entradas(lista);
    const sai = saidas(lista);
    const sal = saldo(lista);

    totalEntradas.textContent = formatarMoeda(ent);
    totalSaidas.textContent = formatarMoeda(sai);
    saldoAtual.textContent = formatarMoeda(sal);
    saldoAtual.className = sal >= 0 ? 'positivo' : 'negativo';
    maiorCategoria.textContent = maiorCategoriaGasto(lista) || '-';

    renderizarTabela(lista);
    renderizarGraficoEvolucao();
    renderizarGraficosCategoria();
}

// ===== TABELA =====
function renderizarTabela(lista) {
    const tbody = document.getElementById('listaMovimentacoes');
    tbody.innerHTML = '';
    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#999;">Nenhuma movimentação encontrada.</td></tr>`;
        return;
    }
    lista.forEach(m => {
        const tr = document.createElement('tr');
        const dataFormatada = m.data ? new Date(m.data).toLocaleDateString('pt-BR') : '';
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${m.descricao}</td>
            <td>${m.categoria}</td>
            <td>${m.tipo}</td>
            <td>${formatarMoeda(m.valor)}</td>
            <td>
                <button class="btn-edit" onclick="editar(${m.id})">Editar</button>
                <button class="btn-delete" onclick="remover(${m.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== GRÁFICO DE EVOLUÇÃO =====
function renderizarGraficoEvolucao() {
    const ctx = document.getElementById('graficoEvolucao').getContext('2d');
    const periodo = periodoGrafico.value;
    let grupos = {};

    if (periodo === 'semanal') {
        movimentacoes.forEach(m => {
            const dataObj = new Date(m.data + 'T00:00:00');
            const dia = dataObj.getDay();
            const diff = dataObj.getDate() - dia + (dia === 0 ? -6 : 1);
            const inicioSemana = new Date(dataObj);
            inicioSemana.setDate(diff);
            inicioSemana.setHours(0,0,0,0);
            const key = inicioSemana.toISOString().split('T')[0];
            const label = `${String(inicioSemana.getDate()).padStart(2,'0')}/${String(inicioSemana.getMonth()+1).padStart(2,'0')}`;
            if (!grupos[key]) grupos[key] = { entrada: 0, saida: 0, label };
            if (m.tipo === 'entrada') grupos[key].entrada += m.valor;
            else grupos[key].saida += m.valor;
        });
    } else {
        movimentacoes.forEach(m => {
            const dataObj = new Date(m.data + 'T00:00:00');
            const key = `${dataObj.getFullYear()}-${String(dataObj.getMonth()+1).padStart(2,'0')}`;
            const label = `${String(dataObj.getMonth()+1).padStart(2,'0')}/${dataObj.getFullYear()}`;
            if (!grupos[key]) grupos[key] = { entrada: 0, saida: 0, label };
            if (m.tipo === 'entrada') grupos[key].entrada += m.valor;
            else grupos[key].saida += m.valor;
        });
    }

    const chaves = Object.keys(grupos).sort();
    const labels = chaves.map(k => grupos[k].label);
    const entradasData = chaves.map(k => grupos[k].entrada);
    const saidasData = chaves.map(k => grupos[k].saida);

    if (chartEvolucao) chartEvolucao.destroy();
    if (chaves.length === 0) {
        const parent = document.getElementById('graficoEvolucao').parentNode;
        let msg = parent.querySelector('.chart-empty-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'chart-empty-msg';
            msg.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:16px; text-align:center; pointer-events:none;';
            msg.textContent = 'Sem dados para exibir';
            parent.style.position = 'relative';
            parent.appendChild(msg);
        }
        return;
    } else {
        const parent = document.getElementById('graficoEvolucao').parentNode;
        const msg = parent.querySelector('.chart-empty-msg');
        if (msg) msg.remove();
    }

    chartEvolucao = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Entradas', data: entradasData, backgroundColor: 'rgba(34,197,94,0.7)', borderColor: '#22c55e', borderWidth: 1, borderRadius: 4 },
                { label: 'Saídas', data: saidasData, backgroundColor: 'rgba(239,68,68,0.7)', borderColor: '#ef4444', borderWidth: 1, borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatarMoeda(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatarMoeda(value);
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICOS DE ROSCA =====
function renderizarGraficosCategoria() {
    const entradasPorCat = {};
    const saidasPorCat = {};
    movimentacoes.forEach(m => {
        if (m.tipo === 'entrada') {
            entradasPorCat[m.categoria] = (entradasPorCat[m.categoria] || 0) + m.valor;
        } else {
            saidasPorCat[m.categoria] = (saidasPorCat[m.categoria] || 0) + m.valor;
        }
    });

    const cores = ['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316','#64748b'];

    // Entradas
    const ctxEnt = document.getElementById('graficoEntradasCategoria').getContext('2d');
    if (chartEntradasCat) chartEntradasCat.destroy();
    const labelsEnt = Object.keys(entradasPorCat);
    const dataEnt = Object.values(entradasPorCat);
    if (labelsEnt.length > 0) {
        chartEntradasCat = new Chart(ctxEnt, {
            type: 'doughnut',
            data: {
                labels: labelsEnt,
                datasets: [{ data: dataEnt, backgroundColor: cores.slice(0, labelsEnt.length), borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a,b) => a+b, 0);
                                const pct = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${formatarMoeda(context.parsed)} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    } else {
        const parent = document.getElementById('graficoEntradasCategoria').parentNode;
        let msg = parent.querySelector('.chart-empty-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'chart-empty-msg';
            msg.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:14px; text-align:center; pointer-events:none;';
            msg.textContent = 'Sem entradas';
            parent.style.position = 'relative';
            parent.appendChild(msg);
        }
    }

    // Saídas
    const ctxSai = document.getElementById('graficoSaidasCategoria').getContext('2d');
    if (chartSaidasCat) chartSaidasCat.destroy();
    const labelsSai = Object.keys(saidasPorCat);
    const dataSai = Object.values(saidasPorCat);
    if (labelsSai.length > 0) {
        chartSaidasCat = new Chart(ctxSai, {
            type: 'doughnut',
            data: {
                labels: labelsSai,
                datasets: [{ data: dataSai, backgroundColor: cores.slice(0, labelsSai.length), borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a,b) => a+b, 0);
                                const pct = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${formatarMoeda(context.parsed)} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    } else {
        const parent = document.getElementById('graficoSaidasCategoria').parentNode;
        let msg = parent.querySelector('.chart-empty-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'chart-empty-msg';
            msg.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:14px; text-align:center; pointer-events:none;';
            msg.textContent = 'Sem saídas';
            parent.style.position = 'relative';
            parent.appendChild(msg);
        }
    }
}

// ===== UTILITÁRIOS =====
function formatarMoeda(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarToast(msg, tipo = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (tipo === 'error' ? ' error' : '');
    t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== EVENTOS =====
formMovimento.addEventListener('submit', salvar);
btnCancelar.addEventListener('click', cancelarEdicao);
filtroDescricao.addEventListener('input', carregarMovimentacoes);
filtroCategoria.addEventListener('change', carregarMovimentacoes);
periodoGrafico.addEventListener('change', renderizarGraficoEvolucao);

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', carregarMovimentacoes);