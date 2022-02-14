quickReviewGetIds: function () {
  const syncShelfs = yv.vendorCustom.quickReviewSetup()
  const asyncShelfs = yv.vendorCustom.quickReviewAsyncSetup()
  
  if (!asyncShelfs.length) {
      return syncShelfs
  
  } else {
      return syncShelfs.concat(asyncShelfs)
  }
},

quickReviewSetup: function () {
  const allEles = document.querySelectorAll('.performa-image-vitrine .tns-lazy-img');
  const allIds = []
  
  if (!allEles || allEles.length == 0) return;
  
  allEles.forEach(function(e) {
      let src = e.getAttribute('data-src')
      
      if (!src) src = e.getAttribute('src')
      
      const itemId = src.split('_').splice(-3, 1).pop()
      
      if(!e.closest('.performa-vitrine-box').querySelector('.yv-review-quickreview')) {
          e.closest('.performa-vitrine-box').querySelector('.performa-name-vitrine').insertAdjacentHTML(
              'afterend',
              '<div class="yv-review-quickreview" value="' + itemId + '"></div>' 
          )
      }
      
      allIds.push(itemId)
  })
  
  return allIds
},

quickReviewAsyncSetup: function () {
  const allEles = document.querySelectorAll('.ndx_product-card .ndx_product-image .lazy.visible.content');
  const allIds = []
  
  if (!allEles || allEles.length == 0) return;
  
  allEles.forEach(function(e) {
      let src = e.getAttribute('data-src')
      
      if (!src) src = e.getAttribute('src')
      
      const itemId = src.split('_').splice(-3, 1).pop()
      
      if(!e.closest('.ndx_product-card-link').querySelector('.yv-review-quickreview')) {
          e.closest('.ndx_product-card-link').querySelector('.info .dados h3').insertAdjacentHTML(
              'afterend',
              '<div class="yv-review-quickreview" value="' + itemId + '"></div>' 
          )
      }
      
      allIds.push(itemId)
  })
  
  return allIds
},