

document.addEventListener('DOMContentLoaded', function() {
  checkInvalidCartChild(); 
  $('body').attr('data-online', isWithinBusinessHours(theme.custom.hoursOn, theme.custom.hoursOff));
  // force offline online
  const params = new URLSearchParams(window.location.search);
  if (params.get('online') === 'true') {
    $('body').attr('data-online', 'true');
  }
  if (params.get('online') === 'false') {
    $('body').attr('data-online', 'false');
  }
  //console.log(navigator.userAgent);
  $('body').on('click', '.discountLink', function() {
    var confirmMsg = $(this).attr('data-msg');
    var discountLink = $(this).attr('href');
    Swal.fire({
        position: 'top',
        title: confirmMsg,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Proceed",
        cancelButtonText: "Cancel",
        type: 'warning',
        reverseButtons: true,
        customClass: {
            cancelButton: 'btn btn-sm btn-remove',
            denyButton: 'btn btn-sm btn-remove',
            confirmButton: 'btn btn-sm btn-primary'
        }
    }).then(function(event) {
        if (event.isConfirmed == true) {
            window.location.href = discountLink;
        }
    });  
    return false;
  });


  
  $('body').on('click', '.inline-pop', function() {
    $.magnificPopup.open({
        items: {
          src: $(this).attr('href'),
          type: 'inline',
          callbacks: {
          }
        }
    });
    return false;
  });

  $('body').on('click', '.ajax-pop', function() {
    $.magnificPopup.open({
        items: {
          src: $(this).attr('href'),
          type: 'ajax',
          callbacks: {
          }
        }
    });
    return false;
  });

  $('body').on('click', '.tipTrigger', function(e) {
    
    // var thisParent = $(this).parent();
    
    // setTimeout(function() {
    //   var parentClass = thisParent.attr('class');
    // console.log(parentClass);
    //   if (thisParent.hasClass('kuCollapse')) {
    //      thisParent.removeClass('kuCollapse');
    //     thisParent.addClass('kuExpand');
    //   } else {
    //     thisParent.removeClass('kuExpand');
    //     thisParent.addClass('kuCollapse');
    //   }
    // }, 600);
    e.preventDefault();
    e.stopPropagation();          // stop bubbling
    e.stopImmediatePropagation();
    $.magnificPopup.open({
        items: {
          src: $(this).attr('href'),
          type: 'ajax',
          callbacks: {
          }
        }
    });
    event.stopPropagation();
  }); 
  $('body').on('click', '.kuFilterHead', function(click) {
    $(this).closest('.kuFilterBox').toggleClass('collapse');
  });   


  if( window.location.href.indexOf("?q=hto")>-1 ){
    tryRunTakeAQuiz()
  }
  if (window.location.pathname.indexOf('/pages/home-try-on-glasses') > -1) {
    tryRunTakeAQuiz()
  }

});  

$(document).click(function() {
  $('.dropdown').removeClass('exp');   
});

$('body').on('click', '.dropdown-toggle', function(event) {
  if ($(this).closest('.dropdown').hasClass('exp')) {
    $(this).closest('.dropdown').removeClass('exp');      
  } else {
    $('.dropdown.exp').removeClass('exp');  
    $(this).closest('.dropdown').addClass('exp'); 
  }
  event.stopPropagation();
});
$('body').on('click', '.expCollapse', function(event) {
  $(this).closest('.seoDescription ').toggleClass('exp');      
});

$('body').on('click', '.nav_quize_text', function(event) {
  return false;
});
var body = $("html, body");
$('body').on('click', '.scroll-top a', function() {
  body.stop().animate({scrollTop:0}, 600, 'swing', function() { 
  });
  return false; 
});


$('body').on('click', '.htoLandingPage2 .page_section_faq h5', function() {
    $(this).next('p').toggle();
    $(this).toggleClass('exp');
});
$('body').on('click', '#banner-text-container h1.category', function() {
    $('#banner-text-container').toggleClass('exp');
});


function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}


function slugify(str)
{
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}



function checkInvalidCartChild() {
  $.ajaxSetup({
    async: false,
  });
  var cartVar;
  $.ajax({
    type: 'GET',
    url: 'https://opticsoutfitter.com/cart.json',
    dataType: 'json',
    success: function(data) {
      //console.log(data);
      cartVar = data.items;
    }
  });

  var invalidKey = [];
  $.each(cartVar, function(index, value) {
    if (value.properties['_Timestamp'] != undefined && value.properties['_Product ID'] != undefined) {
      var currentTS = value.properties['_Timestamp'];
      var currentPID = value.properties['_Product ID'];
      var parentFound = false;

      $.each(cartVar, function(index, value) {
        if (value.id == currentPID || value.product_id == currentPID) {
          if (currentTS == value.properties['_Timestamp']) {
            parentFound = true
          }
        }  
      });
      if (parentFound == false) {
        invalidKey.push(value.key);
      }
    }
  });

  invalidKey = $.unique(invalidKey);
  //console.log('invalidKey');
  //console.log(invalidKey);


  if (invalidKey.length > 0) {
    Swal.fire({
      title: 'Cart Error',
      text: 'Invalid items will be removed from cart',
      showCancelButton: false,
      confirmButtonText: "Ok",
      cancelButtonText: "Go Back",
      type: 'warning',
      reverseButtons: true,
      allowOutsideClick: false,
      customClass: {
        cancelButton: 'btn btn-sm btn-remove',
        denyButton: 'btn btn-sm btn-remove',
        confirmButton: 'btn btn-sm btn-primary'
      }
    }).then(function(del) {
      if (del.isConfirmed) {
        console.log(invalidKey);
        var xdata = {
          updates: {}
        };
        $.each(invalidKey, function(index, value) {
          var cartKeyToRemove = value;
          xdata.updates[cartKeyToRemove] = 0;
        });
        console.log(xdata);
        $.ajax({
          type: 'POST',
          url: '/cart/update.js',
          data: xdata,
          dataType: 'json',
          success: function() {

          }
        });
        location.reload();


      }
    })
  }

  $.ajaxSetup({
    async: true,
  });
}  



function isWithinBusinessHours(startHour, endHour) {
    let now = new Date();

    // Define business hours as strings in AM/PM format
    const START_TIME = startHour;
    const END_TIME = endHour;

    // Function to convert "7 AM" / "7 PM" to 24-hour format
    function convertTo24Hour(timeStr) {
        let [time, period] = timeStr.toUpperCase().split(" ");
        let hour = parseInt(time, 10);

        if (period === "PM" && hour !== 12) {
            hour += 12; // Convert PM hours (except 12 PM)
        } else if (period === "AM" && hour === 12) {
            hour = 0; // Convert 12 AM to 0
        }

        return hour;
    }

    const START_HOUR = convertTo24Hour(START_TIME);
    const END_HOUR = convertTo24Hour(END_TIME);

    //console.log(START_HOUR, END_HOUR);

    // Get the current hour in MST (UTC-7)
    let hourFormatter = new Intl.DateTimeFormat("en-US", { 
        timeZone: "America/New_York", 
        hour12: false, 
        hour: "numeric" 
    });

    let hour = parseInt(hourFormatter.format(now), 10); // Convert to integer

    // Check if the current time is within business hours
    return hour >= START_HOUR && hour < END_HOUR;
}


  /* ---------- CONFIG ---------- */
  const DAY = theme.custom.smsBuffer;
  const ENABLED = theme.custom.smsExit;
  const ONLINE_KL_FORM = theme.custom.onlineKLSMS;
  const OFFLINE_KL_FORM = theme.custom.offlineKLSMS;
  const TIMEOUT = theme.custom.exitDelay;

  const ONLINE_SMS = theme.custom.onlineSMS;
  const OFFLINE_SMS = theme.custom.offlineSMS;

  const ONLINE_SMS_CHAT = theme.custom.onlineSMSChat;
  const OFFLINE_SMS_CHAT = theme.custom.offlineSMSChat;

  const ONLINE_KL_FORM_CHAT = theme.custom.onlineKLSMSChat;
  const OFFLINE_KL_FORM_CHAT = theme.custom.offlineKLSMSChat;

  const STORAGE_KEY_LAST_FIRED = 'mobileExitIntentLastFired';   
  const STORAGE_KEY_PAGE_VIEWS = 'sessionPageViews';            
  const DAYS = DAY * 24 * 60 * 60 * 1000;
  const MIN_PAGE_VIEWS = theme.custom.smsPV;    


  const TOP_EDGE_PX       = 0;    // desktop: Y ≤ this is “above the viewport”
  const SIDE_EDGE_PX      = 0;    // desktop: X ≤ 0 or X ≥ vw ⇒ side hover
  const MOBILE_TOP_PX     = 120;  // mobile: “near top” after fast upward scroll
  const MOBILE_DELTA_PX   = 60;   // scroll‑up distance that counts as “fast”
  const MOBILE_DELTA_MS   = 200;  // … within this many ms                         

  /*  PAGE-VIEW COUNTER  */
  // Count every full page
  const viewsSoFar = parseInt(sessionStorage.getItem(STORAGE_KEY_PAGE_VIEWS), 10) || 0;
  sessionStorage.setItem(STORAGE_KEY_PAGE_VIEWS, viewsSoFar + 1);

  /* EXIT-INTENT LOGIC  */
  const now        = Date.now();
  const lastFired  = localStorage.getItem(STORAGE_KEY_LAST_FIRED);
  let   firedThisSession = false;
  let lastScrollTop = 0;

  function shouldFireIntent() {
    const pageViewsOK   = (parseInt(sessionStorage.getItem(STORAGE_KEY_PAGE_VIEWS), 10) >= MIN_PAGE_VIEWS);
    const notThrottled  = (!lastFired || now - parseInt(lastFired, 10) > DAYS);
    return !firedThisSession && pageViewsOK && notThrottled;
  }

  function fireExitIntent(src) {
    //alert('fireExitIntent'+src+'||'+shouldFireIntent());
    if (ENABLED && shouldFireIntent()) {
      firedThisSession = true;
      localStorage.setItem(STORAGE_KEY_LAST_FIRED, now.toString());
      var onlineHours = document.body.getAttribute('data-online');

      if (onlineHours === 'true') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', ONLINE_KL_FORM]);
      } 
      if (onlineHours === 'false') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', OFFLINE_KL_FORM]);
      }
    }  
  }
  window.addEventListener('load', () => {
    //console.log('viewsSoFar:'+viewsSoFar, shouldFireIntent());
    setTimeout(() => {
      /* scroll-up within 100 px of top */
      let lastY     = window.scrollY;
      let lastTime  = performance.now();
      window.addEventListener('scroll', () => {


        const now  = performance.now();
        const y    = window.scrollY;
        const dy   = lastY - y;          // positive = scrolling up
        const dt   = now - lastTime;

        if (
          dy > MOBILE_DELTA_PX &&        // scrolled up fast enough
          dt < MOBILE_DELTA_MS  &&
          y  < MOBILE_TOP_PX             // landed near the top
        ) {
          //console.log('fast scroll-up', shouldFireIntent());
          fireExitIntent('scroll-up');
        }

        lastY    = y;
        lastTime = now;
      });
      /* tab close */
      window.addEventListener('pagehide', () => fireExitIntent('pagehide'));
      /*  tab-blur fallback */
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') fireExitIntent('visibilitychange');
      });

      document.addEventListener('mouseout', (e) => {
        if (
          !e.toElement && !e.relatedTarget &&
          e.clientY <= 0
        ) {
          //console.log('mouse-out-top', shouldFireIntent());
          fireExitIntent('mouse-out-top');
          //alert('exit mouseout');
        }
      });
      if (ENABLED && shouldFireIntent()) {
        window.addEventListener('beforeunload', (e) => {
          fireExitIntent('beforeunload');
          //e.preventDefault();  // Required in Firefox
          //e.returnValue = '';  // Required in Chrome
          fireExitIntent('beforeunload');
        });
      }

    }, TIMEOUT); 
  });
  function handleSMSClick() {
    const isMobileBody = document.body.classList.contains('mobileBody');
    const onlineHours = document.body.getAttribute('data-online');
    if (isMobileBody) {
      if (onlineHours === 'true') {
        window.location.href = ONLINE_SMS;
      }
      if (onlineHours === 'false') {
        window.location.href = OFFLINE_SMS;
      }  
    } else {
      // desktop
      if (onlineHours === 'true') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', ONLINE_KL_FORM]);
      } 
      if (onlineHours === 'false') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', OFFLINE_KL_FORM]);
      }
    }
    return false;
  }
  function handleSMSClickChat() {
    const isMobileBody = document.body.classList.contains('mobileBody');
    const onlineHours = document.body.getAttribute('data-online');

    if (isMobileBody) {
      if (onlineHours === 'true') {
        window.location.href = ONLINE_SMS_CHAT;
      }
      if (onlineHours === 'false') {
        window.location.href = OFFLINE_SMS_CHAT;
      }  
    } else {
      // desktop
      if (onlineHours === 'true') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', ONLINE_KL_FORM_CHAT]);
      } 
      if (onlineHours === 'false') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', OFFLINE_KL_FORM_CHAT]);
      }
    }

     gtag('event', 'floating_chat_sms', {
      function_name: 'floating_chat_sms',
      page_location: window.location.href,
      online_hours: onlineHours, 
      mobile: isMobileBody 
    });

    return false;
  }

$(document).ready(function() {
  // Clear old discount session

  getDiscountCode();
  // fetch('/checkout?discount=').then(() => {
  //   getDiscountCode()
  // });

    if (theme.custom.template == 'product') {
    pdpCheckDiscountCode(code)
  }
  


});
 


function getDiscountCode() {

  
  $.getJSON('/cart.js', function(cart) {
    
    if (cart.discount_codes.length > 0) {

      const applicableDiscount = (cart.discount_codes || []).find(d => d.applicable === true);
      if (applicableDiscount) { 
        const code = applicableDiscount.code;
        console.log('checkout discount detected', code); 
        checkDiscountCode(code) 
      }



    } else {
      console.log("No checkout discount detected");  
      var cookieDiscountCode = getDiscountCodeCookie();
      if (cookieDiscountCode != null) {
        console.log("No checkout discount detected, apply "+cookieDiscountCode);  
        // Force Shopify to apply new discount and override old session
        fetch(`/checkout?discount=${cookieDiscountCode}`, { method: 'GET' })
          .then(() => {
            // Re-check discount after Shopify applies it
            checkDiscountCode(cookieDiscountCode) 
        });
      } else {
        checkDiscountCode(cookieDiscountCode) 
      }
    }
    
  });
  
}


function checkDiscountCode(code) {
  theme.custom.appliedDiscountCode = code;
  //console.log("Discount applied:", code);
  if (theme.custom.customDiscountToggle == false && theme.custom.appliedDiscountCode == theme.custom.customDiscountCode) {
    //alert('remove discount code');
    clearDiscountCode()
  }

  // banner detection
  if (theme.custom.appliedDiscountCode == $('[data-banner-discount-code]').attr('data-banner-discount-code')) {
    $('[data-banner-discount-code] .discountLink').addClass('void');
    $('[data-banner-discount-code] .discountLink .applied').html(theme.custom.customDiscountCodeApplied);
    if (theme.custom.customDiscountEnded) {
      clearDiscountCode()
    }  
  } 
  

  globalCheckDiscountCode(code);
  if (theme.custom.template == 'product') {
    pdpCheckDiscountCode(code)
  }
}
function clearDiscountCode() {
  
   fetch('/checkout?discount=CLEAR', { method: 'GET' })
        .then(() => {
          //alert('success');
        })
        .catch(() => {
          // CORS error lands here
          //alert('error');
        })
        .finally(() => {
          // ALWAYS runs (success or error)
          location.reload();
        });


}
function getDiscountCodeCookie() {
  const match = document.cookie.match(/(^|;\s*)discount_code=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
}
function pdpCheckDiscountCode(code) {

  const allProductTag = $('[data-pdp-tag]').attr('data-pdp-tag').split(', ');
  
  // automatic discount
  if (theme.custom.autoDiscount && allProductTag.includes(theme.custom.autoDiscountTag)) {
    $('[data-pdp-discount-badge]').html('<strong>'+theme.custom.autoDiscountMsgPDP+'</strong>');
  } 

  // custom discount code
  const prodTypeArr = $('[data-pdp-type]').attr('data-pdp-type').split(', ');
  const setB = new Set(theme.custom.customDiscountProdTypes);
  const hasSimilarities = prodTypeArr.some(type => setB.has(type));

  if (code == theme.custom.customDiscountCode && hasSimilarities) {
     $('[data-pdp-discount-badge]').html('<strong>'+theme.custom.customDiscountAppliedMsgPDP+'</strong>');
  }    
}
function globalCheckDiscountCode(code) {
  var cardInfo = $('[data-card-info]');
  var cardInfoCount = cardInfo.length;
  //console.log('cardInfoCount', cardInfoCount);
  if (cardInfoCount > 0) {
    cardInfo.each(function() {
      var pTagArr = $(this).attr('data-ptag').split(', ');
      if (theme.custom.autoDiscount && pTagArr.includes(theme.custom.autoDiscountTag)) {
        $(this).find('.discountBadge').html('<strong>'+theme.custom.autoDiscountMsgPDP+'</strong>');
      } 


      var prodTypeArr = $(this).attr('data-type').split(', ');
      const setB = new Set(theme.custom.customDiscountProdTypes);
      const hasSimilarities = prodTypeArr.some(type => setB.has(type));

      //console.log('discount', theme.custom.appliedDiscountCode, hasSimilarities);
      if (theme.custom.appliedDiscountCode != '') {
        if (theme.custom.appliedDiscountCode == theme.custom.customDiscountCode) { 
          if (hasSimilarities) {
            //console.log('discount discount discount discount');
            $(this).find('.discountBadge').html('<strong>'+theme.custom.customDiscountAppliedMsgPDP+'</strong>');
          }
        }  
      }



   });   
  }
}


function handleSMSClick() {
    const isMobileBody = document.body.classList.contains('mobileBody');
    const onlineHours = document.body.getAttribute('data-online');
    if (isMobileBody) {
      if (onlineHours === 'true') {
        window.location.href = ONLINE_SMS;
      }
      if (onlineHours === 'false') {
        window.location.href = OFFLINE_SMS;
      }  
    } else {
      // desktop
      if (onlineHours === 'true') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', ONLINE_KL_FORM]);
      } 
      if (onlineHours === 'false') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', OFFLINE_KL_FORM]);
      }
    }
    return false;
  }
  function handleSMSClickChat() {
    const isMobileBody = document.body.classList.contains('mobileBody');
    const onlineHours = document.body.getAttribute('data-online');

    if (isMobileBody) {
      if (onlineHours === 'true') {
        window.location.href = ONLINE_SMS_CHAT;
      }
      if (onlineHours === 'false') {
        window.location.href = OFFLINE_SMS_CHAT;
      }  
    } else {
      // desktop
      if (onlineHours === 'true') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', ONLINE_KL_FORM_CHAT]);
      } 
      if (onlineHours === 'false') {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['openForm', OFFLINE_KL_FORM_CHAT]);
      }
    }

     gtag('event', 'floating_chat_sms', {
      function_name: 'floating_chat_sms',
      page_location: window.location.href,
      online_hours: onlineHours, 
      mobile: isMobileBody 
    });

    return false;
  }
