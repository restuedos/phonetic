class Technician {
  private _name: string;
  private _averageRepairTime: number; // 1 minute ~ 1 second

  constructor(name: string, averageRepairTime: number) {
    this._name = name;
    this._averageRepairTime = averageRepairTime;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set averageRepairTime(averageRepairTime: number) {
    this._averageRepairTime = averageRepairTime;
  }

  public get averageRepairTime() {
    return this._averageRepairTime;
  }

  public async repairing(customer: Customer): Promise<Customer> {
    console.log(
      `>> Technician ${this._name} is repairing ${customer.name}'s phone. Customer phone is ${customer.phoneSeries} series <<`
    );

    return new Promise<Customer>((resolve) => {
      setTimeout(() => {
        console.log(`       REPAIRING DONE: ${this._name} FIXED ${customer.name}'s phone!`);
        resolve(customer);
      }, this._averageRepairTime * 1000);
    });
  }
}

class Customer {
  private _name: string;
  private _phoneSeries: string;

  constructor(name: string, phoneSeries: string) {
    this._name = name;
    this._phoneSeries = phoneSeries;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set phoneSeries(phoneSeries: string) {
    this._phoneSeries = phoneSeries;
  }

  public get phoneSeries() {
    return this._phoneSeries;
  }
}

class ServiceCenter {
  private _name: string;
  private _address: string;
  private _technicians: Technician[];
  private _customers: Customer[];
  private _queue: Customer[];

  constructor(name: string, address: string, technicians: Technician[], customers: Customer[]) {
    this._name = name;
    this._address = address;
    this._technicians = technicians;
    this._customers = customers;
    this._queue = [...customers];
  }

  public get name() {
    return this._name;
  }

  public async startOperating() {
    const repairLog: { [key: string]: string } = {};
    const repairingPromises: Promise<void>[] = [];

    while (this._queue.length > 0) {
      const availableTechnician = this._technicians.shift(); // Get the first available technician
      if (!availableTechnician) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5 second before retrying
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
    console.table(
      this._customers.map((customer) => ({
        customerName: customer.name,
        phone: customer.phoneSeries,
        phoneRepairedBy: repairLog[customer.name],
      }))
    );
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
const serviceCenter: ServiceCenter = new ServiceCenter(
  "First SC",
  "Long Ring Long Land Street",
  technicians,
  customers
);

console.log("Customer on queue: ");
console.table(customers);
console.log("\n");

// Begin Operating
console.log(`${serviceCenter.name} start operating today: `);
serviceCenter.startOperating().catch((err) => console.log(err));
