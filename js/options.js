var options = new Vue({
    el: "#options",
    computed: {
        distanceOn: {
            get: function() {
                return this.options.conversions.distance.on
            },
            set: function(isEnabled){
                this.options.conversions.distance.on = isEnabled;
                this.SaveOptions();
            }
        },
        liquidVolumeOn: {
            get: function(){
                return this.options.conversions.liquidVolume.on
            },
            set: function(isEnabled){
                this.options.conversions.liquidVolume.on = isEnabled;
                this.SaveOptions();
            }
        },
        massOn: {
            get: function(){
                return this.options.conversions.mass.on
            },
            set: function(isEnabled){
                this.options.conversions.mass.on = isEnabled;
                this.SaveOptions();
            }
        },
        speedOn: {
            get: function(){
                this.options.conversions.speed.on
            },
            set: function(isEnabled){
                this.options.conversions.speed.on = isEnabled;
                this.SaveOptions();
            }
        },
        temperatureOn: {
            get: function(){
                return this.options.conversions.temperature.on
            },
            set: function(isEnabled){
                this.options.conversions.temperature.on = isEnabled;
                this.SaveOptions();
            }
        }
    },
    data: {
        options:{
            conversions: {
                distance: {
                    on: true,
                    customary: {
                        inches: true,
                        feet: true,
                        yards: true,
                        miles: true
                    },
                    metric: {
                        millimeters: true,
                        centimeters: true,
                        meters: true,
                        kilometers: true
                    }
                },
                liquidVolume: {
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
                    on: true,
                    customary: {
                        ounces: true,
                        pound: true,
                    },
                    metric: {
                        grams: true,
                        kilograms: true,
                    }
                },
                speed: {
                    on: true,
                    customary: {
                        milesPerHour: true
                    },
                    metric: {
                        kilometersPerHour: true
                    }
                },
                temperature: {
                    on: true,
                    customary: {
                        fahrenheit: true
                    },
                    metric: {
                        celsius: true
                    }
                }
            },
            general:{
                likeConversions: true,
                precision: 10
            }
        }
    },
    methods: {
        _SaveOptions: function(){
            localStorage.setItem("ToMetric.Options", JSON.stringify(this.options));
            M.toast({html: "Options Saved"});
        },
        
        loadOptions: function(){
            var options = localStorage.getItem("ToMetric.Options");
            
            if(options){
                this.options = JSON.parse(options);
            }
        }
    },
    mounted: function(){
        this.loadOptions();
        this.$nextTick(function(){
            this.SaveOptions = _.debounce(this._SaveOptions, 500);
        });
    },
    updated: function(){
        this.SaveOptions();
    }
});

M.Range.init(document.querySelectorAll("input[type=range]"))
M.Tooltip.init(document.querySelectorAll('.tooltipped'))