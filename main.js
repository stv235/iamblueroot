const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const originW = 10;
const originL = 20;

ctx.lineWidth = originW;
ctx.strokeStyle = "#1af";
ctx.lineCap = "round";
//ctx.shadowBlur = 30;
//ctx.shadowColor = "#1ef";

let startX = canvas.width / 2;
let startY = 0;

let currentX = startX;
let currentY = 0;
let stepY = 0;
let points = [];

let sprouts = [];
let oldSprouts = [];

document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 37: // left arrow
            currentX -= 0.5;
            break;
        case 39: // right arrow
            currentX += 0.5;
            break;
    }
});

function length(p) {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}

function normalize(p) {
    const l = length(p);
    return {x: p.x / l, y: p.y / l};
}

function rotate(p, a) {
    const n1 = Math.cos(a);
    const n2 = Math.sin(a);

    return {
        x: p.x * n1 - p.y * n2,
        y: p.x * n2 + p.y * n1
    };
}

function mul(p, s) {
    return {x: p.x * s, y: p.y * s};
}

function sub(p1, p2) {
    return {x: p1.x - p2.x, y: p1.y - p2.y};
}

function add(p1, p2) {
    return {x: p1.x + p2.x, y: p1.y + p2.y};
}

function sprout(p, d, l) {
    for (let i = 0; i < Math.random() * 3; ++i) {
        const a = (Math.random() - 0.5) * 2;

        const sprout = {
            origin: p,
            d: rotate(d, a),
            t: 0,
            l: l,
            split: false
        };

        sprouts = [...sprouts, sprout];
    }
}

function sproutOrigin() {
    if (points.length < 2) {
        return;
    }

    const p2 = points[points.length - 1];
    const p1 = points[points.length - 2];

    const d = normalize(sub(p2, p1));

    sprout(p2, d, 1);
}

function renderSprouts() {
    for (const sppp of sprouts) {
        const p1 = sppp.origin;
        const p2 = add(p1, mul(sppp.d, sppp.t));

        const f = Math.pow(2, sppp.l);

        ctx.lineWidth = originW / f;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        if (!sppp.split) {
            sppp.t += 0.1;

            if (sppp.t >= originL / f * 5) {
                sppp.split = true;
                if (sppp.l <= 3) {
                    sprout(p2, sppp.d, sppp.l + 1);
                }
            }
        }
    }
}
function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    ctx.lineWidth = originW;
    ctx.moveTo(startX, startY);

    for (const point of points) {
        ctx.lineTo(point.x, point.y);
    }

    ctx.lineTo(currentX, currentY);

    ctx.stroke();

    renderSprouts();

    currentY += 0.1;
    stepY += 0.1;

    if (stepY >= originL) {
        stepY -= originL;
        points = [...points, {x:currentX, y: currentY}];

        sproutOrigin();
    }

    if (currentY > canvas.height * 0.9)
    {
        startX = currentX;
        startY = 0;
        points = [];
        currentY = 0;
        ctx.lineWidth += 5;

        sprouts = [];
    }

    requestAnimationFrame(render);
}

render();