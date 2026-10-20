/* ---------- Page d’accueil : afficher / masquer le mot de passe ---------- */
const togglePwd = document.getElementById('togglePwd');
if (togglePwd) {
  const pwd = document.getElementById('password');
  togglePwd.addEventListener('click', () => {
    const show = pwd.type === 'password';
    pwd.type = show ? 'text' : 'password';
    togglePwd.classList.toggle('active', show);
    togglePwd.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  });
}

/* ---------- Page des tarifs : pop-up d’achat ---------- */
const overlay = document.getElementById('overlay');
if (overlay) {
  const $ = (id) => document.getElementById(id);
  const steps = { form: $('stepForm'), load: $('stepLoad'), ok: $('stepOk') };
  const operators = document.querySelectorAll('input[name="operator"]');
  let current = null;

  const showStep = (name) => {
    Object.entries(steps).forEach(([key, el]) => el.classList.toggle('hidden', key !== name));
  };
  const formatFcfa = (n) => Number(n).toLocaleString('fr-FR') + ' FCFA';
  const closeModal = () => overlay.classList.remove('open');
  const selectedOperator = () => document.querySelector('input[name="operator"]:checked');

  // Le libellé du champ suit l’opérateur choisi
  operators.forEach((radio) => {
    radio.addEventListener('change', () => {
      $('phoneLabel').textContent = `Numéro ${radio.value}`;
      $('err').textContent = '';
      $('phone').focus();
    });
  });

  document.querySelectorAll('.buy').forEach((btn) => {
    btn.addEventListener('click', () => {
      current = { forfait: btn.dataset.forfait, prix: btn.dataset.prix };
      $('mForfait').textContent = current.forfait;
      $('mPrix').textContent = formatFcfa(current.prix);
      $('phone').value = '';
      $('err').textContent = '';
      $('phoneLabel').textContent = 'Numéro Mobile Money';
      operators.forEach((r) => (r.checked = false));
      showStep('form');
      overlay.classList.add('open');
    });
  });

  $('payBtn').addEventListener('click', () => {
    const op = selectedOperator();
    if (!op) {
      $('err').textContent = 'Choisissez MTN MoMo ou Moov Money.';
      return;
    }
    const phone = $('phone').value.replace(/\s/g, '');
    if (!/^\d{8,}$/.test(phone)) {
      $('err').textContent = 'Entrez un numéro valide.';
      return;
    }
    current.operateur = op.value;
    current.phone = phone;
    showStep('load');

    /* ICI : remplace cette simulation par KkiaPay
       (openKkiapayWidget avec current.prix et current.phone,
       puis vérification côté serveur). */
    setTimeout(() => {
      const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
      $('code').textContent = `${part()}-${part()}`; // code de démonstration
      showStep('ok');
    }, 1800);
  });

  $('closeBtn').addEventListener('click', closeModal);
  $('doneBtn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}