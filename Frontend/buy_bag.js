// Strategy Interface
class Bag {
    carry() {
        throw new Error("This method must be overridden");
    }
}

// Concrete Strategies
class ClothBag extends Bag {
    carry() {
        return "Carrying items in a cloth bag.";
    }
}

class PlasticBag extends Bag {
    carry() {
        return "Carrying items in a plastic bag.";
    }
}

class Trolley extends Bag {
    carry() {
        return "Carrying items in a trolley.";
    }
}

class NoBag extends Bag {
    carry() {
        return "Not carrying any bag.";
    }
}

// Context: Shopper
class Shopper {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    carryItems() {
        return this.strategy.carry();
    }
}

// Bag instances
const clothBag = new ClothBag();
const plasticBag = new PlasticBag();
const trolley = new Trolley();
const noBag = new NoBag();

// Shopper instance
const shopper = new Shopper(noBag); // Default strategy
shopper.setStrategy (noBag);
localStorage.setItem("selectedBag", shopper.carryItems()); 

// Handle Bag Selection
const handleBagSelection = (bagType) => {
    switch (bagType) {
        case "ClothBag":
            shopper.setStrategy(clothBag);
            break;
        case "PlasticBag":
            shopper.setStrategy(plasticBag);
            break;
        case "Trolley":
            shopper.setStrategy(trolley);
            break;
        case "NoBag":
            shopper.setStrategy(noBag);
            break;
        default:
            alert("Invalid bag type");
            return;
    }
    localStorage.setItem("selectedBag", bagType); 
    alert(shopper.carryItems());
};