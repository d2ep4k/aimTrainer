let height = window.innerHeight;
    let width = window.innerWidth;
    // console.log(height, width);
    let mainDiv = document.querySelector("#mainDiv");
    let bestScore = document.querySelector('#bestScore');
    let xOffset = 1;
    while(xOffset<width){
        xOffset *= 10;
    }
    let yOffset = 1;
    while(yOffset<height){
        yOffset *= 10;
    }
    let isPlaying = false;
    let timeoutRef;
    let score = 0;
    let maxScore = -1e9;
    let targetsHit = 0;
    let timeTaken = 0;
    let result = document.querySelector("#result");
    let content = document.querySelector('#content');
    let gameWindow = 30 * 1000;
    let targetSizeElement = document.querySelector('#targetSize');
    let windowPeriod = document.querySelector('#windowPeriod');
    let targetSize = 50;

    targetSizeElement.childNodes.forEach((childNode)=>{
        if(childNode.nodeName !== "#text"){         
            if(childNode.id === 'medium'){
                oppress(childNode);
            }
            else{
                supress(childNode);
            }
        }
    })
    windowPeriod.childNodes.forEach((childNode)=>{
        if(childNode.nodeName !== "#text"){         
            if(childNode.id === '30'){
                oppress(childNode);
            }
            else{
                supress(childNode);
            }
        }
    })

    windowPeriod.addEventListener('click', (event) => {
        windowPeriod.childNodes.forEach((childNode)=>{
            if(childNode.nodeName !== "#text")
                supress(childNode);
        })
        oppress(event.target);
        gameWindow = parseInt(event.target.id)*1000;
    });

    targetSizeElement.addEventListener('click', (event) => {
        targetSizeElement.childNodes.forEach((childNode)=>{
            if(childNode.nodeName !== "#text")
                supress(childNode);
        })
        oppress(event.target);
        if(event.target.id === 'small'){
            targetSize = 35;
        }
        if(event.target.id === 'medium'){
            targetSize = 50;
        }
        if(event.target.id === 'large'){
            targetSize = 70;
        }
    });

    function oppress(element){
        element.style.color = "white";
    }

    function supress(element){
        element.style.color = "grey";
    }
    window.addEventListener('keydown', (event) => {
        if(isPlaying && event.key === 'Escape'){
            endGame();
        }
    });


    playBtn.addEventListener('click', (event) => {
        if(!isPlaying){
            play();
        }
    });
    let timeBefore, timeAfter;

    function play(){
        if(isPlaying) return;
        score = 0;
        isPlaying = true;
        targetsHit = 0;
        timeTaken = 0;
        setTimeout(() => {
            endGame();
        }, gameWindow);
        content.setAttribute("hidden", "");
        generateTarget();
    };

    function generateTarget() {        
        let target = createTarget();
        timeBefore = new Date().getTime();
        timeoutRef = setTimeout(() => {
            mainDiv.removeChild(target);
            generateTarget();
        }, 2000);        
    };

    function updateScore(){
        result.innerHTML = `You scored ${score} with average reaction time of ${parseInt(timeTaken/targetsHit)}ms and hit ${targetsHit} targets`;
        if(maxScore < score){
            bestScore.innerHTML = `${score}(@${parseInt(timeTaken/targetsHit)}ms)`;
            maxScore = score;
        }
    }

    function endGame(){        
        timeAfter = new Date().getTime();
        clearTimeout(timeoutRef); 
        timeTaken += timeAfter-timeBefore;
        mainDiv.removeChild(document.querySelector("#target"));
        isPlaying = false;                 
        content.removeAttribute("hidden");
        updateScore();
    }

    mainDiv.addEventListener('click', (event) => {
        if(event.target.id === "target"){
            timeAfter = new Date().getTime();
            clearTimeout(timeoutRef); 
            timeTaken += timeAfter-timeBefore;
            score += (2000-(timeAfter-timeBefore));
            targetsHit++;
            mainDiv.removeChild(event.target);                  
            generateTarget();  
        }
        else if(isPlaying)
            score -= 50;    
    });

    
    function createTarget(){        
        randX = parseInt((Math.random()*xOffset))%(width-targetSize);
        randY = parseInt((Math.random()*yOffset))%(height-targetSize);
        // console.log(randY, randX); 
        target = document.createElement("div");
        target.setAttribute('id', 'target');
        target.style.height = `${targetSize}px`;
        target.style.width = `${targetSize}px`;
        target.style.borderRadius = `${parseInt(targetSize/2)}px`;
        // target.style.backgroundColor = "white";
        target.style.borderWidth = "3px";
        target.style.borderColor = "white";
        target.style.borderStyle = "solid";
        target.style.position = "absolute";
        target.style.top = `${randY}px`;
        target.style.left = `${randX}px`;
        mainDiv.appendChild(target);
        return target;
    }