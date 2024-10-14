const tocBtn = document.querySelector(".tocBtn");
const tocWrapper = document.querySelector(".tocWrapper");
//折叠栏
const contentFoldedList=document.querySelectorAll(".contentFolded");
if(contentFoldedList){
    contentFoldedList.forEach(item=>{
        let foldFlag=false;
        let foldBtn = document.createElement("div");
        foldBtn.textContent = "展开";
        foldBtn.className = "foldBtn";
        item.appendChild(foldBtn);
        foldBtn.addEventListener("click",function(e){
            e.stopPropagation();
            if(foldFlag){
                item.style.height="200px";
                foldBtn.textContent="展开";
                foldFlag=false;
            }
            else{
                item.style.height=item.scrollHeight+30+"px";
                foldBtn.textContent="收起";
                foldFlag=true;
            }
            item.classList.toggle("unfolded");
            foldBtn.classList.toggle("foldBtn-unfolded");
        })
        window.addEventListener("resize",function(){
            if(foldFlag){
                item.style.height="max-content";
            }
        })
    })
}
//代码高亮初始化
hljs.highlightAll();
hljs.initLineNumbersOnLoad();
tocBtn.addEventListener("click", function () {
    tocWrapper.classList.toggle("tocWrapperActive");
})
let imgs = document.querySelector('.art-content').querySelectorAll('img');
if (imgs) {
    imgs.forEach(img => {
        let imgWrapper = document.createElement('div');
        imgWrapper.className = "imgWrapper";
        imgWrapper.innerHTML = `
        <div class="loadWrapper">
        <div class="loadLine"></div>
        <div class="loadLine"></div>
        <div class="loadLine"></div>
        <div class="loadText">
            <span>Loading</span>
            <span class="pointText">o</span>
            <span class="pointText">.</span>
            <span class="pointText">0</span>
        </div>
        </div>`;
        img.insertAdjacentElement('beforebegin', imgWrapper);
        imgWrapper.insertBefore(img, null);
    })
}
const viewH = document.documentElement.clientHeight;
const imgWrappers = document.querySelectorAll('.imgWrapper');

function loadImg(imgIndex){
    if (imgWrappers[imgIndex].getBoundingClientRect().top < viewH) {
        imgs[imgIndex].src = imgs[imgIndex].dataset.src;
        imgs[imgIndex].onload = function () {
            this.parentNode.querySelector('.loadWrapper').style = "display:none;";
        }
}}
for (let i = 0; i < imgWrappers.length; i++) {
    loadImg(i);
}
function throttleLazyload(){
    let imgIndex=0;
    let timer=null;
    return function(){
        if(!timer){
            timer=setTimeout(()=>{
                if (imgIndex >= imgWrappers.length) {
                    main.removeEventListener('scroll', throttleLazyload);
                    return;
                }
                if (imgWrappers[imgIndex].getBoundingClientRect().top < viewH) {
                    imgs[imgIndex].src = imgs[imgIndex].dataset.src;
                    imgs[imgIndex].onload = function () {
                        this.parentNode.querySelector('.loadWrapper').style = "display:none;";
                    }
                    imgIndex++;
            }
            timer=null;
            },300) 
        }
    }
}

main.addEventListener('scroll', throttleLazyload());
const pres = document.querySelectorAll('pre');
if (pres) {
    for (let i = 0; i < pres.length; i++) {
        let copyBtn = document.createElement('span');
        copyBtn.innerText = "copy";
        pres[i].appendChild(copyBtn);
        copyBtn.addEventListener("click", function () {
            let codeContent = pres[i].querySelector('code').innerText;
            try {
                let codeContainer = document.createElement('textarea');
                pres[i].appendChild(codeContainer);
                codeContainer.value = codeContent;
                codeContainer.select(); // 选中文本
                document.execCommand("copy");
                showMsg("代码已粘贴至剪贴板！");
                pres[i].removeChild(codeContainer);
            } catch (e) {
                try {
                    navigator.clipboard.writeText(codeContent);
                    showMsg("代码已粘贴至剪贴板！");
                } catch (e) {
                    showMsg("浏览器不支持，请手动复制");
                    console.error(error);
                }
            }
        }, false)
    }
}

