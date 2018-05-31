class Messenger {
    constructor(id, content, medium) {
        this.id = id;
        this.content = content;
        this.medium = medium;
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


    async update(data) {
        try {
            let updated = await this.medium.update(this.id, Messenger.type, {
                content: data.attributes.content
            }).catch(err => {
                throw err;
            });
            this.content = updated.content;
            return this;
        } catch (e) {
            throw e;
        }
    }
}

Messenger.type = "messengers";

export default Messenger;