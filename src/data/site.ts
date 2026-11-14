// All site content. Anything marked placeholder: true needs the client's confirmation.
export const site = {
  name: 'Huli Huli Tiki Lounge',
  short: 'Huli Huli',
  url: 'https://www.hulihulipowell.com',
  description:
    'Tiki bar and kitchen in downtown Powell, Ohio. Rum cocktails lit at your table, carved tiki mugs, Polynesian plates, private parties and catering.',
  address: { street: '26 W. Olentangy St', city: 'Powell', region: 'OH', zip: '43065' },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Huli+Huli+Tiki+Lounge+26+W+Olentangy+St+Powell+OH',
  orderUrl: 'https://hulihulipowell.smartonlineorder.com',
  instagram: 'https://www.instagram.com/hulihulipowell',
  // placeholder: true. The client's real inbox for parties and catering.
  email: 'hello@hulihuli.example',
  // placeholder: true. Form and newsletter endpoints are not wired yet.
  formEndpoint: '',
  hours: [
    { days: 'Monday', short: 'Mon', time: 'Closed', open: null },
    { days: 'Tuesday to Thursday', short: 'Tue to Thu', time: '4:30 to 9:30 pm', open: [16.5, 21.5] },
    { days: 'Friday', short: 'Fri', time: '4:30 to 11 pm', open: [16.5, 23] },
    { days: 'Saturday', short: 'Sat', time: '1 to 11 pm', open: [13, 23] },
    { days: 'Sunday', short: 'Sun', time: '1 to 8 pm', open: [13, 20] },
  ],
  rating: { score: '4.5', count: '941', source: 'Google' },
};

export type Drink = {
  name: string;
  origin: string;
  price: string;
  strength: number; // the skulls on the printed menu
  spec: string;
  photo?: string;
  placeholder?: boolean;
};

// The four bar photos. Names matched by glass shape against the printed menu: placeholder: true.
export const lineup: Drink[] = [
  { name: "Pat's Barrel", origin: 'House recipe', price: '$17', strength: 3, photo: 'drink-barrel',
    spec: 'Monkey Shoulder Scotch, Planteray Dark, macadamia liqueur, allspice dram, lime, grapefruit, passionfruit, pineapple, coconut five spice syrup' },
  { name: 'Category 5', origin: 'House recipe', price: '$15', strength: 2, photo: 'drink-cat5', placeholder: true,
    spec: 'Planteray 3 Star, Smith & Cross, Chinola passionfruit, yuzu, mango, lemon, coconut cream' },
  { name: 'Red Sky at Night', origin: 'House recipe', price: '$15', strength: 2, photo: 'drink-redsky', placeholder: true,
    spec: '451 Claw Foot gin, falernum, hibiscus orgeat, cinnamon, mangosteen, lychee, lemon, Peychaud’s bitters' },
  { name: 'Cabana Banana Boy', origin: 'House recipe', price: '$14', strength: 4, photo: 'drink-banana', placeholder: true,
    spec: 'Clément rhum, Banhez mezcal, pisco, banana liqueur, lime, banana horchata syrup' },
];

export const legends: Drink[] = [
  { name: 'Mai Tai', origin: "Trader Vic, 1944", price: '$14', strength: 3, spec: 'Appleton Estate 8, Planteray Dark, lime, orgeat, dry curaçao' },
  { name: 'Zombie', origin: "Donn Beach, 1934", price: '$16', strength: 6, spec: 'Bacardi 4, Appleton Signature, Hamilton 151, falernum, lime, grenadine, grapefruit, cinnamon. Two per visit.' },
  { name: 'Painkiller', origin: "G. and M. Myrick, 1971", price: '$14', strength: 2, spec: 'Pusser’s and Appleton blend, pineapple, orange, coconut cream. Pusser’s float $2.' },
  { name: 'Blue Hawaii', origin: "Harry Yee, 1957", price: '$14', strength: 2, spec: 'Ketel One vodka, Planteray 3 Star, pineapple, lemon, blue curaçao' },
  { name: 'Head Hunter', origin: 'Sandro Conti, Kahiki', price: '$14', strength: 2, spec: 'Bacardi 4, Barbancourt rum, orange curaçao, pineapple, soursop, orange' },
  { name: 'Polynesian Paralysis', origin: 'Classic', price: '$13', strength: 2, spec: 'Bulleit bourbon, orgeat, lemon, orange, pineapple' },
];

export const legacies: Drink[] = [
  { name: 'Aloha Aina', origin: 'House recipe', price: '$14', strength: 3, spec: 'Planteray Fiji, Planteray Stiggins, lime, macadamia liqueur, taro coconut cream, pineapple' },
  { name: 'Rosa Exótica', origin: 'House recipe', price: '$15', strength: 4, spec: 'Espolòn Blanco, ruby red grapefruit, lime, hibiscus, grapefruit curaçao, tamarind syrup' },
  ...lineup,
];

export type Dish = { name: string; price: string; note: string; photo?: string };

export const starters: Dish[] = [
  { name: 'Bang Bang Broccoli', price: '$10', note: 'Tempura broccoli tossed in Bang Bang sauce, scallions, sesame', photo: 'food-broccoli' },
  { name: 'Huli Huli Wings, 8', price: '$13', note: 'Tiki dry rub, pineapple BBQ, Huli Huli, teriyaki, Buffalo or Bachan’s BBQ', photo: 'food-wings' },
  { name: 'Coconut Shrimp, 8', price: '$12', note: 'With Thai chili sauce', photo: 'food-shrimp' },
  { name: 'Pupu Platter', price: '$17', note: 'Pork belly, lobster rangoon and veggie potstickers, three of each', photo: 'food-pupu' },
  { name: 'Lobster Rangoon, 5', price: '$12', note: 'North Atlantic lobster, lemon zest, scallions, cream cheese' },
  { name: 'Veggie Potstickers, 6', price: '$10', note: 'Cabbage, carrot, bamboo shoots, water chestnut, mushroom' },
  { name: 'Blackened Fish Tacos, 3', price: '$12', note: 'Tilapia, pineapple salsa, Bang Bang sauce, corn tortillas' },
  { name: 'Pork Belly, 5', price: '$11', note: 'Marinated in Bachan’s BBQ' },
  { name: 'Hush Puppies, 6', price: '$7', note: 'Cornmeal and mochiko, passionfruit remoulade' },
  { name: 'Edamame', price: '$7', note: 'Steamed, kosher salt' },
];

export const casual: Dish[] = [
  { name: 'Lobster Roll', price: '$20', note: 'Chilled lobster in citrus aioli on two New England buns, fries', photo: 'food-lobster' },
  { name: 'Tiki Fries', price: '$15', note: 'Tiki dry rub, Kalua pork, Bang Bang sauce, pineapple salsa' },
  { name: 'Huli Burger', price: '$14', note: '8 oz patty, cheddar, pineapple salsa, Bang Bang sauce' },
  { name: 'Spam Bowl', price: '$14', note: 'Grilled Spam, gochujang and wasabi aioli, rice, nori, fried egg' },
  { name: 'Aloha Bowl', price: '$13', note: 'Rice, edamame, avocado, radish, slaw, pineapple salsa, teriyaki' },
  { name: 'Fish and Chips', price: '$15', note: 'Tempura tilapia, creamy slaw, fries, passionfruit remoulade' },
  { name: 'Kalua Pork Sandwich', price: '$13', note: 'Slow cooked pork with BBQ sauce' },
];

export const plate = {
  note: 'Double rice, Hawaiian macaroni salad, your protein and your sauce.',
  proteins: [
    ['Mochiko chicken', '$15'], ['Huli chicken', '$15'], ['Kalua pork', '$15'], ['Blackened tilapia', '$15'],
    ['Shrimp, 6', '$17'], ['Fried tofu', '$12'], ['Spam', '$12'], ['Pork belly', '$11'],
  ],
  sauces: ['Huli Huli', 'Bang Bang', 'Teriyaki', 'Pineapple BBQ', 'Wasabi aioli', 'Gochujang aioli', 'Bachan’s BBQ', 'Soy'],
};

// The dishes on the home page's order list (they travel well).
export const orderList: Dish[] = [starters[0], starters[1], starters[2], starters[3], casual[0]];

export const reviews = [
  { name: 'Madison Fouts', text: 'The drinks are where this place really shines. They’re creative, over-the-top, beautifully presented, and just as delicious as they look.' },
  { name: 'Lisa', text: 'This is my absolute favorite place to go for delicious drinks and food! The Bang Bang Broccoli is so good!' },
  { name: 'Sarah Newcomer', text: 'Such a great spot. Drinks are authentic with good presentation and food is great. Never have had a bad experience here!' },
  { name: 'Anne Gearo', text: 'Awesome place!! Loved the atmosphere. Food was delish and drinks were well made.' },
];
