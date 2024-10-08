export class PricingMatrix {
    pricingAlgorithm(distance, duration, matrix) {
        try {
            // check if distance is greater than the allowed:
            if (distance > ((matrix.maximumDistance) * 1000)) {
                return { success: false, error: 'Distance exceeds the maximum allowed' }
            }
            // check if duration is less than the minimum allowed:
            console.log(duration)
            if (duration < (parseInt(matrix.minimumDuration))) {
                return { success: false, error: 'Duration is less than the minimum allowed' }
            }
            // calculate the base price based on the season and time of day:
            let basePrice = 0;

            // choose pricing strategy; flat prices or dynamic prices
            // this should be picked randomly
            let randomStrategy = Math.floor(Math.random() * 100);
            let strategy;
            strategy % 2 === 0
            if (randomStrategy % 2 === 0) {
                strategy = 'Flat Pricing';
            } else {
                strategy = 'Dynamic Pricing';
            }

            // get month of the year
            const month = new Date().getMonth() + 1;
            const isDecember = month === matrix.december;
            let season = 'NONE';

            if (month >= matrix.summerMonths.start && month <= matrix.summerMonths.end) {
                season = 'summer';
            }
            if (month >= matrix.winterMonths.start && month <= matrix.winterMonths.end) {
                season = 'winter';
            }

            // get day of the week
            const dayOfTheWeek = new Date().getDay();
            const isAWeekend = matrix.dayOfTheWeek.weekends.includes(dayOfTheWeek);
            //    Get hour of the day
            const hour = new Date().getHours();
            let whichPeak = 'NONE';
            if (hour >= matrix.timeOfDay.morningPeakHours.start && hour <= matrix.timeOfDay.morningPeakHours.end) {
                whichPeak = 'morningPeak';
            }
            if (hour >= matrix.timeOfDay.afternoonPeakHours.start && hour <= matrix.timeOfDay.afternoonPeakHours.end) {
                whichPeak = 'afternoonPeak';
            }
            if (hour >= matrix.timeOfDay.eveningPeakHours.start && hour <= matrix.timeOfDay.eveningPeakHours.end) {
                whichPeak = 'eveningPeak';
            }
            if (hour >= matrix.timeOfDay.night.start && hour <= matrix.timeOfDay.night.end) {
                whichPeak = 'night';
            }
            // fifteenth minute of the hour
            const isFifteenthMinute = (new Date().getMinutes() === 15) && (new Date().getSeconds() === 0);
            // 30th Minute of the hour?
            const isThirtyMinute = (new Date().getMinutes() === 30) && (new Date().getSeconds() === 0);
            // 45th minute of the hour?
            const isFortyFiveMinute = (new Date().getMinutes() === 45) && (new Date().getSeconds() === 0);
            // 60th minute of the hour?
            const isSixtyMinute = (new Date().getMinutes() === 0) && (new Date().getSeconds() === 0);

            // Price calculator;
            let { success, totalPrice, error } = this.priceCalculator(
                basePrice,
                distance,
                duration,
                {

                    strategy,
                    season,
                    isDecember,
                    isAWeekend,
                    whichPeak,
                    isFifteenthMinute,
                    isThirtyMinute,
                    isFortyFiveMinute,
                    isSixtyMinute,
                    matrix
                }
            );
            if (!success) {
                return { success, error };
            }
            if (totalPrice < matrix.minimumCharge) {
                totalPrice = matrix.minimumCharge;
            }
            if (totalPrice > matrix.maximumCharge) {
                totalPrice = matrix.maximumCharge;
            }
            if (totalPrice > (matrix.maxPricesForTenKilometers /2) && (distance/1000) <= 5) {
                totalPrice = 210;
            }
            if ((totalPrice > matrix.maxPricesForTenKilometers) && (distance/1000) <= 10) {
                totalPrice = matrix.maxPricesForFiftyKilometer;
            }
            if ((totalPrice > matrix.maxPricesForFiftyKilometer) && (distance/1000) <= 50) {
                totalPrice = matrix.maxPricesForFiftyKilometer;
            }
            if ((totalPrice > matrix.maxPricesForHundredandKilometers) && (distance/1000) > 100) {
                totalPrice = matrix.maxPricesForHundredandKilometers;
            }

            return { success, data: Math.ceil(totalPrice),}
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    priceCalculator(basePrice, distance, duration, objMatrix) {
        // this function calculates the price based on the strategy and parameters
        // the logic here is to be implemented based on the pricing matrix provided
        try {
            let distanceCost = 0;
            let timeCost = 0;
            let totalRunningPrice = 0;
            let totalPrice = 0;
            if (objMatrix.strategy === 'Flat Pricing') {
                let {runningPerminuteRate, runningPricePerKilometer, runningPrice, error, success } = this.flatPrice(objMatrix);
                if (!success) {
                    return { success, error };
                }
                distanceCost = (runningPrice * (runningPricePerKilometer * (distance/1000)));
                timeCost = (runningPrice * (runningPerminuteRate * (duration/60)));
                totalRunningPrice = runningPrice
            }
            else if (objMatrix.strategy === 'Dynamic Pricing') {
                let { runningPerminuteRate, runningPricePerKilometer, runningPrice, error, success } = this.dynamicPrice(objMatrix);
                if (!success) {
                    return { success, error };
                }
                distanceCost = (runningPrice * (runningPricePerKilometer * (distance/1000)));
                timeCost = (runningPrice * (runningPerminuteRate * (duration/60)));
                totalRunningPrice = runningPrice
            }else {
                let { runningPerminuteRate, runningPricePerKilometer, runningPrice, error, success } = this.normalPrincing(objMatrix);
                if (!success) {
                    return { success, error };
                }
                distanceCost = (runningPrice * (runningPricePerKilometer * (distance/1000)));
                timeCost = (runningPrice * (runningPerminuteRate * (duration/60)));
                totalRunningPrice = runningPrice
            }
            totalPrice = totalRunningPrice + distanceCost + timeCost;
            return { success: true, totalPrice };
        } catch (error) {
            return { success: false, error: error.message}
        }
    }
    flatPrice (objMatrix) {
        try {
            let runningPrice = objMatrix.matrix['Flat Pricing'].base;
            let runningPerminuteRate = objMatrix.matrix['Flat Pricing'].perMinute;
            let runningPricePerKilometer = objMatrix.matrix['Flat Pricing'].perKilometer;

            if (objMatrix.season === 'summer') {
                runningPrice =  Math.floor((runningPrice + objMatrix.matrix.seasonalAdjustment.summer.base) / 2) - (Math.ceil(Math.random() * 6));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.seasonalAdjustment.summer.perKilometer)/2) - ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.season === 'winter') {
                runningPrice =  Math.floor((runningPrice + objMatrix.matrix.seasonalAdjustment.winter.base) / 2) + (Math.ceil(Math.random() * 6));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.seasonalAdjustment.winter.perKilometer)/2) + ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isDecember) {
                runningPrice = runningPrice + 15;
                runningPricePerKilometer = runningPricePerKilometer + ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isAWeekend) {
                runningPrice = Math.floor((runningPrice + objMatrix.matrix.weekendPricing.base) / 2) - (Math.ceil(Math.random() * 5));
                runningPricePerKilometer = ((runningPricePerKilometer +  objMatrix.matrix.weekendPricing.perKilometer) / 2) + ((Math.random() * 0.01).toFixed(3));
                runningPerminuteRate = ((runningPerminuteRate + objMatrix.matrix.weekendPricing.perMinute) / 2) + ((Math.random() * 0.02).toFixed(3));
            }else {
                runningPrice = Math.floor((runningPrice + objMatrix.matrix.weekdaysPricing.base) / 2) + (Math.ceil(Math.random() * 4));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.weekdaysPricing.perKilometer) / 2) - ((Math.random() * 0.01).toFixed(3));
                runningPerminuteRate = ((runningPerminuteRate + objMatrix.matrix.weekdaysPricing.perMinute) / 2) - ((Math.random() * 0.02).toFixed(3));
            }
            if (objMatrix.matrix.peakPrices[objMatrix.whichPeak]) {
                runningPrice = Math.floor(((runningPrice + objMatrix.matrix.peakPrices[objMatrix.whichPeak].base)/2) - (Math.ceil(Math.random() * (Math.random() * 10))));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.peakPrices[objMatrix.whichPeak]) / 2)-((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isFifteenthMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.fifteenthMinute;
            }
            if (objMatrix.isThirtyMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.thirtiethMinute;
            }
            if (objMatrix.isFortyFiveMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.fourtyFifthMinute;
            }
            if (objMatrix.isSixtyMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.sixtiethMinute;
            }
            return { 
                success: true,
                runningPrice,
                runningPerminuteRate,
                runningPricePerKilometer,
            }
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    dynamicPrice (objMatrix) {
        try {
            let runningPrice = objMatrix.matrix['Dynamic Pricing'].base;
            let runningPerminuteRate = objMatrix.matrix['Dynamic Pricing'].perMinute;
            let runningPricePerKilometer = objMatrix.matrix['Dynamic Pricing'].perKilometer;

            if (objMatrix.season === 'summer') {
                runningPrice =  Math.ceil((runningPrice + objMatrix.matrix.seasonalAdjustment.summer.base) / 2) - (Math.ceil(Math.random() * 6));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.seasonalAdjustment.summer.perKilometer)/2) - ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.season === 'winter') {
                runningPrice =  Math.ceil((runningPrice + objMatrix.matrix.seasonalAdjustment.winter.base) / 2) + (Math.ceil(Math.random() * 6));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.seasonalAdjustment.winter.perKilometer)/2) + ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isDecember) {
                runningPrice = runningPrice + 15;
                runningPricePerKilometer = runningPricePerKilometer + ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isAWeekend) {
                runningPrice = Math.ceil((runningPrice + objMatrix.matrix.weekendPricing.base) / 2) - (Math.ceil(Math.random() * 5));
                runningPricePerKilometer = ((runningPricePerKilometer +  objMatrix.matrix.weekendPricing.perKilometer) / 2) + ((Math.random() * 0.01).toFixed(3));
                runningPerminuteRate = ((runningPerminuteRate + objMatrix.matrix.weekendPricing.perMinute) / 2) + ((Math.random() * 0.02).toFixed(3));
            }else {
                runningPrice = Math.ceil((runningPrice + objMatrix.matrix.weekdaysPricing.base) / 2) + (Math.ceil(Math.random() * 4));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.weekdaysPricing.perKilometer) / 2) - ((Math.random() * 0.01).toFixed(3));
                runningPerminuteRate = ((runningPerminuteRate + objMatrix.matrix.weekdaysPricing.perMinute) / 2) - ((Math.random() * 0.02).toFixed(3));
            }
            if (objMatrix.matrix.peakPrices[objMatrix.whichPeak]) {
                runningPrice = Math.ceil(((runningPrice + objMatrix.matrix.peakPrices[objMatrix.whichPeak].base)/2) - (Math.ceil(Math.random() * (Math.random() * 10))));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.peakPrices[objMatrix.whichPeak]) / 2)-((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isFifteenthMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.fifteenthMinute;
            }
            if (objMatrix.isThirtyMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.thirtiethMinute;
            }
            if (objMatrix.isFortyFiveMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.fourtyFifthMinute;
            }
            if (objMatrix.isSixtyMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.sixtiethMinute;
            }
            return { 
                success: true,
                runningPrice,
                runningPerminuteRate,
                runningPricePerKilometer,
            }
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    normalPrincing ( objMatrix) {
        try {
            let runningPrice = 0;
            let runningPerminuteRate = 0;
            let runningPricePerKilometer = 0;

            if (objMatrix.season === 'summer') {
                runningPrice =  Math.floor((runningPrice + objMatrix.matrix.seasonalAdjustment.summer.base) / 2) - (Math.ceil(Math.random() * 6));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.seasonalAdjustment.summer.perKilometer)/2) - ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.season === 'winter') {
                runningPrice =  Math.floor((runningPrice + objMatrix.matrix.seasonalAdjustment.winter.base) / 2) + (Math.ceil(Math.random() * 6));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.seasonalAdjustment.winter.perKilometer)/2) + ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isDecember) {
                runningPrice = runningPrice + 15;
                runningPricePerKilometer = runningPricePerKilometer + ((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isAWeekend) {
                runningPrice = Math.floor((runningPrice + objMatrix.matrix.weekendPricing.base) / 2) - (Math.ceil(Math.random() * 5));
                runningPricePerKilometer = ((runningPricePerKilometer +  objMatrix.matrix.weekendPricing.perKilometer) / 2) + ((Math.random() * 0.01).toFixed(3));
                runningPerminuteRate = ((runningPerminuteRate + objMatrix.matrix.weekendPricing.perMinute) / 2) + ((Math.random() * 0.02).toFixed(3));
            }else {
                runningPrice = Math.floor((runningPrice + objMatrix.matrix.weekdaysPricing.base) / 2) + (Math.ceil(Math.random() * 4));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.weekdaysPricing.perKilometer) / 2) - ((Math.random() * 0.01).toFixed(3));
                runningPerminuteRate = ((runningPerminuteRate + objMatrix.matrix.weekdaysPricing.perMinute) / 2) - ((Math.random() * 0.02).toFixed(3));
            }
            if (objMatrix.matrix.peakPrices[objMatrix.whichPeak]) {
                runningPrice = Math.floor(((runningPrice + objMatrix.matrix.peakPrices[objMatrix.whichPeak].base)/2) - (Math.ceil(Math.random() * (Math.random() * 10))));
                runningPricePerKilometer = ((runningPricePerKilometer + objMatrix.matrix.peakPrices[objMatrix.whichPeak]) / 2)-((Math.random() * 0.01).toFixed(3));
            }
            if (objMatrix.isFifteenthMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.fifteenthMinute;
            }
            if (objMatrix.isThirtyMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.thirtiethMinute;
            }
            if (objMatrix.isFortyFiveMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.fourtyFifthMinute;
            }
            if (objMatrix.isSixtyMinute) {
                runningPricePerKilometer = runningPricePerKilometer + objMatrix.timeStamp.sixtiethMinute;
            }
            return { 
                success: true,
                runningPrice,
                runningPerminuteRate,
                runningPricePerKilometer,
            }
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}