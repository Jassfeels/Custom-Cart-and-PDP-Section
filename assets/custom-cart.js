$(document).ready(function () {

  window.openCartDrawer = function () {
    $('#custom-cart-drawer').addClass('open');
    loadCartDrawer();
  };

  window.closeCartDrawer = function () {
    $('#custom-cart-drawer').removeClass('open');
  };

  $(document).on('click', '#close-cart', closeCartDrawer);

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function loadCartDrawer() {
    $.getJSON('/cart.js', function (cart) {
      var subtotal = cart.items_subtotal_price;
      $('#cart-subtotal').text(formatMoney(subtotal));

      var itemsHtml = '';
      cart.items.forEach(function (item) {
        itemsHtml += '<div class="cart-item" data-key="' + item.key + '" style="display: flex; gap: 12px; margin-bottom: 16px;">' +
          '<div class="item-image" style="width: 64px; flex-shrink: 0;">' +
            '<img src="' + item.image + '" alt="' + item.title + '" style="width: 100%; border-radius: 6px;">' +
          '</div>' +
          '<div class="item-info" style="flex-grow: 1;">' +
            '<strong>' + item.title + '</strong><br>' +
           '<span>' + formatMoney(item.line_price) + '</span><br>' +
            'Quantity: ' +
         
            '<button class="qty-btn minus" data-key="' + item.key + '" data-qty="' + (item.quantity - 1) + '">−</button>' +
            '<span class="qty">' + item.quantity + '</span>' +
            '<button class="qty-btn plus" data-key="' + item.key + '" data-qty="' + (item.quantity + 1) + '">+</button>' + 
            '<button class="remove-item" data-key="' + item.key + '" style="margin-top: 6px;">Remove</button>' +
          '</div>' +
        '</div>';

      });
      $('#cart-items').html(itemsHtml);

     // --- TIER & PROGRESS BAR LOGIC ---

var discountTier = 0;
var nextTier = 0;
var progressPercent = 0;

if (subtotal >= 30000) {
  discountTier = 15;
  progressPercent = 100;
} else if (subtotal >= 20000) {
  discountTier = 10;
  nextTier = 30000;
  progressPercent = ((subtotal - 20000) / 10000) * 33.33 + 66.66;
} else if (subtotal >= 10000) {
  discountTier = 5;
  nextTier = 20000;
  progressPercent = ((subtotal - 10000) / 10000) * 33.33 + 33.33;
} else {
  nextTier = 10000;
  progressPercent = (subtotal / 10000) * 33.33;
}

progressPercent = Math.min(progressPercent, 100);

// Update the gradient width visually
$('.progress-bar-inner').css('background', 'linear-gradient(to right, #4CAF50 0%, #4CAF50 ' + progressPercent + '%, #eee ' + progressPercent + '%, #eee 100%)');

// Update label text
if (discountTier === 15) {
  $('#progress-label').text("🎉 You've unlocked the final 15% discount!");
} else {
  var remaining = nextTier - subtotal;
  var nextDiscount = (discountTier === 10) ? '15%' : (discountTier === 5 ? '10%' : '5%');
  $('#progress-label').text("Add " + formatMoney(remaining) + " more to unlock " + nextDiscount + " discount");
}


// Unlock message
if (discountTier > 0) {
  $('#discount-tier-msg').html('<strong>' + discountTier + '% Discount Unlocked!</strong>');
} else {
  var remaining = nextTier - subtotal;
  $('#discount-tier-msg').html('Spend ' + formatMoney(remaining) + ' more to unlock a discount!');
}

// Highlight unlocked milestones
$('#tier-label-1, #tier-label-2, #tier-label-3').removeClass('unlocked');
if (subtotal >= 10000) $('#tier-label-1').addClass('unlocked').text('5% Unlocked');
if (subtotal >= 20000) $('#tier-label-2').addClass('unlocked').text('10% Unlocked');
if (subtotal >= 30000) $('#tier-label-3').addClass('unlocked').text('15% Unlocked');

// Save discount tier as attribute
$.post('/cart/update.js', {
  attributes: { 'applied_discount': discountTier + '%' }
});


      $.post('/cart/update.js', {
        attributes: { 'applied_discount': discountTier + '%' }
      });
    });
  }

  // Quantity update
  $(document).on('click', '.qty-btn', function () {
    var key = $(this).data('key');
    var qty = parseInt($(this).data('qty'));

    if (qty < 1) {
      $.post('/cart/change.js', { id: key, quantity: 0 }, function () {
        loadCartDrawer();
      });
    } else {
      $.post('/cart/change.js', { id: key, quantity: qty }, function () {
        loadCartDrawer();
      });
    }
  });

  // Remove item
  $(document).on('click', '.remove-item', function () {
    var key = $(this).data('key');
    $.post('/cart/change.js', { id: key, quantity: 0 }, function () {
      loadCartDrawer();
    });
  });

});
