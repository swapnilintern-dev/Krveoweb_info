/**
 * SPOCART product categories — the single source of truth.
 * ---------------------------------------------------------------------------
 * Add, rename or reorder a category here and it updates everywhere: the
 * homepage preview grid, the filterable grid on products.html, the footer
 * column and the sitemap anchors. Nothing about the list is hard-coded into
 * page markup, so the structure scales as the range grows.
 *
 *   id     anchor + filter key (must stay URL-safe and stable — it is linked to)
 *   group  which filter bucket the card belongs to
 *   icon   sprite symbol id from src/partials/sprite.html
 *   name   display name
 *   blurb  one line, plain language, no claims we cannot stand behind
 *   items  subcategories, shown as pills inside the card's expander
 */

export const groups = [
  { key: 'all',            label: 'All' },
  { key: 'sports',         label: 'By Sport' },
  { key: 'products',       label: 'Products' },
  { key: 'institutional',  label: 'Institutional' },
  { key: 'infrastructure', label: 'Infrastructure' }
];

export const categories = [
  {
    id: 'team-sports', group: 'sports', icon: 'i-football',
    name: 'Team &amp; Field Sports',
    blurb: 'Match and training inventory for every squad sport played on a ground or a court.',
    items: ['Football', 'Cricket', 'Hockey', 'Rugby', 'Baseball', 'Softball', 'Volleyball',
            'Handball', 'Basketball', 'Kabaddi', 'Kho-Kho']
  },
  {
    id: 'racket-sports', group: 'sports', icon: 'i-badminton',
    name: 'Racket Sports',
    blurb: 'Rackets, consumables and court equipment across indoor and outdoor racket games.',
    items: ['Badminton', 'Tennis', 'Table Tennis', 'Squash', 'Pickleball', 'Padel']
  },
  {
    id: 'athletics-fitness', group: 'sports', icon: 'i-gym',
    name: 'Athletics &amp; Fitness',
    blurb: 'Track, field and gym-floor equipment for training programmes and fitness facilities.',
    items: ['Running', 'Jogging', 'Athletics', 'Gym &amp; Fitness', 'CrossFit', 'Yoga',
            'Skipping', 'Exercise Equipment', 'Resistance Training']
  },
  {
    id: 'water-sports', group: 'sports', icon: 'i-swimming',
    name: 'Water Sports',
    blurb: 'Pool and open-water equipment for swimming programmes, clubs and academies.',
    items: ['Swimming', 'Diving', 'Water Polo', 'Surfing', 'Kayaking', 'Rowing']
  },
  {
    id: 'combat-sports', group: 'sports', icon: 'i-combat',
    name: 'Combat Sports',
    blurb: 'Ring, mat and training equipment for martial arts schools and combat academies.',
    items: ['Boxing', 'MMA', 'Wrestling', 'Judo', 'Karate', 'Taekwondo', 'Kickboxing',
            'Martial Arts']
  },
  {
    id: 'outdoor-adventure', group: 'sports', icon: 'i-outdoor',
    name: 'Outdoor &amp; Adventure',
    blurb: 'Kit for camps, expeditions, adventure programmes and wheeled sports.',
    items: ['Camping', 'Trekking', 'Hiking', 'Mountaineering', 'Cycling', 'Skateboarding',
            'Roller Skating', 'Archery']
  },
  {
    id: 'equipment', group: 'products', icon: 'i-equipment',
    name: 'Sports Equipment',
    blurb: 'The playing and training hardware behind every session, in bulk quantities.',
    items: ['Balls', 'Bats', 'Rackets', 'Nets', 'Goals', 'Stumps', 'Cones', 'Training Hurdles',
            'Agility Ladders', 'Weights', 'Dumbbells', 'Benches', 'Sports Tables']
  },
  {
    id: 'apparel', group: 'products', icon: 'i-apparel',
    name: 'Sports Apparel',
    blurb: 'Team wear and training wear, including uniform sets for squads and institutions.',
    items: ['Jerseys', 'T-Shirts', 'Shorts', 'Track Pants', 'Tracksuits', 'Sports Bras',
            'Leggings', 'Compression Wear', 'Jackets', 'Socks', 'Team Uniforms']
  },
  {
    id: 'footwear', group: 'products', icon: 'i-footwear',
    name: 'Sports Footwear',
    blurb: 'Sport-specific footwear across sizes, for retail shelves and squad kitting.',
    items: ['Running Shoes', 'Football Studs', 'Cricket Shoes', 'Basketball Shoes',
            'Badminton Shoes', 'Tennis Shoes', 'Training Shoes', 'Trekking Shoes']
  },
  {
    id: 'protective', group: 'products', icon: 'i-protect',
    name: 'Sports Protective Gear',
    blurb: 'Guards, pads and helmets for contact sports, coaching sessions and match play.',
    items: ['Helmets', 'Shin Guards', 'Knee Pads', 'Elbow Guards', 'Wrist Guards', 'Gloves',
            'Mouth Guards', 'Chest Guards', 'Thigh Guards', 'Protective Cups']
  },
  {
    id: 'accessories', group: 'products', icon: 'i-bag',
    name: 'Sports Accessories',
    blurb: 'Fast-moving lines that restock often — the dependable repeat-order categories.',
    items: ['Sports Bags', 'Backpacks', 'Water Bottles', 'Towels', 'Caps', 'Wristbands',
            'Headbands', 'Grip Tapes', 'Pumps', 'Ball Bags', 'Kit Bags', 'Whistles',
            'Stopwatches']
  },
  {
    id: 'institutional', group: 'institutional', icon: 'i-school',
    name: 'School &amp; Institutional Sports',
    blurb: 'Annual PE, sports-day and playground inventory quoted line by line for institutions.',
    items: ['School Sports Kits', 'House Uniforms', 'Sports Uniforms', 'School-Level Equipment',
            'PE Equipment', 'Playground Equipment', 'Indoor Games', 'Outdoor Games',
            'Athletics Equipment', 'Sports Storage']
  },
  {
    id: 'infrastructure', group: 'infrastructure', icon: 'i-infra',
    name: 'Sports Infrastructure',
    blurb: 'Project-scale supply: courts, grounds, surfaces, lighting, seating and fit-out.',
    feature: true,
    items: ['Football Grounds', 'Cricket Pitches', 'Basketball Courts', 'Volleyball Courts',
            'Badminton Courts', 'Synthetic Tracks', 'Artificial Turf', 'Gymnasiums',
            'Indoor Sports Halls', 'Playgrounds', 'Bleachers / Seating', 'Sports Lighting',
            'Scoreboards', 'Fencing', 'Sports Flooring']
  },
  {
    id: 'indoor-games', group: 'sports', icon: 'i-chess',
    name: 'Indoor &amp; Recreational Games',
    blurb: 'Common-room and recreation-room games for schools, hostels, clubs and workplaces.',
    items: ['Carrom', 'Chess', 'Ludo', 'Foosball', 'Billiards', 'Snooker', 'Darts',
            'Table Tennis', 'Board Games']
  },
  {
    id: 'training-competition', group: 'products', icon: 'i-trophy',
    name: 'Sports Training &amp; Competition',
    blurb: 'Everything a tournament or coaching programme needs on the day, beyond the playing kit.',
    items: ['Training Equipment', 'Coaching Aids', 'Referee Equipment', 'Scoreboards', 'Medals',
            'Trophies', 'Certificates', 'Bibs', 'Number Plates', 'Timing Equipment']
  }
];

/** The short list used in the footer and the homepage highlight strip. */
export const featuredCategoryIds = [
  'team-sports', 'racket-sports', 'athletics-fitness', 'equipment', 'apparel', 'infrastructure'
];
