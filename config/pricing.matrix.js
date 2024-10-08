export default {
    timeStamp: {
        fifteenthMinute: 15,
        thirtiethMinute: 20,
        fourtyFifthMinute: 25,
        sixtiethMinute: 30,
    },
    pricing: {
        base: 50,
        perKilometer: 0.25,
    },
    timeOfDay: {
        morning: {
            start: 6,
            end: 12,
        },
        afternoon: {
            start: 12,
            end: 18,
        },
        evening: {
            start: 18,
            end: 24,
        },
        night: {
            start: 23,
            end: 5,
        },
        peakHours: {
            start: 14,
            end: 23,
        },
        offPeakHours: {
            start: 23,
            end: 14,
        },
        morningPeakHours: {
            start: 7,
            end: 8,
        },
        eveningPeakHours: {
            start: 17,
            end: 20,
        },
        afternoonPeakHours: {
            start: 15,
            end: 16,
        },
    },
    peakPrices: {
        morningPeak: {
            base: 70,
            perKilometer: 0.50,
        },
        afternoonPeak: {
            base: 80,
            perKilometer: 0.48,
        },
        eveningPeak: {
            base: 90,
            perKilometer: 0.70,
        },
        night: {
            base: 100,
            perKilometer: 0.80,
        }
    },
    dayOfTheWeek: {
        weekdays: [1, 2, 3, 4, 5],
        weekends: [6, 0],
    },
    seasonalAdjustment: {
        summer: {
            base: 65,
            perKilometer: 0.33,
        },
        winter: {
            base: 95,
            perKilometer: 0.43,
        },
    },
    weekdaysPricing: {
        base: 60,
        perKilometer: 0.45,
        perMinute: 0.020,
    },
    weekendPricing: {
        base: 85,
        perKilometer: 0.80,
        perMinute: 0.021,
    },
    summerMonths: {
        start: 6,
        end: 8,
    },
    winterMonths: {
        start: 12,
        end: 2,
    },
    december: 12,
    ['Flat Pricing']: {
        base: 55,
        perKilometer: 0.40,
        perMinute: 0.022,
    },
    ['Dynamic Pricing']: {
        base: 80,
        perKilometer: 0.600,
        perMinute: 0.019,
    },
    minimumDuration: 60, //mins
    maximumDistance: 10000, // kilometers
    minimumCharge: 150, // KES
    maximumCharge: 10000, // KES
    maxPricesForTenKilometers: 350,
    maxPricesForFiftyKilometer: 850,
    maxPricesForHundredandKilometers: 1550,
}