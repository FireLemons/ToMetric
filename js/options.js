// Trims the object representing measurement type to just the user set data
//  @param  {object} measurementType The object to be trimmed
//  @return {object} only the members of measurementType related to user set data
function mapMeasurementTypeUnitsEnable(measurementType){
  let mappedMeasurementType = {}
  
  let{customary, metric} = measurementType
  
  for(unit in customary){
    mappedMeasurementType[unit] = {
      on: customary[unit].on
    }
  }
  
  for(unit in metric){
    mappedMeasurementType[unit] = {
      on: metric[unit].on
    }
  }
  
  return mappedMeasurementType
}

Vue.component('measurement-type-options', {
  props: {
    type: Object,
    type_name: String
  },
  computed: {
    // Returns a version of type where the first letter is capitalized
    //  @return {string} type but the first letter is capitalized
    captializedType: function(){
      let type_name = this.type_name
      return type_name.charAt(0).toUpperCase() + type_name.slice(1);
    }
  },
  template: `<div class="row">
                <div class="col s12">
                    <div :id="type_name + '-options'" class="card grey darken-3">
                        <div class="card-image">
                            <img :src="type.img" :alt="type_name + ' options background'">
                            <span class="card-title">{{captializedType}}</span>
                            <div class="switch">
                                <label class="white-text">
                                    Off
                                    <input type="checkbox" v-model="type.on">
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
})

var options = new Vue({
  el: '#options',
  data: {
    options: {
      conversions: {
        distance: {
          img: 'img/distance.jpg',
          on: true,
          customary: {
            inches: {
              displayText: 'Inches',
              on: true
            },
            feet: {
              displayText: 'Feet',
              on: true
            },
            yards: {
              displayText: 'Yards',
              on: true
            },
            miles: {
              displayText: 'Miles',
              on: true
            }
          },
          metric: {
            millimeters: {
              displayText: 'Milliliters',
              on: true
            },
            centimeters: {
              displayText: 'Centimeters',
              on: true
            },
            meters: {
              displayText: 'Meters',
              on: true
            },
            kilometers: {
              displayText: 'Kilometers',
              on: true
            }
          }
        },
        liquidVolume: {
          img: 'img/liquid-volume.jpg',
          on: true,
          customary: {
            gallons: true,
            quarts: true,
            pints: true,
            fluidOunces: true
          },
          metric: {
            milliliters: true,
            liters: true
          }
        },
        mass: {
          img: 'img/mass.jpg',
          on: true,
          customary: {
            ounces: true,
            pound: true
          },
          metric: {
            grams: {
              displayText: 'Grams',
              on: true
            },
            kilograms: {
              displayText: 'Kilograms',
              on: true
            }
          }
        },
        speed: {
          img: 'img/speed.jpg',
          on: true,
          customary: {
            milesPerHour: {
              displayText: 'Miles/Hour',
              on: true
            }
          },
          metric: {
            kilometersPerHour: {
              displayText: 'Kilometers/Hour',
              on: true
            }
          }
        },
        temperature: {
          img: 'img/temperature.jpg',
          on: true,
          customary: {
            fahrenheit: true
          },
          metric: {
            celsius: true
          }
        }
      },
      general: {
        likeConversions: true,
        precision: 10
      }
    }
  },
  methods: {
    // Saves the option data to local storage and displays a toast saying the data is saved
    _SaveOptions: function () {
      let setOptions = {
          conversions: {},
          general: this.options.general
      }
      
      let {conversions} = this.options
      
      for(key in conversions){
        let measurementType = conversions[key]
        setOptions[key] = {
          on: measurementType.on,
          customary: measurementType.customary,
          metric: measurementType.metric
        }
      }
      
      localStorage.setItem('ToMetric.Options', JSON.stringify(setOptions))
      M.toast({ html: 'Options Saved' })
    },
    
    // Placeholder so no error is thrown for the update triggered by loadOptions()
    SaveOptions: function(){
    },

    // Loads saved option data if it exists
    loadOptions: function () {
      var options = localStorage.getItem('ToMetric.Options')

      if (options) {
        _.merge(this.options, JSON.parse(options))
      }
    }
  },
  mounted: function () {
    this.loadOptions()
    
    // Init SaveOptions after the initial load so it's not called for the update triggered by the initial load
    this.$nextTick(function () {
      this.SaveOptions = _.debounce(this._SaveOptions, 500)
    })
  },
  updated: function () {
    this.SaveOptions()
  }
})

M.Range.init(document.querySelectorAll('input[type=range]'))
M.Tooltip.init(document.querySelectorAll('.tooltipped'))
