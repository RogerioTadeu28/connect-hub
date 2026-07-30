// ===== CONFIGURAÇÃO =====
const API_URL = 'https://connect-hub-smart-cash.vercel.app/api';

// ===== ELEMENTOS DOM =====
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// ===== ALTERNAR TELAS =====
showRegister.addEventListener('click', () => {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
    loginError.textContent = '';
    registerError.textContent = '';
});

showLogin.addEventListener('click', () => {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
    loginError.textContent = '';
    registerError.textContent = '';
});

// ===== LOGIN =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    loginError.textContent = '';

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            loginError.textContent = data.error || 'Erro no login';
            return;
        }

        // Sucesso: armazena token e dados
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // alert('Login realizado com sucesso! Bem-vindo, ' + data.user.name);


        // Redireciona para o dashboard
        window.location.href = 'index.html';

        // console.log('Token:', data.token);

    } catch (err) {
        loginError.textContent = 'Erro de conexão com o servidor';
        console.error(err);
    }
});

// ===== CADASTRO =====
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    registerError.textContent = '';

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            registerError.textContent = data.error || 'Erro no cadastro';
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));



        // alert('Cadastro realizado com sucesso! Bem-vindo, ' + data.user.name);

        // Redireciona para o Dashboard
        window.location.href = 'index.html';
        // console.log('Token:', data.token);
    } catch (err) {
        registerError.textContent = 'Erro de conexão com o servidor';
        console.error(err);
    }
});


// ===== VERIFICAR SE JÁ ESTÁ LOGADO =====
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Se já estiver logado, vai direto para o dashboard
        window.location.href = 'index.html';
    }
});