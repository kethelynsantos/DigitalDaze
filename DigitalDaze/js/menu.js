// menu

const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector(".menu-button");

menuButton.addEventListener("click", () =>{
    navbar.classList.toggle("show-menu");
});

let contador = 1;

setInterval( function(){
    document.getElementById('slide' + contador).checked = true;
    contador++;

    if(counter > 5 ) {
        contador = 1;
    }
}, 3000 );

$('input').on('change', function() {
    $('body').toggleClass('blue');
  });
