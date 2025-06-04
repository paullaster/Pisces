export default {
    timeStamp: {
        fifteenthMinute: 15,
        thirtiethMinute: 20,
        fourtyFifthMinute: 25,
        sixtiethMinute: 30,
    },
    pricing: {
        base: 40,
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
            base: 60,
            perKilometer: 0.40,
        },
        afternoonPeak: {
            base: 67,
            perKilometer: 0.45,
        },
        eveningPeak: {
            base: 79,
            perKilometer: 0.60,
        },
        night: {
            base: 100,
            perKilometer: 0.50,
        }
    },
    dayOfTheWeek: {
        weekdays: [1, 2, 3, 4, 5],
        weekends: [6, 0],
    },
    seasonalAdjustment: {
        summer: {
            base: 55,
            perKilometer: 0.32,
        },
        winter: {
            base: 80,
            perKilometer: 0.45,
        },
    },
    weekdaysPricing: {
        base: 45,
        perKilometer: 0.36,
        perMinute: 0.020,
    },
    weekendPricing: {
        base: 75,
        perKilometer: 0.55,
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
    maximumCharge: 2000, // KES
    maxPricesForTenKilometers: 350,
    maxPricesForFiftyKilometer: 750,
    maxPricesForHundredandKilometers: 1550,
}