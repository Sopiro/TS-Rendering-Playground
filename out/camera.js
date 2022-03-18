import { Entity } from "./entity.js";
import { Vector2 } from "./math.js";
export class Camera extends Entity {
    constructor() {
        super();
    }
    get transform() {
        return super.localToGlobal;
    }
    get cameraTransform() {
        return super.globalToLocal;
    }
    reset() {
        this.position = new Vector2(0, 0);
        this.scale = new Vector2(1, 1);
        this.rotation = 0;
    }
}
