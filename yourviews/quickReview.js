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
            yv.awaitEndpointShelfs = false
        })
    },
    
    showQuickReview: function(shelfsRes) {
        shelfsRes.forEach(function(e) {
            if (e && e.productId && e.data) yv.quickReview.quickReviewSetResult(e)
        })
    },

    getProductShelf: function(shelfsToLoad) {
        const endpoint = yv.uriBuilder.general('/review/productShelf', '&ids=' + shelfsToLoad.join(','))
        
        yv.awaitEndpointShelfs = true
        
        njQuery.jsonpx(endpoint, function (res) {
            if (!res.html) return
            
            const parsedRes = JSON.parse(res.html)
            
            if (parsedRes) yv.quickReview.showQuickReview(parsedRes);
        });
    },
    
    searchExecuteQuickReview: function() {
        const shelfsToLoad = yv.vendorCustom.quickReviewGetIds()
        
        if (shelfsToLoad && shelfsToLoad.length && !yv.awaitEndpointShelfs) {
            yv.quickReview.getProductShelf(shelfsToLoad)
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
        if (yv.quickReviewStarted == true) return
        
        setInterval(yv.quickReview.searchExecuteQuickReview, 500)
        yv.quickReviewStarted = true;
        
        if (njQuery('#yv-popover').length == 0) {
            njQuery('body')
                .append('<div class="yv-bootstrap" id="yv-popover" style="position: absolute;"></div>')
        }
    }
}