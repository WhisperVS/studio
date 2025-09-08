export const CATEGORIES = ['systems', 'servers', 'laptops', 'networks', 'printers', 'other'] as const;
export const LOCATIONS = ['Schaumburg IL', 'Rockford IL'] as const;
export const STATUSES = ['In Use', 'In Repair', 'Spare', 'For Parts'] as const;
export const SYSTEM_TYPES = ['MFF', 'Tower', 'AiO', 'Desktop'] as const;
export const SERVER_TYPES = ['Rack', 'Tower', 'Blade'] as const;
export const MANUFACTURERS = [
  'Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft', 'Asus', 'Acer', 'MSI', 'Samsung', 'Sony', 'Cisco', 'Brother', 'Canon', 'Epson'
] as const;
export const USER_TYPES = ['local', 'remote'] as const;

// Approximate percentage-based (x, y) coordinates for each seat on floor-plan.jpg
// Top-left is (0, 0), bottom-right is (100, 100)
export const OFFICE_SEAT_LOCATIONS: Record<string, { x: number; y: number }> = {
  // Cubicles 1-8
  '1': { x: 4.5, y: 15 },
  '2': { x: 4.5, y: 23 },
  '3': { x: 9.5, y: 15 },
  '4': { x: 9.5, y: 23 },
  '5': { x: 14.5, y: 15 },
  '6': { x: 14.5, y: 23 },
  '7': { x: 19.5, y: 15 },
  '8': { x: 19.5, y: 23 },
  // Cubicles 9-24
  '9': { x: 28.5, y: 15 },
  '10': { x: 28.5, y: 23 },
  '11': { x: 33.5, y: 15 },
  '12': { x: 33.5, y: 23 },
  '13': { x: 38.5, y: 15 },
  '14': { x: 38.5, y: 23 },
  '15': { x: 43.5, y: 15 },
  '16': { x: 43.5, y: 23 },
  '17': { x: 48.5, y: 15 },
  '18': { x: 48.5, y: 23 },
  '19': { x: 53.5, y: 15 },
  '20': { x: 53.5, y: 23 },
  '21': { x: 58.5, y: 15 },
  '22': { x: 58.5, y: 23 },
  '23': { x: 63.5, y: 15 },
  '24': { x: 63.5, y: 23 },
  // Cubicles 25-28
  '25': { x: 72.5, y: 15 },
  '26': { x: 72.5, y: 23 },
  '27': { x: 77.5, y: 15 },
  '28': { x: 77.5, y: 23 },
  // Cubicles 29-36
  '29': { x: 4.5, y: 77 },
  '30': { x: 4.5, y: 85 },
  '31': { x: 9.5, y: 77 },
  '32': { x: 9.5, y: 85 },
  '33': { x: 14.5, y: 77 },
  '34': { x: 14.5, y: 85 },
  '35': { x: 19.5, y: 77 },
  '36': { x: 19.5, y: 85 },
  // Cubicles 37-52
  '37': { x: 28.5, y: 77 },
  '38': { x: 28.5, y: 85 },
  '39': { x: 33.5, y: 77 },
  '40': { x: 33.5, y: 85 },
  '41': { x: 38.5, y: 77 },
  '42': { x: 38.5, y: 85 },
  '43': { x: 43.5, y: 77 },
  '44': { x: 43.5, y: 85 },
  '45': { x: 48.5, y: 77 },
  '46': { x: 48.5, y: 85 },
  '47': { x: 53.5, y: 77 },
  '48': { x: 53.5, y: 85 },
  '49': { x: 58.5, y: 77 },
  '50': { x: 58.5, y: 85 },
  '51': { x: 63.5, y: 77 },
  '52': { x: 63.5, y: 85 },
  // Cubicles 53-56
  '53': { x: 72.5, y: 77 },
  '54': { x: 72.5, y: 85 },
  '55': { x: 77.5, y: 77 },
  '56': { x: 77.5, y: 85 },
  // Cubicles 57-73 (middle section)
  '57': { x: 35.5, y: 46 },
  '58': { x: 35.5, y: 54 },
  '59': { x: 40.5, y: 46 },
  '60': { x: 40.5, y: 54 },
  '61': { x: 45.5, y: 46 },
  '62': { x: 45.5, y: 54 },
  '63': { x: 50.5, y: 46 },
  '64': { x: 50.5, y: 54 },
  '65': { x: 55.5, y: 46 },
  '66': { x: 55.5, y: 54 },
  '67': { x: 60.5, y: 46 },
  '68': { x: 60.5, y: 54 },
  '69': { x: 65.5, y: 46 },
  '70': { x: 65.5, y: 54 },
  '71': { x: 70.5, y: 46 },
  '72': { x: 70.5, y: 54 },
  '73': { x: 75.5, y: 50 },
  // Rooms
  '121': { x: 91, y: 15 },
  '122': { x: 91, y: 25 },
  '123': { x: 91, y: 35 },
  '124': { x: 91, y: 65 },
  '125': { x: 91, y: 75 },
  '126': { x: 91, y: 85 },
};
