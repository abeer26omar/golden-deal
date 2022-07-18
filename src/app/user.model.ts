export class User{
    constructor(
        public name: string, 
        public id: string, 
        private _token: string,
        public birth_date: string,
        public phone: string,
        public otp: number,
        public image_url: string,
        public cover_url: string, 
        private _tokenExpirationDate?: Date){}

        get token(){
            if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
                return null
            }
            return this._token;
        }
}

export interface Register{
    data: {
        user: {
            name: string,
            gender: string,
            birth_date: string,
            phone: string,
            otp: number,
            id: string,
            image_url: string,
            cover_url: string,
            expiresIn: 60,
        },
        token: string
    }      
}