import Canvas from "canvas";
import * as Database from "./database.js";
import * as Matoshi from "./matoshi.js";
import * as Utilities from "./utilities.js";

const stockApiKey = "c8oe5maad3iatn99i470";

const stockHistoryLength = 24;
const stockUpdatesPerHour = 4;

export const stockNames = ["CORN", "BTC"];
export let stockData = new Map();


export function init() {
    stockNames.forEach(name => {
        stockData.set(name, []);
    })
    setInterval(() => {
        getStockInfo();
    }, 3600000 / stockUpdatesPerHour);
}

function updateStockHistory(stockName, value) {
    let hist = stockData.get(stockName);
    if (hist.length > stockHistoryLength)
        hist.shift();
    hist.push(value);
}

export function generateGraph(stockName) {
    const width = 600;
    const height = 300;
    const padding = 5;
    const graphPadding = 25;
    const axisOffetX = 50;
    const axisOffsetY = 25;
    let stockHistory = stockData.get(stockName);
    let can = Canvas.createCanvas(width, height);
    let ctx = can.getContext("2d");
    ctx.fillStyle = "#32353B";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#18C3B2";
    ctx.lineWidth = 3;

    let min = Math.min(...stockHistory);
    let max = Math.max(...stockHistory);
    console.log(stockHistory);

    //ctx.moveTo(600, 300 - stockHistory[stockHistory.length - 1]);
    for (let i = 0; i < stockHistory.length; i++) {
        let y = (stockHistory[stockHistory.length - i - 1] - min) / (max - min) * (height - graphPadding * 2) + graphPadding;
        if (min == max) y = height / 2;
        ctx.lineTo(width - i * (width / stockHistoryLength), height - y);
    }
    ctx.stroke();

    ctx.strokeStyle = "#5E5E5E";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(axisOffetX+5, 0);
    ctx.lineTo(axisOffetX+5, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height - axisOffsetY);
    ctx.lineTo(width, height - axisOffsetY);
    ctx.stroke();


    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(min, axisOffetX, height - padding);
    ctx.textBaseline = "top";
    ctx.fillText(max, axisOffetX, padding);
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(Utilities.dateString(new Date()), width - padding, height - padding);
    ctx.textAlign = "left";
    ctx.fillText(Utilities.dateString(new Date(Date.now() - stockHistoryLength / stockUpdatesPerHour * 3600000)), axisOffetX + 5, height - padding);
    return can.createPNGStream();
}

function stockPrice(stockName) {
    return stockData.get(stockName)[stockData.get(stockName).length - 1];
}


function getStockInfo() {
    for (let i = 0; i < stockNames.length; i++) {
        const stock = stockNames[i];
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${stockApiKey}`).then((res) => {
            updateStockHistory(stock, res.data.c);
            if (i == stockNames.length - 1) {
                console.log("Updated stocks.");
            }
        });
    }
}