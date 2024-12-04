/*
 * @Author: SHIWIVI 
 * @Date: 2023-09-07 00:29:00 
 * @Last Modified by: SHIWIVI
 * @Last Modified time: 2024-11-28 22:50:58
 */
//线性插值
const lerp = (a, b, amt) => (1 - amt) * a + amt * b;
Array.prototype.lerp = function (t = [], a = 0) {
  this.forEach((n, i) => (this[i] = lerp(n, t[i], a)));
};
//用于存储canvas数据
class PropsArray {
  constructor(count = 0, props = []) {
    this.count = count;
    this.props = props;
    this.values = new Float32Array(count * props.length);
  }
  get length() {
    return this.values.length;
  }
  set(a = [], i = 0) {
    this.values.set(a, i);
  }
  get(i = 0) {
    return this.values.get(i, this.props.length);
  }
}
const angle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
const fadeInOut = (t, m) => {
  let hm = 0.5 * m;
  return Math.abs((t + hm) % m - hm) / hm;
};
//背景色渐变
let baseColor = random() * 360;
let backAni = random() < .9 ? backRenderAnimation1 : backRenderAnimation2;
//图片懒加载
const viewH = document.documentElement.clientHeight;
if (document.querySelector(".update")) {
  let pics = document.querySelectorAll(".update-pic");
  function loadPic(picIndex){
    let img = pics[picIndex].querySelector("img");
          img.src = img.dataset.src;
          img.onload = function () {
            setTimeout(() => {
              this.parentNode.previousElementSibling.style = "display:none;";
              this.parentNode.style = "visibility:visible;";
            }, 1000)
          }
  }
  function lazyloadThrottle(){
    let picIndex=2;
    let standby=true;
    return function(){
      if(standby){
        standby=false;
        if (picIndex >= pics.length) {
          main.removeEventListener("scroll", lazyloadThrottle);
          return;
        }
        if (pics[picIndex].getBoundingClientRect().top < viewH) {
          loadPic(picIndex);
          picIndex++;
        }
        setTimeout(()=>standby=true,100)
      }
    }
  }
  for(let i=0;i<2;i++){
    loadPic(i);
  }
  main.addEventListener("scroll", lazyloadThrottle());
  //文章聚焦
  let lis = document.querySelector(".update").querySelectorAll("li");
  function articleFocus() {
    let standby = true;
    return function () {
      if (standby) {
        standby = false;
        lis.forEach(item => {
          let rect = item.getBoundingClientRect();
          if (rect.top < 350 && rect.top > 80) {
            item.classList.add("focus")
          }
          else {
            item.classList.remove("focus")
          }
        });
        setTimeout(() => standby = true, 300);//节流
      }
    }
  }

  main.addEventListener("scroll", articleFocus());
  //鼠标经过时，将焦点转换到目标身上
  lis.forEach(item => {
    item.onmouseover = function () {
      lis.forEach(allItem => {
        allItem.classList.remove("focus");
      })
      item.classList.add("focus");
    }
    item.onmouseout = function () {
      item.classList.remove("focus");
    }
  });
}
console.log([
  "    ┬┬  ┌┬┐┬  ┌─┐┬ ┬┬┬ ┬┬",
  "    ││   │││  └─┐├─┤│││││",
  "    ┴┴  ─┴┘┴  └─┘┴ ┴┴└┴┘┴",
  "shiwivi.com"
].join("\n"));
//网站运行时间
if (document.getElementById("day")) {
  let timeGap = floor((new Date().getTime() - new Date("2021/4/10 12:19:14")) / 1000);
  const dayWrapper = document.getElementById("day");
  const hourWrapper = document.getElementById("hour");
  const minuteWrapper = document.getElementById("minute");
  const second = document.getElementById("second");
  setInterval(() => {
    let seconds = timeGap % 60;
    dayWrapper.textContent = floor(timeGap / 86400);
    hourWrapper.textContent = floor(timeGap / 3600 % 24);
    minuteWrapper.textContent = floor(timeGap / 60 % 60);
    second.textContent = seconds > 9 ? seconds : "0" + seconds;
    timeGap += 1;
  }, 1000)
}
//canvas渲染
function backRenderAnimation1() {
  let center = [pageWidth / 2, pageHeight / 2];
  let tick;
  let simplex;
  let tentacle;
  let tentacles;
  const canvasRender = document.createElement("canvas");//渲染用canvas
  const ctxRender = canvasRender.getContext("2d");
  canvasRender.width = pageWidth;
  canvasRender.height = pageHeight;
  const tentacleSetting_mobile = {
    tentacleCount: 20,
    segmentCountMin: 8,
    segmentCountMax: 15,
    segmentLengthMin: 20,
    segmentLengthMax: 30,
    colonyRadius: 100,
  }
  const tentacleSetting_PC = {
    tentacleCount: 30,
    segmentCountMin: 10,
    segmentCountMax: 20,
    segmentLengthMin: 20,
    segmentLengthMax: 40,
    colonyRadius: 200,
  }
  const tentacleSetting = mobile ? tentacleSetting_mobile : tentacleSetting_PC;
  class Tentacle {
    constructor(x, y, segmentNum, baseLength, baseDirection) {
      this.base = [x, y];
      this.position = [x, y];
      this.target = [x, y];
      this.segmentNum = segmentNum;
      this.baseLength = baseLength;
      this.baseDirection = baseDirection;
      this.segmentProps = ["x1", "y1", "x2", "y2", "l", "d", "h"];
      this.segments = new PropsArray(segmentNum, this.segmentProps);
      this.follow = false;
      let i = this.segments.length - this.segmentProps.length;
      let x1, y1, x2, y2, l, d, h;

      l = this.baseLength;
      d = this.baseDirection;

      for (; i >= 0; i -= this.segmentProps.length) {
        x1 = x2 || this.position[0];
        y1 = y2 || this.position[1];
        x2 = x1 - l * cos(d);
        y2 = y1 - l * sin(d);
        d += 0.3;
        l *= 0.98;
        h = baseColor + i / this.segments.length * 180;
        this.segments.set([x1, y1, x2, y2, l, d, h], i);
      }
    }
    setCtx(ctx) {
      this.ctx = ctx;
    }
    setTarget(target) {
      this.target = target;
    }
    //未下达click指令时的数据更新
    updateBase() {
      let t = simplex.noise3D(this.base[0] * .005, this.base[1] * 0.005, tick * .005) * 2 * PI;
      this.base.lerp([
        this.base[0] + 20 * cos(t),
        this.base[1] + 20 * sin(t)],
        .025);
    }
    //更新数据
    async update() {
      let target = this.position;
      let i = this.segments.length - this.segmentProps.length;
      let promises = [];

      this.position.lerp(this.target, .015);
      !this.follow && this.updateBase();

      for (; i >= 0; i -= this.segmentProps.length) {
        promises.push(
          new Promise(resolve => {
            let [x1, y1, x2, y2, l, d, h] = this.segments.get(i);
            let t, n, tn;

            x1 = target[0];
            y1 = target[1];
            t = angle(x1, y1, x2, y2);

            n = simplex.noise3D(
              x1 * 0.005,
              y1 * 0.005,
              (i + tick) * 0.005);

            tn = t + n * PI * 0.0125;
            x2 = x1 + l * cos(tn);
            y2 = y1 + l * sin(tn);
            d = t;

            target = [x2, y2];

            this.segments.set([x1, y1, x2, y2, l, d], i);
            this.drawSegment(x1, y1, x2, y2, h, n, i);
            resolve();
          }));
      }
      await Promise.all(promises);
    }
    //绘制
    drawSegment(x1, y1, x2, y2, h, n, i) {
      const fn = fadeInOut(1 + n, 2);
      const fa = fadeInOut(i, this.segments.length);
      const a = 0.25 * (fn + fa);
      ctxRender.beginPath();
      ctxRender.strokeStyle = `hsla(${h}, 50%, 50%, ${a})`;
      ctxRender.moveTo(x2, y2);
      ctxRender.lineTo(x1, y1);
      ctxRender.stroke();
      ctxRender.closePath();
      ctxRender.beginPath();
      ctxRender.strokeStyle = `hsla(${h}, 50%, 50%, ${a + 0.5})`;
      ctxRender.arc(x1, y1, fn * 3, 0, 2 * PI);
      ctxRender.stroke();
      ctxRender.closePath();
    }
  }

  function setup() {
    tick = 0;
    simplex = new SimplexNoise();
    tentacles = [];
    let i, t;
    for (i = 0; i < tentacleSetting.tentacleCount; i++) {
      t = i / tentacleSetting.tentacleCount * 2 * PI;

      tentacle = new Tentacle(
        center[0] + tentacleSetting.colonyRadius * cos(random() * 2 * PI),
        center[1] + tentacleSetting.colonyRadius * sin(random() * 2 * PI),
        round(getRandom(tentacleSetting.segmentCountMin, tentacleSetting.segmentCountMax)),
        round(getRandom(tentacleSetting.segmentLengthMin, tentacleSetting.segmentLengthMax)),
        t);
      tentacles.push(tentacle);
    }
  }
  async function loop() {
    tick++;
    ctxRender.clearRect(0, 0, pageWidth, pageHeight);
    ctxBack.fillStyle = "rgba(0,0,10,0.5)";
    ctxBack.fillRect(0, 0, pageWidth, pageHeight);
    await Promise.all(tentacles.map(tentacle => tentacle.update()));
    ctxBack.save();
    ctxBack.filter = "blur(8px) brightness(200%)";
    ctxBack.globalCompositeOperation = "lighter";
    ctxBack.drawImage(canvasRender, 0, 0);
    ctxBack.restore();
    ctxBack.save();
    ctxBack.filter = "blur(4px) brightness(200%)";
    ctxBack.globalCompositeOperation = "lighter";
    ctxBack.drawImage(canvasRender, 0, 0);
    ctxBack.restore();
    ctxBack.save();
    ctxBack.globalCompositeOperation = "lighter";
    ctxBack.drawImage(canvasRender, 0, 0);
    ctxBack.restore();
    animationID = window.requestAnimationFrame(loop);
  }
  setup();
  loop();

  let tentacleTimer = 0;
  function tentacleMove(e) {
    let r = random() * 100;
    tentacles.forEach((tentacle, i) => {
      const t = i / tentacles.length * PI * 2;
      tentacle.setTarget([e.clientX + r * cos(t + tick * 0.05), e.clientY + r * sin(t + tick * 0.05)]);
      tentacle.follow = true;
    });
    clearInterval(tentacleTimer);
    tentacleTimer = setTimeout(() => {
      tentacles.forEach(tentacle => {
        tentacle.base = [
          tentacle.position[0] + tentacleSetting.colonyRadius * cos(random() * PI * 2),
          tentacle.position[1] + tentacleSetting.colonyRadius * sin(random() * PI * 2)];

        tentacle.setTarget(tentacle.base);
        tentacle.follow = false;
      });
    }, 3000)
  }
  function resizeCanvasRender() {
    canvasRender.width = pageWidth;
    canvasRender.height = pageHeight;
  }

  window.addEventListener("resize", throttle(resizeCanvasRender,500));
  setTimeout(() => {
    window.addEventListener("click", tentacleMove)
  }, 3000)
}

function backRenderAnimation2() {
  let x = 0, t = 0, b, _x, _y, _t = 1 / 100, u = 0, _u = u / 20;
  let xing = 0;
  function flower() {
    x = 0;
    _u = u / 20;
    ctxBack.clearRect(0, 0, pageWidth, pageHeight);
    ctxBack.fillStyle = "#000";
    ctxBack.fillRect(0, 0, pageWidth, pageHeight);
    ctxBack.beginPath();
    for (let j = 100; j > 0; j--) {
      x += 3 * Math.sin(4);
      y = x * .5;
      _x = x * Math.cos(b) + y * Math.sin(b);
      _y = x * Math.sin(b) - y * Math.cos(b);
      b = (j * (xing += .00002)) * Math.PI / 9;
      ctxBack.lineTo(pageWidth / 2 - _x, pageHeight / 2 - _y);
    }
    var g = ctxBack.createLinearGradient(pageWidth / 2 + _x, pageHeight / 2 + _y, 0, pageWidth / 2 + _x);
    g.addColorStop(0, "hsla(" + u + ",85%,50%,1)");
    g.addColorStop(0.5, "hsla(" + _u + ",85%,40%,1)");
    g.addColorStop(1, "hsla(0,0%,5%,1)");
    ctxBack.strokeStyle = g;
    ctxBack.stroke();
    t += _t;
    u -= .8;
    animationID = window.requestAnimationFrame(flower);
  }
  flower();
}
toggleItem.addEventListener("click", () => {
  if (webTheme === "dark" && window.localStorage.getItem("disableBack") === "false") {
    backAni();
  }
  else {
    ctxBack.clearRect(0, 0, pageWidth, pageHeight);
    window.cancelAnimationFrame(animationID);
  }
});

function homePageInit() {
  if (webTheme === "dark" && window.localStorage.getItem("disableBack") === "false") {
    backAni();
  }
}
window.addEventListener("load", homePageInit);