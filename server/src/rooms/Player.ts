

export class Player {
    sockerId: string;
    constructor(public readonly id: number, public readonly username: string) {}

    setSocketId = (socId: string) => this.sockerId = socId
}