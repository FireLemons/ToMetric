// Generates a TeX representation of a formula
//   @param  {number}  ratio The ratio for unit conversion
//   @param  {string}  imperial The abbreviation for the imperial unit of the conversion
//   @param  {string}  metric The abbreviation for the metric unit of the conversion
//   @param  {boolean} isScientific True to format the formula in scientific notation, false otherwise
//   @return {string}  the TeX representation of the formula to convert from imperial to metric
function generateFormula (ratio, imperial, metric, isScientific) {
  if (isScientific) {
    const ratioAsSciNotation = ratio.toExponential()
    const coefficientMagnitude = ratioAsSciNotation.match(/([0-9]\.[0-9]+)e([+-][0-9]+)/)

    if (coefficientMagnitude[2].charAt(0) === '+') {
      coefficientMagnitude[2] = coefficientMagnitude[2].substr(1)
    }

    return `\\[ 1\\,\\mathrm{${imperial}} = ${coefficientMagnitude[1]}\\,\\mathrm{${metric}}` + (coefficientMagnitude[2] === '0' ? '' : `\\times 10^{${coefficientMagnitude[2]}}`) + '\\]'
  } else {
    const floatScientificPattern = /^-?\d(\.\d+)?e(-?\d+)$/
    const ratioAsString = ratio.toString()
    const tryCaptureScientific = ratioAsString.match(floatScientificPattern)
    let coefficient = ''

    if (tryCaptureScientific !== null) {
      coefficient = ratio.toFixed(Math.abs(parseInt(tryCaptureScientific[2])) + tryCaptureScientific[1] ? tryCaptureScientific[1].length : 0)
    } else {
      coefficient = ratioAsString
    }

    return `\\[ 1\\,\\mathrm{${imperial}} = ${coefficient}\\,\\mathrm{${metric}} \\]`
  }
}

// Calculates the average given the current average value and a new data point
//  @param  {number} newDataPointValue The value of the new data point
//  @param  {number} previousAverage The current average value
//  @param  {number} previousSampleCount The current number of samples in the average
//  @return {number} The new average including the new data point
function cumulativeAverage (newDataPointValue, previousAverage, previousSampleCount) {
  return previousAverage + ((newDataPointValue - previousAverage) / (previousSampleCount + 1))
}

// Corrected javascript round function
//  @param  {number} x The number to be rounded
//  @return {number} x rounded down if its decimal component is at most .5 otherwise x rounded up
function round (x) {
  return (x % 1 <= 0.5) ? Math.floor(x) : Math.floor(x) + 1
}

// Shortens numbers with repeating decimals
//  @param  {number} x The number to be shortened if necessary
//  @return {number} A shortened version of x if x trailed in a repeating decimal otherwise just x
function fixRepeat (x) {
  const repeatPattern = /^([0-9.\-]+?)(0{3,}|1{3,}|2{3,}|3{3,}|4{3,}|5{3,}|6{3,}|7{3,}|8{3,}|9{3,})/
  const matchRepeat = x.toString().match(repeatPattern)

  if (matchRepeat) {
    const xTruncated = matchRepeat[1]
    const repeatingDigitAsString = matchRepeat[2].charAt(1)

    return `${xTruncated}${repeatingDigitAsString}${repeatingDigitAsString}...`
  } else {
    return x
  }
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
    this.formula = formula || generateFormula(conversion, imperial, metric, false)
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

const generateFineImperial = (range) => {
  return 1 + 0.1 * Math.floor(Math.random() * range)
}

const generateCoarseImperial = (range) => {
  return 1 + 1 * Math.floor(Math.random() * range)
}

const unreasonableConversionTypes = {
  incheskilometers: new ConversionProblemType(0.0000254, 'in', 'km', generateCoarseImperial),
  feetmillimeters: new ConversionProblemType(304.8, 'ft', 'mm', generateFineImperial),
  feetkilometers: new ConversionProblemType(0.0003048, 'ft', 'km', generateCoarseImperial),
  yardsmillimeters: new ConversionProblemType(914.4, 'yd', 'mm', generateFineImperial),
  yardskilometers: new ConversionProblemType(0.0009144, 'yd', 'km', generateCoarseImperial),
  milesmillimeters: new ConversionProblemType(1609344, 'mi', 'mm', generateFineImperial),
  milescentimeters: new ConversionProblemType(160934.4, 'mi', 'cm', generateFineImperial),
  poundsgrams: new ConversionProblemType(453.592, 'lb', 'g', generateFineImperial),
  quartsmilliliters: new ConversionProblemType(946.3, 'qt', 'mL', generateFineImperial),
  gallonsmilliliter: new ConversionProblemType(3785.41, 'gal', 'mL', generateFineImperial)
}

const conversionTypes = {
  inchesmillimeters: new ConversionProblemType(25.4, 'in', 'mm', generateFineImperial),
  inchescentimeters: new ConversionProblemType(2.54, 'in', 'cm', generateFineImperial),
  inchesmeters: new ConversionProblemType(0.0254, 'in', 'm', generateCoarseImperial),
  feetcentimeters: new ConversionProblemType(30.48, 'ft', 'cm', generateFineImperial),
  feetmeters: new ConversionProblemType(0.3048, 'ft', 'm', generateCoarseImperial),
  yardscentimeters: new ConversionProblemType(91.44, 'yd', 'cm', generateFineImperial),
  yardsmeters: new ConversionProblemType(0.9144, 'yd', 'm', generateCoarseImperial),
  milesmeters: new ConversionProblemType(1609.344, 'mi', 'm', generateFineImperial),
  mileskilometers: new ConversionProblemType(1.609, 'mi', 'km', generateCoarseImperial),

  fahrenheitcelsius: new ConversionProblemType((imperial) => (imperial - 32) * 5 / 9, '°F', '°C', (range) => {
    return -20 + 5 * Math.ceil(Math.random() * range)
  }, '\\[ (°F - 32) \\times \\frac{5}{9} = °C \\]'),

  ouncesgrams: new ConversionProblemType(28.349, 'oz', 'g', generateFineImperial),
  ounceskilograms: new ConversionProblemType(0.02834, 'oz', 'kg', generateCoarseImperial),
  poundskilograms: new ConversionProblemType(0.453, 'lb', 'kg', generateCoarseImperial),

  fluidOuncesmilliliters: new ConversionProblemType(29.57, 'fl oz', 'mL', generateFineImperial),
  fluidOuncesliters: new ConversionProblemType(0.02957, 'fl oz', 'L', generateCoarseImperial),
  pintsmilliliters: new ConversionProblemType(473.2, 'pt', 'mL', generateFineImperial),
  pintsliters: new ConversionProblemType(0.4732, 'pt', 'L', generateCoarseImperial),
  quartsliters: new ConversionProblemType(0.9463, 'qt', 'L', generateCoarseImperial),
  gallonsliters: new ConversionProblemType(3.785, 'gal', 'L', generateCoarseImperial),
  
  feetPerSecondmetersPerSecond: new ConversionProblemType(0.3048, 'ft/s', 'm/s', generateCoarseImperial, '\\[ 1\\,\\mathrm{\\frac{ft}{s}} = 3.048\\,\\mathrm{\\frac{m}{s}} \\times 10^{-1} \\]'),
  feetPerSecondkilometersPerHour: new ConversionProblemType(1.097, 'ft/s', 'km/h', generateCoarseImperial, '\\[ 1\\,\\mathrm{\\frac{ft}{s}} = 1.097\\,\\mathrm{\\frac{km}{h}} \\]'),
  milesPerHourmetersPerSecond: new ConversionProblemType(0.44704, 'mph', 'm/s', generateFineImperial, '\\[ 1\\,\\mathrm{\\frac{mi}{h}} = 4.4704\\,\\mathrm{\\frac{m}{s}} \\times 10^{-1} \\]'),
  milesPerHourkilometersPerHour: new ConversionProblemType(1.609, 'mph', 'km/h', generateCoarseImperial, '\\[ 1\\,\\mathrm{\\frac{mi}{h}} = 1.609\\,\\mathrm{\\frac{km}{h}} \\]')
}

const metricFacts = [
  'The yard is defined as 0.9144 meters. The meter is defined as the length of the path travelled by light in a vacuum in 1/299792458 of a second.',
  'The Metric Conversion Act declared the metric system as "the preferred system of weights and measures for United States trade and commerce", but still allowed the use of customary units.',
  'Astronauts on the ISS have sets of tools for metric and customary units because only the American portion has been built in customary units.',
  'Joseph Dombey was sent to the US to help with metrication. On his way across the Atlantic he was captured by privateers and held captive in Montserrat where he died.',
  'Interstate 19 in Arizona is the only freeway in America that uses the metric system.',
  'The Mars Climate Orbiter was lost in space because some of its software was feeding customary unit output into another piece expecting metric units.',
  'The Gimli Glider was a Boeing 747 that ran out of fuel mid flight. During refueling, the crew used a conversion factor for pounds instead of one for kilograms.',
  
  'The fractional metric prefixes in decreasing order of magnitude are: deci, centi, milli, micro, nano, pico, femto, atto, zepto, yocto',
  'The multiple metric prefixes in increasing order of magnitude are: deca, hecto, kilo, mega, giga, tera, peta, exa, zetta, yotta',
  
  'An apple is usually 7 to 8 centimeters',
  'A person is about 1.7 meters tall',
  'CDs are 12 centimeters wide',
  'Cars are about 4 to 5 meters long',
  
  'An inch is about 25 millimeters',
  'An inch is about 2.5 centimeters',
  'An inch is about .025 meters',
  'A foot is about 30% of a meter',
  'A foot is about 30 centimeters',
  'A yard is about 90 centimeters',
  'A yard is about 90% of a meter',
  'A mile is about 1600 meters',
  'A mile is about 1.6 kilometers',
  'An ounce is about 28 grams',
  'An ounce is about 3 hundredths of a kilogram',
  'A pound is a little less than half a kilogram',
  'A fluid ounce is about 30 milliliters',
  'A fluid ounce is about 3 hundredths of a liter',
  'A pint is a little less than half a liter',
  'A pint is about 470 milliliters',
  'A quart is a little under a liter',
  'A gallon is about 3.8 liters'
]

// configure
const config = JSON.parse(localStorage.getItem('ToMetric.Options'))

// removes all disabled problems for a measurementType
//  @param  {object} measurementType The object representing the measurement type(e.g. distance) from the config
function pruneDisabledProblems (measurementType) {
  const customaryUnits = measurementType.customary
  const metricUnits = measurementType.metric

  if (!measurementType.on) {
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
  // If abnormal conversions are enabled
  if (config.general.oddConversions) {
    // Add strange conversions to the problem pool
    Object.assign(conversionTypes, unreasonableConversionTypes)
  }

  const measurements = Object.values(config.measurements)

  // Remove disabled measurements
  measurements.forEach((measurementType) => {
    pruneDisabledProblems(measurementType)
  })

  if (config.general.scientific) {
    for (conversionType in conversionTypes) {
      const problem = conversionTypes[conversionType]

      if (!(problem.conversion instanceof Function)) {
        problem.formula = generateFormula(problem.conversion, problem.imperial, problem.metric, true)
      }
    }
  }
}

const problems = Object.values(conversionTypes)

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
    overlay: true,
    loaded: false,
    metricFact: '',

    level: 0,
    levelUpProgress: 0,
    levelUpQuota: 2,
    difficulty: 5,

    secondsPerProblem: 30,
    secondsLeft: 30,
    paused: false,
    countdownIntervalID: null,

    given: 0,
    imperialAbbrev: '',
    userAnswer: '',
    wrongAnswer: true,
    tries: 1,
    exactConversion: 0,
    metricAbbrev: '',
    tolerance: config ? config.general.precision : 5,

    formula: '',
    showFormula: false,

    roundStats: [],
    gameStats: {
      attemptCount: 0,
      averageErrorPercent: 0,
      problemsSolvedCount: 0,
    }
  },
  computed: {
    // Makes it so float errors don't produce a very long string in the given imperial measurement box
    givenWithoutFloatErrors: function () {
      const floatCheck = this.given.toString().match(/(^[0-9]+\.[0-9]?)0+/)

      if (floatCheck) {
        return floatCheck[1]
      } else {
        return this.given
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    // Checks if the user conversion was close enough
    checkAnswer: function () {
      const exactConversion = this.exactConversion
      const percentError = Math.abs((exactConversion - this.userAnswer) * 100 / exactConversion)
      
      if (percentError <= this.tolerance) { // Acceptable answer
        this.onCorrect({
          errorPercent: round(percentError) ? Math.abs(round(percentError)) : '< 1',
          errorAmount: `${fixRepeat(Math.abs(this.userAnswer - exactConversion))} (${this.metricAbbrev})`,
          exactConversion: `${fixRepeat(exactConversion)} (${this.metricAbbrev})`,
          userConversion: `${this.userAnswer} (${this.metricAbbrev})`,
          given: `${this.givenWithoutFloatErrors} (${this.imperialAbbrev})`,
          tries: this.tries
        })

        this.tries = 1
      } else { // Answer not accurate enough
        this.wrongAnswer = !this.wrongAnswer
        this.tries++
      }
    },
    // Gets a random problem object
    //  @return {ConversionProblemType} a random problem type from the problem pool
    getProblem: function () {
      return problems[Math.floor(Math.random() * problems.length)]
    },
    loadNewProblem: function () {
      // Reset answer box
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
      this.secondsLeft = this.secondsPerProblem
      this.levelUpProgress += 1

      if (this.levelUpProgress === this.levelUpQuota) {
        this.levelUpProgress = 0
        this.showStats()
      } else {
        this.loadNewProblem()
      }

      this.roundStats.push(problemStats)
      this.gameStats.attemptCount += problemStats.tries

      let errorPercentAsNumber = problemStats.errorPercent === '< 1' ? 0 : Number(problemStats.errorPercent)
      this.gameStats.averageErrorPercent = cumulativeAverage(errorPercentAsNumber, this.gameStats.averageErrorPercent, this.gameStats.problemsSolvedCount)
      this.gameStats.problemsSolvedCount++
    },
    onLevelUp: function () {
      this.level++
      const roll = Math.random()

      if (roll < 0.5) {
        this.difficulty += 5
      } else {
        this.levelUpQuota += 1
      }

      this.loadNewProblem()
      this.roundStats = []
    },
    onLoseGame: function () {
        this.gameOverModal.open()

        clearInterval(this.countdownIntervalID)
    },
    resetGame: function () {
      this.level = 0
      this.levelUpProgress = 0
      this.levelUpQuota = 2
      this.difficulty = 5

      this.secondsPerProblem = 30
      this.secondsLeft = 30
      this.paused = false,
      this.countdownIntervalID = null

      this.loadNewProblem()
      this.tries = 1,

      this.roundStats = []
      this.gameStats.attemptCount = 0
      this.gameStats.averageErrorPercent = 0
      this.gameStats.problemsSolvedCount = 0
    },
    showStats: function () {
      this.paused = true
      this.roundStatsModal.open()
      
      if(!this.countdownIntervalID){
          this.countdownIntervalID = setInterval(() => {
              if(!this.paused){
                  this.secondsLeft--
              }
              
              if(this.secondsLeft <= 0){
                  this.onLoseGame()
              }
          }, 1000)
      }
    }
  },
  mounted: function () {
    // Init materialize modals
    M.Modal.init(document.querySelectorAll('.modal'))

    this.roundStatsModal = M.Modal.getInstance(document.getElementById('round-stats'))
    this.gameOverModal = M.Modal.getInstance(document.getElementById('game-over'))
    
    this.roundStatsModal.options.onCloseEnd = () => {
      this.onLevelUp()
      this.paused = false
    }

    this.gameOverModal.options.onCloseStart = () => {
      this.resetGame()
    }

    MathJax.Hub.Register.StartupHook('End', () => {
      this.loaded = true
      this.metricFact = `<p>${metricFacts[Math.floor(Math.random() * metricFacts.length)]}</p><p class="grey-text text-lighten-2">Click anywhere to continue</p>`

      this.loadNewProblem()
    })
  }
})
