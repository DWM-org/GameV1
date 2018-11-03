let position_x = 200;
let position_y=200;//Starting position
let x_velocity = 0;
let y_velocity = 0;
const numberOfBlocks = 30;
grav=0.5;
let onGround=false;
let rightCollision = false;
let leftCollision = false;
let topCollision = false;
holdLeft=holdRight=false;
platform=[];
window.onload= function() {//the first function that will be executed when the program loads.
    canv=document.getElementById("gc");
    ctx=canv.getContext("2d");
    setInterval(update,1000/30);//refresh rate of the canvas, calls the update function at that interval of time
    document.addEventListener("keydown",keyDown); //checks to see if down key is pressed
    document.addEventListener("keyup",keyUp);//checks to see if up key is pressed

    for(let i=0; i<numberOfBlocks; i++) {
        platform.push( //adds platforms into the platform object upto 50 in this case with random widths and height based off the canvas's width, height.
            {
                x:Math.random()*canv.width,
                y:Math.random()*canv.height,
                w:Math.random()*100+30,
                h:Math.random()*30+20
            }
        );
    }
};
function update() {
    if(holdLeft) {
        x_velocity = -2; //moves the character left
    }
    if(holdRight) {
        x_velocity = 2;
    }
    if(onGround) {
        x_velocity *= 0.8;
    } else {
        y_velocity += grav;
    }
    position_x+=x_velocity;
    position_y+=y_velocity;

    onGround=false;
    rightCollision = false;
    leftCollision = false;
    topCollision = false;
    for(i=0;i<numberOfBlocks;i++) {

        let charBound1 = position_y;
        let charBound2 = position_y - 20;
        let platBound1 = platform[i].y;
        let platBound2 = platform[i].y + platform[i].h;

        let boundValue = Math.sign(charBound1 - platBound1) + Math.sign(charBound1 - platBound2) +
            Math.sign(charBound2 - platBound1) + Math.sign(charBound2 - platBound2);

        // Stop clipping through the ground
        if (position_x + 5 > platform[i].x &&
            position_x - 5 < platform[i].x + platform[i].w &&
            position_y > platform[i].y &&
            position_y <= platform[i].y + (1.2*y_velocity) &&
            y_velocity > 0)
        {
            position_y=platform[i].y;
            onGround=true;
        }

        // Stop clipping through the right
        if( (position_x + 5 > platform[i].x) &&
            (position_x + 5 <= platform[i].x + 1.2*x_velocity) &&
            Math.abs(boundValue) !== 4)
        {

            position_x = platform[i].x -5;
            rightCollision = true;
        }

        // Stop clipping through the left
        if( (position_x - 5 <  platform[i].x + platform[i].w) &&
            (position_x - 5 >= platform[i].x + platform[i].w + 1.2*x_velocity) &&
            Math.abs(boundValue) !== 4)
        {
            position_x = platform[i].x + platform[i].w + 5;
            leftCollision = true;
        }

        // Stop clipping through the ceiling
        if ((position_x + 5 > platform[i].x) &&
            (position_x - 5 < platform[i].x + platform[i].w) &&
            (position_y - 20 < platform[i].y + platform[i].h) &&
            (position_y - 20 > platform[i].y + platform[i].h + 1.2*y_velocity) &&
            y_velocity < 0)
        {
            position_y = platform[i].y + platform[i].h + 20;
            if(y_velocity<-3) {
                y_velocity=-3;
            }
            topCollision = true;
        }
    }

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="white";
    ctx.fillRect(position_x-5,position_y-20,10,20);
    ctx.fillStyle="blue";
    ctx.fillRect(position_x,position_y,2,2);
    for(i=0;i<numberOfBlocks;i++) {
        ctx.fillStyle="green";
        ctx.fillRect(platform[i].x, platform[i].y,platform[i].w,platform[i].h);
        ctx.fillStyle="blue";
        ctx.fillRect(platform[i].x, platform[i].y, 5, 5);
    }
}
function keyDown(evt) {
    switch(evt.keyCode) {
        case 37:
            holdLeft=true;
            break;
        case 38:
            if(onGround && !topCollision) {
                y_velocity=-10;
            }
            break;
        case 39:
            holdRight=true;
            break;
    }
}
function keyUp(evt) {
    switch(evt.keyCode) {
        case 37:
            holdLeft=false;
            break;
        case 38:
            if(y_velocity<-3) {
                y_velocity=-3;
            }
            break;
        case 39:
            holdRight=false;
            break;
    }
}