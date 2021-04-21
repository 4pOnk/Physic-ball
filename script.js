let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.height = document.documentElement.clientHeight;
canvas.width = document.documentElement.clientWidth;

let colors = ['#d82323','#d82377','#d823d2','#9223d8','#3623d8','#238dd8','#23d8ae','#23d842','#c5d823','#d8a023']
let r = 25;
let loss_of_speed = 0.1;

let epilepsy = false;
if(epilepsy){
    colors = ['red','blue'];
}


let col_count = 0;
ctx.fillStyle = colors[col_count];
canvas.style.background = 'rgb(31 31 31)'


let x = canvas.width/2 - r/2;
let y = canvas.height/2 - r/2;

let speed = 0;
let rot = 0;

let drawBall = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI * 2);
    ctx.fill();
}
drawBall();

let cursorX;
let cursorY;
let gragChecking;
let movePositions = [];
let persMove = false;

document.addEventListener('mousedown',(e)=>{
    if(e.offsetX > x - r && e.offsetX < x + r && e.offsetY > y - r && e.offsetY < y + r){
        persMove = true;

        speed = 0;

        movePositions = [];
        cursorX = e.offsetX;
        cursorY = e.offsetY;
        movePositions.push([cursorX, cursorY]);
        document.addEventListener('mousemove',(e1)=>{
            cursorX = e1.offsetX;
            cursorY = e1.offsetY;
        })
        gragChecking = setInterval(()=>{
            movePositions.push([cursorX, cursorY]);
            x -= movePositions[movePositions.length - 2][0] - movePositions[movePositions.length - 1][0];
            y -= movePositions[movePositions.length - 2][1] - movePositions[movePositions.length - 1][1];
            drawBall();
        },1000/120);
    }
})
document.addEventListener('mouseup',()=>{
    if(persMove){
        persMove = false
        clearInterval(gragChecking);
        let tx = -(movePositions[movePositions.length - 11][0] - movePositions[movePositions.length - 1][0]);
        let ty = movePositions[movePositions.length - 11][1] - movePositions[movePositions.length - 1][1];
        let tc = Math.sqrt(tx**2 + ty**2);

        if(tx !== 0 || ty !== 0){
            speed = tc / 10;

            if(ty >= 0){
                rot = Math.acos(tx / tc);
            }else{
                rot = 2 * Math.PI -  Math.acos(tx / tc);
            }

            console.log(tx + ' ' + ty + ' ' + tc);
            console.log(speed + ' - ' + rot);
        }
    }
})


let gameEngine = () => {

    x += Math.cos(rot) * speed;
    y -= Math.sin(rot) * speed;

    if(y <= r - 5 || y >= canvas.height - r + 5 || x <= r - 5 || x >= canvas.width - r + 5){

        ctx.fillStyle = colors[++col_count % colors.length];
        if(epilepsy){
            canvas.style.background = colors[(col_count + 1) % colors.length];
        }

        if(y <= r - 5){
            rot = 2 * Math.PI - rot;
            y = r;
        }
        else if(y >= canvas.height - r + 5){
            y = canvas.height - r;
            rot = 2 * Math.PI - rot;
        }
        else if(x <= r - 5){
            x = r;
            rot = 5 * Math.PI - rot;
        }
        else if(x >= canvas.width - r + 5){
            x = canvas.width - r + 5;
            rot = 5 * Math.PI - rot;
        }
    }

    if(speed > 0){
        speed -= loss_of_speed;
    }
    if(speed < 0){
        speed = 0;
    }

    drawBall();

    requestAnimationFrame(gameEngine)
}
gameEngine();