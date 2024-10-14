/*
 * @Author: SHIWIVI
 * @Date: 2021-08-30 03:11
 * @Last Modified by: SHIWIVI
 * @Last Modified time: 2024-07-20 09:57:37
 */
const { PI, cos, sin, tan, abs, sqrt, pow, min, max, ceil, floor, round, random, atan2 } = Math;
const getRandom = (min, max) => random() * (max - min) + min;
Float32Array.prototype.get = function (i = 0, l = 0) {
    let t = i + l;
    let result = [];
    for (; i < t; i++) {
        result.push(this[i])
    }
    return result;
};
const body = document.body;
const nav = document.querySelector(".nav");
const motto = document.querySelector(".motto");
const main = document.querySelector(".main");
const msg = document.querySelector(".msg");
const msgBar = document.querySelector(".msgBar");
const msgText = document.querySelector(".msgText");
const menuBtn = document.querySelector(".menuBtn");
const addFont = document.getElementById("increaseFontSize");
const reduceFont = document.getElementById("reduceFontSize");
const fontSizeNum = document.querySelector(".fontSizeNum");
const setMenu = document.querySelector(".setMenu");
const setBtn = document.getElementById("setBtn");
const clearBack = document.getElementById("clearBack");
const disableBack = document.getElementById("disableBack");
const toggleItem = document.getElementById("toggleItem");
const itemIco = document.querySelector(".itemIco");
const menuLi = document.querySelector(".setMenu").querySelectorAll("li");
const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");
const canvasPage = document.createElement("canvas");
const ctxPage = canvasPage.getContext("2d");
const canvasBack = document.createElement("canvas");
const ctxBack = canvasBack.getContext("2d");
const mobile = navigator.userAgent.toLowerCase().match(/(phone|pad|ipod|iphone|android|mobile|MQQBrowser|JUC|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince|windows Phone)/i);
let colors = ["#f00", "#f80", "#fffb00", "#2bff00", "#0fd", "#2002ff", "#cc02ff", "#ff02bc", "#1b9cfc", "#25ccf7", "#fff"];//数组最后一个颜色#fff用于夜间模式
let pageWidth, pageHeight;
let pointerAni = [];
let sparkArray = [];
let animationID = 0;
let webTheme;
class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.dx = getRandom(-6, 6);
        this.dy = 1;
        this.r = r;
    }
    update() {
        if (this.r <= 5) {
            pointerAni.shift();
            return;
        }
        let xLeft = this.x + this.dx - this.r;
        let xRight = this.x + this.dx + this.r;
        let yBottom = this.y + this.dx + this.r;
        if (yBottom > pageHeight - 10) {
            this.dy = -this.dy;
            this.dy *= .7;
            this.dx *= 1;
            this.r -= 5;
            this.y += this.dy - 10;
            sparkArray.push(new Spark(this.x, this.y, 4, 4, 5, 50, true));
        }
        else {
            this.dy += 0.5;
            this.y += this.dy;
        }
        if (xLeft < 0 || xRight > pageWidth) {
            this.dx = -this.dx;
        }
        this.y += this.dy;
        this.x += this.dx;
        this.draw();
    }
    draw() {
        ctxPage.save();
        ctxPage.beginPath();
        ctxPage.arc(this.x, this.y, this.r + 30, 0, Math.PI * 2);
        const gradient = ctxPage.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        gradient.addColorStop(0, "#ffffffda");
        gradient.addColorStop(0.3, "#ffffffda");
        gradient.addColorStop(0.4, "#ffffff40");
        gradient.addColorStop(1, "#fff0");
        ctxPage.fillStyle = gradient;
        ctxPage.fill();
        ctxPage.closePath();
        ctxPage.restore();
    }
}
class Spark {
    constructor(x, y, width = 5, height = 5, sugarNum = 9, live = 140, spark = false) {
        this.x = x,
            this.y = y,
            this.height = height,
            this.width = width,
            this.sugarNum = sugarNum,
            this.live = live,
            this.data = new Float32Array(6 * sugarNum); //存储的参数有x,y,dx,dy,yBottom,colorIndex
        spark ? this.setSpark() : this.setSugar();
    }
    setSpark() {
        for (let i = 0; i < this.sugarNum; i++) {
            let dy = Math.random() * (-10) - 2;
            this.data.set([this.x, this.y, Math.random() * 9 - 3, dy, this.y + dy + this.height, colors.length - 1], i * 6)
        }
    }
    setSugar() {
        for (let i = 0; i < this.sugarNum; i++) {
            let dy = Math.random() * 10 - 5;
            this.data.set([this.x, this.y, Math.random() * 6 - 3, dy, this.y + dy + this.height, i > colors.length - 1 ? Math.round(Math.random() * colors.length - 2) : i], i * 6)
        }
    }
    update() {
        if (this.live < 0) {
            sparkArray.shift();
            return;
        }
        for (let i = 0; i < this.sugarNum; i++) {
            let [x, y, dx, dy, yBottom, colorIndex] = this.data.get(6 * i, 6);
            if (yBottom >= pageHeight) {
                dy = -dy;
                dy *= 0.5;
                y += dy - 10;
            }
            else {
                dy += .5;
                y += dy;
            }
            x += dx;
            yBottom = y + this.height;
            this.data.set([x, y, dx, dy, yBottom], i * 6)
            this.draw(x, y, colors[colorIndex]);
        }
        this.live--;
    }
    draw(x, y, color) {
        ctxPage.beginPath();
        ctxPage.fillStyle = color;
        ctxPage.fillRect(x, y, this.width, this.height);
        ctxPage.closePath();
    }
}

/*
* 提示栏
*/
let msgReady = true;
function showMsg(text) {
    msgText.innerText = text;
    if (msgReady) {
        msgReady = false;
        msg.classList.add("msgShow");
        msgBar.classList.add("msgbarActive");
        setTimeout(() => {
            msgBar.classList.remove("msgbarActive");
            msg.classList.remove("msgShow");
            msgReady = true;
        }, 4000)
    }
}
function canvasInit() {
    pageWidth = canvasPage.width = window.innerWidth;
    pageHeight = canvasPage.height = window.innerHeight;//pageCanvas用于全屏点击特效
    canvasBack.width = window.innerWidth;
    canvasBack.height = window.innerHeight;//backCanvas用于背景渲染
    canvasPage.style = "position:fixed;top:0;left:0;z-index:200;pointer-events:none;";
    canvasBack.style = "position:absolute;top:0;left:0;z-index:-1;pointer-events:none;";
    document.body.append(canvasPage);
    document.querySelector(".canvasWrapper").append(canvasBack);
}
function canvasResize() {
    pageWidth = canvasBack.width = canvasPage.width = window.innerWidth;
    pageHeight = canvasBack.height = canvasPage.height = window.innerHeight;
}
function throttle(func,time){
    let timer;
    return function(){
        clearTimeout(timer);
        timer=setTimeout(()=>{
            func();
        },time)
    }
}

window.addEventListener("resize", throttle(canvasResize,500));
window.addEventListener("click", e => {
    webTheme == "dark" ? pointerAni.push(new Ball(e.clientX, e.clientY, 20)) : sparkArray.push(new Spark(e.clientX, e.clientY, 5, 5, 10, 140, false))
})
function canvasAnimation() {
    ctxPage.clearRect(0, 0, pageWidth, pageHeight);
    pointerAni.forEach(p => p.update());
    sparkArray.forEach(s => s.update());
    window.requestAnimationFrame(canvasAnimation);
}
canvasAnimation();
/*
*   下雪
*/
let snowTimer = 0;
let snowfall = mobile ? 1 : 10;
function snowing() {
    let maxheight = motto.clientHeight;

    snowTimer = setInterval(() => {
        let snowDom = document.createElement("div");
        let size = floor(random() * 8);
        let dx = random() * 10;
        let x = random() * motto.clientWidth;
        let y = 0;
        if (size > 5) {
            snowDom.style.boxShadow = "0 0 3px #fff,0 0 6px #fff";
        }
        snowDom.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:#fff;border-radius:50%;left:${x}px;top:0;`
        motto.appendChild(snowDom);
        let fallTimer = setInterval(() => {
            x += dx;
            y += 5;
            snowDom.style.left = x + "px";
            snowDom.style.top = y + 5 + "px";
            if (y >= maxheight) {
                clearInterval(fallTimer);
                motto.removeChild(snowDom);
            }
        }, 80)
    }, snowfall);
    console.log("snowing\n%c我不冷\n%c是我太热了", "text-shadow:0 0 3px #ff00c8;color:#ff00c8;", "text-shadow:0 0 3px #008cff;color:#008cff;");
}

if (window.localStorage.getItem("webTheme") === "light" && random() > .9) {
    //调整下雪几率
    snowing();
}

//屏幕小于800自动收起侧边栏
window.addEventListener("resize", () => {
    if (window.innerWidth < 800) {
        menuBtn.classList.remove("closed");
        nav.classList.add("left-move");
    }
    else {
        menuBtn.classList.add("closed");
        nav.classList.remove("left-move");
    }
})

//修改字体大小
let initFont = 16;
fontSizeNum.innerText = initFont + "px";
addFont.addEventListener("click", () => {
    initFont > 20 ? 20 : initFont++;
    (document.querySelector(".art-content") || main).style = "font-size:" + initFont + "px";
    fontSizeNum.innerText = initFont + "px";
});
reduceFont.addEventListener("click", () => {
    initFont < 14 ? 14 : initFont--;
    (document.querySelector(".art-content") || main).style = "font-size:" + initFont + "px";
    fontSizeNum.innerText = initFont + "px";
})

//切换夜间主题
function toggleItemfn() {
    if (webTheme === "light") {
        body.classList.remove("loadLight");
        nav.classList.remove("loadLight");
        body.classList.add("dark", "loadDark");
        nav.classList.add("dark", "loadDark");
        itemIco.className = "itemIco moon";
        clearInterval(snowTimer);
        for (let i = 0; i < 6; i++) {
            pointerAni.push(new Ball(pageWidth / 6 * i, 0, 20));
        }
        window.localStorage.setItem("webTheme", "dark");
    }
    else {
        body.classList.remove("dark", "loadDark");
        nav.classList.remove("dark", "loadDark");
        body.classList.add("loadLight");
        nav.classList.add("loadLight");
        itemIco.className = "itemIco sun";
        window.localStorage.setItem("webTheme", "light");
        for (let i = 0; i < 6; i++) {
            sparkArray.push(new Spark(pageWidth / 6 * i, 0, 5, 5, 10, 140, false));
        }
    }
    webTheme = window.localStorage.getItem("webTheme");
}
toggleItem.addEventListener("click", toggleItemfn);


//设置菜单
setBtn.addEventListener("click", function () {
    this.classList.toggle("setBtnActive");
    menuLi.forEach((item) => {
        item.classList.toggle("menuActive");
    });
    setTimeout(() => {
        if (this.innerText === "<") {
            this.innerText = ">>"
        }
        else {
            this.innerText = "<";
        }
    }, 500);
    searchInput.value = "";
    searchResult.innerHTML = "";
})
clearBack.addEventListener("click", () => {
    if (animationID) {
        window.cancelAnimationFrame(animationID);
        ctxBack.clearRect(0, 0, pageWidth, pageHeight);
        showMsg("已移除背景动画!");
        animationID = 0;
    }
    else {
        showMsg("未启用动画，无需清除");
    }
})
disableBack.addEventListener("click", () => {
    if (window.localStorage.getItem("disableBack") === "false") {
        window.cancelAnimationFrame(animationID);
        ctxBack.clearRect(0, 0, pageWidth, pageHeight);
        disableBack.textContent = "启用背景";
        showMsg("已在全局禁用动态夜间背景");
        window.localStorage.setItem("disableBack", "true");
    }
    else {
        if (window.localStorage.getItem("webTheme") == "dark") {
            try {
                backAni();
            } catch (e) { };
        }
        disableBack.textContent = "禁用背景";
        showMsg("已启用夜间背景");
        window.localStorage.setItem("disableBack", "false");
    }
})

//页面初始化
function pageInit() {
    if (!window.localStorage.getItem("webTheme")) {
        if (new Date().getHours() >= 21 || new Date().getHours() < 7) {
            window.localStorage.setItem("webTheme", "dark");
            showMsg("检测到当前系统时间为夜间，已自动开启夜间主题，可在右侧设置栏切换主题");
        }
        else {
            window.localStorage.setItem("webTheme", "light");
        }
    }
    if (!window.localStorage.getItem("disableBack")) {
        window.localStorage.setItem("disableBack", "false");
    }
    if (window.localStorage.getItem("disableBack") === "true") {
        disableBack.textContent = "启用背景";
    }
    //其他页面继承主页的主题
    webTheme = window.localStorage.getItem("webTheme");
    if (webTheme == "dark") {
        body.classList.add("dark");
        nav.classList.add("dark");
        itemIco.className = "itemIco moon";
    }
}

canvasInit();
pageInit();

//JQuery代码，主打的就是一个混用
$(function () {
    $(".backTop").fadeOut();
    //点击关闭菜单栏
    $(".menuBtn").click(function () {
        if ($(".menuBtn").hasClass("closed")) {
            $(".menuBtn").removeClass("closed");
            $(".nav").addClass("left-move");
        }
        else {
            $(".menuBtn").addClass("closed");
            $(".nav").removeClass("left-move");
        }
    });
    //移动端自动关闭菜单栏
    if (($(document).innerWidth()) < 420) {
        if (!($(".nav").hasClass("left-move"))) {
            $(".nav").addClass("left-move");
            $(".menuBtn").removeClass("closed");
        }
    }
    //滚动事件
    $(".main").scroll(function () {
        //滚动大于400，出现返回顶部和哈士奇 
        if ($(this).scrollTop() > 400) {
            $(".backTop").fadeIn();
            $(".husky").animate({ "right": "0px" }, 200);
        }
        if ($(".main").scrollTop() == 0) {//回到顶部，按钮消失
            $(".backTop").fadeOut();
            if ($(".husky").css("right") == "0px") {
                $(".husky").animate({ "right": "100px" }, 500, function () {
                    $(this).css("right", "-100px");
                });
            }
        }
        $(".husky").click(function () {//点一下哈士奇，哈士奇消失
            $(".husky").fadeOut();
        });
    });
    $(".backTop").click(function () {//返回顶部
        $(".main").animate({ "scrollTop": 0 }, 1000)
    });
    $(document).ready(function () {
        //搜索功能
        $.ajax({
            url: "/blog/search.json",
            dataType: "json",
            success: function (xmlResponse) {
                var datas = xmlResponse;
                if (!searchInput) return;
                if ($("#searchInput").length > 0) {
                    searchInput.addEventListener("input", function () {
                        var resultNum = 0;
                        var str = "<ul class=\"searchResultList\">";
                        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                        searchResult.innerHTML = "";
                        if (this.value.trim().length <= 0) {
                            return;
                        }
                        datas.forEach(function (data) {
                            var isMatch = true;
                            if (!data.title || data.title.trim() === "") {
                                data.title = "Untitled";
                            }
                            var data_title = data.title.trim().toLowerCase();
                            var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                            var data_url = data.url;
                            var index_title = -1;
                            var index_content = -1;
                            var first_occur = -1;
                            if (data_content !== "") {
                                keywords.forEach(function (keyword, i) {
                                    index_title = data_title.indexOf(keyword);
                                    index_content = data_content.indexOf(keyword);

                                    if (index_title < 0 && index_content < 0) {
                                        isMatch = false;
                                    } else {
                                        if (index_content < 0) {
                                            index_content = 0;
                                        }
                                        if (i == 0) {
                                            first_occur = index_content;
                                        }
                                    }
                                });
                            } else {
                                isMatch = false;
                            }
                            if (isMatch) {
                                str += "<li><a href='" + data_url + "' class='search-result-title'>" + "<div class='searchResultTitle'>" + data_title + "</div>";
                                var content = data.content.trim().replace(/<[^>]+>/g, "");
                                if (first_occur >= 0) {
                                    var start = first_occur - 20;
                                    var end = first_occur + 80;
                                    if (start < 0) {
                                        start = 0;
                                    }
                                    if (start == 0) {
                                        end = 100;
                                    }
                                    if (end > content.length) {
                                        end = content.length;
                                    }
                                    var match_content = content.substring(start, end);
                                    keywords.forEach(function (keyword) {
                                        try {
                                            var regS = new RegExp(keyword, "gi");
                                        } catch (error) { }
                                        match_content = match_content.replace(regS, "<span class=\"search-keyword\">" + keyword + "</span>");
                                    });
                                    str += "<p class=\"search-result\">" + match_content + "...</p></a>"
                                }
                                str += "</li>";
                                resultNum++;
                            }
                        });
                        if (resultNum == 0) {
                            str += "<div class='noResult'>\"坏了！什么都没有 (─.─||)\"</div>";
                        }
                        str = '<div class=\"resultInfo\">一共找到<span class="resultNum">' + resultNum + '</span>条数据</div>' + str + "</ul>";
                        searchResult.innerHTML = str;
                    });
                }
            },
            error: function (jqxhr, textStatus, error) {
                searchInput.disabled = true;
                searchInput.classList.add("forbidden");
                document.querySelector(".searchContainer").addEventListener("click", function () {
                    showMsg("出了亿点小问题，搜索功能已被禁用");
                })
                console.error("Ajax未能获取search.json文件");
                showMsg("Ajax抛出了一个异常: " + jqxhr.status + error);
            }
        });
    })
});