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
