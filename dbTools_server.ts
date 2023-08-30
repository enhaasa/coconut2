export class SQL {
    public static convertSQLKeyword (word) {
        return "`" + word + "`";
    };
    
    public static convertSQLKeywords (words) {
        return words.map(word => (this.convertSQLKeyword(word)))
    };
    
    public static pgConvertSQLKeyword (word) {
        return '"' + word + '"';
    }
    
    public static pgConvertSQLKeywords (words) {
        return words.map(word => (this.pgConvertSQLKeyword(word)))
    }
}

export class Time {
    public static getCurrentDateTime(): string {
        const now: Date = new Date();
        const year: number = now.getFullYear();
        const month: string = this.padZero(now.getMonth() + 1);
        const day: string = this.padZero(now.getDate());
        const hour: string = this.padZero(now.getHours());
        const minute: string = this.padZero(now.getMinutes());
        const second: string = this.padZero(now.getSeconds());
      
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    public static getCurrentTime = () => {
        const today = new Date();
        return today.getTime();
    }
      
    private static padZero(value: number): string {
        return value.toString().padStart(2, '0');
    }
}
