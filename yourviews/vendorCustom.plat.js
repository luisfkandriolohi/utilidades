quickReviewGetIds: function () {

    const asyncShelfs = yv.vendorCustom.quickReviewAsyncSetup()
    let allShelfs
    
    if (asyncShelfs) {
        allShelfs = [].concat(asyncShelfs)
    }
    
    return allShelfs
},
quickReviewAsyncSetup: function () {
    const shelfToInsert = document.querySelectorAll('.ProductCard-info a');
    const quickReviewToLoad = document.querySelectorAll('.yv-review-quickreview:not(.is-loaded)');
    const allIds = []
    
    if (typeof(shelfToInsert) !== "undefined" && shelfToInsert.length) {
        shelfToInsert.forEach(function(e) {
            let src = e.getAttribute('href')
            
            let itemId = src.split('/').pop().split('?').shift();
            
            if(!e.querySelector('.yv-review-quickreview')) {
                e.querySelector('.ProductCard-name').insertAdjacentHTML(
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