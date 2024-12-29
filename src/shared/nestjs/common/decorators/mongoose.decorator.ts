import { Virtual, VirtualOptions } from '@nestjs/mongoose';

export const VirtualID = (options?: VirtualOptions) =>
    Virtual({
        options: options || undefined,
        get() {
            return this._id;
        },
        set(id: string) {
            this._id = id;
        },
    });
