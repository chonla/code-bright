Object.assign(String.prototype, {
  highlight(lang, options) {
    var text = this;
    var line_count = text.split("\n").length
    options["line_count"] = line_count
    var h = highlight(lang, text, options)
    h = putToPlaceholder(h, options)
    return h
  }
})

function putToPlaceholder(code, options) {
  var theme = options["theme"]
  var line_number_flag = options["line_number"]
  var codeHolder = createStyledElement("pre", themes[theme]["code"] + ";margin:0px", code)
  var blockHolder = createGrid(codeHolder, themes[theme])
  if (line_number_flag) {
    var lineHolder = createStyledLines(themes[theme], options["line_count"])
    prependGrid(blockHolder, lineHolder)
  }
  return blockHolder.outerHTML
}

function createGrid(content, theme) {
  var td = createStyledElement("td", "", content.outerHTML)
  var tr = createStyledElement("tr", "", td.outerHTML)
  var tbody = createStyledElement("tbody", "", tr.outerHTML)
  var table = createStyledElement("table", theme["frame"], tbody.outerHTML)
  return table
}

function prependGrid(table, content) {
  var td = createStyledElement("td", "", content.outerHTML)
  var childTr = table.children[0].children[0]
  childTr.insertBefore(td, childTr.firstChild)
}

function createStyledLines(theme, count) {
  var o = []
  var font = theme["font"]
  for (var i = 1; i <= count; i++) {
    var s = (i & 1)?theme["line_odd"]:theme["line_even"]
    o.push("<div style='" + font + ";" + s + "'>" + i + "</div>")
  }
  var elms = o.join("\n")
  var h = createStyledElement("div", theme["lines"], elms)
  return h
}

function createStyledElement(tag, style, content) {
  var elm = document.createElement(tag)
  elm.innerHTML = content
  elm.setAttribute("style", style)
  return elm  
}

function highlight(lang, text, options) {
  var buff = text
  l = languages[lang]
  for (var o in l["syntax"]) {
    for (var i = 0, kl = l["syntax"][o].length; i < kl; i++) {
      k = l["syntax"][o][i]
      s = themes[options["theme"]]["highlight"][l["styles"][o]]
      switch (typeof (k)) {
        case "object":
          var opt = {}
          var by = ""
          Object.assign(opt, { "before": 0, "ref": 0, "after": 0 }, k[1])
          by = (opt.before !== 0) ? ("$" + opt.before) : "";
          by += "<span style='" + s + "'>$" + opt.ref + "</span>"
          by += (opt.after !== 0) ? ("$" + opt.after) : "";

          buff = buff.replace(k[0], by)

          break;
        case "string":
          buff = buff.replace(k, "<span style='" + s + "'>" + k + "</span>")
      }
    }
  }
  return buff
}