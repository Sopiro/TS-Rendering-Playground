import { Entity } from "./entity.js";
import { Matrix3, Vector2 } from "./math.js";

export class Camera extends Entity
{
    constructor()
    {
        super();
    }

    get transform(): Matrix3
    {
        return super.localToGlobal;
    }

    get cameraTransform(): Matrix3
    {
        return super.globalToLocal;
    }

    reset(): void
    {
        this.position = new Vector2(0, 0);
        this.scale = new Vector2(1, 1);
        this.rotation = 0;
    }
}