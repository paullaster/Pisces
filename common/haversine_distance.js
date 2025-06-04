/**
 * 
 * @param {*} originLocation 
 * @param {*} destination 
 */
export default function (originLocation, destination) {
    originLocation.lat = Number(originLocation.lat);
    destination.lat = Number(destination.lat);
    originLocation.long = Number(originLocation.long);
    destination.long = Number(destination.long);
    const R = 6371e3;
    const phi1 = (Math.PI * originLocation.lat) / 180;
    const phi2 = (Math.PI * destination.lat) / 180;
    const deltaPhi = (Math.PI * (destination.lat - originLocation.lat)) / 180;
    const deltaLambda = (Math.PI * (destination.long - originLocation.long)) / 180;
    const v = ((Math.sin(deltaPhi / 2)) ** 2) + ((Math.cos(phi1) * Math.cos(phi2)) * (Math.sin(deltaLambda / 2) ** 2));
    const w = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v));
    return R * w;
}