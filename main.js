var Config = {
  age: {
    min: 10,
    max: 66,
    default: 67
  },
  rate: {
    default: 8
  },
  currency: {
    dot: 2,
  }
}
var AppData = {};


function _show(type) {
  $('[data-w-id="c4edf300-4311-c06f-9d48-f06a6ace4bc4"]').hide();
  $(`#${type}-page`).css('opacity',1).css('display', 'flex');
  $(`#${type}-page > *:first-child`).css('opacity',1).css('display', 'flex');
}

var BaseScreen = {
  init: function () {
    AppData = {
      age: 0,
      data: {},
    }
    this.checkBrowser();
    this.initMenu();
    // this.watch();
  },

  checkBrowser: function() {
    var data = [/FBAV/i, /Instagram/i, /Twitter/i]
    var found = false;
    data.forEach(function(regex) {
      found = navigator.userAgent.match(regex);
    })
    if (found) {
      this.show();
    }
  },

  show: function() {
    $('#browser-check').css('display', 'flex');
  },

  reset: function () {
    this.init();
    window.location.reload();
  },

  submit: function(type) {
    if(this.calculate(type)){
      resetVal();
      document.getElementById(`${type}Submit`).click();
    }
  },

  calculate: function (type) {
    var val = $(`[data-key="${type}"]`).val();
    if (!val) {
      return;
    }
    val = val.replace(',', '');
    var data = {
      value: parseFloat(val),
      timing: $(`[data-key="${type}-timing"]`).val(),
    }
    if (isNaN(data.value) || data.timing === '') {
      if (isNaN(data.value) && AppData.data[type]) {
        delete AppData.data[type].value;
      }
      if (data.timing === '' && AppData.data[type]) {
        delete AppData.data[type].timing;
      }
      return;
    }
    AppData.data[type] = data;
    this.update();
    $('.field-label.green').html('$' + Utils.formatMoney(AppData.total, Config.currency.dot, '.', ','));
    return true;
  },

  update: function() {
    AppData.total = 0;
    _.forOwn(AppData.data, function(item, key) {
      item.amount = calcFV(0, item.value, Config.rate.default / 100,
        getPeriodsPerYear(item.timing), getPeriodsPerYear('year'), Config.age.default - AppData.age);
      AppData.total += item.amount.FV;
    });
    this.render();
  },

  render: function() {
    $('.wrapper.result').css('display', 'none');
    _.forOwn(AppData.data, function(item, key) {
      $(`#${key}-result`).css('display', 'flex');
      $(`#${key}-result .year`).html(Config.age.default - AppData.age);
      $(`#${key}-result .money`).html('$' + Utils.formatMoney(item.amount.FV, Config.currency.dot, '.', ','));
    })
    $('#final .year').html(Config.age.default - AppData.age);
    $('#final .money').html('$' + Utils.formatMoney(AppData.total, Config.currency.dot, '.', ','));
  },

  // watch: function() {
  //   var _self = this;
  //   $('.timing-select').on('change', function (e, v) {
  //     var key = $(this).attr('data-key');
  //     if (!key || key === '') {
  //       return;
  //     }
  //     key = key.replace('-timing', '');
  //     _self.calculate(key);
  //   })
  // },

  initMenu: function() {
    $('[lity-click]').on('click', function() {
      lity($(this).attr('lity-click'));
    });
  }
}

var AgeScreen = {
  init: function() {
    this.initElements();
    this.setAges();
  },

  setAges: function() {
    this.mainAge.html('<option value=-1>--</option>');
    for (var i=Config.age.min; i <= Config.age.max; i++) {
      this.mainAge.append(`<option value=${i}>${i}</option>`);
    }
  },

  submitAge: function(e) {
    var ageVal = this.mainAge.val();
    if (ageVal < Config.age.min || ageVal > Config.age.max) {
      return;
    }
    AppData.age = ageVal;
    return document.getElementById('submitAge').click();
  },

  initElements: function() {
    this.mainAge = $('#field-2');
  }
}

var Utils = {
  formatMoney: function(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  }
  
}

$(document).ready(function() {
  AgeScreen.init();
  BaseScreen.init();
})
