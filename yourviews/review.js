openFilters: function () {
        
  //evitar clique duplo
  $('.yv-reviews-filter-btn').unbind('click');
  
  //Filtro de reviews
  jQuery('.yv-reviews-filter-btn').click(function () {    
      jQuery('.yv-reviews-all-filters').toggle('slow')
  });

  //Botão Ordernar por
  jQuery('.yv-btn.yv-order-review-button.yv-dropdown-toggle').click(function () {
      jQuery('.yv-order-review-dropdown-menu.yv-dropdown-menu').toggle();
  });
  
},