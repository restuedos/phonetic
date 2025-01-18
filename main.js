var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Technician {
    constructor(name, averageRepairTime) {
        this._name = name;
        this._averageRepairTime = averageRepairTime;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set averageRepairTime(averageRepairTime) {
        this._averageRepairTime = averageRepairTime;
    }
    get averageRepairTime() {
        return this._averageRepairTime;
    }
    repairing(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`>> Technician ${this._name} is repairing ${customer.name}'s phone. Customer phone is ${customer.phoneSeries} series <<`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`       REPAIRING DONE: ${this._name} FIXED ${customer.name}'s phone!`);
                    resolve(customer);
                }, this._averageRepairTime * 1000);
            });
        });
    }
}
class Customer {
    constructor(name, phoneSeries) {
        this._name = name;
        this._phoneSeries = phoneSeries;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set phoneSeries(phoneSeries) {
        this._phoneSeries = phoneSeries;
    }
    get phoneSeries() {
        return this._phoneSeries;
    }
}
class ServiceCenter {
    constructor(name, address, technicians, customers) {
        this._name = name;
        this._address = address;
        this._technicians = technicians;
        this._customers = customers;
        this._queue = [...customers];
    }
    get name() {
        return this._name;
    }
    startOperating() {
        return __awaiter(this, void 0, void 0, function* () {
            const repairLog = {};
            const repairingPromises = [];
            while (this._queue.length > 0) {
                const availableTechnician = this._technicians.shift(); // Get the first available technician
                if (!availableTechnician) {
                    yield new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5 second before retrying
                    continue;
                }
                const currentCustomer = this._queue.shift(); // Get the first customer in the queue
                if (currentCustomer) {
                    availableTechnician.repairing(currentCustomer).then(() => {
                        repairLog[currentCustomer.name] = availableTechnician.name;
                        this._technicians.push(availableTechnician); // Return the technician to the pool
                        console.log(`${availableTechnician.name} available, call another customer...`);
                    });
                }
            }
            console.log("\nService Center Log for today:");
            console.table(this._customers.map((customer) => ({
                customerName: customer.name,
                phone: customer.phoneSeries,
                phoneRepairedBy: repairLog[customer.name],
            })));
        });
    }
}
// ====================================================================================
// MAIN
// ====================================================================================
// Define Technician
const dalton = new Technician("Dalton", 10); // 10 seconds
const wapol = new Technician("Wapol", 20); // 20 seconds
const technicians = [dalton, wapol];
// Define Customer
// Generate 10 customers
const phoneSeries = ["Jaguar", "Lion", "Leopard"];
const customers = new Array(10).fill(null).map((_, index) => {
    const randomPhoneSeries = phoneSeries[Math.floor(Math.random() * phoneSeries.length)];
    return new Customer(`Customer ${index}`, randomPhoneSeries);
});
// Define Service Center
const serviceCenter = new ServiceCenter("First SC", "Long Ring Long Land Street", technicians, customers);
console.log("Customer on queue: ");
console.table(customers);
console.log("\n");
// Begin Operating
console.log(`${serviceCenter.name} start operating today: `);
serviceCenter.startOperating().catch((err) => console.log(err));
