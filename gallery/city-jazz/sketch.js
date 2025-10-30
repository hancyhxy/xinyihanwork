let canvasSize = 600;
let brailleArea = canvasSize * 0.8;
let textArea = canvasSize * 0.2;
let lastColorUpdate = 0;
let colorUpdateInterval = 1000;
let brailleMap = {
  'S': [[1,0],[0,1],[1,1]],
  'Y': [[1,1],[0,1],[1,0]],
  'D': [[1,0],[0,1],[0,1]],
  'N': [[1,1],[0,1],[0,1]],
  'E': [[1,0],[0,0],[1,1]]
};
// 设置蒙德里安颜色
let mondrianColors = ['#FF0000', '#0000FF', '#FFFF00', '#FFFFFF', '#000000'];
let currentColors = [];
let word = 'SYDNEY';


function setup() {
  createCanvas(canvasSize, canvasSize);
  background(255);
  
  initializeColors();
}

function draw() {
  background(230);
  
  if (millis() - lastColorUpdate > colorUpdateInterval) {
    updateColors();
    lastColorUpdate = millis();
  }
  
  drawBrailleWord();
  drawBottomText();
}

function initializeColors() {
  currentColors = [];
  for (let i = 0; i < word.length; i++) {
    let charColors = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        charColors.push(getRandomMondrianColor());
      }
    }
    currentColors.push(charColors);
  }
}

function updateColors() {
  for (let i = 0; i < currentColors.length; i++) {
    for (let j = 0; j < currentColors[i].length; j++) {
      currentColors[i][j] = getRandomMondrianColor();
    }
  }
}

function getRandomMondrianColor() {
  return random(mondrianColors);
}

function getBraillePattern(char) {
  return brailleMap[char] || [[0,0],[0,0],[0,0]];
}

function drawBrailleWord() {
  let charSpacing = canvasSize / 7;
  let startX = charSpacing;
  let centerY = brailleArea / 2;
  let dotSize = charSpacing / 8;
  let dotSpacing = charSpacing / 4;
  
  for (let i = 0; i < word.length; i++) {
    let char = word[i];
    let pattern = getBraillePattern(char);
    let charX = startX + (i * charSpacing);
    
    let colorIndex = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        let dotX = charX + (col * dotSpacing);
        let dotY = centerY - dotSpacing + (row * dotSpacing);
        let filled = pattern[row][col];
        let color = currentColors[i][colorIndex];
        
        drawBrailleDot(dotX, dotY, filled, color, dotSize);
        colorIndex++;
      }
    }
  }
}

function drawBrailleDot(x, y, filled, color, size) {
  if (filled === 1) {
    // 添加跳动效果
    let pulseFactor = 1 + sin(millis() * 0.01 + x * 0.1) * 0.3;
    let dynamicSize = size * pulseFactor;
    
    fill(color);
    noStroke();
    circle(x, y, dynamicSize);
  } else {
    fill(255);
    stroke(200);
    strokeWeight(1);
    circle(x, y, size);
  }
}
// 添加文字描述
function drawBottomText() {
  let textY = brailleArea + (textArea / 2);
  let fontSize = canvasSize / 15;
  
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  textStyle(BOLD);
  text('SYDNEY', canvasSize / 2, textY);
  
  let description = 'A digital artwork that transforms Sydney into rhythmic jazz through braille patterns and Mondrian colors, creating visual harmony like musical beats.';
  let maxTextWidth = canvasSize * 0.8; 
  let textBoxHeight = 80; 
  
  fill(60);
  textAlign(CENTER);
  textSize(fontSize/3);
  textStyle(ITALIC);
  
  text(description, 
       canvasSize * 0.1,      
       textY - 100,         
       maxTextWidth,          
       textBoxHeight);     
}