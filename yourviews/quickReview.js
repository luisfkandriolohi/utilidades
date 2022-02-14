yv.quickReview = {
  quickReviewSetResult: function(e) {
      const shelfId = e.productId
      const shelfData = e.data
      const shelfs = document.querySelectorAll('.yv-review-quickreview[value="' + shelfId + '"]')
      
      shelfs.forEach(function (shelf) {
          if (!shelf.classList.contains('is-loaded')) {
              shelf.classList.toggle('is-loaded')
              shelf.addEventListener('mouseenter', function() {
                  yv.quickReview.searchRelevantReview(njQuery(shelf))
              }) 
          }
          
          shelf.replaceChildren('')
          shelf.insertAdjacentHTML('beforeend', shelfData);
      })
  },
  
  showQuickReview: function(shelfsRes) {
      shelfsRes.forEach(function(e) {
          if (e && e.productId && e.data) yv.quickReview.quickReviewSetResult(e)
      })
  },

  getProductShelf: function(shelfsNotLoaded) {
      const endpoint = yv.uriBuilder.general('/review/productShelf', '&ids=' + shelfsNotLoaded.join(','))
      
      njQuery.jsonpx(endpoint, function (res) {
          if (!res.html) return
          
          const parsedRes = JSON.parse(res.html)
          
          if (parsedRes) yv.quickReview.showQuickReview(parsedRes);
      });
  },
  
  loadCheck: function(shelfsToLoad) {
      const shelfsNotLoaded = []
      
      shelfsToLoad.forEach(function(e) {
          const shelf = document.querySelector('.yv-review-quickreview[value="' + e + '"]')
          const isLoaded = yv.loadedShelfs.includes(e) ? true : false
          
          if (shelf && !shelf.childNodes.length && isLoaded) shelfsNotLoaded.push(e)
      })
      
      if (shelfsNotLoaded.length) yv.quickReview.getProductShelf(shelfsNotLoaded)
  },
  
  searchExecuteQuickReview: function() {
      const shelfsToLoad = yv.vendorCustom.quickReviewGetIds()
      const shelfsNotLoaded = []
      
      if (!yv.loadedShelfs) yv.loadedShelfs = []
      
      shelfsToLoad.forEach(function(e) {
          if (!yv.loadedShelfs.includes(e)) shelfsNotLoaded.push(e)
      })
      
      if (shelfsNotLoaded.length) {
          yv.loadedShelfs = yv.loadedShelfs.concat(shelfsNotLoaded)
          yv.quickReview.getProductShelf(shelfsNotLoaded)
      
      } else {
          yv.quickReview.loadCheck(shelfsToLoad)
      }
      
      return
  },

  searchRelevantReview: function (product) {
      var productId = product.attr('value');
      var url = yv.uriBuilder.general('/review/ReviewRelevant', '&productStoreId=' + productId);
      
      if (product.attr('data-content') == undefined) {
          njQuery.jsonpx(url, function (r) {
              if (!r.html) return;
              
              product.on('shown.bs.popover', function () {
                  setTimeout(function () {
                      product.popover('hide');
                  }, 12000);
              });

              product.popover({
                  content: r.html,
                  trigger: 'hover',
                  html: true,
                  title: 'O que as pessoas acham',
                  placement: "auto yv-bottom",
                  container: '#yv-popover'
              }).popover('show');               

              product.attr('data-content', r.html);
          });
      }
  },

  startQuickReview: function () {
      setInterval(yv.quickReview.searchExecuteQuickReview, 500)
      
      if (njQuery('#yv-popover').length == 0) {
          njQuery('body')
              .append('<div class="yv-bootstrap" id="yv-popover" style="position: absolute;"></div>')
      }
  }
}