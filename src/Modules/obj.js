class Queue{
    constructor(){
        this.data = [];
    }
    push(item){
        this.data.push(item);
    }
    pop(){
        return this.data.shift();
    }
    empty(){
        if (this.data.length > 0) return 0;
        else return 1;
    }
}

module.exports = {
    Queue: Queue
};