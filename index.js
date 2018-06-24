/**
 * @author Chathura Widanage
 */

//Actual Dimensions
let trackLongLength = 1006;
let trackShortLength = 201;
let trackWidth = 15.2;
let turnArc = 402;
let turnRadius = turnArc * 4 / (2 * Math.PI);

//calculating optimum scale for screen size
var scale = Math.min((window.innerWidth - 200) / (trackLongLength + (turnRadius * 2)), (window.innerHeight - 200) / (trackShortLength + turnRadius * 2));
var widthSCale = scale * 5;
var carScale = 15;

//scaled dimensions
let scaledRadius = turnRadius * scale;
let scalledTurnArc = 2 * Math.PI * scaledRadius / 4;

var longStraightWay = {
    length: trackLongLength * scale,
    width: trackWidth * widthSCale
};

var shortStraightWay = {
    length: trackShortLength * scale,
    width: trackWidth * widthSCale
};

var roadTexture = "road_two.jpg";

var draw = SVG('drawing').size('100%', '100%');

/* var outerTrack = draw.rect(longStraightWay.length + (2 * scaledRadius), shortStraightWay.length + (2 * scaledRadius))
     .attr({ fill: 'transparent', stroke: roadTexture, 'stroke-width': 15.2 * widthSCale }).radius(turnRadius * scale);
 outerTrack.center(window.innerWidth / 2, window.innerHeight / 2);*/


//adding display padding for clarity
let paddingTop = (window.innerHeight - shortStraightWay.length - 2 * scaledRadius) / 2;
let paddingLeft = (window.innerWidth - longStraightWay.length - 2 * scaledRadius) / 2;

//------------------------------//
//          TRACK POINTS        //
//------------------------------//
let xc1 = paddingLeft;
let yc1 = paddingTop;

let x1 = xc1 + scaledRadius;
let y1 = yc1;

let x2 = x1 + longStraightWay.length;
let y2 = y1;

let xc2 = x2 + scaledRadius;
let yc2 = y2;

let x3 = xc2;
let y3 = yc2 + scaledRadius;

let x4 = x3;
let y4 = y3 + shortStraightWay.length;

let xc3 = x4;
let yc3 = y4 + scaledRadius;

let x5 = xc3 - scaledRadius;
let y5 = yc3;

let x6 = x5 - longStraightWay.length;
let y6 = y5;

let xc4 = x6 - scaledRadius;
let yc4 = y6;

let x7 = xc4;
let y7 = yc4 - scaledRadius;

let x8 = x7;
let y8 = y7 - shortStraightWay.length;

//--------------------------------//
//          TRACK DISTANCE        //
//--------------------------------//
let oneToTwo = longStraightWay.length;
let twoToThree = oneToTwo + scalledTurnArc;
let threeToFour = twoToThree + shortStraightWay.length;
let fourToFive = threeToFour + scalledTurnArc;
let fiveToSix = fourToFive + longStraightWay.length;
let sixToSeven = fiveToSix + scalledTurnArc;
let sevenToEight = sixToSeven + shortStraightWay.length;
let eightToOne = sevenToEight + scalledTurnArc;

console.log("Total", eightToOne);

//drawing track
let path = draw.path
    (`
        M${x1} ${y1} 
        L${x2} ${y2} 
        Q ${xc2} ${yc2} ${x3} ${y3}
        L${x4} ${y4}
        Q ${xc3} ${yc3} ${x5} ${y5}
        L${x6} ${y6}
        Q ${xc4} ${yc4} ${x7} ${y7}
        L${x8} ${y8}
        Q ${xc1} ${yc1} ${x1} ${y1}
    `)
    .attr({ stroke: roadTexture, fill: 'transparent', 'stroke-width': longStraightWay.width })
    .center(window.innerWidth / 2, window.innerHeight / 2);
let length = path.length();

//start pattern
let pattern = draw.pattern(20, 20, function (add) {
    add.rect(20, 20).fill('#fff')
    add.rect(10, 10)
    add.rect(10, 10).move(10, 10)
});

//start line
let startLine = draw.rect(20 * scale, longStraightWay.width).fill(pattern).move(x1, y1 - (longStraightWay.width / 2));

console.log("Length", length / scale);

function addCar(image, animationTime) {
    var carContainer = draw.group();
    var car = carContainer.image(image).size(4.8 * carScale, 1.8 * carScale);
    let boundingBoxMax = Math.sqrt(Math.pow(4.8 * carScale, 2) * 2);
    carContainer.rect(boundingBoxMax, boundingBoxMax).fill('transparent');
    car.move(boundingBoxMax / 2 - 4.8 * carScale / 2, boundingBoxMax / 2 - 1.8 * carScale / 2);

    //var car = carContainer.rect(4.8 * carScale, 1.8 * carScale).stroke(1).fill('transparent').attr({ 'stroke-width': 1 })

    carContainer.animate(animationTime).during(function (pos, morph, eased) {
        var p = path.pointAt(eased * length)
        carContainer.center(p.x, p.y);

        //distance travelled
        let distance = length * pos;
        //handling car rotation at arcs and long runways
        if (distance < oneToTwo) {
            car.rotate(360);
        } else if (distance < twoToThree) {
            car.rotate((distance - oneToTwo) / scalledTurnArc * 90);
        } else if (distance < threeToFour) {
            car.rotate(90);
        } else if (distance < fourToFive) {
            car.rotate(90 + (distance - threeToFour) / scalledTurnArc * 90);
        } else if (distance < fiveToSix) {
            car.rotate(180);
        } else if (distance < sixToSeven) {
            car.rotate(180 + (distance - fiveToSix) / scalledTurnArc * 90);
        } else if (distance < sevenToEight) {
            car.rotate(270);
        } else if (distance < eightToOne) {
            car.rotate(270 + (distance - sevenToEight) / scalledTurnArc * 90);
        }
    }).loop(true, false)
}

addCar('car.png', 13000);
addCar('orange.png', 15000);
addCar('car_red.png', 20000);
addCar('blue.png', 18000);