import Matter, { Collision } from 'matter-js';
import {
    verticals,
    horizontals,
    cellsHorizontal,
    cellsVertical,
} from './gird-verticals-horizontals.js';

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine,
    options: {
        width,
        height,
        wireframes: false,
    },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const Walls = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
World.add(world, Walls);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return;
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            {
                isStatic: true,
                label: 'wall',
                render: {
                    fillStyle: 'red',
                },
            }
        );
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return;
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            {
                isStatic: true,
                label: 'wall',
                render: {
                    fillStyle: 'red',
                },
            }
        );
        World.add(world, wall);
    });
});

// Goal

const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green',
        },
    }
);
World.add(world, goal);

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
    label: 'ball',
    render: {
        fillStyle: 'blue',
    },
});

World.add(world, ball);

document.addEventListener('keydown', (e) => {
    const { x, y } = ball.velocity;
    if (e.keyCode === 87) {
        // move the ball up with w key
        Body.setVelocity(ball, {
            x,
            y: y - 5,
        });
    }

    if (e.keyCode === 83) {
        // move the ball down with s key
        Body.setVelocity(ball, {
            x,
            y: y + 5,
        });
    }
    if (e.keyCode === 68) {
        // move the ball right with d key
        Body.setVelocity(ball, {
            x: x + 5,
            y,
        });
    }
    if (e.keyCode === 65) {
        // move the ball left with a key
        Body.setVelocity(ball, {
            x: x - 5,
            y,
        });
    }
});

// Win Condition
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];
        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach((body) => {
                if (body.label === 'wall') Body.setStatic(body, false);
            });
        }
    });
});
