const URL_API = "https://script.google.com/macros/s/AKfycbxSEPc5LptXEszW6eJVpsa5PL0MOdvWISFwI1IeO0UwpvFbJ_VsCbulrAx18hWK_Sd2/exec";  // <-- Cole aqui!

// Evento do botão entrar (adicione no seu script)
document.getElementById('btn-entrar').addEventListener('click', async () => {
  const matricula = document.getElementById('matricula').value.trim();
  const senha = document.getElementById('senha').value;
  const msgErro = document.getElementById('msg-erro');
  const btnEntrar = document.getElementById('btn-entrar');

  if (!matricula || !senha) {
    msgErro.textContent = "Preencha matrícula e senha";
    msgErro.style.display = "block";
    return;
  }

  msgErro.style.display = "none";
  btnEntrar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
  btnEntrar.disabled = true;

  try {
    const response = await fetch(URL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula, senha })
    });
    const resultado = await response.json();

    if (resultado.sucesso) {
      localStorage.setItem('usuarioPENSO', JSON.stringify(resultado.usuario));
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('tela-principal').style.display = 'flex';

      // Saudação personalizada no header
      const header = document.querySelector('header h1');
      header.innerHTML = `<i class="fas fa-clipboard-list"></i> Olá, ${resultado.usuario.apelido || resultado.usuario.nome.split(' ')[0]}!`;

      // Libera botões por nível
      const btnInsp = document.getElementById('btn-segunda-tela');
      if (resultado.usuario.nivel === 'admin' || resultado.usuario.nivel === 'inspetor') {
        btnInsp.classList.remove('disabled');
        btnInsp.href = '#';  // Ou link para nova página, ex: 'inspetores.html'
      }
    } else {
      msgErro.textContent = resultado.erro || 'Login falhou';
      msgErro.style.display = 'block';
    }
  } catch (error) {
    msgErro.textContent = 'Erro de conexão. Verifique internet e tente novamente.';
    msgErro.style.display = 'block';
  } finally {
    btnEntrar.innerHTML = '<i class="fas fa-sign-in-alt"></i> ENTRAR';
    btnEntrar.disabled = false;
  }
});

// Auto-login se já logado
window.addEventListener('load', () => {
  const usuario = localStorage.getItem('usuarioPENSO');
  if (usuario) {
    const userData = JSON.parse(usuario);
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('tela-principal').style.display = 'flex';
    document.querySelector('header h1').innerHTML = `<i class="fas fa-clipboard-list"></i> Olá, ${userData.apelido || userData.nome.split(' ')[0]}!`;
    // Libera botões aqui também
  }
});

// Logout (adicione um botão se quiser)
function logout() {
  localStorage.removeItem('usuarioPENSO');
  document.getElementById('tela-login').style.display = 'flex';
  document.getElementById('tela-principal').style.display = 'none';
}
