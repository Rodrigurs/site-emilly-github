// ====== Configuração: troque pelo seu e-mail para o formulário funcionar ======
const MEU_EMAIL = "seu-email@exemplo.com";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Menu mobile: o Bootstrap abre/fecha; aqui só fechamos ao clicar em um link
const menu = $("#menu");
$$(".navbar a").forEach(a => a.addEventListener("click", () => {
  if (menu?.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
}));

// Sombra do header, botão "topo" e link ativo ao rolar
const header = $(".header"), toTop = $(".to-top");
const sections = $$("main section[id]"), links = $$('.navbar a[href^="#"]');
addEventListener("scroll", () => {
  header.classList.toggle("scrolled", scrollY > 20);
  toTop?.classList.toggle("show", scrollY > 600);
  let atual = "";
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) atual = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + atual));
}, { passive: true });
toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

// Animação ao aparecer na tela
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: .15 });
$$(".reveal").forEach(el => io.observe(el));

// Efeito de digitação no hero
const typingEl = $("#typing");
if (typingEl) {
  const frases = ["fotógrafa de natureza", "futura militar", "gamer", "apaixonada pela família"];
  let f = 0, c = 0, apagando = false;
  (function digitar() {
    const frase = frases[f];
    typingEl.textContent = frase.slice(0, apagando ? --c : ++c);
    let t = apagando ? 40 : 90;
    if (!apagando && c === frase.length) { apagando = true; t = 1500; }
    else if (apagando && c === 0) { apagando = false; f = (f + 1) % frases.length; t = 400; }
    setTimeout(digitar, t);
  })();
}

// Foto de perfil: usa img/emilly.jpg; se não existir, mostra o placeholder
const portrait = $("#portrait");
portrait?.addEventListener("error", () => { portrait.src = "img/placeholder.svg"; }, { once: true });

// Galeria: filtro por categoria
const items = $$(".gallery-item");
$$(".filters button").forEach(btn => btn.addEventListener("click", () => {
  $$(".filters button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  items.forEach(i => i.parentElement.classList.toggle("d-none", btn.dataset.filter !== "todos" && i.dataset.cat !== btn.dataset.filter));
}));

// Lightbox com navegação (setas, teclado e Esc)
const lb = $("#lightbox"), lbImg = $("#lightbox-img"), lbCap = $("#lightbox-cap");
let visiveis = [], idx = 0;
function abrir(i) {
  idx = (i + visiveis.length) % visiveis.length;
  const it = visiveis[idx];
  lbImg.src = it.dataset.full; lbImg.alt = $("img", it).alt; lbCap.textContent = it.dataset.title;
  lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
}
function fechar() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); lbImg.src = ""; }
items.forEach(it => it.addEventListener("click", () => {
  visiveis = items.filter(i => !i.parentElement.classList.contains("d-none"));
  abrir(visiveis.indexOf(it));
}));
if (lb) {
  $(".lb-close").addEventListener("click", fechar);
  $(".prev").addEventListener("click", () => abrir(idx - 1));
  $(".next").addEventListener("click", () => abrir(idx + 1));
  lb.addEventListener("click", e => { if (e.target === lb) fechar(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") abrir(idx - 1);
    if (e.key === "ArrowRight") abrir(idx + 1);
  });
}

// Formulário com validação (abre o app de e-mail com a mensagem pronta)
const form = $("#contact-form"), status = $("#form-status");
form?.addEventListener("submit", e => {
  e.preventDefault();
  const campos = $$("input,textarea", form);
  campos.forEach(c => c.classList.toggle("invalid", !c.checkValidity()));
  if (campos.some(c => !c.checkValidity())) { status.textContent = "Preencha todos os campos corretamente."; return; }
  const [nome, email, msg] = campos.map(c => c.value.trim());
  location.href = `mailto:${MEU_EMAIL}?subject=${encodeURIComponent("Contato pelo portfólio - " + nome)}&body=${encodeURIComponent(msg + "\n\n" + nome + " (" + email + ")")}`;
  status.textContent = "Obrigada, " + nome + "! Seu app de e-mail vai abrir com a mensagem pronta.";
  form.reset();
});

// Contadores animados na seção "Sobre mim"
const contar = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, alvo = +el.dataset.count; let n = 0;
  const passo = setInterval(() => { el.textContent = ++n; if (n >= alvo) clearInterval(passo); }, Math.max(30, 900 / alvo));
  contar.unobserve(el);
}), { threshold: .6 });
$$("[data-count]").forEach(el => contar.observe(el));

// Se alguma foto da galeria não carregar, esconde o item em vez de mostrar um quadrado quebrado
$$(".gallery-item img").forEach(img => img.addEventListener("error", () => img.closest(".col-12")?.classList.add("d-none")));
