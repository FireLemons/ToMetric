// Generates a TeX representation of a formula
//   @param  {number} ratio The ratio for unit conversion
//   @param  {string} imperial The abbreviation for the imperial unit of the conversion
//   @param  {string} metric The abbreviation for the metric unit of the conversion
//   @return {string} the TeX representation of the formula to convert from imperial to metric
function generateFormula (ratio, imperial, metric) {
  const ratioAsSciNotation = ratio.toExponential()
  const coefficientMagnitude = ratioAsSciNotation.match(/([0-9]\.[0-9]+)e([+-][0-9]+)/)

  if (coefficientMagnitude[2].charAt(0) === '+') {
    coefficientMagnitude[2] = coefficientMagnitude[2].substr(1)
  }

  return `\\[ 1\\,\\mathrm{${imperial}} = ${coefficientMagnitude[1]}\\,\\mathrm{${metric}}` + (coefficientMagnitude[2] === '0' ? '' : `\\times 10^{${coefficientMagnitude[2]}}`) + '\\]'
}

const ConversionProblemType = class {
  // @param {number} increment
  // @param {number} conversion The ratio pr formula for unit conversion
  // @param {string} imperial The abbreviation for the imperial unit of the conversion
  // @param {string} metric The abbreviation for the metric unit of the conversion
  // @param {function} generateImperial(range) A function to generate imperial values for conversions
  //    @param {number} range A number to limit imperial value generated
  //    @return {number} A value in imperial units for conversion
  // @param {string=} formula(optional) The formula for conversion represented in TeX
  constructor (conversion, imperial, metric, generateImperial, formula = '') {
    if (isNaN(conversion) && typeof conversion !== 'function') {
      throw new TypeError('param conversion must be a number or a function')
    }

    if (typeof imperial !== 'string') {
      throw new TypeError('param imperial must be a string')
    }

    if (typeof metric !== 'string') {
      throw new TypeError('param metric must be a string')
    }

    if (typeof formula !== 'string') {
      throw new TypeError('param formula must be a string')
    }

    if (typeof generateImperial !== 'function') {
      throw new TypeError('param generateImperial must be a function')
    }

    this.conversion = conversion
    this.imperial = imperial
    this.metric = metric
    this.formula = formula || generateFormula(conversion, imperial, metric)
    this.generateImperial = generateImperial
  }

  // Generates an imperial value and an equivalent metric value
  //  @param  {number} range Limits the imperial value generated
  //  @return {object} An object containing an imperial and metric measurement
  generateConversionPair (range) {
    const imperialMeasurement = this.generateImperial(range)
    return {
      imperial: imperialMeasurement,
      metric: isNaN(this.conversion) ? this.conversion(imperialMeasurement) : imperialMeasurement * this.conversion
    }
  }
}

const unreasonableConversionTypes = {
  incheskilometers: new ConversionProblemType(0.0000254, 'in', 'km', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  feetmillimeters: new ConversionProblemType(304.8, 'ft', 'mm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  feetkilometers: new ConversionProblemType(0.0003048, 'ft', 'km', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  yardsmillimeters: new ConversionProblemType(914.4, 'yd', 'mm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  yardskilometers: new ConversionProblemType(0.0009144, 'yd', 'km', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  milesmillimeters: new ConversionProblemType(1609344, 'mi', 'mm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  milescentimeters: new ConversionProblemType(160934.4, 'mi', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  
  poundsgrams: new ConversionProblemType(453.592, 'lb', 'g', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  
  
  quartsmilliliters: new ConversionProblemType(946.3, 'qt', 'mL', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  gallonsmilliliter: new ConversionProblemType(3785.41, 'gal', 'mL', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  })
}

const conversionTypes = {
  inchesmillimeters: new ConversionProblemType(25.4, 'in', 'mm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  inchescentimeters: new ConversionProblemType(2.54, 'in', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  inchesmeters: new ConversionProblemType(0.0254, 'in', 'm', (range) => {
    return 10 + 10 * Math.ceil(Math.random() * range)
  }),
  feetcentimeters: new ConversionProblemType(30.48, 'ft', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  feetmeters: new ConversionProblemType(0.3048, 'ft', 'm', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  yardscentimeters: new ConversionProblemType(91.44, 'yd', 'cm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  yardsmeters: new ConversionProblemType(0.9144, 'yd', 'm', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  milesmeters: new ConversionProblemType(1609.344, 'mi', 'm', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  mileskilometers: new ConversionProblemType(1.609, 'mi', 'cm', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  
  fahrenheitcelsius: new ConversionProblemType((imperial) => (imperial - 32) * 5/9, '°F', '°C', (range) => {
    return -20 + 5 * Math.ceil(Math.random() * range)
  }, '\\[ (°F - 32) \\times \\frac{5}{9} = °C \\]'),
  
  ouncesgrams: new ConversionProblemType(28.349, 'oz', 'g', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  ounceskilograms: new ConversionProblemType(0.02834, 'oz', 'kg', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  poundskilograms: new ConversionProblemType(0.453, 'lb', 'kg', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  
  fluidOuncesmilliliters: new ConversionProblemType(29.57, 'fl oz', 'mL', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  fluidOuncesliters: new ConversionProblemType(0.02957, 'fl oz', 'L', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  pintsmilliliters: new ConversionProblemType(473.2, 'pt', 'mL', (range) => {
    return 1 + 0.1 * Math.ceil(Math.random() * range)
  }),
  pintsliters: new ConversionProblemType(0.4732, 'pt', 'L', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  quartsliters: new ConversionProblemType(0.9463, 'qt', 'L', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  }),
  gallonsliters: new ConversionProblemType(3.785, 'gal', 'L', (range) => {
    return 1 + 1 * Math.ceil(Math.random() * range)
  })
}

// configure
const config = JSON.parse(localStorage.getItem('ToMetric.Options'))

// removes all disabled problems for a measurementType
//  @param  {object} measurementType The object representing the measurement type(e.g. distance) from the config
function pruneDisabledProblems (measurementType) {
  const customaryUnits = measurementType.customary
  const metricUnits = measurementType.metric
  
  if(!measurementType.on){
    for (const customaryUnit in customaryUnits) {
      for (const metricUnit in metricUnits) {
        delete conversionTypes[customaryUnit + metricUnit]
      }
    }
  } else {
    for (const customaryUnit in customaryUnits) {
      const customaryUnitEnabled = customaryUnits[customaryUnit].on

      for (const metricUnit in metricUnits) {
        const metricUnitEnabled = metricUnits[metricUnit].on
      
        if (!(customaryUnitEnabled && metricUnitEnabled)) {
          delete conversionTypes[customaryUnit + metricUnit]
        }
      }
    }
  }
}

if (config) {
  if(!config.general.likeConversions){
    Object.assign(conversionTypes, unreasonableConversionTypes)
  }
  
  const measurements = Object.values(config.measurements)

  measurements.forEach((measurementType) => {
    pruneDisabledProblems(measurementType)
  })
}

const problems = Object.values(conversionTypes)

// Init mathjax tools
// Renders TeX code in the formula div
function renderTeX (TeX) {
  MathJax.Hub.Queue(
    function () { document.getElementById('formula').innerHTML = TeX },
    ['Typeset', MathJax.Hub, 'formula']
  )
}

const toMetric = new Vue({
  el: '#app',
  data: {
    level: 0,
    levelUpProgress: 0,
    levelUpQuota: 2,
    levelUpQuotaIncreased: '',
    difficulty: 10,
    difficultyIncreased: '',

    given: 0,
    imperialAbbrev: '',
    answerClass: 'grey darken-3',
    userAnswer: '',
    exactConversion: 0,
    metricAbbrev: '',

    formula: '',
    
    roundStats: [],

    tolerance: config ? 1 / config.general.precision : 1 / 5
  },
  computed: {
    givenWithoutFloatErrors: function(){
      let floatCheck = this.given.toString().match(/(^[0-9]+\.[0-9]?)0+/)
      
      if(floatCheck){
        return floatCheck[1]
      } else {
        return this.given
      }
    }
  },
  methods: {
    checkAnswer: function () {
      const exactConversion = this.exactConversion
      let percentError = Math.abs(exactConversion - this.userAnswer) / exactConversion

      if (percentError <= this.tolerance) {
        this.onCorrect({
          errorPercent: percentError,
          errorAmount: Math.abs(this.userAnswer - exactConversion),
          exactConversion: exactConversion
        })
        this.loadNewProblem()
      } else {
        this.answerClass = 'grey darken-3 wrong'
      }
    },
    getProblem: function () {
      return problems[Math.floor(Math.random() * problems.length)]
    },
    loadNewProblem: function () {
      //Reset answer box
      this.answerClass = 'grey darken-3'
      this.userAnswer = ''

      const problem = this.getProblem()
      this.imperialAbbrev = problem.imperial
      this.metricAbbrev = problem.metric

      const conversionPair = problem.generateConversionPair(this.difficulty)

      this.given = conversionPair['imperial']
      this.exactConversion = conversionPair['metric']

      this.formula = problem.formula
      renderTeX(problem.formula)
    },
    onCorrect: function (problemStats) {
      this.levelUpProgress += 1
        
      if(this.levelUpProgress === this.levelUpQuota){
        this.levelUpProgress = 0
        this.onLevelUp()
      }
      
      if(this.levelUpProgress === 1){
        this.levelUpQuotaIncreased = ''
        this.difficultyIncreased = ''
      }
      
      this.roundStats.push(problemStats)
    },
    onLevelUp: function(){
      this.level++
      let roll = Math.random()
      
      if(roll < 0.5){
        this.difficulty += 1
        this.difficultyIncreased = 'increased'
      } else {
        this.levelUpQuota += 1
        this.levelUpQuotaIncreased = 'increased'
      }
    }
  },
  mounted: function () {
    this.loadNewProblem()
  }
})
