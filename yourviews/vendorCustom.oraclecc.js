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
      const shelfToInsert = document.querySelectorAll('');
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
  
  initialSetup: function () { },
  
  /* FUNÇÕES PARA SPAs GRENDENE */
  
  loadYourviewsElements: function (){
      
      yv.vendorCustom.clearYvVariables();
      yv.vendorCustom.searchElementsInPage();
      
  },
  
  clearYvVariables: function () {
      
      yv.elementsLoaded = [];
      yv.productId = undefined
      yv.productName = undefined
      yv.productPrice = undefined
      yv.categoryForm = undefined
      yv.imageUrl = undefined
      
  },
  
  searchElementsInPage: function () {
      
      const elementsToSearch = ["#yv-reviews", ".yv-qa", "#yv-review-quickreview", ".yv-testimonial", "#yv-show-form"]
      const elementsInPage = []
      if (typeof(yv.elementsLoaded) == 'undefined') yv.elementsLoaded = []
      
      let count = 0
      
      const searchElements = setInterval(() => {
          elementsToSearch.forEach((e) => {
              let element = njQuery(e)
              if (element.length && !elementsInPage.includes(e)) elementsInPage.push(e)
          })
          if (elementsInPage.length) yv.vendorCustom.loadElementsInPage(elementsInPage)
          count++
          if (count >= 10){
              clearInterval(searchElements)
          }
      },500)
      
      
  },
  
  loadElementsInPage: function (elementsInPage) {        
      elementsInPage.forEach((e) => {
          if (!yv.elementsLoaded.includes(e)) {
              
              switch (e) {
                  case '#yv-reviews':
                      if (typeof(yv.productId) == 'undefined') yv.vendorCustom.getYvVariables();
                      yv.vendorCustom.loadReviews();
                      yv.elementsLoaded.push(e);
                      break;
                  case '.yv-qa':
                      if (typeof(yv.productId) == 'undefined') yv.vendorCustom.getYvVariables();
                      yv.vendorCustom.loadQA();
                      yv.elementsLoaded.push(e)
                      break;
                  case '#yv-review-quickreview':
                      if (typeof(yv.productId) == 'undefined') yv.vendorCustom.getYvVariables();
                      yv.vendorCustom.loadQuickReview();
                      yv.elementsLoaded.push(e)
                      break;
                  case ".yv-testimonial":
                      yv.vendorCustom.loadTestimonial();
                      yv.elementsLoaded.push(e)
                      break;
                  case "#yv-show-form":
                      if (njQuery(e).html() !== ''){
                          yv.vendorCustom.loadShowForm();
                          yv.elementsLoaded.push(e)
                          break;
                      }
              }
              
          }
      })
  },
  
  getYvVariables: function () {
      
      yv.productId = window.location.pathname.split('/').pop();
      yv.productName = njQuery('.product-details__name').text().trim();
      yv.imageUrl = 'https://' + window.location.hostname + njQuery('.item.thumb-carousel-item a img').first().attr('src');
      yv.productUrl = window.location.href;
      
      yv.categoryForm = njQuery('.box-items .box-items__items a').map(
          function (i, v) { return njQuery(v).text() }
      ).get();
      
      if ( njQuery('.product-details__price span').lenght ) {
          yv.productPrice = njQuery('.product-details__price span').last().text();
      } else {
          yv.productPrice = njQuery('.product-details__price').last().text();
      }
      
  },
  
  loadReviews: function () {
      yv.review.startReviews();
      yv.review.startReviewForm();
      yv.review.loadReviewShelf();
      yv.review.loadReviewPhotoGrid();
      yv.vendorCustom.popularChart();
  },
  
  loadQA: function () {
      yv.qa.startQa();
  },
  
  loadQuickReview: function () {
      yv.review.startQuickReviewProductPage();        
  },
  
  loadTestimonial: function () {
      yv.storeReviews.startTestimonial();
      yv.storeReviews.startStoreReview();
  },
  
  loadShowForm: function () {
      yv.review.startReviewForm();
      yv.review.loadReviewShelf();
      yv.review.loadReviewPhotoGrid();
  },
  
  
  
};