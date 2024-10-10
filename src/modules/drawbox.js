export function drawInfo(context, cursor, buffer) {
    context.fillStyle = 'white';
    context.font = '16px monospace';
    context.fillText(`FPS: ${Math.round(1 / context.delta)}`, 10, 20);
}

