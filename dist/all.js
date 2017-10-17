var languages = {}
languages["robotframework"] = {
  "styles": {
    "titles": "reserved_words",
    "keyword_calls": "links",
    "keywords": "functions",
    "variables": "variables",
    "comment": "comment"
  },
  "syntax": {
    "titles": [
      [/^(\*\*+\s*test\s*cases?\s*\*\*+)/gimu, {
        "ref": 1
      }],
      [/^(\*\*+\s*keywords?\s*\*\*+)/gimu, {
        "ref": 1
      }],
      [/^(\*\*+\s*settings?\s*\*\*+)/gimu, {
        "ref": 1
      }],
      [/^(\*\*+\s*variables?\s*\*\*+)/gimu, {
        "ref": 1
      }]
    ],
    "keyword_calls": [
      [/^(\s\s+)([a-z0-9_\-]+(?:\s[a-z0-9_\-]+)*)(\s\s+.*)$/gimu, {
        "before": 1,
        "ref": 2,
        "after": 3
      }],
      [/^(\s\s+)([a-z0-9_\-]+(?:\s[a-z0-9_\-]+)*)$/gimu, {
        "before": 1,
        "ref": 2
      }]
    ],
    "keywords": [
      [/^([a-z0-9_\-]+(?:\s[a-z0-9_\-]+)*)$/gimu, {
        "ref": 1
      }]
    ],
    "variables": [
      [/([&\$@]\{[a-z0-9_\-]+(?:\s[a-z0-9_\-]+)*\})/gimu, {
        "ref": 1
      }]
    ],
    "comment": [
      [/(\s\s+)(#.+)$/gimu, {
        "before": 1,
        "ref": 2
      }]
    ]
  }
}

var themes = {}
themes["dark"] = {
  "font": "font:10pt courier",
  "code": "background-color:#111;color:#eee;min-width:400px;padding-left:2px;padding-right:2px",
  "lines": "text-align:center;min-width:40px",
  "line_odd": "background-color:#fff;color:#111",
  "line_even": "background-color:#ddd;color:#111",
  "frame": "border-spacing:0px;border:1px solid #111",
  "highlight": {
    "reserved_words": "font-weight:bold;color:#FFD700;",
    "functions": "font-weight:bold;color:#9CDCFE",
    "links": "font-weight:bold;color:#CE9178;",
    "variables": "color:#DA70D6",
    "comment": "color:#666"
  }
}

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