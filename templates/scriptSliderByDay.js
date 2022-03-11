
(function () {
  "use strict";

  const sd = {}

  sd.getFlickity = function() {

    //procura o slider em looping
    const element = document.querySelector('.flickity-slider');
    if (!element) { 
      return false
    }
    return true
  },

  sd.getDatas = function() {
    
    console.log("call")

    var existSlider = sd.getFlickity();

    if (!existSlider) {
      setTimeout(sd.getDatas, 500)
      return
    }

    //pega todos os cards de treinamentos
    const card = document.querySelectorAll('.card-sub');

    //pegar todos os dias de treinamento dentro dos textos das datas dos cards
    //e filtra com regex pegando apenas numeros
    const arrayCardDate = new Array
    card.forEach(e => {
      let cardDate = e.textContent.replace(/[^\d]/g, '')
      arrayCardDate.push(cardDate)
    })

    //pega a data de hoje
    var today = new Date()
    today = today.getDate();



    /* a funcao equals verifica:
    se o dia atual nao for igual a nenhum dentro do arrayCardDate
    ele ira somar o dia atual ate coincidir para que o slider va
    para o proximo dia de treinamento */
    sd.equals(today, arrayCardDate)
  
  },

  sd.equals = function(today, arrayCardDate) {

    if ( arrayCardDate.includes(`${today}`) ){
      sd.goToCard(today)
    }else{
      today++
      sd.equals(today,arrayCardDate)
    }

  },

  sd.goToCard = function(today){
    var count = 0

    //pega todos os cards de treinamentos
    const card = document.querySelectorAll('.card-sub');

    card.forEach((e,i) => {
      let dayText = e.textContent.replace(/[^\d]/g, '');

      if (today == dayText && !count){
        for (let j = 0; j < i; j++) {
          document.querySelector('.flickity-button.flickity-prev-next-button.next').click()
        }
        count++
      }

    })

  }

  sd.getDatas()

})();