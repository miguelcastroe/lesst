export function drawInfo(context, cursor, buffer) {
    context.fillStyle = 'white';
    context.font = '12px monospace';
    context.fillText(`FPS: ${Math.round(1 / context.delta)}`, 10, 20);
}
