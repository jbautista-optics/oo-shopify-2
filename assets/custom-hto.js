var htoTimer;
var htoTimer2;


  var htoPresentCheck = false;  
  $('body').on('click', '.htoOverlayBox:not([status="disabled"]) > .label', function(event) {
    var htoOverlayBox = $(this).closest('.htoOverlayBox');
    var productCard = $(this).closest('.customCard');
    var htoStatus = htoOverlayBox.attr('status');
    if (htoOverlayBox.attr('status') == 'empty') {
      productCard.find('.c-color-swatches__swatch.active').trigger('mouseover');
      //$('.customCard .c-color-swatches__swatch.active').trigger('mouseover');
      if (htoStatus != htoOverlayBox.attr('status')) {
        htoPresentCheck = true;
      }      
    }  
    // console.log('htoStatus:'+htoStatus);
    // console.log('htoPresentCheck:'+htoPresentCheck);
    
    if (htoPresentCheck == false) {
      // Run code here, resizing has "stopped"
      $(this).closest('.productGrid').find('.htoOverlayBox').removeClass('open');

      if (htoOverlayBox.attr('data-has-size') == 'true') {
        // has size option
        if (htoOverlayBox.attr('status') == 'empty') {
          htoOverlayBox.closest('.htoOverlayBox').toggleClass('open'); 
          var sizeAvailCount = htoOverlayBox.find('.htoSize label').not('.unAvailable').length;
          if (sizeAvailCount == 1) {
            htoOverlayBox.find('.htoSize label').not('.unAvailable').find('input').trigger('click');
          }
          
          //htoOverlayBox.find('.htoSize label input').trigger('click');

        } else if (htoOverlayBox.attr('status') == 'full') {
          if (htoOverlayBox.find('.label input').prop('checked') == true) {
            removeHTO(htoOverlayBox, htoOverlayBox.attr('data-variant-id'));
          } else {
            htoOverlayBox.closest('.htoOverlayBox').toggleClass('open'); 
          }
        } else if (htoOverlayBox.attr('status') == 'added') {
          //remove hto
          removeHTO(htoOverlayBox, htoOverlayBox.attr('data-variant-id'));
        }
      } else {
        // no size option 
        if ($(this).closest('.htoOverlayBox').attr('status') == 'removed') {
          $(this).closest('.htoOverlayBox').attr('status', 'empty')
        }
        if (htoOverlayBox.attr('status') == 'empty') {
          htoOverlayBox.closest('.htoOverlayBox').toggleClass('open'); 
          htoOverlayBox.find('.htoSize label input').trigger('click');
        } else if (htoOverlayBox.attr('status') == 'full') {
          //remove hto
          if (htoOverlayBox.find('.label input').prop('checked') == true) {
            removeHTO(htoOverlayBox, htoOverlayBox.attr('data-variant-id'));
          } else {
            htoOverlayBox.closest('.htoOverlayBox').toggleClass('open'); 
          }
        } else if (htoOverlayBox.attr('status') == 'added') {
          //remove hto
          removeHTO(htoOverlayBox, htoOverlayBox.attr('data-variant-id'));
        }   
      }
    }

    clearTimeout(htoTimer2);
    htoTimer2 = setTimeout(function() {
      htoPresentCheck = false;    
    }, 600);
    adjustHTOSize();   
    event.stopPropagation();
  });
  // hto selection

  $('body').on('click', '.htoSizeSelection .htoSize label input', function() {
      var htoOverlayBox = $(this).closest('.htoOverlayBox');
    
      var xUID = createUUID();
      var productCard = $(this).closest('.customCard');
      var productName = $.trim(productCard.find('.boost-pfs-filter-product-item-title').text());
      var pc20bFlag = productCard.attr('data-pc02b-flag');
      if (productName == '') {
        productName = productCard.find('.product-card__name').text();  
      }
      var variantSize = $(this).closest('label').attr('data-size');
      var variantSuffix = $(this).closest('label').attr('data-handle');
      if (variantSuffix === undefined) {
        variantSuffix = '';  
      }
      if (pc20bFlag == 'true') {
        variantSuffix = '';
      }
      var variantId = $(this).val(); 
      var imageURL = '';
      
      if (productCard.find('.boost-pfs-filter-product-item-main-image').length > 0) {
        imageURL = productCard.find('.boost-pfs-filter-product-item-main-image').first().attr('data-src').replace('_large.webp?', '.webp?').replace('_large.jpg?', '.jpg?').replace('_large.png?', '.png?').replace('_360x.webp?', '.webp?').replace('_360x.jpg?', '.jpg?').replace('_360x.png?', '.png?').replace(' 360w', '');
      } else {
        imageURL = productCard.find('.product-card__image').first().attr('data-src').replace('_480x480.webp?', '.webp?').replace('_480x480.jpg?', '.jpg?').replace('_480x480.png?', '.png?').replace('_large.webp?', '.webp?').replace('_large.jpg?', '.jpg?').replace('_large.png?', '.png?');        
      }
      var variantColor = '';
      if (productCard.find('.swatches-row .selected').length > 0) {
        variantColor = productCard.find('.swatches-row .selected').attr('aria-label');
        var variantColorHandle = productCard.find('.swatches-row .selected').attr('data-handle');
        var variantURL = productCard.find('.overlayLink').attr('data-href')+variantSuffix+'?color='+variantColorHandle;
      } else {
        if (productCard.find('.swatches-row .active').length > 0) {
          variantColor = productCard.find('.swatches-row .active').attr('title');
          var variantColorHandle = productCard.find('.swatches-row .active').attr('data-handle');
          var variantURL = productCard.find('.overlayLink').attr('data-href')+variantSuffix+'?color='+variantColorHandle;
        } else {
          var variantURL = productCard.find('.overlayLink').attr('data-href').replace(variantSuffix, '')+variantSuffix;
        }  
        
      }
      if (productCard.find('.swatches-row input:checked').length > 0) {
        variantColor = productCard.find('.swatches-row input:checked').val();
      }
      console.log('xxxx variantColor', variantColor);
      var chkId = productCard.attr('data-id');
      var prodTag = htoOverlayBox.attr('data-tag'); 
      if (prodTag === undefined) {
        prodTag = '';
      }

      if (variantSize == 'default') {
        variantSize = '';
      }
      // console.log('prodTag:'+prodTag);
      // console.log('productName:'+productName);
      // console.log('variantId:'+variantId);
      // console.log('imageURL:'+imageURL);
      // console.log('variantURL:'+variantURL);
      // console.log('variantColor:'+variantColor);
      // console.log('chkId:'+chkId);
      // console.log('prodTag:'+prodTag);

      //var variantJSON = $(this).closest('.product-card').find('.variantJson').html();
      //console.log('variantJSON');
      //console.log(JSON.parse(variantJSON));



      var eyeSize = $(this).closest('label').attr('data-eye-size');
      var prodSKU = $(this).closest('label').attr('data-sku');



      

      var inHTOArr = $.inArray(productName, singleHTOArr);
      if (inHTOArr > -1 ) {
        if (countLocalStorage() > 0) {
          $('.htoOverlayBox').removeClass('open');    
          Swal.fire({
            title: clearHTOTitle,
            text: clearHTOMsg, 
            showCancelButton: true,
            confirmButtonText: "Add to Home Try-On",
            cancelButtonText: "Cancel",
            type: 'warning',
            reverseButtons: true,
            customClass: {
                cancelButton: 'btn btn-sm btn-remove',
                denyButton: 'btn btn-sm btn-remove',
                confirmButton: 'btn btn-sm btn-primary'
            }   
          }).then(function(hto) {
            if (hto.isConfirmed) {
              //console.log('remove other hto'); 
              //htoOverlayBox.attr('status', 'full'); 
              //$('body').addClass('ajaxLoading'); 
              
              setTimeout(function() {
                $('.htoOverlayBox').removeClass('open');   
                htoOverlayBox.addClass('open');
                localStorage.removeItem('products');
                addHTO(productName,variantId,variantSize,imageURL,variantURL,variantColor,chkId,prodTag, eyeSize, prodSKU);
                htoOverlayBox.attr('status', 'added');   
              }, 300);
            }
          });
        } else {
          addHTO(productName,variantId,variantSize,imageURL,variantURL,variantColor,chkId,prodTag, eyeSize, prodSKU);
          htoOverlayBox.attr('status', 'added'); 
        }  
      } else {
        addHTO(productName,variantId,variantSize,imageURL,variantURL,variantColor,chkId,prodTag, eyeSize, prodSKU);
        htoOverlayBox.attr('status', 'added'); 
      }

      
      
  });


  // close hto
  $('body').on('click', '.htoOverlayBox', function() {
    $('.htoOverlayBox').removeClass('open');    
    $(this).closest('.htoOverlayBox').addClass('open');
  });
  $('body').on('click', '.htoOverlayBox .htoPop', function(event) {
      event.stopPropagation(); 
  });

  $('body').on('click', '.closeHTO ', function() {
      $('.htoOverlayBox').removeClass('open');   
      if ($(this).closest('.htoOverlayBox').attr('status') == 'removed') {
        $(this).closest('.htoOverlayBox').attr('status', 'empty')
      }
  });



function checkHTOItem() {
  const rawStorage = localStorage.getItem("products");
  const htoProductStorage = rawStorage ? JSON.parse(rawStorage) : [];
  const product_count = htoProductStorage.length;
  const htoTotal = 4;
  const htoTipHTML = '<div class="htoTip"><div>Add to your Home Try-On</div></div>';
  const htoFull = (product_count >= htoTotal || singleHTOArr.some(item => htoProductStorage.map(p => p.productname).includes(item)));

  const $htoOverlayBoxes = $('.htoOverlayBox');
  const $htoLabels = $('.htoSizeSelection .htoSize label input');

  // Reset state
  $htoOverlayBoxes.find('> .label input').prop('checked', false);
  $htoLabels.prop('checked', false);
  $htoOverlayBoxes.attr('data-variant-id', '');
  $htoOverlayBoxes.not('[status="disabled"]').attr('status', 'empty');
  $htoOverlayBoxes.find('.hto_count').text(product_count);
  $htoOverlayBoxes.find('.hto_max').text(htoTotal);
  $htoOverlayBoxes.find('.htoSelectedSize').text('');

  // Update product cards
  for (const htoItem of htoProductStorage) {
    const htoTitle = htoItem.productname;
    const variantColor = sanitize(htoItem.variantcolor || '');

    let $pCard = $(`.htoOverlayBox[data-title="${htoTitle}"]`).closest('.product-card');
    if ($(`.htoOverlayBox[data-title="${htoTitle}"]`).closest('.customCardd').length == 0) {
      $pCard = $(`.htoOverlayBox[data-title="${htoTitle}"]`).closest('.customCard');
    }
    const $overlayBox = $pCard.find('.htoOverlayBox');
    let selectedColor = $pCard.find('.swatches-row .selected').attr('aria-label') || $pCard.find('.swatches-row input:checked').val() || '';

    if ($pCard.find('.swatches-row input:checked').length > 0) {
      selectedColor = $pCard.find('.swatches-row input:checked').val();
    }

    //console.log('selectedColor', selectedColor, $pCard.find('.swatches-row input:checked').val());
    selectedColor = sanitize(selectedColor);
    //console.log('checkHTOItem', selectedColor, variantColor);
    if (selectedColor === variantColor) {
      const $sizeCheckbox = $pCard.find(`.htoSize label[data-eye-size="${htoItem.eyeSize}"] input`);
      $sizeCheckbox.prop('checked', true);
      $overlayBox.find('.label input').prop('checked', true);
      $overlayBox.attr({ 'status': 'added', 'data-variant-id': htoItem.variantid });

      const $present = $overlayBox.find('.htoPresent');
      if (!htoItem.size) {
        $present.html('Added to your try at home');
      } else {
        $present.html(`Size: <span class="htoSelectedSize">${htoItem.size}</span> <span>is in your try at home </span>`);
      }
    }
  }

  // Tip message
  $('.htoOverlayBox .htoTip').remove();
  if (product_count === 0) {
    $('.htoOverlayBox').first().append(htoTipHTML);
  }

  // Set full status
  if (htoFull) {
    $htoOverlayBoxes.not('[status="disabled"]').attr('status', 'full');
  }

  // Update cart count
  const itemCount = parseInt($('.site-header__cart-indicator').attr('data-cart-count'), 10) || 0;
  const cartCount = itemCount + product_count;
  const $cartIndicator = $('.site-header__cart-indicator');
  if (cartCount > 0) {
    $cartIndicator.removeClass('hide').text(cartCount);
  } else {
    $cartIndicator.addClass('hide').text(cartCount);
  }

  function sanitize(str) {
    return str.replace(/\W+(?!$)/g, '-').replace(/\W$/, '').toLowerCase();
  }
}


function addHTO(productName,variantId,variantSize,imageURL,variantURL,variantColor,chkId, prodTag, eyeSize, sku){
  //alert('addHTO'); 
  //console.log('addHTO'); 
  // validate
  var htoProductStorage = JSON.parse(localStorage.getItem("products")) == null ? [] : JSON.parse(localStorage.getItem("products"));  
  var productName = $.trim(productName); 
  var product = { uid: createUUID(), productname: productName, variantid: variantId, size:variantSize, imageurl:imageURL, url:variantURL, variantcolor:variantColor, chkid: chkId, prodTag: prodTag, eyeSize: eyeSize, sku: sku};
  htoProductStorage.push(product);
  var product_count = htoProductStorage.length;
  localStorage.setItem("products", JSON.stringify(htoProductStorage));
  
  products = JSON.parse(localStorage.getItem("products")) == null ? [] : JSON.parse(localStorage.getItem("products")); 


  $.ajaxSetup({ async: false });
  pushHTOTracking(); 
  $.ajaxSetup({ async: true }); 
  
  $(window).trigger("HTO_Added");

  var htoTitle = productName;
  var inHTOArr = $.inArray(htoTitle, singleHTOArr);

  if(product_count >= 4 ){
    htoFull = true;
  } else {
    htoFull = false;
  }  
  if (inHTOArr > -1) {
    htoFull = true;
  }
  //alert(product_count);
  //alert('htoFull:'+htoFull);
  // console.log(singleHTOArr);
  // console.log(inHTOArr);
  // console.log('product_count:'+product_count);
  checkHTOItem();
  if (htoFull) {
    //alert('hto full');
    $('.htoOverlayBox').not('[status="disabled"]').attr('status', 'full');
    htoTimer = setTimeout(function() {
     // window.location.href = '/cart'
     //alert('aaaaaaaaaaaaddHTO');
     //console.log(products);
     addHTOFromStorageValue(products);
    }, 1200);
    //alert('full hto'); 
  } 
  
    

}
function removeHTO(htoOverlayBox, vid)  {
  console.log('removeHTO');


  removeHTOStorage(vid);
  htoOverlayBox.closest('.htoOverlayBox').addClass('open'); 
  htoOverlayBox.attr('status', 'removed');
  htoOverlayBox.find('.htoSize input').prop('checked', false);
  htoOverlayBox.find('.label input').prop('checked', false);

    htoTimer = setTimeout(function() {
      if (htoOverlayBox.attr('data-has-size') == 'true') {
        var sizeAvailCount = htoOverlayBox.find('.htoSize label').not('.unAvailable').length;
        if (sizeAvailCount > 1) {
          htoOverlayBox.attr('status', 'empty');    
        } else {
          htoOverlayBox.removeClass('open'); 
          htoOverlayBox.attr('status', 'empty');  
        }
      } else {
        //htoOverlayBox.removeClass('open'); 
        //htoOverlayBox.attr('status', 'empty');  
      }     
    }, 300);
  
      
}
function removeHTOStorage(vid) {
  console.log('removeHTOStorage');
  var htoProductStorage = JSON.parse(localStorage.getItem("products")) == null ? [] : JSON.parse(localStorage.getItem("products"));
  var vid = vid;
  var removeIndex = '';




  if (htoProductStorage != null) {
      var matchedProduct = $.grep(htoProductStorage, function(n, i) {
          if (n.variantid == vid) {
              removeIndex = i;
          }
          return n.variantid == vid;
      });
      if (matchedProduct.length != 0) {
        htoProductStorage.splice(removeIndex, 1);
        localStorage.setItem('products', JSON.stringify(htoProductStorage));
        $.ajaxSetup({
            async: false,
        });
        var xdata = { updates: {} };
        xdata.updates[theme.custom.htoProduct] = 0;
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: xdata,
            dataType: 'json',
            success: function() {
               theme.custom.htoProductCart = false;
            }       
        });
        $.ajaxSetup({
          async: true,
        });
        checkHTOItem();
      }
  }
}

function adjustHTOSize() {
  $('.htoOverlayBox.open .htoSize').attr('data-col', 2);
  var xheights = $(".htoOverlayBox.open .htoSize label").map(function ()
    {
        return $(this).height();
    }).get();

  var xmaxHeight = Math.max.apply(null, xheights);
  if (xmaxHeight > 35) {
    $('.htoOverlayBox.open .htoSize').attr('data-col', 1);
  } 
}

function pushHTOTracking() {
  if (typeof window._learnq !== 'undefined') {
    if (customerEmail) {
        console.log("Logged-in Customer Email:", customerEmail);
          _learnq.push(['identify', {
          "$email": customerEmail
      }]);
      var products = JSON.parse(localStorage.getItem("products")) == null ? [] : JSON.parse(localStorage.getItem("products"));
      if (products.length > 0) {
        var htoStatus = 'incomplete';
        var metricName = 'Custom Incomplete HTO Tracking';
        if (products.length == 4) {
          htoStatus = 'complete';
          metricName = 'Custom Completed HTO Tracking';
        } 
        var prodNames = [];
        var colorNames = [];
        var eyeSizes = [];
        var items = [];
        $.each(products, function(index, val) {
            prodNames.push(val.productname);
            colorNames.push(val.variantcolor);
            eyeSizes.push(val.eyeSize);
        });
        _learnq.push(['track', metricName, {
          "htoStatus": htoStatus,
          "prodNames": prodNames, 
          "colorNames": colorNames,  
          "eyeSizes": eyeSizes,  
          "items": products 
        }]);
      }
    } 
  } 
}


function countLocalStorage() {
  var products = JSON.parse(localStorage.getItem("products")) == null ? [] : JSON.parse(localStorage.getItem("products"));
  if( products != null ){
    return products.length; 
  }
  else return 0;
}

function createUUID(){
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
function checkHTOGrid(elem, handle, color) {
  
  const $grid = $(elem);
  const $labels = $grid.find('.htoSize label');
  const $overlay = $grid.find('.htoOverlayBox');


  

  $labels.removeClass('disableHTO'); 
  $overlay.show();

  for (const entry of disableHto) {

    const handleMatch = entry.handle && entry.handle === handle;
    const colorMatch = entry.Color && entry.Color.split(', ').includes(color);
    console.log('checkHTOGrid', elem, handle, color);

    
    if (handleMatch && colorMatch) {
      const widthStr = entry.width || '';
      
      if (!widthStr) {
        $overlay.hide();
        return;
      }

      const widthArr = widthStr.split(', ');
      for (const width of widthArr) {
        $labels.filter(`[data-size="${width}"]`).addClass('disableHTO');
      }

      const available = $labels
        .not('.disableHTO')
        .not('.unAvailable')
        .not('.soldOut').length;

      if (available === 0) {
        $overlay.hide();
      } else {
        $overlay.show();
      }

      return; // Exit early after first match
    }
  }
}
