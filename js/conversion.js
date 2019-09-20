let conversionProblem = class{
  // @param {number} increment 
  // @param {number} ratio The ratio for unit conversion
  // @param {string} imperial The abbreviation for the imperial unit of the conversion
  // @param {string} metric The abbreviation for the metric unit of the conversion
  // @param {string} formula The formula for conversion represented in TeX
  // @param {function} generateImperial(range) A function to generate imperial values for conversions
  //    @param {number} range A number to limit imperial value generated
  //    @return {number} A value in imperial units for conversion
  constructor(ratio, imperial, metric, formula, generateImperial){
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
    this.formula = formula
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
  
}

let toMetric = new Vue({
  el: '#app',
  data: {
    score: 0,
    answerClass: 'grey darken-3',
    userAnswer: '',

    conversionResult: undefined,
    errorAmount: undefined,
    errorPercent: undefined,
    given: Math.ceil(Math.random() * 50),
    tolerance: 0.1
  },
  methods: {
    checkAnswer: function () {
      const exactConversion = this.given / 2.54

      if (Math.abs(exactConversion - this.userAnswer) / exactConversion <= this.tolerance) {
        this.given = Math.ceil(Math.random() * 50)
        this.score += 1

        M.toast({
          html: 'What a great job you did!!!'
        })

        this.answerClass = 'grey darken-3'
        this.answer = ''
      } else {
        this.answerClass = 'grey darken-3 wrong'
      }
    }
  },
  mounted: function () {

  }
})
