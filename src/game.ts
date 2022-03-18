import { Matrix3, Vector2 } from "./math.js";
import * as Input from "./input.js";
import * as Util from "./util.js";
import { Renderer } from "./renderer.js";
import { Camera } from "./camera.js";
import { Settings } from "./settings.js";
import { AABB, fix } from "./aabb.js";
import { PRNG } from "./prng.js";
import { Timer } from "./timer.js";
import { Entity } from "./entity.js";
import { toBox } from "./box.js";

export class Game
{
    private renderer: Renderer;
    public camera: Camera;

    private cameraPosStart!: Vector2;
    private cursorStart!: Vector2;
    private cameraMove = false;

    public cursorPos: Vector2 = new Vector2(0, 0);
    public deltaTime: number = 0.0;
    public time: number = 0.0;
    public frame: number = 0;

    private dragging: boolean = false;
    private clickStart: Vector2 = new Vector2(0, 0);
    private clickEnd: Vector2 = new Vector2(0, 0);

    private blahBlahLabel: HTMLDivElement;
    private seedTextBox: HTMLInputElement;

    private timer: Timer = new Timer();
    private rand: PRNG = new PRNG(0);

    private entities: Entity[] = [];

    constructor(renderer: Renderer)
    {
        this.renderer = renderer;
        this.camera = new Camera();
        this.camera.position = new Vector2(0, 0);

        let projectionTransform = Util.orth(
            -Settings.clipWidth / 2.0, Settings.clipWidth / 2.0,
            -Settings.clipHeight / 2.0, Settings.clipHeight / 2.0
        );
        let viewportTransform = Util.viewport(Settings.width, Settings.height);

        this.renderer.init(viewportTransform, projectionTransform, this.camera.cameraTransform);

        const restartBtn = document.querySelector("#restart") as HTMLButtonElement;
        restartBtn.addEventListener("click", () =>
        {
            this.init();
        });

        this.blahBlahLabel = document.querySelector("#blahBlah") as HTMLDivElement;
        this.seedTextBox = document.querySelector("#seedTextBox") as HTMLInputElement;

        this.init();
    }

    init(): void
    {
        // Initialization code here
        this.camera.reset();
        this.entities = [];
    }

    update(delta: number): void
    {
        this.deltaTime = delta;
        this.frame++;
        this.time += delta;
        this.handleInput(delta);

        // Update code here
        let seedString = this.seedTextBox.value.length == 0 ? this.seedTextBox.placeholder : this.seedTextBox.value;
        let seed = Util.stringHash(seedString);
        this.rand.setSeed(seed);

        this.blahBlahLabel.innerHTML = "Some text box: " + seed;
    }

    private handleInput(delta: number): void
    {
        const mx = Input.isKeyDown("ArrowLeft") ? -1 : Input.isKeyDown("ArrowRight") ? 1 : 0;
        const my = Input.isKeyDown("ArrowDown") ? -1 : Input.isKeyDown("ArrowUp") ? 1 : 0;

        this.camera.translate(new Vector2(mx, my).mul(delta * 10 * this.camera.scale.x));
        let tmpCursorPos = this.renderer.pick(Input.mousePosition);

        this.cursorPos.x = tmpCursorPos.x;
        this.cursorPos.y = tmpCursorPos.y;

        if (Input.isScrolling())
        {
            this.camera.scale.x += Input.mouseScroll.y * 0.1;
            this.camera.scale.y += Input.mouseScroll.y * 0.1;

            if (this.camera.scale.x < 0.1)
            {
                this.camera.scale.x = 0.1;
                this.camera.scale.y = 0.1;
            }
        }

        if (!this.cameraMove && Input.isMousePressed(Input.Button.Right))
        {
            this.cameraMove = true;
            this.cursorStart = Input.mousePosition.copy();
            this.cameraPosStart = this.camera.position.copy();
        }
        else if (Input.isMouseReleased(Input.Button.Right))
        {
            this.cameraMove = false;
        }

        if (this.cameraMove)
        {
            let dist = Input.mousePosition.sub(this.cursorStart);
            dist.x *= -(Settings.clipWidth / Settings.width) * this.camera.scale.x;
            dist.y *= -(Settings.clipHeight / Settings.height) * this.camera.scale.y;
            this.camera.position = this.cameraPosStart.add(dist);
        }

        if (Input.isKeyPressed("r"))
        {
            this.init();
        }

        if (Input.isMousePressed(Input.Button.Left))
        {
            if (!this.dragging)
            {
                this.dragging = true;
                this.clickStart = this.renderer.pick(Input.mousePosition);
            }
        }

        if (Input.isMouseDown(Input.Button.Left))
        {
            if (this.dragging)
            {
                this.clickEnd = this.renderer.pick(Input.mousePosition);
            }
        }

        if (Input.isMouseReleased(Input.Button.Left))
        {
            if (this.dragging)
            {
                let box = toBox(new AABB(this.clickStart.copy(), this.clickEnd.copy()));
                this.entities.push(box);
                this.dragging = false;
            }
        }
    }

    render(r: Renderer): void
    {
        r.setCameraTransform(this.camera.cameraTransform);
        r.setModelTransform(new Matrix3());

        // Render code here
        if (this.dragging)
        {
            r.drawAABB(new AABB(this.clickStart.copy(), this.clickEnd.copy()));
        }

        r.drawLine(0, 0, 1, 1, 1);
        r.drawCircle(2, 2, 1);
        r.drawText(100, 100, "Hello renderer~");
        r.drawVector(new Vector2(-3, -3), new Vector2(0, 2));

        this.entities.forEach(e => r.drawEntity(e));
    }
}