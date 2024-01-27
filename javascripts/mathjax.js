window.MathJax = {
  loader: { load: ['[tex]/physics', '[tex]/boldsymbol'] },
  tex: {
    tags: 'all',
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    packages: { '[+]': ['physics', 'boldsymbol'] },
    macros: {
      dag: "\\dagger",
      nrm: ["\\left\\lVert#1\\right\\rVert", 1],
    },
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {
  MathJax.typesetPromise()
})