export class Config {
    baseUrl: string = 'https://jsonplaceholder.typicode.com'
    constructor() {}

    getBaseURL() {
        return this.baseUrl
    }
}