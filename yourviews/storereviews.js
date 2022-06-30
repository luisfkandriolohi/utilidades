yv.storeReviews = {
  startTestimonial: function () {
      if (njQuery('.yv-testimonial').length) {
          var element = njQuery('.yv-testimonial');

          //Verifica se está no modo debug
          var debug = element.data('debug');

          if (debug && debug == true) {
              if (yv.utils.qs["yv-debug"] != 'true') //Se estiver e não houver querystring, não carrega
              {
                  yv.utils.safeLog('Debugging mode for Testimonial but no yv-debug querystring. Testimonial will not load');
                  return;
              }
          }

          var qty = element.data('qty') || 9;

          njQuery.jsonpx(yv.uriBuilder.general('/storereview/testimonial', '&qty=' + qty), function (r) {
              element.html(r.html);
              yv.commom.toggleViewMore();

              if (element.find('.yv-slide').length > 0) {
                  yv.Slider.build(
                      [
                          {
                              slidesToShow: 3,
                              slidesToShift: 3,
                              showButtons: true,
                              showPaging: true,
                              infinite: true,
                              breakpoint: 9999
                          },
                          {
                              slidesToShow: 2,
                              slidesToShift: 2,
                              showButtons: true,
                              showPaging: true,
                              infinite: true,
                              breakpoint: 990
                          },
                          {
                              slidesToShow: 1,
                              slidesToShift: 1,
                              showButtons: true,
                              showPaging: true,
                              infinite: true,
                              breakpoint: 690
                          }
                      ],
                      {
                          container: '.yv-testimonial__container',
                          view: '.yv-testimonial__container__view',
                          wrapper: '.yv-testimonial__container__view__wrapper',
                          slides: '.yv-slide',
                      },
                      qty
                  );
                  
                  element.show();
              }
          });
      }
  },
  startStoreReview: function () {
      yv.storeReviews.loadStampModal();

      var element = njQuery('.yv-storereviews');

      if (!element || element.length == 0) return;

      //Verifica se está no modo debug
      var debug = element.data('debug');

      if (debug && debug == true) {
          //Se estiver e não houver querystring, não carrega
          if (yv.utils.qs["yv-debug"] != 'true') {
              yv.utils.safeLog('Debugging mode for store reviews but no yv-debug querystring. Store reviews will not load');
              return;
          }
      }

      yv.utils.toggleLoading(false, '.yv-store-review');

      njQuery.jsonpx(yv.uriBuilder.general('/storereview/reviews'), function (r) {
          yv.storeReviews.loadStoreReviewResult(r);
          yv.utils.toggleLoading(true, '.yv-store-review');
      });
  },
  loadStoreReviewResult: function (r) {
      var element = njQuery('.yv-storereviews');
      element.html(r.html);

      yv.commom.loadPaging(yv.storeReviews.loadStoreReviewResult, yv.storeReviews.loadStoreReviewResult, '.yv-store-review');
  },
  loadStoreReview: function () {
      var element = njQuery('.yv-storereviews');

      if (!element || element.length == 0) return;

      //Verifica se está no modo debug
      var debug = element.data('debug');

      if (debug && debug == true) {
          if (yv.utils.qs["yv-debug"] != 'true') //Se estiver e não houver querystring, não carrega
          {
              yv.utils.safeLog('Debugging mode for store reviews but no yv-debug querystring. Store reviews will not load');
              return;
          }
      }

      yv.utils.toggleLoading(false, '.yv-store-review');

      njQuery.jsonpx(yv.uriBuilder.general('/storereview/reviews'), function (r) {
          yv.storeReviews.loadStoreReviewResult(r);
          yv.utils.toggleLoading(true, '.yv-store-review');
      });
  },
  loadStampModal: function () {
      var baseUrl = 'https://www.lojaconfiavel.com/trustedstore/modal/';

      njQuery('[data-lcname],img[title="Loja Confiável"][src*="Footer.jpg"],img[title="Loja ConfiÃ¡vel"][src*="Footer.jpg"]').click(function (event) {
          var storeName = '';
          var tgt = njQuery(event.target);

          if (tgt[0].hasAttribute('data-lcname')) {
              storeName = njQuery(tgt).attr('data-lcname');
          } else {
              var linkElement = njQuery(event.target).parent();

              if (linkElement) {
                  var attrElement = linkElement.attr('href');

                  if (attrElement) {
                      if (attrElement.indexOf('?') > -1) {
                          storeName = attrElement.split('utm_source=')[1];
                      } else {
                          var splitted = attrElement.split('/');
                          storeName = splitted[splitted.length - 1];
                      }
                  }
              }
          }

          if (storeName != '') {
              if (!njQuery('.yv-trustedstore-modal').length) {
                  var modalBody = "<div class='yv-bootstrap'> <div class='yv-trustedstore-modal yv-modal  yv-fade' tabindex='-1' role='dialog' style='display: none;'><div class='yv-modal-dialog' role='document'><div class='yv-modal-content'> <div class='yv-modal-close'><span class='yv-modal-closetext'><img src='" + yv.staticServiceAddr + "/static/images/close_btn_blue.png'></span></div> <div class='yv-modal-body'> <iframe src='" + baseUrl + storeName + "' style='border: 0; width: 100%; height: 100%'>Your browser doesn't support iFrames.</iframe>  </div></div></div></div></div>";
                  njQuery('body').append(modalBody);
                  njQuery('.yv-modal-close,.yv-trustedstore-modal').click(function (r) {
                      njQuery('.yv-trustedstore-modal').modal('hide');
                      njQuery('.yv-modal-backdrop.yv-fade.yv-in').remove();
                  });
              }

              njQuery('.yv-trustedstore-modal').modal('show');
              event.preventDefault();
              return false;
          }
      });
  }
}
