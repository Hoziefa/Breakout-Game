const elements = {
    rulesBtn: document.getElementById("rules-btn"),
    closeBtn: document.getElementById("close-btn"),
    rules: document.getElementById("rules"),
    canvas: document.querySelector("canvas"),
};
const { canvas, rules, rulesBtn, closeBtn } = elements;

const ctx = elements.canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

const ball = { x: canvas.width / 2, y: canvas.height / 2, size: 10, speed: 4, dx: 4, dy: -4 };

const paddle = { x: canvas.width / 2 - 40, y: canvas.height - 20, w: 80, h: 10, speed: 8, dx: 0 };

const brickInfo = { w: 70, h: 20, padding: 10, offsetX: 45, offsetY: 60, visible: true };

const drawBall = _ => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
};

const drawPaddle = _ => {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
};

const drawScore = _ => {
    ctx.font = "1.45rem apercu";
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

const bricks = Array.from({ length: brickRowCount }, (_, idx) =>
    Array.from({ length: brickColumnCount }, (_, idx2) => ({
        x: idx * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX,
        y: idx2 * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY,
        ...brickInfo,
    })),
);

const drawBricks = _ => {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
            ctx.fill();
            ctx.closePath();
        });
    });
};

const movePaddle = _ => {
    paddle.x += paddle.dx;

    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

    if (paddle.x < 0) paddle.x = 0;
};

const showAllBricks = _ => bricks.forEach(column => column.forEach(brick => (brick.visible = true)));

const increaseScore = _ => {
    score++;

    score % (brickRowCount * brickRowCount) === 0 && showAllBricks();
};

const moveBall = _ => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) ball.dx *= -1;

    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) ball.dy *= -1;

    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });

    if (ball.y + ball.size > canvas.height) {
        score = 0;
        showAllBricks();
    }
};

const draw = _ => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
};

const update = _ => {
    movePaddle();
    moveBall();

    draw();

    requestAnimationFrame(update);
};
update();

const keyDown = ({ key }) => {
    if (key === "Right" || key === "ArrowRight") paddle.dx = paddle.speed;
    else if (key === "Left" || key === "ArrowLeft") paddle.dx = -paddle.speed;
};

const keyUp = ({ key }) => {
    if (key === "Right" || key === "ArrowRight" || key === "Left" || key === "ArrowLeft") paddle.dx = 0;
};

[rulesBtn, closeBtn].forEach(btn => btn.addEventListener("click", _ => rules.classList.toggle("show")));

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
