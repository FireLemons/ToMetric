// Generates a TeX representation of a formula
//   @param  {number} ratio The ratio for unit conversion
//   @param  {string} imperial The abbreviation for the imperial unit of the conversion
//   @param  {string} metric The abbreviation for the metric unit of the conversion
//   @return {string} the TeX representation of the formula to convert from imperial to metric
function generateFormula(ratio, imperial, metric){
  let ratioAsSciNotation = ratio.toExponential()
  let coefficientMagnitude = ratioAsSciNotation.match(/([0-9]\.[0-9]+)e([+-][0-9]+)/)
  
  if(coefficientMagnitude[2].charAt(0) === '+'){
    coefficientMagnitude[2] = coefficientMagnitude[2].substr(1)
  }
  
  return `\\[ 1\\,\\mathrm{${imperial}} = ${coefficientMagnitude[1]}\\,\\mathrm{${metric}}` + (coefficientMagnitude[2] === '0' ? '' : `\\times 10^{${coefficientMagnitude[2]}}` + '\\]')
}

let conversionProblemType = class{
  // @param {number} increment 
  // @param {number} ratio The ratio for unit conversion
  // @param {string} imperial The abbreviation for the imperial unit of the conversion
  // @param {string} metric The abbreviation for the metric unit of the conversion
  // @param {function} generateImperial(range) A function to generate imperial values for conversions
  //    @param {number} range A number to limit imperial value generated
  //    @return {number} A value in imperial units for conversion
  // @param {string=} formula(optional) The formula for conversion represented in TeX
  constructor(ratio, imperial, metric, generateImperial, formula = ''){
    if(isNaN(ratio)){
      throw new TypeError('param ratio must be a number')
    }
    
    if(typeof imperial !== 'string'){
      throw new TypeError('param imperial must be a string')
    }
    
    if(typeof metric !== 'string'){
      throw new TypeError('param metric must be a string')
    }
    
    if(typeof formula !== 'string'){
      throw new TypeError('param formula must be a string')
    }
    
    if(typeof generateImperial !== 'function'){
      throw new TypeError('param generateImperial must be a function')
    }
    
    this.ratio = ratio
    this.imperial = imperial
    this.metric = metric
    this.formula = formula ? formula : generateFormula(ratio, imperial, metric);
    this.generateImperial = generateImperial
  }
  
  // Generates an imperial value and an equivalent metric value
  //  @param  {number} range Limits the imperial value generated
  //  @return {object} An object containing an imperial and metric measurement
  generateConversionPair(range){
    let imperialMeasurement = this.generateImperial(range)
    return {
      imperial: imperialMeasurement,
      metric: imperialMeasurement * this.ratio
    }
  }
}

// configuration
const config = JSON.parse(localStorage.getItem('ToMetric.Options'))

const conversionTypes = {
  inchesmillimeters: null,
  inchescentimeters: new conversionProblemType(2.54, 'in', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  inchesmeters: new conversionProblemType(0.0254, 'in', 'm', (range) => {
    return 10 + 10 * Math.ceil(Math.random() * range)
  }),
  incheskilometers: null,
  feetmillimeters: null,
  feetcentimeters: null,
  feetmeters: null,
  feetkilometers: null,
  yardsmillimeters: null,
  yardscentimeters: null,
  yardsmeters: null,
  yardskilometers: null,
  milesmillimeters: null,
  milescentimeters: null,
  milesmeters: null,
  mileskilometers: null
}

// Init mathjax tools
// Renders TeX code in the formula div
function renderTeX(TeX){
  MathJax.Hub.Queue(
    function(){document.getElementById('formula').innerHTML = TeX},
    ["Typeset", MathJax.Hub, 'formula']
  );
}

let toMetric = new Vue({
  el: '#app',
  data: {
    score: 0,
    errorPercent: undefined,
    errorAmount: undefined,
    exactConversionDisplay: undefined,
    
    given: 0,
    imperialAbbrev: '',
    answerClass: 'grey darken-3',
    userAnswer: '',
    exactConversion: 0,
    metricAbbrev: '',
    
    formula: '',
    
    tolerance: 1 / config.general.precision
  },
  methods: {
    checkAnswer: function () {
      let exactConversion = this.exactConversion

      if (Math.abs(exactConversion - this.userAnswer) / exactConversion <= this.tolerance) {
        this.onCorrect()
        this.loadNewProblem()
      } else {
        this.answerClass = 'grey darken-3 wrong'
      }
    },
    loadNewProblem: function(){
      this.answerClass = 'grey darken-3'
      this.userAnswer = ''
      
      let problem = conversionTypes['inchesmeters']
      
      this.imperialAbbrev = problem.imperial
      this.metricAbbrev = problem.metric
      
      let conversionPair = problem.generateConversionPair(10)
      
      this.given = conversionPair['imperial']
      this.exactConversion = conversionPair['metric']
      
      this.formula = problem.formula
      renderTeX(problem.formula)
    },
    onCorrect: function(){
      this.score += 1
    }
  },
  mounted: function () {
    this.loadNewProblem()
  }
})
