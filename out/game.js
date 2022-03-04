import { Matrix3, Vector2 } from "./math.js";
import * as Input from "./input.js";
import * as Util from "./util.js";
import { Camera } from "./camera.js";
import { Settings } from "./settings.js";
export class Game {
    constructor(renderer) {
        this.cameraMove = false;
        this.cursorPos = new Vector2(0, 0);
        this.deltaTime = 0.0;
        this.time = 0.0;
        this.frame = 0;
        this.callback = () => { };
        this.renderer = renderer;
        this.camera = new Camera();
        this.camera.position = new Vector2(0, 0);
        let projectionTransform = Util.orth(-Settings.clipWidth / 2.0, Settings.clipWidth / 2.0, -Settings.clipHeight / 2.0, Settings.clipHeight / 2.0);
        let viewportTransform = Util.viewport(Settings.width, Settings.height);
        this.renderer.init(viewportTransform, projectionTransform, this.camera.cameraTransform);
    }
    initDemo() {
        this.frame = 0;
        this.time = 0.0;
        this.camera.position = new Vector2(0, 0);
        this.camera.scale = new Vector2(1, 1);
    }
    update(delta) {
        this.deltaTime = delta;
        this.frame++;
        this.time += delta;
        this.handleInput(delta);
        this.callback();
    }
    handleInput(delta) {
        const mx = Input.isKeyDown("ArrowLeft") ? -1 : Input.isKeyDown("ArrowRight") ? 1 : 0;
        const my = Input.isKeyDown("ArrowDown") ? -1 : Input.isKeyDown("ArrowUp") ? 1 : 0;
        this.camera.translate(new Vector2(mx, my).mul(delta * 10 * this.camera.scale.x));
        let tmpCursorPos = this.renderer.pick(Input.mousePosition);
        this.cursorPos.x = tmpCursorPos.x;
        this.cursorPos.y = tmpCursorPos.y;
        if (Input.isScrolling()) {
            this.camera.scale.x += Input.mouseScroll.y * 0.1;
            this.camera.scale.y += Input.mouseScroll.y * 0.1;
            if (this.camera.scale.x < 0.1) {
                this.camera.scale.x = 0.1;
                this.camera.scale.y = 0.1;
            }
        }
        if (!this.cameraMove && Input.isMousePressed(2)) {
            this.cameraMove = true;
            this.cursorStart = Input.mousePosition.copy();
            this.cameraPosStart = this.camera.position.copy();
        }
        else if (Input.isMouseReleased(2)) {
            this.cameraMove = false;
        }
        if (this.cameraMove) {
            let dist = Input.mousePosition.sub(this.cursorStart);
            dist.x *= -(Settings.clipWidth / Settings.width) * this.camera.scale.x;
            dist.y *= -(Settings.clipHeight / Settings.height) * this.camera.scale.y;
            this.camera.position = this.cameraPosStart.add(dist);
        }
    }
    render(r) {
        r.setCameraTransform(this.camera.cameraTransform);
        r.setModelTransform(new Matrix3());
        // Render code here
        r.drawLine(0, 0, 1, 1, 1);
        r.drawCircle(2, 2, 1);
        r.drawText(100, 100, "Hello renderer~");
        r.drawVector(new Vector2(-3, -3), new Vector2(0, 2));
    }
}
