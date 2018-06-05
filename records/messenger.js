class Messenger {
    constructor(id, attributes, medium) {
        this.id = id;
        this.attributes = attributes;
        this.medium = medium;
    }

    toJson() {
        let json = {
            data: {
                id: `${this.id}`,
                type: "messengers",
                attributes: {}
            }
        };
        if (this.attributes) {
            json.data.attributes = this.attributes;
        }
        return json;
    }


    async update(data) {
        try {
            let updated = await this.medium.update(this.id, Messenger.type, {
                attributes: data.attributes
            }).catch(err => {
                throw err;
            });
            this.attributes = updated.attributes;
            return this;
        } catch (e) {
            throw e;
        }
    }
}

Messenger.type = "messengers";

export default Messenger;