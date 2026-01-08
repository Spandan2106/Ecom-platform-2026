import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.model.js";
import connectDB from "./config/db.js";

dotenv.config();

const products = [
  {
    name: "Apple iPhone 15 Pro",
    description: "Titanium design, A17 Pro chip.",
    price: 134900,
    category: "Mobiles",
    stock: 10,
    imageUrl: "https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "AI features, 200MP camera.",
    price: 129999,
    category: "Mobiles",
    stock: 15,
    imageUrl: "https://m.media-amazon.com/images/I/81vxWpPpgNL._SL1500_.jpg"
  },
  {
    name: "Google Pixel 8 Pro",
    category: "Mobiles",
    price: 106999,
    stock: 20,
    description: "Advanced AI, best-in-class camera.",
    imageUrl: "https://placehold.co/400?text=Pixel+8+Pro"
  },
  { name: "OnePlus 12", category: "Mobiles", price: 64999, stock: 25, description: "Snapdragon 8 Gen 3, Hasselblad camera.", imageUrl: "https://placehold.co/400?text=OnePlus+12" },
  { name: "Xiaomi 14", category: "Mobiles", price: 69999, stock: 10, description: "Leica optics, compact flagship.", imageUrl: "https://placehold.co/400?text=Xiaomi+14" },
  { name: "Nothing Phone (2)", category: "Mobiles", price: 39999, stock: 30, description: "Glyph interface, transparent design.", imageUrl: "https://placehold.co/400?text=Nothing+Phone+2" },
  { name: "Samsung Galaxy Z Flip 5", category: "Mobiles", price: 99999, stock: 12, description: "Foldable pocket-sized design.", imageUrl: "https://placehold.co/400?text=Galaxy+Z+Flip+5" },
  { name: "Realme GT 5 Pro", category: "Mobiles", price: 45000, stock: 18, description: "Flagship performance, budget price.", imageUrl: "https://placehold.co/400?text=Realme+GT+5" },
  { name: "Vivo X100 Pro", category: "Mobiles", price: 89999, stock: 8, description: "Zeiss APO Floating Telephoto Camera.", imageUrl: "https://placehold.co/400?text=Vivo+X100" },
  { name: "Apple iPhone 13", category: "Mobiles", price: 52999, stock: 50, description: "A15 Bionic, dual-camera system.", imageUrl: "https://placehold.co/400?text=iPhone+13" },

  // Laptops
  { name: "MacBook Air M2", category: "Laptops", price: 99900, stock: 20, description: "Supercharged by M2, 13.6-inch Liquid Retina.", imageUrl: "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg" },
  { name: "Dell XPS 13", category: "Laptops", price: 145000, stock: 10, description: "InfinityEdge display, premium build.", imageUrl: "https://m.media-amazon.com/images/I/71an9eiBxpL._SL1500_.jpg" },
  { name: "HP Spectre x360", category: "Laptops", price: 135000, stock: 15, description: "2-in-1 convertible, OLED display.", imageUrl: "https://placehold.co/400?text=HP+Spectre" },
  { name: "Lenovo ThinkPad X1 Carbon", category: "Laptops", price: 160000, stock: 12, description: "Business flagship, durable and light.", imageUrl: "https://placehold.co/400?text=ThinkPad+X1" },
  { name: "Asus ROG Zephyrus G14", category: "Laptops", price: 120000, stock: 25, description: "Gaming powerhouse, AniMe Matrix.", imageUrl: "https://placehold.co/400?text=Asus+ROG" },
  { name: "Acer Swift Go 14", category: "Laptops", price: 65000, stock: 30, description: "OLED display, Intel Core Ultra.", imageUrl: "https://placehold.co/400?text=Acer+Swift" },
  { name: "Microsoft Surface Laptop 5", category: "Laptops", price: 110000, stock: 18, description: "Sleek design, touchscreen.", imageUrl: "https://placehold.co/400?text=Surface+Laptop" },
  { name: "MSI Raider GE78", category: "Laptops", price: 250000, stock: 5, description: "High-end gaming, RGB lighting.", imageUrl: "https://placehold.co/400?text=MSI+Raider" },
  { name: "LG Gram 17", category: "Laptops", price: 140000, stock: 10, description: "Ultra-lightweight, long battery life.", imageUrl: "https://placehold.co/400?text=LG+Gram" },
  { name: "Razer Blade 15", category: "Laptops", price: 220000, stock: 7, description: "Premium gaming laptop, CNC aluminum.", imageUrl: "https://placehold.co/400?text=Razer+Blade" },

  // Toys
  { name: "LEGO Star Wars Millennium Falcon", category: "Toys", price: 15999, stock: 10, description: "Detailed LEGO model.", imageUrl: "https://m.media-amazon.com/images/I/615afIGJirL._SX679_.jpg" },
  { name: "Barbie Dreamhouse", category: "Toys", price: 12999, stock: 15, description: "3-story dollhouse with slide.", imageUrl: "https://placehold.co/400?text=Barbie+Dreamhouse" },
  { name: "Hot Wheels 10-Car Pack", category: "Toys", price: 1499, stock: 50, description: "Set of 10 die-cast cars.", imageUrl: "https://placehold.co/400?text=Hot+Wheels" },
  { name: "Nerf Elite 2.0 Commander", category: "Toys", price: 999, stock: 40, description: "Blaster with 12 darts.", imageUrl: "https://placehold.co/400?text=Nerf+Blaster" },
  { name: "Fisher-Price Rock-a-Stack", category: "Toys", price: 499, stock: 60, description: "Classic stacking toy for babies.", imageUrl: "https://placehold.co/400?text=Rock-a-Stack" },
  { name: "Monopoly Classic Game", category: "Toys", price: 999, stock: 30, description: "Fast-dealing property trading game.", imageUrl: "https://placehold.co/400?text=Monopoly" },
  { name: "Rubik's Cube 3x3", category: "Toys", price: 399, stock: 100, description: "The original color-matching puzzle.", imageUrl: "https://placehold.co/400?text=Rubiks+Cube" },
  { name: "Play-Doh Modeling Compound", category: "Toys", price: 299, stock: 80, description: "Pack of 4 colors.", imageUrl: "https://placehold.co/400?text=Play-Doh" },
  { name: "Remote Control Car", category: "Toys", price: 1999, stock: 25, description: "High speed off-road RC car.", imageUrl: "https://placehold.co/400?text=RC+Car" },
  { name: "Uno Card Game", category: "Toys", price: 199, stock: 150, description: "Classic card game.", imageUrl: "https://placehold.co/400?text=Uno+Cards" },

  // Foods
  { name: "Ferrero Rocher (24 Pieces)", category: "Foods", price: 999, stock: 50, description: "Premium hazelnut chocolates.", imageUrl: "https://placehold.co/400?text=Ferrero+Rocher" },
  { name: "Organic Green Tea", category: "Foods", price: 499, stock: 60, description: "100 tea bags, detox.", imageUrl: "https://placehold.co/400?text=Green+Tea" },
  { name: "Peanut Butter (1kg)", category: "Foods", price: 599, stock: 40, description: "Crunchy, high protein.", imageUrl: "https://placehold.co/400?text=Peanut+Butter" },
  { name: "California Almonds (500g)", category: "Foods", price: 650, stock: 45, description: "Premium quality almonds.", imageUrl: "https://placehold.co/400?text=Almonds" },
  { name: "Extra Virgin Olive Oil (1L)", category: "Foods", price: 1200, stock: 30, description: "Cold pressed, healthy.", imageUrl: "https://placehold.co/400?text=Olive+Oil" },
  { name: "Instant Coffee (200g)", category: "Foods", price: 750, stock: 55, description: "Rich aroma, 100% pure coffee.", imageUrl: "https://placehold.co/400?text=Coffee" },
  { name: "Basmati Rice (5kg)", category: "Foods", price: 899, stock: 35, description: "Long grain, aromatic.", imageUrl: "https://placehold.co/400?text=Basmati+Rice" },
  { name: "Dark Chocolate Bar", category: "Foods", price: 250, stock: 80, description: "85% Cocoa, intense flavor.", imageUrl: "https://placehold.co/400?text=Dark+Chocolate" },
  { name: "Honey (500g)", category: "Foods", price: 399, stock: 60, description: "Pure natural honey.", imageUrl: "https://placehold.co/400?text=Honey" },
  { name: "Protein Bar Box", category: "Foods", price: 1500, stock: 25, description: "Pack of 6, chocolate flavor.", imageUrl: "https://placehold.co/400?text=Protein+Bar" },

  // Cosmetics
  { name: "Maybelline Mascara", category: "Cosmetics", price: 450, stock: 60, description: "Volume express, waterproof.", imageUrl: "https://placehold.co/400?text=Mascara" },
  { name: "MAC Matte Lipstick", category: "Cosmetics", price: 1950, stock: 40, description: "Long lasting, velvet finish.", imageUrl: "https://placehold.co/400?text=Lipstick" },
  { name: "Lakme Eye Liner", category: "Cosmetics", price: 350, stock: 80, description: "Intense black, smudge proof.", imageUrl: "https://placehold.co/400?text=Eye+Liner" },
  { name: "Nivea Soft Moisturizer", category: "Cosmetics", price: 299, stock: 100, description: "Light moisturizer for face and body.", imageUrl: "https://placehold.co/400?text=Moisturizer" },
  { name: "L'Oreal Paris Shampoo", category: "Cosmetics", price: 699, stock: 50, description: "Total repair, 1 litre.", imageUrl: "https://placehold.co/400?text=Shampoo" },
  { name: "Neutrogena Sunscreen", category: "Cosmetics", price: 550, stock: 70, description: "SPF 50+, ultra sheer.", imageUrl: "https://placehold.co/400?text=Sunscreen" },
  { name: "The Body Shop Shower Gel", category: "Cosmetics", price: 495, stock: 45, description: "British Rose, 250ml.", imageUrl: "https://placehold.co/400?text=Shower+Gel" },
  { name: "Face Serum Vitamin C", category: "Cosmetics", price: 899, stock: 35, description: "Brightening and anti-aging.", imageUrl: "https://placehold.co/400?text=Face+Serum" },
  { name: "Nail Polish Set", category: "Cosmetics", price: 499, stock: 60, description: "Pack of 5 pastel colors.", imageUrl: "https://placehold.co/400?text=Nail+Polish" },
  { name: "Makeup Brush Set", category: "Cosmetics", price: 999, stock: 30, description: "12 piece professional set.", imageUrl: "https://placehold.co/400?text=Makeup+Brushes" },

  // Books
  { name: "The Alchemist", category: "Books", price: 299, stock: 100, description: "A novel by Paulo Coelho.", imageUrl: "https://m.media-amazon.com/images/I/51Z0nLAfLmL._SX320_BO1,204,203,200_.jpg" },
  { name: "Atomic Habits", category: "Books", price: 450, stock: 80, description: "Build good habits, break bad ones.", imageUrl: "https://placehold.co/400?text=Atomic+Habits" },
  { name: "Psychology of Money", category: "Books", price: 399, stock: 90, description: "Timeless lessons on wealth.", imageUrl: "https://placehold.co/400?text=Psychology+of+Money" },
  { name: "Harry Potter & Sorcerer's Stone", category: "Books", price: 599, stock: 60, description: "Book 1 of Harry Potter series.", imageUrl: "https://placehold.co/400?text=Harry+Potter" },
  { name: "Rich Dad Poor Dad", category: "Books", price: 350, stock: 120, description: "Personal finance classic.", imageUrl: "https://placehold.co/400?text=Rich+Dad+Poor+Dad" },
  { name: "Sapiens", category: "Books", price: 499, stock: 50, description: "A brief history of humankind.", imageUrl: "https://placehold.co/400?text=Sapiens" },
  { name: "Ikigai", category: "Books", price: 350, stock: 75, description: "Japanese secret to a long life.", imageUrl: "https://placehold.co/400?text=Ikigai" },
  { name: "The Great Gatsby", category: "Books", price: 250, stock: 40, description: "Classic novel by F. Scott Fitzgerald.", imageUrl: "https://placehold.co/400?text=Great+Gatsby" },
  { name: "To Kill a Mockingbird", category: "Books", price: 299, stock: 45, description: "Harper Lee's masterpiece.", imageUrl: "https://placehold.co/400?text=Mockingbird" },
  { name: "1984", category: "Books", price: 250, stock: 55, description: "Dystopian novel by George Orwell.", imageUrl: "https://placehold.co/400?text=1984" },

  // Stationery
  { name: "Parker Vector Pen", category: "Stationery", price: 350, stock: 100, description: "Standard rollerball pen.", imageUrl: "https://placehold.co/400?text=Parker+Pen" },
  { name: "Faber-Castell Pencils", category: "Stationery", price: 150, stock: 200, description: "Pack of 10 wooden pencils.", imageUrl: "https://placehold.co/400?text=Pencils" },
  { name: "Pilot V5 Pen Set", category: "Stationery", price: 250, stock: 150, description: "Pack of 3 liquid ink pens.", imageUrl: "https://placehold.co/400?text=Pilot+Pens" },
  { name: "Staedtler Mars Lumograph", category: "Stationery", price: 800, stock: 50, description: "Art drawing pencils set.", imageUrl: "https://placehold.co/400?text=Drawing+Pencils" },
  { name: "Moleskine Classic Notebook", category: "Stationery", price: 1500, stock: 30, description: "Hard cover, ruled pages.", imageUrl: "https://placehold.co/400?text=Notebook" },
  { name: "Sticky Notes Pad", category: "Stationery", price: 99, stock: 300, description: "Neon colors, 400 sheets.", imageUrl: "https://placehold.co/400?text=Sticky+Notes" },
  { name: "Highlighters Set", category: "Stationery", price: 199, stock: 120, description: "Pack of 5 fluorescent colors.", imageUrl: "https://placehold.co/400?text=Highlighters" },
  { name: "Geometry Box", category: "Stationery", price: 250, stock: 80, description: "Complete mathematical set.", imageUrl: "https://placehold.co/400?text=Geometry+Box" },
  { name: "Whiteboard Markers", category: "Stationery", price: 300, stock: 90, description: "Pack of 4, erasable.", imageUrl: "https://placehold.co/400?text=Markers" },
  { name: "Fountain Pen Ink", category: "Stationery", price: 200, stock: 60, description: "Royal Blue, 60ml bottle.", imageUrl: "https://placehold.co/400?text=Ink+Bottle" },

  // Footwear
  { name: "Nike Air Max", category: "Footwear", price: 8999, stock: 20, description: "Comfortable running shoes.", imageUrl: "https://placehold.co/400?text=Nike+Air+Max" },
  { name: "Adidas Ultraboost", category: "Footwear", price: 11999, stock: 15, description: "High performance running shoes.", imageUrl: "https://placehold.co/400?text=Adidas+Ultraboost" },
  { name: "Puma Sneakers", category: "Footwear", price: 4500, stock: 30, description: "Casual white sneakers.", imageUrl: "https://placehold.co/400?text=Puma+Sneakers" },
  { name: "Converse Chuck Taylor", category: "Footwear", price: 3999, stock: 40, description: "Classic high-top canvas shoes.", imageUrl: "https://placehold.co/400?text=Converse" },
  { name: "Vans Old Skool", category: "Footwear", price: 4999, stock: 25, description: "Skate shoes, suede canvas.", imageUrl: "https://placehold.co/400?text=Vans" },
  { name: "Woodland Boots", category: "Footwear", price: 5500, stock: 20, description: "Rugged leather boots.", imageUrl: "https://placehold.co/400?text=Boots" },
  { name: "Crocs Classic Clogs", category: "Footwear", price: 2995, stock: 50, description: "Comfortable and lightweight.", imageUrl: "https://placehold.co/400?text=Crocs" },
  { name: "Reebok Training Shoes", category: "Footwear", price: 3500, stock: 35, description: "Gym and workout shoes.", imageUrl: "https://placehold.co/400?text=Reebok" },
  { name: "Formal Oxford Shoes", category: "Footwear", price: 2500, stock: 40, description: "Black leather formal shoes.", imageUrl: "https://placehold.co/400?text=Formal+Shoes" },
  { name: "Women's High Heels", category: "Footwear", price: 2999, stock: 30, description: "Stiletto pumps, beige.", imageUrl: "https://placehold.co/400?text=High+Heels" },

  // Men's Fashion
  { name: "Levi's Men's Jeans", category: "Men's Fashion", price: 2999, stock: 50, description: "511 Slim Fit.", imageUrl: "https://placehold.co/400?text=Levis+Jeans" },
  { name: "US Polo T-Shirt", category: "Men's Fashion", price: 1299, stock: 60, description: "Cotton polo neck.", imageUrl: "https://placehold.co/400?text=Polo+TShirt" },
  { name: "Raymond Formal Shirt", category: "Men's Fashion", price: 1599, stock: 40, description: "White cotton formal shirt.", imageUrl: "https://placehold.co/400?text=Formal+Shirt" },
  { name: "Denim Jacket", category: "Men's Fashion", price: 2499, stock: 30, description: "Classic blue denim jacket.", imageUrl: "https://placehold.co/400?text=Denim+Jacket" },
  { name: "Men's Chinos", category: "Men's Fashion", price: 1899, stock: 45, description: "Beige slim fit trousers.", imageUrl: "https://placehold.co/400?text=Chinos" },
  { name: "Puma Hoodie", category: "Men's Fashion", price: 2299, stock: 35, description: "Black fleece hoodie.", imageUrl: "https://placehold.co/400?text=Hoodie" },
  { name: "Men's Blazer", category: "Men's Fashion", price: 4999, stock: 20, description: "Navy blue casual blazer.", imageUrl: "https://placehold.co/400?text=Blazer" },
  { name: "Cargo Pants", category: "Men's Fashion", price: 1999, stock: 40, description: "Olive green, multi pockets.", imageUrl: "https://placehold.co/400?text=Cargo+Pants" },
  { name: "Cotton Kurta", category: "Men's Fashion", price: 999, stock: 50, description: "Traditional wear, white.", imageUrl: "https://placehold.co/400?text=Kurta" },
  { name: "Men's Shorts", category: "Men's Fashion", price: 799, stock: 70, description: "Casual cotton shorts.", imageUrl: "https://placehold.co/400?text=Shorts" },

  // Women's Fashion
  { name: "Floral Summer Dress", category: "Women's Fashion", price: 1499, stock: 50, description: "Cotton midi dress.", imageUrl: "https://placehold.co/400?text=Summer+Dress" },
  { name: "Silk Saree", category: "Women's Fashion", price: 3999, stock: 30, description: "Traditional Banarasi silk.", imageUrl: "https://placehold.co/400?text=Saree" },
  { name: "Cotton Kurti", category: "Women's Fashion", price: 899, stock: 60, description: "Printed daily wear kurti.", imageUrl: "https://placehold.co/400?text=Kurti" },
  { name: "Women's Leggings", category: "Women's Fashion", price: 499, stock: 100, description: "Stretchable cotton leggings.", imageUrl: "https://placehold.co/400?text=Leggings" },
  { name: "Pleated Skirt", category: "Women's Fashion", price: 1299, stock: 40, description: "Midi length, black.", imageUrl: "https://placehold.co/400?text=Skirt" },
  { name: "Designer Blouse", category: "Women's Fashion", price: 1599, stock: 25, description: "Readymade saree blouse.", imageUrl: "https://placehold.co/400?text=Blouse" },
  { name: "Winter Cardigan", category: "Women's Fashion", price: 1999, stock: 35, description: "Woolen knitwear.", imageUrl: "https://placehold.co/400?text=Cardigan" },
  { name: "Stylish Jumpsuit", category: "Women's Fashion", price: 1799, stock: 30, description: "Casual wear jumpsuit.", imageUrl: "https://placehold.co/400?text=Jumpsuit" },
  { name: "Silk Scarf", category: "Women's Fashion", price: 699, stock: 50, description: "Printed square scarf.", imageUrl: "https://placehold.co/400?text=Scarf" },
  { name: "Palazzo Pants", category: "Women's Fashion", price: 999, stock: 55, description: "Wide leg comfortable pants.", imageUrl: "https://placehold.co/400?text=Palazzo" },

  // Kids' Fashion
  { name: "Kids Graphic T-Shirt", category: "Kids' Fashion", price: 499, stock: 80, description: "Cotton, superhero print.", imageUrl: "https://placehold.co/400?text=Kids+TShirt" },
  { name: "Baby Onesie Pack", category: "Kids' Fashion", price: 999, stock: 60, description: "Pack of 3, soft cotton.", imageUrl: "https://placehold.co/400?text=Onesie" },
  { name: "Kids Denim Jeans", category: "Kids' Fashion", price: 1199, stock: 50, description: "Elastic waist, durable.", imageUrl: "https://placehold.co/400?text=Kids+Jeans" },
  { name: "Party Wear Frock", category: "Kids' Fashion", price: 1499, stock: 40, description: "Pink satin dress.", imageUrl: "https://placehold.co/400?text=Frock" },
  { name: "School Uniform Shirt", category: "Kids' Fashion", price: 599, stock: 100, description: "White cotton shirt.", imageUrl: "https://placehold.co/400?text=Uniform" },
  { name: "Kids Fleece Hoodie", category: "Kids' Fashion", price: 1299, stock: 45, description: "Warm winter wear.", imageUrl: "https://placehold.co/400?text=Kids+Hoodie" },
  { name: "Cotton Pajama Set", category: "Kids' Fashion", price: 899, stock: 55, description: "Nightwear for kids.", imageUrl: "https://placehold.co/400?text=Pajamas" },
  { name: "Kids Shorts", category: "Kids' Fashion", price: 599, stock: 70, description: "Summer wear.", imageUrl: "https://placehold.co/400?text=Kids+Shorts" },
  { name: "Winter Puffer Jacket", category: "Kids' Fashion", price: 1999, stock: 30, description: "Insulated jacket.", imageUrl: "https://placehold.co/400?text=Jacket" },
  { name: "Kids Cap", category: "Kids' Fashion", price: 399, stock: 60, description: "Baseball cap.", imageUrl: "https://placehold.co/400?text=Cap" },

  // Bags
  { name: "Laptop Backpack", category: "Bags", price: 1999, stock: 50, description: "Water resistant, fits 15 inch.", imageUrl: "https://placehold.co/400?text=Backpack" },
  { name: "Travel Suitcase", category: "Bags", price: 4999, stock: 20, description: "Hard shell, 4 wheels.", imageUrl: "https://placehold.co/400?text=Suitcase" },
  { name: "Women's Handbag", category: "Bags", price: 2499, stock: 40, description: "Leather tote bag.", imageUrl: "https://placehold.co/400?text=Handbag" },
  { name: "Canvas Tote Bag", category: "Bags", price: 599, stock: 80, description: "Eco friendly shopping bag.", imageUrl: "https://placehold.co/400?text=Tote+Bag" },
  { name: "Sling Bag", category: "Bags", price: 999, stock: 60, description: "Compact crossbody bag.", imageUrl: "https://placehold.co/400?text=Sling+Bag" },
  { name: "Gym Duffle Bag", category: "Bags", price: 1299, stock: 45, description: "Shoe compartment included.", imageUrl: "https://placehold.co/400?text=Gym+Bag" },
  { name: "Leather Wallet", category: "Bags", price: 899, stock: 70, description: "Bi-fold men's wallet.", imageUrl: "https://placehold.co/400?text=Wallet" },
  { name: "Party Clutch", category: "Bags", price: 1499, stock: 35, description: "Golden embellished clutch.", imageUrl: "https://placehold.co/400?text=Clutch" },
  { name: "Hiking Rucksack", category: "Bags", price: 3999, stock: 15, description: "60L capacity, rain cover.", imageUrl: "https://placehold.co/400?text=Rucksack" },
  { name: "Messenger Bag", category: "Bags", price: 1799, stock: 30, description: "Office bag for documents.", imageUrl: "https://placehold.co/400?text=Messenger+Bag" },

  // Bottles (Home)
  { name: "Steel Water Bottle", category: "Home", price: 599, stock: 100, description: "1 Litre, insulated.", imageUrl: "https://placehold.co/400?text=Steel+Bottle" },
  { name: "Glass Water Bottle", category: "Home", price: 499, stock: 60, description: "With silicone sleeve.", imageUrl: "https://placehold.co/400?text=Glass+Bottle" },
  { name: "Thermos Flask", category: "Home", price: 1299, stock: 40, description: "Keeps hot for 12 hours.", imageUrl: "https://placehold.co/400?text=Thermos" },
  { name: "Sports Sipper", category: "Home", price: 399, stock: 80, description: "BPA free plastic.", imageUrl: "https://placehold.co/400?text=Sipper" },
  { name: "Copper Bottle", category: "Home", price: 999, stock: 50, description: "Health benefits, 1L.", imageUrl: "https://placehold.co/400?text=Copper+Bottle" },
  { name: "Fruit Infuser Bottle", category: "Home", price: 699, stock: 45, description: "Detox water bottle.", imageUrl: "https://placehold.co/400?text=Infuser+Bottle" },
  { name: "Kids Water Bottle", category: "Home", price: 450, stock: 70, description: "Cartoon print, straw.", imageUrl: "https://placehold.co/400?text=Kids+Bottle" },
  { name: "Tupperware Set", category: "Home", price: 1499, stock: 30, description: "Set of 4 bottles.", imageUrl: "https://placehold.co/400?text=Tupperware" },
  { name: "Protein Shaker", category: "Home", price: 299, stock: 90, description: "With mixing ball.", imageUrl: "https://placehold.co/400?text=Shaker" },
  { name: "Travel Mug", category: "Home", price: 899, stock: 55, description: "Leak proof coffee mug.", imageUrl: "https://placehold.co/400?text=Travel+Mug" },

  // Sports
  { name: "Cricket Bat", category: "Sports", price: 1299, stock: 50, description: "English Willow bat.", imageUrl: "https://placehold.co/400?text=Cricket+Bat" },
  { name: "Football Size 5", category: "Sports", price: 899, stock: 40, description: "Standard match ball.", imageUrl: "https://placehold.co/400?text=Football" },
  { name: "Badminton Racket", category: "Sports", price: 1500, stock: 30, description: "Lightweight graphite.", imageUrl: "https://placehold.co/400?text=Badminton+Racket" },
  { name: "Yoga Mat", category: "Sports", price: 699, stock: 60, description: "Anti-slip 6mm mat.", imageUrl: "https://placehold.co/400?text=Yoga+Mat" },
  { name: "Dumbbells (5kg Pair)", category: "Sports", price: 1999, stock: 25, description: "Rubber coated hex dumbbells.", imageUrl: "https://placehold.co/400?text=Dumbbells" },
  { name: "Tennis Ball Set", category: "Sports", price: 399, stock: 100, description: "Pack of 3 balls.", imageUrl: "https://placehold.co/400?text=Tennis+Balls" },
  { name: "Skipping Rope", category: "Sports", price: 199, stock: 80, description: "Adjustable speed rope.", imageUrl: "https://placehold.co/400?text=Skipping+Rope" },
  { name: "Swimming Goggles", category: "Sports", price: 499, stock: 45, description: "Anti-fog UV protection.", imageUrl: "https://placehold.co/400?text=Goggles" },
  { name: "Cycling Helmet", category: "Sports", price: 1299, stock: 20, description: "Safety certified helmet.", imageUrl: "https://placehold.co/400?text=Helmet" },
  { name: "Basketball", category: "Sports", price: 999, stock: 35, description: "Outdoor rubber basketball.", imageUrl: "https://placehold.co/400?text=Basketball" },

  // Furniture
  { name: "Office Chair", category: "Furniture", price: 4999, stock: 20, description: "Ergonomic mesh chair.", imageUrl: "https://placehold.co/400?text=Office+Chair" },
  { name: "Study Table", category: "Furniture", price: 3500, stock: 15, description: "Wooden desk with drawers.", imageUrl: "https://placehold.co/400?text=Study+Table" },
  { name: "Bean Bag (XXL)", category: "Furniture", price: 1299, stock: 30, description: "With beans, faux leather.", imageUrl: "https://placehold.co/400?text=Bean+Bag" },
  { name: "Bookshelf", category: "Furniture", price: 2999, stock: 10, description: "4-tier wooden shelf.", imageUrl: "https://placehold.co/400?text=Bookshelf" },
  { name: "Shoe Rack", category: "Furniture", price: 1599, stock: 25, description: "Metal rack, 4 shelves.", imageUrl: "https://placehold.co/400?text=Shoe+Rack" },
  { name: "Laptop Table", category: "Furniture", price: 899, stock: 40, description: "Foldable bed table.", imageUrl: "https://placehold.co/400?text=Laptop+Table" },
  { name: "Wall Mirror", category: "Furniture", price: 1200, stock: 20, description: "Decorative round mirror.", imageUrl: "https://placehold.co/400?text=Mirror" },
  { name: "Coffee Table", category: "Furniture", price: 2499, stock: 12, description: "Modern glass top table.", imageUrl: "https://placehold.co/400?text=Coffee+Table" },
  { name: "Folding Chair", category: "Furniture", price: 999, stock: 50, description: "Portable metal chair.", imageUrl: "https://placehold.co/400?text=Folding+Chair" },
  { name: "Bedside Lamp", category: "Furniture", price: 799, stock: 35, description: "Warm light, modern design.", imageUrl: "https://placehold.co/400?text=Lamp" },

  // Pet Supplies
  { name: "Pedigree Dog Food (3kg)", category: "Pet Supplies", price: 699, stock: 40, description: "Chicken and vegetables.", imageUrl: "https://placehold.co/400?text=Dog+Food" },
  { name: "Whiskas Cat Food (1kg)", category: "Pet Supplies", price: 450, stock: 35, description: "Tuna flavor.", imageUrl: "https://placehold.co/400?text=Cat+Food" },
  { name: "Dog Leash", category: "Pet Supplies", price: 299, stock: 50, description: "Nylon, 5 feet.", imageUrl: "https://placehold.co/400?text=Dog+Leash" },
  { name: "Cat Litter (5kg)", category: "Pet Supplies", price: 599, stock: 30, description: "Odor control sand.", imageUrl: "https://placehold.co/400?text=Cat+Litter" },
  { name: "Pet Shampoo", category: "Pet Supplies", price: 350, stock: 45, description: "Anti-tick and flea.", imageUrl: "https://placehold.co/400?text=Pet+Shampoo" },
  { name: "Chew Toy", category: "Pet Supplies", price: 199, stock: 60, description: "Rubber bone for dogs.", imageUrl: "https://placehold.co/400?text=Chew+Toy" },
  { name: "Fish Food", category: "Pet Supplies", price: 150, stock: 80, description: "Flakes for aquarium fish.", imageUrl: "https://placehold.co/400?text=Fish+Food" },
  { name: "Pet Bed", category: "Pet Supplies", price: 999, stock: 20, description: "Soft cushion, medium size.", imageUrl: "https://placehold.co/400?text=Pet+Bed" },
  { name: "Bird Cage", category: "Pet Supplies", price: 1200, stock: 10, description: "Metal cage with perch.", imageUrl: "https://placehold.co/400?text=Bird+Cage" },
  { name: "Dog Collar", category: "Pet Supplies", price: 250, stock: 55, description: "Adjustable with bell.", imageUrl: "https://placehold.co/400?text=Dog+Collar" }
];

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany(); // Clear existing data
    console.log("Deleted old products...");
    
    await Product.insertMany(products);
    console.log("Added new products!");
    
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();