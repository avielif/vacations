export class Vacation {

    constructor(
        public destination: string,
        public description: string,
        public startDate: Date,
        public endDate: Date,
        public price: number,
        public image?: string | FileList,
        public numberOfFollowers?: number,
        public id?: number,
        ){}
}
