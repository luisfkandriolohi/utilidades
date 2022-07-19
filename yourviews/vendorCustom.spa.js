yv.vendorCustom = {
  quickReviewGetIds: function () {

      const asyncShelfs = yv.vendorCustom.quickReviewAsyncSetup()
      let allShelfs
      
      if (asyncShelfs) {
          allShelfs = [].concat(asyncShelfs)
      }
      
      return allShelfs
  },
  quickReviewAsyncSetup: function () {
      const shelfToInsert = document.querySelectorAll('.product-box a');
      const quickReviewToLoad = document.querySelectorAll('.yv-review-quickreview:not(.is-loaded)');
      const allIds = []
      
      if (typeof(shelfToInsert) !== "undefined" && shelfToInsert.length) {
          shelfToInsert.forEach(function(e) {
              let src = e.getAttribute('href')
              
              let itemId = src.split('?').shift().split('/').pop();
              
              if(!e.querySelector('.yv-review-quickreview')) {
                  e.querySelector('.product-box__info-name').insertAdjacentHTML(
                      'afterend',
                      '<div class="yv-review-quickreview" value="' + itemId + '"></div>' 
                  )
                  
                  allIds.push(itemId)
              
              }
          })
      }
      
      if (typeof(quickReviewToLoad) !== "undefined" && quickReviewToLoad.length) {
          quickReviewToLoad.forEach((qr) => {
              if (qr) {
                  let itemId = qr.getAttribute('value')
                  allIds.push(itemId)
              }
          })
      }
      
      return allIds
  },
  
  popularChart: function() {
      let count = 0;
      
      const searchCircle = setInterval(() => {
          if (njQuery(".circle").length){
              var yvRecommend = njQuery('.yv-recommend').length;
              var yvNotRecommend = njQuery('.yv-not-recommend').length; 
              
              var yvPercent = (yvRecommend *100/(yvNotRecommend +yvRecommend)).toFixed(0);
              
              njQuery(".circle").addClass("yv-percent");
              njQuery('head').append("<style>.circle.yv-percent:before{content: '" + yvPercent + "%' !important" + '}</style>');
              njQuery(".yv-circle-chart__circle").css("stroke-dasharray", yvPercent+",100");
              
              clearInterval(searchCircle);
          }
          
          if (count >= 5){
              clearInterval(searchCircle);
          }
          
          count++;
      },500)
  },
  
  QaElement: function () {
      return ".yv-qa";
  },
  quickReviewProdElement: function () {
      return "#yv-review-quickreview";
  },
  quickReviewProdBefore: function () {

  },

  reviewsElement: function () {
      return "#yv-reviews";
  },
  reviewsBefore: function () { },

  initialSetup: function () {
      yv.vendorCustom.startNewPage();
  },
  
  /* FUNÇÕES PARA SPAs */
  
  checkChangePage: function (){
      
      var lastPage = window.location.pathname;
      
      var checkPage = setInterval(() => {
          
          var actualPage = window.location.pathname;
          
          if (actualPage != lastPage){
              clearInterval(checkPage);
              lastPage = window.location.pathname;
              yv.vendorCustom.clearElementsInPage();
              yv.vendorCustom.clearYvVariables();
              yv.vendorCustom.startNewPage();
          }
          
      },500)
      
  },
  
  startNewPage: function () {

      if (window.location.pathname.includes('/reviews')) {
          yv.vendorCustom.loadPageWritereview()
          yv.vendorCustom.checkChangePage()
      } else if (window.location.pathname.includes('/p/') && !yv.productId) {
          yv.vendorCustom.loadPageProduct.start();
          yv.vendorCustom.checkChangePage()
      } else if (window.location.pathname == '/') {
          yv.vendorCustom.loadPageHome.start();
          yv.vendorCustom.checkChangePage()
      } else {
          yv.vendorCustom.checkChangePage()
      }
      
      //yv.vendorCustom.loadSelo.start();
    
  },
  
  clearElementsInPage: function () {
      
      const elements = ["#yv-reviews", ".yv-qa", "#yv-review-quickreview", ".yv-testimonial", "#yv-show-form"]
      elements.forEach((e) => {
          let element = njQuery(e)
          if (element) element.remove()
      })
      
  },
  
  clearYvVariables: function () {
      
      yv.productId = undefined
      yv.productName = undefined
      yv.productPrice = undefined
      yv.categoryForm = undefined
      yv.imageUrl = undefined
      
  },
  
  getYvVariables: function () {
      
      yv.productId = window.location.pathname.split('/').pop()
      yv.productName = njQuery('.product-details__name').text().trim();
      yv.imageUrl = 'https://' + window.location.hostname + njQuery('.item.thumb-carousel-item a img').first().attr('src');
      
      yv.categoryForm = njQuery('.box-items .box-items__items a').map(
          function (i, v) { return njQuery(v).text() }
      ).get();
      
      if ( njQuery('.product-details__price span').lenght ) {
          yv.productPrice = njQuery('.product-details__price span').last().text();
      } else {
          yv.productPrice = njQuery('.product-details__price').last().text();
      }
      
  },
  
  loadPageWritereview: {
      
      start: function () {
          let count = 0;
          
          //aguarda pagina carregar (procura pela imagem)
          const checkPageLoaded = setInterval(() => {
              if (njQuery('#yv-show-form').length){
                  clearInterval(checkPageLoaded)
                  yv.vendorCustom.loadPageWritereview.loadElements()
              }else{
                  count++
                  if (count >= 10){
                      clearInterval(checkPageLoaded)
                      yv.vendorCustom.loadPageWritereview.insertElements()
                      yv.vendorCustom.loadPageWritereview.loadElements()
                  }                   
              }
          },100)
      },
      
      insertElements: function () {
          njQuery('main.page-row.page-row-expanded #main')
              .append('<div id="yv-show-form" style="min-height:300px; background-image:url(//service.yourviews.com.br/static/images/loading.gif); background-repeat: no-repeat"><br/><br/>Por favor aguarde...</div>')
      },
      
      loadElements: function () {
          if (typeof (yv.review) !== 'undefined' && njQuery('#yv-show-form').length) {
              yv.review.startReviewForm();
              yv.review.loadReviewShelf();
              yv.review.loadReviewPhotoGrid();
          }
      }
      
  },    
  
  loadPageProduct: {
      
      start: function () {
          let count = 0;
          
          //aguarda pagina carregar (procura pela imagem)
          const checkPageLoaded = setInterval(() => {
              if (njQuery('#yv-reviews, .yv-qa, #yv-review-quickreview').length){
                  clearInterval(checkPageLoaded)
                  yv.vendorCustom.getYvVariables()
                  yv.vendorCustom.loadPageProduct.loadElements()
              }else{
                  count++
                  if (count >= 10){
                      clearInterval(checkPageLoaded)
                      yv.vendorCustom.getYvVariables()
                      yv.vendorCustom.loadPageProduct.insertElements()
                      yv.vendorCustom.loadPageProduct.loadElements()
                  }                   
              }
          },100)
      },
      
      insertElements: function () {            
          //quickreview ancora
          if (!njQuery('#yv-review-quickreview').length && njQuery('.product-details__ref').length){
              njQuery('.product-details__ref').before('<div id="yv-review-quickreview"></div>');
          }
          
          //yv-container (insere depois da div das infos do produto)
          if (!njQuery('.yourviews_reviews, #yv-reviews').length && njQuery('.widget_suggestions_for_you').length){
              njQuery('.widget_suggestions_for_you').before('<div class="yourviews_reviews"></div>');
          }
          
          //reviews
          if (!njQuery('#yv-reviews').length && njQuery('.yourviews_reviews').length){
              njQuery('.yourviews_reviews').append('<div id="yv-reviews"></div>');
          }
          
          //QA
          if (!njQuery('.yv-qa').length && njQuery('#yv-reviews').length){
              njQuery('#yv-reviews').after('<div class="yv-qa"></div>');
          }  
          
      },
      
      loadElements: function () {  
          //load quickreview
          if (typeof (yv.review) !== 'undefined' && njQuery('#yv-review-quickreview').length){
              yv.review.startQuickReviewProductPage();
          }
          
          //load review
          if (typeof (yv.review) !== 'undefined' && njQuery('#yv-reviews').length) {
              yv.review.startReviews();
              yv.review.startReviewForm();
              yv.review.loadReviewShelf();
              yv.review.loadReviewPhotoGrid();
              yv.vendorCustom.popularChart();
          }
          
          //load qa
          if (typeof (yv.qa) !== 'undefined' && njQuery('.yv-qa').length) {
              //yv.qa.startQa();
          } 
      }
      
      
  },
  
  loadPageHome: {
      
      start: function () {
          let count = 0;
          
          //aguarda pagina carregar (procura pelas imagens das prateleiras)
          const checkPageLoaded = setInterval(() => {
              if (njQuery('.yv-testimonial').length){
                  clearInterval(checkPageLoaded)
                  yv.vendorCustom.loadPageHome.loadElements()
              }else{
                  count++
                  if (count >= 10){
                      clearInterval(checkPageLoaded)
                      yv.vendorCustom.loadPageHome.insertElements()
                      yv.vendorCustom.loadPageHome.loadElements()
                  }                   
              }
          },100)
      },
      
      insertElements: function () {
          //testemunhos
          if (!njQuery('.yv-testimonial').length && njQuery('#b2cgnzaxyCustomProductRecommendations_v1-wi600018').length){
              njQuery('#b2cgnzaxyCustomProductRecommendations_v1-wi600018')
                  .after('<div class="yourviews_testemunhos"><div class="yv-testimonial" qty="9"></div></div>')
          }
      },
      
      loadElements: function () {
          if (typeof (yv.storeReviews) !== 'undefined' && njQuery('.yv-testimonial').length) {
              yv.storeReviews.startTestimonial();
              yv.storeReviews.startStoreReview();
          }
      }
  },
  
  loadSelo: {
      
      start: function () {
          let count = 0;
          
          //aguarda pagina carregar (procura pela div do selo)
          const checkPageLoaded = setInterval(() => {
              if (njQuery('div.security').length){
                  clearInterval(checkPageLoaded)
                  yv.vendorCustom.loadSelo.insertElements()
              }else{
                  count++
                  if (count >= 10){
                      clearInterval(checkPageLoaded)
                  }                   
              }
          },100)
      },
      
      insertElements: function () {
          //selo
          if (!njQuery('[title="Loja Confiável"]').length){
             njQuery("div.security")
                  .append('<a href="https://www.lojaconfiavel.com/zaxy" class="ts-footerstamp" data-lcname="zaxy"  target="_blank"> <img src="//service.yourviews.com.br/Image/b60eae90-d3cd-4efb-9d14-67fd9b399c2e/Footer.jpg" title="Loja Confiável" alt="Loja Confiável" style="width: 88px; height: 91px;"/> </a>')
          }
      }
       
  },
  
  
  
};