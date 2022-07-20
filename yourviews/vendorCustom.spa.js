yv.vendorCustom = {
  quickReviewGetIds: function () {
    const asyncShelfs = yv.vendorCustom.quickReviewAsyncSetup();
    let allShelfs;

    if (asyncShelfs) {
      allShelfs = [].concat(asyncShelfs);
    }

    return allShelfs;
  },
  quickReviewAsyncSetup: function () {
    const shelfToInsert = document.querySelectorAll(".product-box a");
    //const quickReviewToLoad = document.querySelectorAll('.yv-review-quickreview:not(.is-loaded)');
    const allIds = [];

    if (typeof shelfToInsert !== "undefined" && shelfToInsert.length) {
      shelfToInsert.forEach(function (e) {
        let src = e.getAttribute("href");

        let itemId = src.split("?").shift().split("/").pop();

        if (!e.querySelector(".yv-review-quickreview")) {
          e.querySelector(".product-box__info-name").insertAdjacentHTML(
            "afterend",
            '<div class="yv-review-quickreview" value="' + itemId + '"></div>'
          );

          allIds.push(itemId);
        }
      });
    }

    if (typeof quickReviewToLoad !== "undefined" && quickReviewToLoad.length) {
      quickReviewToLoad.forEach((qr) => {
        if (qr) {
          let itemId = qr.getAttribute("value");
          allIds.push(itemId);
        }
      });
    }

    return allIds;
  },

  canStart: function () {
    return true;
  },

  popularChart: function () {
    let count = 0;

    const searchCircle = setInterval(() => {
      if (njQuery(".circle").length) {
        var yvRecommend = njQuery(".yv-recommend").length;
        var yvNotRecommend = njQuery(".yv-not-recommend").length;

        var yvPercent = (
          (yvRecommend * 100) /
          (yvNotRecommend + yvRecommend)
        ).toFixed(0);

        njQuery(".circle").addClass("yv-percent");
        njQuery("head").append(
          "<style>.circle.yv-percent:before{content: '" +
            yvPercent +
            "%' !important" +
            "}</style>"
        );
        njQuery(".yv-circle-chart__circle").css(
          "stroke-dasharray",
          yvPercent + ",100"
        );

        clearInterval(searchCircle);
      }

      if (count >= 5) {
        clearInterval(searchCircle);
      }

      count++;
    }, 500);
  },

  QaElement: function () {
    return ".yv-qa";
  },
  quickReviewProdElement: function () {
    return "#yv-review-quickreview";
  },
  quickReviewProdBefore: function () {},

  reviewsElement: function () {
    return "#yv-reviews";
  },
  reviewsBefore: function () {},

  initialSetup: function () {
    yv.vendorCustom.startSpa();
    yv.vendorCustom.checkChangePage();
  },

  /* FUNÇÕES PARA SPAs */

  startSpa: function () {
    const elementsToInsert = [
      {
        element: ".yv-testimonial",
        selector: ".pwat-home__campaign-1",
        where: "afterend",
        elementHTML: "<div class='yv-testimonial' data-qty='9'></div>",
        loadFunctions: [
          yv.storeReviews.startTestimonial,
          yv.storeReviews.startStoreReview,
        ],
        isLoaded: false,
      },

      {
        element: "#yv-review-quickreview",
        selector: ".pwat-product__info .name",
        where: "afterend",
        elementHTML: "<div id='yv-review-quickreview'></div>",
        loadFunctions: [yv.review.startQuickReviewProductPage],
        isLoaded: false,
      },

      {
        element: "#yv-reviews",
        selector: ".pwat-product__container",
        where: "afterend",
        elementHTML: "<div id='yv-reviews'></div>",
        loadFunctions: [
          yv.review.startReviews,
          yv.review.startReviewForm,
          yv.review.loadReviewShelf,
          yv.review.loadReviewPhotoGrid,
        ],
        isLoaded: false,
      },

      {
        element: ".yv-qa",
        selector: "#yv-reviews",
        where: "afterend",
        elementHTML: "<div class='yv-qa'></div>",
        loadFunctions: [yv.qa.startQa],
        isLoaded: false,
      },

      {
        element: "#yv-show-form",
        selector: "SELETOR_AQUI",
        where: "",
        elementHTML:
          "<div id='yv-show-form' style='min-height:300px;background-image:url(//service.yourviews.com.br/static/images/loading.gif);background-repeat:no-repeat'><br/><br/>Por favor aguarde...</div>",
        loadFunctions: [yv.review.startReviewForm],
        isLoaded: false,
      },
    ];

    var count = 0;
    const loadElements = setInterval(() => {
      elementsToInsert.forEach((obj) => {
        if (
          obj.element == "#yv-reviews" &&
          document.querySelector(obj.selector) &&
          !yv.yvVariablesGot
        ) {
          yv.vendorCustom.getYvVariables();
          yv.yvVariablesGot = true;
        }

        if (document.querySelector(obj.element) && !obj.isLoaded) {
          obj.loadFunctions.forEach((f) => f());
          obj.isLoaded = true;
          yv.utils.safeLog(`${obj.element} loaded!`);
        } else if (document.querySelector(obj.selector) && !obj.isLoaded) {
          document
            .querySelector(obj.selector)
            .insertAdjacentHTML(obj.where, obj.elementHTML);
          obj.loadFunctions.forEach((f) => f());
          obj.isLoaded = true;
          yv.utils.safeLog(`${obj.element} loaded!`);
        }
      });
      count++;
      if (count >= 10) {
        clearInterval(loadElements);
        yv.utils.safeLog(`loadSpa ended`);
      }
    }, 500);
  },

  getYvVariables: function () {
    yv.productId = njQuery(".pwat-gallery__main-image")
      .attr("src")
      .split("_")
      .pop()
      .split(".")
      .shift();
    yv.productName = njQuery(".pwat-product__info .name").text().trim();
    yv.productPrice = njQuery(".detail-price .price .current").last().text();
    yv.imageUrl = njQuery('[name="og:image"]').attr("content");
    yv.categoryForm = [];
    yv.productUrl = window.location.href;
  },

  checkChangePage: function () {
    var lastPage = window.location.pathname;
    var checkPage = setInterval(() => {
      var actualPage = window.location.pathname;
      if (actualPage != lastPage) {
        lastPage = window.location.pathname;
        clearInterval(checkPage);
        yv.vendorCustom.initialSetup();
      }
    }, 500);
  },
};
