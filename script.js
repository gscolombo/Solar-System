const canvas = document.getElementById("canvas");
const orbitsButton = document.querySelector(".orbits");

let canvasWidth, canvasHeight, centerY, centerX, resizeFactor;

function handleCanvasResize() {
    canvasWidth = `${window.screen.width}`;
    canvasHeight = `${canvasWidth / 2}`;

    if (canvasWidth >= 960) {
        canvasHeight = window.screen.height * 0.65;
    }

    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);

    centerY = canvasHeight / 2;
    centerX = canvasWidth / 2;
    resizeFactor = canvasWidth / 1080;
}

window.onload = () => {
    handleCanvasResize();
    window.resize = handleCanvasResize;
};

let time = Math.floor(Math.random() * (60001 - 600) + 600);
let showOrbits = true;
const sunSize = 110 * resizeFactor;

orbitsButton.addEventListener("click", () => {
    if (showOrbits) showOrbits = false;
    else showOrbits = true;
    orbitsButton.classList.toggle("active");
})

if (canvas.getContext){
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 0.3;

    const sun = new Image();

    class Planet {
        constructor(src, x, y, sizeX, sizeY = sizeX){
            this.imgObj = new Image();
            this.imgObj.src = src;
            this.x = x * resizeFactor;
            this.y = y * resizeFactor;
            this.sizeX = sizeX * resizeFactor;
            this.sizeY = sizeY * resizeFactor;
        }

        setOrbit = () => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + this.y);
            ctx.bezierCurveTo(centerX, centerY + this.y, centerX - this.x, centerY + this.y, centerX - this.x, centerY);
            ctx.moveTo(centerX - this.x, centerY);
            ctx.bezierCurveTo(centerX - this.x, centerY, centerX - this.x, centerY - this.y, centerX, centerY - this.y);
            ctx.moveTo(centerX, centerY - this.y);
            ctx.bezierCurveTo(centerX, centerY - this.y, centerX + this.x, centerY - this.y, centerX + this.x, centerY);
            ctx.moveTo(centerX + this.x, centerY);
            ctx.bezierCurveTo(centerX + this.x, centerY + this.y, centerX, centerY + this.y, centerX, centerY + this.y);
            ctx.stroke();
        };

        configTranslation = () => {
            return  this.midpointX = centerX - (this.sizeX / 2),
                    this.midpointY = centerY - (this.sizeY / 2);
        };

        setTranslation = (angle, fx = 0, fy = 0) => {
            this.xPos = this.midpointX + (this.x * Math.sin(angle)) + fx;
            this.yPos = this.midpointY + (this.y * Math.cos(angle)) + (fy * Math.cos(angle));

            return this.xPos, this.yPos;
        };

        insert = () => {
            ctx.drawImage(this.imgObj, this.xPos, this.yPos, this.sizeX, this.sizeY);
        };
    }

    class Moon extends Planet {
        constructor(src, x, y, size, planet){
            super(src, x, y, size);
            this.imgObj = new Image();
            this.imgObj.src = src;
            this.refPlanet = planet;
            this.x = this.x + (this.refPlanet.sizeX / 2);
        }

        setRefCenter = () => {
            return  this.refX = this.refPlanet.xPos + (this.refPlanet.sizeX / 2),
                    this.refY = this.refPlanet.yPos + (this.refPlanet.sizeY / 2);
        }

        setOrbit = () => {
            ctx.beginPath();
            ctx.moveTo(this.refX, this.refY + this.y);
            ctx.bezierCurveTo(this.refX, this.refY + this.y, this.refX - this.x, this.refY + this.y, this.refX - this.x, this.refY);
            ctx.moveTo(this.refX - this.x, this.refY);
            ctx.bezierCurveTo(this.refX - this.x, this.refY, this.refX - this.x, this.refY - this.y, this.refX, this.refY - this.y);
            ctx.moveTo(this.refX, this.refY - this.y);
            ctx.bezierCurveTo(this.refX, this.refY - this.y, this.refX + this.x, this.refY - this.y, this.refX + this.x, this.refY);
            ctx.moveTo(this.refX + this.x, this.refY);
            ctx.bezierCurveTo(this.refX + this.x, this.refY + this.y, this.refX, this.refY + this.y, this.refX, this.refY + this.y);
            ctx.stroke();

        };

        configTranslation = () => {
            return  this.midpointX = this.refX - (this.sizeX / 2),
                    this.midpointY = this.refY - (this.sizeY / 2);
        };

        insertMoon = (theta, angle, rotation = 0) => {
            ctx.translate(this.midpointX, this.midpointY);
            ctx.rotate((Math.PI / 180) * theta);
            ctx.translate(-this.midpointX, -this.midpointY);
            if (showOrbits) this.setOrbit();
            this.configTranslation();
            if (angle) this.setTranslation(angle * 10);
            this.insert();        
            ctx.resetTransform();

            if (rotation) {
                ctx.translate(this.refPlanet.xPos, this.refPlanet.yPos);
                ctx.rotate((Math.PI / 180) * rotation);
                ctx.translate(-this.refPlanet.xPos, -this.refPlanet.yPos);
            }
            ctx.drawImage(
                this.refPlanet.imgObj,
                0, 0,
                this.refPlanet.imgObj.naturalWidth,
                this.refPlanet.imgObj.naturalHeight / 2,
                this.refPlanet.xPos,
                this.refPlanet.yPos,
                this.refPlanet.sizeX,
                this.refPlanet.sizeY / 2
            );

            if (rotation) ctx.resetTransform();
        }
    }

    /*Objetos*/
    // Planetas
    const earth = new Planet("./img/Terra.png", 150, 40, 15);
    const mercury = new Planet("./img/Mercúrio.png", 70, 20, 8);
    const venus = new Planet("./img/Vênus.png", 110, 30, 10);
    const mars = new Planet ("./img/Marte.png", 186, 55, 9);
    const jupiter = new Planet("./img/jupiter2.png", 320, 100, 30);
    const saturn = new Planet("./img/saturn.png", 380, 120, 60, 23);
    const uranus = new Planet("./img/uranus.png", 440, 140, 15.5);
    const neptune = new Planet("./img/neptune.png", 475, 160, 15);

    // Cinturão de Asteroides
    const belt = [];
    for (let i = 0; i < 750; i++){
        let n = Math.floor(Math.random() * (5 - 1) + 1);
        let x = Math.floor(Math.random() * (241 - 225) + 225);
        let y = Math.floor(Math.random() * (81 - 70) + 70);
        let size = Math.floor(Math.random() * (5 - 1) + 1);
        let src;
        if (n === 1) src = "./img/a1.png"
        else if (n === 2) src = "./img/a2.png"
        else if (n === 3) src = "./img/a3.png"
        else if (n === 4) src = "./img/a4.png"

        belt.push(new Planet(src, x, y, size));
    };

    //Luas
    const moon = new Moon("./img/Lua.png", 6, 5, 5, earth);
    const deimos = new Moon("./img/Deimos.png", 13, 8, 3, mars);
    const fobos = new Moon("./img/Fobos.png", 6, 4, 4, mars);
    const ganymede = new Moon("./img/Ganimedes.png", 15, 4, 6, jupiter);
    const calisto = new Moon("./img/Calisto.png", 18, 5, 4, jupiter);
    const io = new Moon("./img/Io.png", 20, 7, 3.5, jupiter);
    const europa = new Moon("./img/Europa.png", 12, 3, 3, jupiter);
    const titan = new Moon("./img/Titã.png", 6, 5, 3.2, saturn);

    function init(){
        sun.src = "./img/sun.png";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, Math.PI, 0);
        
        earth.configTranslation();
        mercury.configTranslation();
        venus.configTranslation();
        mars.configTranslation();
        jupiter.configTranslation();
        saturn.configTranslation();
        uranus.configTranslation();
        neptune.configTranslation();

        belt.forEach(belt => {
            belt.configTranslation();
            belt.angleFactor = Math.random() * (1.2 - 0.5) + 0.5;
        });

        window.requestAnimationFrame(draw);
    };
    
    function draw(){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight + 80);
        ctx.drawImage(sun, centerX - (sunSize / 2), centerY - (sunSize / 2), sunSize, sunSize);

        ctx.save();

        // Órbitas de planetas
        if (showOrbits) {
            ctx.strokeStyle = "white";
        } else {
            ctx.strokeStyle = "transparent";
        }

        earth.setOrbit();
        mercury.setOrbit();
        venus.setOrbit();
        mars.setOrbit();

        ctx.translate(20, 0);
        jupiter.setOrbit();
        ctx.translate(-20, 0);

        ctx.translate(5, 0);
        saturn.setOrbit();
        ctx.translate(-5, 0);

        ctx.translate(7.5, 0);
        uranus.setOrbit();
        ctx.translate(-7.5, 0);

        neptune.setOrbit();  
        
        /*Planetas*/
        time += 1/60;
        let angle = ((2 * Math.PI) / 60) * time;

        // Terra
        earth.setTranslation(angle);
        earth.insert();

        // Mercúrio
        mercury.setTranslation(angle * 6);
        mercury.insert();

        // Vênus
        venus.setTranslation(angle * 2);
        venus.insert();

        // Marte
        mars.setTranslation(angle * 0.8);
        mars.insert();

        // Júpiter
        jupiter.setTranslation(angle * .4, 20);
        jupiter.insert();

        // Saturno
        saturn.setTranslation(angle * .375, 5);
        ctx.translate(5 + saturn.xPos, saturn.yPos);
        ctx.rotate((Math.PI / 180) * 5);
        ctx.translate(-(5 + saturn.xPos), -saturn.yPos);
        saturn.insert();
        ctx.resetTransform();

        // Urano
        uranus.setTranslation(angle * .3, 7.5, 3.25);
        ctx.translate(7.5 + uranus.xPos, uranus.yPos);
        ctx.rotate((Math.PI / 180) * 7.5);
        ctx.translate(-(7.5 + uranus.xPos), -uranus.yPos);
        uranus.insert();
        ctx.resetTransform();

        // Netuno
        neptune.setTranslation(angle * .275, 3, 2.5);
        neptune.insert();

        /*Cinturão de asteroides*/
        belt.forEach(belt => {
            belt.setTranslation(angle * belt.angleFactor);
            belt.insert();
        })

        /*Luas*/
        // Referências espaciais
        moon.setRefCenter();
        deimos.setRefCenter();
        fobos.setRefCenter();

        ganymede.setRefCenter();
        io.setRefCenter();
        europa.setRefCenter();
        calisto.setRefCenter();

        titan.setRefCenter();

        // Lua
        moon.insertMoon(-5, angle);

        // Fobos e Deimos
        deimos.insertMoon(-0.93, angle * .25);
        fobos.insertMoon(1.09, angle * .5);

        // Ganimedes, Calisto, Io e Europa
        ganymede.insertMoon(-22, angle * .15);
        io.insertMoon(0.5, angle * .8);
        europa.insertMoon(4.7, angle * .7);
        calisto.insertMoon(10, angle * .4);

        // Titã
        titan.insertMoon(-15, angle * -.75, 5);

        ctx.restore();

        ctx.drawImage(sun, 
                    0, 0, 
                    sun.naturalWidth, 
                    sun.naturalHeight / 2, 
                    centerX - (sunSize / 2), 
                    centerY - (sunSize / 2), 
                    sunSize, sunSize / 2);
        
        window.requestAnimationFrame(draw);
    };
    
    init();
}
