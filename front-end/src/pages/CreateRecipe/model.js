class Ingredient {
	constructor(name, quantity) {
		this.name = name;
		this.quantity = quantity;
	}
}

class Step {
    constructor(description, mediaFiles = []) {
        this.description = description;
        this.mediaFiles = mediaFiles;
    }
}

export { Ingredient, Step }