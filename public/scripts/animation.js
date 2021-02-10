// Ai você adicionar como quiser, pode ser baseado no scroll, em algum clique ou qualquer outra ação do usuário

document.querySelector('.test').classList.add('animate');
// Função para determinar o comprimento de cada path
document.querySelectorAll('.test.animate path').forEach(function (element) {
  let comprimento = Math.round(element.getTotalLength());
  element.setAttribute('stroke-dasharray', comprimento);
  element.setAttribute('stroke-dashoffset', comprimento);
});
