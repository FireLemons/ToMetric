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
  
  return `\\[ 1\\,\\mathrm{${imperial}} = ${coefficientMagnitude[1]}\\,\\mathrm{${metric}}` + (coefficientMagnitude[2] === '0' ? '' : `\\times 10^{${coefficientMagnitude[2]}}`) + '\\]'
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

const conversionTypes = {
  inchesmillimeters: new conversionProblemType(25.4, 'in', 'mm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  inchescentimeters: new conversionProblemType(2.54, 'in', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  inchesmeters: new conversionProblemType(0.0254, 'in', 'm', (range) => {
    return 10 + 10 * Math.ceil(Math.random() * range)
  }),
  incheskilometers: new conversionProblemType(0.0000254, 'in', 'km', (range) => {
    range *= 2
    return 10000 + 5000 * Math.ceil(Math.random() * range)
  }),
  feetmillimeters: new conversionProblemType(304.8, 'ft', 'mm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  feetcentimeters: new conversionProblemType(30.48, 'ft', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  feetmeters: new conversionProblemType(0.3048, 'ft', 'm', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  feetkilometers: new conversionProblemType(0.0003048, 'ft', 'km', (range) => {
    return 1000 + 500 * Math.ceil(Math.random() * range)
  }),
  yardsmillimeters: new conversionProblemType(914.4, 'yd', 'mm', (range) => {
    return 1 + .1 * Math.ceil(Math.random() * range)
  }),
  yardscentimeters: new conversionProblemType(91.44, 'yd', 'cm', (range) => {
    return 1 + .1 * Math.ceil(Math.random() * range)
  }),
  yardsmeters: new conversionProblemType(.9144, 'yd', 'm', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  yardskilometers: new conversionProblemType(.0009144, 'yd', 'km', (range) => {
    return 100 + 50 * Math.ceil(Math.random() * range)
  }),
  milesmillimeters: new conversionProblemType(1609344, 'mi', 'mm', (range) => {
    return 1 + .1 * Math.ceil(Math.random() * range)
  }),
  milescentimeters: new conversionProblemType(160934.4, 'mi', 'cm', (range) => {
    return 1 + .1 * Math.ceil(Math.random() * range)
  }),
  milesmeters: new conversionProblemType(1609.344, 'mi', 'm', (range) => {
    return 1 + .1 * Math.ceil(Math.random() * range)
  }),
  mileskilometers: new conversionProblemType(1.609, 'mi', 'cm', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  })
}

// configure
const config = JSON.parse(localStorage.getItem('ToMetric.Options'))

// removes all disabled problems for a measurementType
//  @param  {object} measurementType The object representing the measurement type(e.g. distance) from the config
function pruneDisabledProblems(measurementType){
  let customaryUnits = measurementType.customary
  let metricUnits = measurementType.metric

  for(let customaryUnit in customaryUnits){
    let customaryUnitEnabled = customaryUnits[customaryUnit].on
  
    for(let metricUnit in metricUnits){
      let metricUnitEnabled = metricUnits[metricUnit].on
    
      if(!(customaryUnitEnabled && metricUnitEnabled)){
        delete conversionTypes[customaryUnit + metricUnit]
      }
    }
  }
}

if(config){
  let measurements = Object.values(config.measurements)
  
  measurements.forEach((measurementType) => {
    pruneDisabledProblems(measurementType)
  })
} else {
  //prune the conversions where the magnitudes of the units are too far apart
}

const problems = Object.values(conversionTypes)

let measurementType = config.measurements.distance

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
    difficulty: 10,
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
    getProblem: function(){
      return problems[Math.floor(Math.random() * problems.length)]
    },
    loadNewProblem: function(){
      this.answerClass = 'grey darken-3'
      this.userAnswer = ''
      
      let problem = this.getProblem()
      
      this.imperialAbbrev = problem.imperial
      this.metricAbbrev = problem.metric
      
      let conversionPair = problem.generateConversionPair(this.difficulty)
      
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
