var ProductModel = Backbone.Model.extend({
  setDatetime: function() {
    var date = new Date(this.get("date"));
    var datetime = formatDatetime(date);

    this.set("datetime", datetime);
  },
  setDateFormatted: function() {
    var date = new Date(this.get("date"));
    var date_formatted = formatDate(date);

    this.set("date_formatted", date_formatted);
  },
  initialize: function() {
    this.setDatetime();
    this.setDateFormatted();
  }
});

var product = new ProductModel(product_json);

var templates = {};
$("[type='text/x-handlebars']").each(function() {
  var $template = $(this);
  templates[$template.attr("id")] = Handlebars.compile($template.html());
});

renderProduct();
renderForm();

$("form").on("submit", function(e) {
  e.preventDefault();
  var inputs = $(this).serializeArray();
  var date = new Date();
  var attrs = {};

  inputs.forEach(function(input) {
    attrs[input.name] = input.value;
  });

  attrs.datetime = formatDatetime(date);
  attrs.date_formatted = formatDate(date);
  attrs.date = date.valueOf();
  product.set(attrs);
  renderProduct();
});

function formatDatetime(date) {
  var datetime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  datetime += "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return datetime;
}

function formatDate(date) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var suffix_overrides = ["st", "nd", "rd"];
  var date_suffix = "th";
  var date_formatted;

  if (date.getDate() <= suffix_overrides.length) {
    date_suffix = suffix_overrides[date.getDate() - 1];
  }
  date_formatted = months[date.getMonth()] + " " + date.getDate() + date_suffix + ", " + date.getFullYear();
  date_formatted += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return date_formatted;
}

function renderProduct() {
  $("article").html(templates.product(product.toJSON()));
}

function renderForm() {
  $("fieldset").html(templates.form(product.toJSON()));
}