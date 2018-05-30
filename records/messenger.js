class Messenger {


    constructor(id, content) {
        this.id = id;

        this.content = content;
    }

    toJson() {
        return {
            data: {
                id: `${this.id}`,
                type: "messengers",
                attributes:
                    {
                        content: this.content
                    }
            }
        }
    }
}

Messenger.type = "messengers";

export default Messenger;