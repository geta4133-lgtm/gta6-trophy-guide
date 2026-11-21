// main.ts — GTA 6 Trophy Guide generator (node 22, stdlib only, deterministic)
// Run: node --experimental-strip-types main.ts
// Output: build/index.html, build/style.css

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Grade = "platinum" | "gold" | "silver" | "bronze";
type Category =
  | "story"
  | "grind"
  | "collectible"
  | "partner"
  | "heist"
  | "secret";

interface Trophy {
  name: string;
  desc: string;
  grade: Grade;
  category: Category;
  secret: boolean;
  missable: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  minutes: number;
  walkthrough: string;
}

const POINTS: Record<Grade, number> = {
  platinum: 1800,
  gold: 900,
  silver: 300,
  bronze: 90,
};

const T: Trophy[] = [
  // ─── PLATINUM ─────────────────────────────────────────────
  {
    name: "Leonida Legend",
    desc: "Unlock every other trophy in GTA 6.",
    grade: "platinum",
    category: "secret",
    secret: false,
    missable: false,
    difficulty: 4,
    minutes: 0,
    walkthrough:
      "Unlocked automatically once all 54 other trophies are earned. Nothing extra is required — the platinum pops the moment your final trophy does. Follow the 5-phase roadmap and keep the in-game checklist synced so no missable trophy slips past you.",
  },
  // ─── GOLD ─────────────────────────────────────────────────
  {
    name: "Land of the Free",
    desc: "Complete all 78 story missions across Jason and Lucia's chapters.",
    grade: "gold",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 3900,
    walkthrough:
      "Story missions are tracked in the pause menu under Story > Progress. Missions are replayable from the mission replay menu after completion, so no story trophy is permanently lost if you fail an objective mid-mission. Finish every main chapter in order — some late missions only unlock after all optional 'Business Setup' missions in the same chapter are done. Expect 55-65 hours for a single completionist run.",
  },
  {
    name: "The Big Score",
    desc: "Successfully execute the final heist with a full crew payout above $10,000,000.",
    grade: "gold",
    category: "heist",
    secret: false,
    missable: true,
    difficulty: 4,
    minutes: 240,
    walkthrough:
      "MISSABLE: your final heist approach and crew choices are locked in during the 'Casting Call' mission and cannot be changed afterward. To clear $10M: (1) pick the 'Subtle' approach during planning, (2) recruit the two cheapest crew members (7% cuts) and complete their prerequisite loyalty missions so they don't die mid-heist, (3) invest the maximum $2M in getaway vehicles at the planning board. Save manually before starting the final mission — a failed approach can be reloaded from that save, but crew selection cannot.",
  },
  // ─── SILVER ───────────────────────────────────────────────
  {
    name: "Crew Love",
    desc: "Complete a heist without any crew member dying or turning on you.",
    grade: "silver",
    category: "heist",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 180,
    walkthrough:
      "Before any heist, complete each available crew member's side mission (marked with a cyan 'C' icon). Loyal crew never panic, never turn, and never die. For an easy unlock, run the 'Gas Station Grab' heist early with both pre-leveled crew members and the subtle approach. If a crew member dies mid-run, reload your manual save and retry.",
  },
  {
    name: "Full Cartel",
    desc: "Complete all 9 heists in the game.",
    grade: "silver",
    category: "heist",
    secret: false,
    missable: true,
    difficulty: 4,
    minutes: 720,
    walkthrough:
      "MISSABLE: heists 3, 6, and 9 offer mutually exclusive approach variants, and only the completed variant counts. Before each heist planning board session, make a manual save so you can re-plan. Complete heists in story order; the last one triggers automatically after the 'Ledger Closing' mission. Track progress under Story > Heists.",
  },
  {
    name: "Beach Body",
    desc: "Max out Jason's Fitness stat.",
    grade: "silver",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 300,
    walkthrough:
      "Fitness rises by swimming at any beach, cycling, and using outdoor gyms in Vice City Beach and Port Gellhorn. Each activity grants ~1% per in-game hour. Fast method: buy the Ocean Drive gym membership ($500) and use the treadmill while watching the in-game phone; the stat continues per session. Stat progress shows on the Character page of the pause menu.",
  },
  {
    name: "Hoarder of Leonida",
    desc: "Find and collect at least 50% of all collectible items in the game.",
    grade: "silver",
    category: "collectible",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 900,
    walkthrough:
      "Collectibles include Hidden Caches (60), Airwreckage sites (20), and Vintage Comics (15) — 95 items total, so 48 items unlocks this. Collectible locations stay on the map permanently once discovered via the Flying Camera drone store ($1,500 each, up to 3 drones). Do not sell any collectible once picked up; they live in your stash permanently. Progress counter is under Stats > Collectibles.",
  },
  {
    name: "Public Enemy Number One",
    desc: "Reach a 5-star wanted level and evade the police.",
    grade: "silver",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 45,
    walkthrough:
      "Head to downtown Vice City, destroy 4+ police vehicles and shoot down one police helicopter to spike your wanted level to 5 stars. Then enter the Pay 'n' Spray on Rockridge Ave while off-screen of cops, or hole up in the canal storm drains south of the port until the meter empties. The trophy pops when the last star clears, not when it's earned.",
  },
  {
    name: "Wheelman",
    desc: "Win a gold medal in every street race.",
    grade: "silver",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 240,
    walkthrough:
      "There are 12 street races, unlocked by visiting each race marker once. Gold times are generous; use a sports-class car (the Voltaic GT is free after the 'Test Drive' mission) and brake-before-turn, throttle-after. Races can be replayed at any time from the map. Two night-only races in Leonida Keys only spawn between 20:00-04:00 in-game time.",
  },
  {
    name: "Business Tycoon",
    desc: "Own every purchasable business and bring all of them to full daily income.",
    grade: "silver",
    category: "grind",
    secret: false,
    missable: true,
    difficulty: 4,
    minutes: 1200,
    walkthrough:
      "MISSABLE: two businesses (the Ambrosia Dive Charter and the Keys Kiosk) are only purchasable during Chapters 2 and 3 respectively, and their 'for sale' signs vanish permanently afterward. Buy every property as soon as it appears. Full income requires completing each property's setup missions — check the Properties page in the pause menu for a per-property income meter. Total cost is roughly $28M; run the stock-style crypto market after Chapter 4 to fund it.",
  },
  {
    name: "Partner in Crime",
    desc: "Complete all Lucia and Jason partner activities.",
    grade: "silver",
    category: "partner",
    secret: false,
    missable: true,
    difficulty: 3,
    minutes: 360,
    walkthrough:
      "MISSABLE: the 'Beach Bonfire' and 'Drive-In Night' activities are only offered after specific story missions and will not reappear if skipped. Partner activities trigger via phone calls from Lucia/Jason (accept every call). Each completed activity raises the Relationship meter shown on the Character page; the trophy pops at 100%. If an activity offer is missed, it can re-trigger after sleeping 3 in-game days, except the two noted above.",
  },
  {
    name: "Wildlife Photographer",
    desc: "Photograph every animal species in Leonida using the in-game phone camera.",
    grade: "silver",
    category: "collectible",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 480,
    walkthrough:
      "28 species total. The phone camera app logs each new species automatically when the animal is framed and centered. Rare spawns: the Florida panther (dawn, Grassrivers wetlands), the roseate spoonbill (Ambrosia marshes, morning), and the hammerhead shark (off Leonida Keys, dive between 10:00-14:00). Use the Wildlife Finder app ($2,000, unlocked after 'Field Study') to reveal heatmaps.",
  },
  {
    name: "Deep Cover",
    desc: "Complete all undercover story operations without blowing your cover.",
    grade: "silver",
    category: "story",
    secret: false,
    missable: true,
    difficulty: 4,
    minutes: 420,
    walkthrough:
      "MISSABLE: during Chapter 5's 'Badge of Dishonor', a dialogue choice sends Jason either undercover or on the run — this branch locks permanently. Undercover ops require zero civilian casualties and zero police contact during stakeout missions; failing a stealth objective twice fails the whole operation. Save before each op. Completing the undercover branch is required for this trophy and adds the 'Det. Reyes' crew member for the final heist.",
  },
  {
    name: "Social Butterfly",
    desc: "Attend every story event and make the 'loyal' dialogue choice each time.",
    grade: "silver",
    category: "story",
    secret: false,
    missable: true,
    difficulty: 3,
    minutes: 300,
    walkthrough:
      "MISSABLE: there are 14 story events (weddings, funerals, crew dinners) triggered by phone invites, and at least 4 offer a 'betray/leave' option that closes the event forever. Always pick the top dialogue option (marked with a handshake icon). Invites expire after 2 in-game days — if you miss one, that event is gone. Track attended events under Story > Events.",
  },
  // ─── BRONZE ───────────────────────────────────────────────
  {
    name: "Welcome to Leonida",
    desc: "Complete the prologue.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 30,
    walkthrough:
      "Unlocked after the opening tutorial mission 'Sons of Liberty' on the Panamanian job. Follow the on-screen prompts; nothing can be failed permanently here.",
  },
  {
    name: "First Blood",
    desc: "Complete your first story mission in Vice City.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 15,
    walkthrough:
      "Pops after the second mission, 'Fresh Off the Boat'. Simply drive to the yellow marker and complete the cutscene-driven intro. Auto-unlocks for every player.",
  },
  {
    name: "Two of a Kind",
    desc: "Complete your first mission playing as Lucia.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 20,
    walkthrough:
      "Character switching unlocks after Chapter 1. Switch to Lucia via the character wheel and complete any mission with her — the earliest is 'Parole Violation'.",
  },
  {
    name: "Dinner and a Robbery",
    desc: "Complete the first heist setup and heist.",
    grade: "bronze",
    category: "heist",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 90,
    walkthrough:
      "The first heist, 'Gas Station Grab', becomes available in Chapter 1 after 'Case the Block'. Do the two setup missions (get masks, steal a van), then execute the heist. Any approach works for the trophy.",
  },
  {
    name: "Big Tuna",
    desc: "Catch your first fish.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 15,
    walkthrough:
      "Buy a fishing rod at any bait shop ($75) and cast anywhere off a pier. Any species counts. The trophy pops the moment the fish lands in the boat.",
  },
  {
    name: "Home Sweet Home",
    desc: "Purchase your first property.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 30,
    walkthrough:
      "The cheapest property, the Port Gellhorn trailer ($12,000), is available from Chapter 1. Buy any property from the Dollar signs on the map to unlock.",
  },
  {
    name: "Hidden in Plain Sight",
    desc: "Find your first Hidden Cache.",
    grade: "bronze",
    category: "collectible",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 20,
    walkthrough:
      "Hidden Caches are glowing crates in underwater/overgrown spots. The first one, on the beach north of Rockridge, sits under the broken pier. Follow the shimmer and collect it.",
  },
  {
    name: "Paper Trail",
    desc: "Collect 10 Vintage Comics.",
    grade: "bronze",
    category: "collectible",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 120,
    walkthrough:
      "15 comics exist in locked interiors. 10 of them are in accessible buildings from the start; use the drone store heatmap or a map guide. Comics glow faintly purple through walls when nearby.",
  },
  {
    name: "SkyWatcher",
    desc: "Investigate 5 Airwreckage crash sites.",
    grade: "bronze",
    category: "collectible",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 90,
    walkthrough:
      "Crash sites spawn in the Everglades and Keys after Chapter 2, marked by smoke columns. Land a helicopter (the NP-1 spawns at Ambrosia airfield) at 5 different sites and pick up the black box each time.",
  },
  {
    name: "Getaway Driver",
    desc: "Lose a 3-star wanted level within 90 seconds of it being earned.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 30,
    walkthrough:
      "Commit a quick crime downtown (carjack in view of police), then drive into the Rockridge Pay 'n' Spray immediately. Timing starts when the stars appear; the spray resets your search timer and the trophy pops when stars clear under 90 seconds.",
  },
  {
    name: "Stuntman",
    desc: "Complete 5 unique stunt jumps.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 60,
    walkthrough:
      "30 stunt jumps exist, marked by orange ramps. Five easy ones cluster in Vice City Beach: the marina gap, the hotel pool jump, and three along the boardwalk. Use a fast bike (Revenant RR) and full throttle.",
  },
  {
    name: "Star Spangled",
    desc: "Fly a plane under 10 different bridges.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 75,
    walkthrough:
      "Use the nimble Stark dressed as a seaplane from Ambrosia airfield. Ten bridges cross the intra-coastal waterway between Vice City and the Keys; fly low and slow under each. Bridges count once each — a tracker appears under Stats > Flying.",
  },
  {
    name: "Reel Deal",
    desc: "Catch one of every common fish species.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 150,
    walkthrough:
      "8 common species: snapper, tarpon, redfish, grouper, mackerel, catfish, pickerel, and largemouth bass. Freshwater species bite in the Grassrivers; saltwater off any pier. Check the Fishing Log in the phone for what's missing.",
  },
  {
    name: "Adrenaline Junkie",
    desc: "Complete all 30 stunt jumps.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 240,
    walkthrough:
      "After the first 5 easy jumps, the remainder spread across the Keys and the Everglades. The hardest, 'Skyway Suicide', requires hitting the ramp at exactly 92 mph in a sports car. All jumps are replayable and tracked under Stats > Stunt Jumps.",
  },
  {
    name: "Ramp It Up",
    desc: "Win your first street race.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 15,
    walkthrough:
      "Enter any race marker and finish first. The Boardwalk Sprint is the easiest — straight, wide roads and lenient AI. Any car class works for the win.",
  },
  {
    name: "Chopper Down",
    desc: "Shoot down a police helicopter.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 20,
    walkthrough:
      "Reach a 3-star wanted level and a helicopter will deploy. Use any rooftop with clear sightlines and an assault rifle; aim for the tail rotor (3-4 hits). Or hijack a Hydra attack chopper from the port and one-shot it with rockets.",
  },
  {
    name: "Custom Job",
    desc: "Fully upgrade any vehicle at a Los Santos-style customs shop.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 25,
    walkthrough:
      "Take any vehicle to Bowstring Customs in Vice City and buy every category: engine, brakes, turbo, armor, and tires. Costs ~$45,000 total. The trophy pops when the last slot is maxed.",
  },


  {
    name: "Movie Buff",
    desc: "Watch a full movie at the drive-in or cinema.",
    grade: "bronze",
    category: "partner",
    secret: false,
    missable: true,
    difficulty: 1,
    minutes: 45,
    walkthrough:
      "MISSABLE: the drive-in north of Port Gellhorn closes permanently after Chapter 4's story events. Sit in a car at the drive-in (or buy a cinema ticket downtown) and let the full in-game movie play without skipping. 45 real-world minutes for the drive-in route; the cinema is 25 minutes.",
  },
  {
    name: "Date Night",
    desc: "Complete 5 partner activities with Lucia or Jason before the epilogue.",
    grade: "bronze",
    category: "partner",
    secret: false,
    missable: true,
    difficulty: 1,
    minutes: 90,
    walkthrough:
      "MISSABLE: partner activity calls dry up permanently once the epilogue starts. Answer phone calls offering activities (dinner, tennis, beach walks, etc.) and complete any 5. They appear regularly after Chapter 2 and can repeat, so this unlocks naturally while grinding Partner in Crime.",
  },
  {
    name: "Family Meeting",
    desc: "Introduce Jason and Lucia to the Calvo family crew.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 25,
    walkthrough:
      "Unlocks automatically during Chapter 2's 'Meet the Calvos' story mission. Pure cutscene and a short drive — unmissable on any run.",
  },
  {
    name: "Bail Bondsman",
    desc: "Bail Lucia out of Leonida Penitentiary.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 35,
    walkthrough:
      "Chapter 1's 'Collateral' mission ends with the bail sequence. Follow the marker to the penitentiary, pay the bail at the desk, and complete the cutscene. Story-driven, cannot be failed.",
  },
  {
    name: "Crocodile Tears",
    desc: "Escape the Grassrivers alligators after the swamp ambush.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 30,
    walkthrough:
      "During 'Swamp Things', swim to the airboat marker while avoiding gator aggro zones (ripples in the water). Keep moving; the escape timer is generous. Failing just reloads the checkpoint.",
  },
  {
    name: "Trunk Music",
    desc: "Dispose of 3 vehicles with bodies inside at the port crusher.",
    grade: "bronze",
    category: "secret",
    secret: true,
    missable: false,
    difficulty: 2,
    minutes: 60,
    walkthrough:
      "SECRET: after any mission where enemies arrive in cars, incapacitate 3 enemies (non-lethal melee), place each in a vehicle, and drive it to the Hammerline port crusher (crane icon). Crush all three. Any three vehicles across any number of sessions count.",
  },


  {
    name: "Linebacker",
    desc: "Tackle 10 enemies with the shoulder charge.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 40,
    walkthrough:
      "Sprint into enemies to trigger the shoulder-charge takedown (unlocked via the Fitness stat at 40%). Enemies respawn at the Port Gellhorn docks drug spots — clear, leave, return, repeat until 10 takedowns.",
  },
  {
    name: "Sharp Dressed Sniper",
    desc: "Get 5 headshot kills with any sniper rifle.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 35,
    walkthrough:
      "Buy the Marksman rifle ($18,000) at Ammu-Nation after Chapter 2. The docks and the Vice City port host respawning enemy groups at chest height — aim slightly up. Counter resets only on save load, so chain kills in one session.",
  },
  {
    name: "Ghost Protocol",
    desc: "Complete any heist without being detected during the stealth approach.",
    grade: "bronze",
    category: "heist",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 90,
    walkthrough:
      "Choose the subtle approach on 'Gas Station Grab' (the easiest heist). During infiltration, stay crouched, watch guard vision cones on the minimap, and use the takedown (R1 behind guards) rather than lethal force. Save before entering so a failed run costs nothing.",
  },
  {
    name: "Demolition Expert",
    desc: "Destroy a building with a planted charge during a heist setup.",
    grade: "bronze",
    category: "heist",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 50,
    walkthrough:
      "The 'Wrecking Permit' setup mission (required for heist 4) tasks you with demolishing a condemned warehouse. Plant the charge at all 4 marked supports, reach the safe distance, and detonate. Hard to fail — the trophy pops with the building.",
  },
  {
    name: "Getaway Squared",
    desc: "Escape a heist with 4 crew members alive in the getaway vehicle.",
    grade: "bronze",
    category: "heist",
    secret: false,
    missable: false,
    difficulty: 3,
    minutes: 60,
    walkthrough:
      "Only possible on heists with a 4-seat van getaway (heist 3 or 5). Pre-level all crew loyalty, drive the van yourself, and avoid police roadblocks by cutting through the canal underpasses. If any crew dies en route, reload your pre-heist save.",
  },
  {
    name: "Inside Man",
    desc: "Recruit an inside man for any heist.",
    grade: "bronze",
    category: "heist",
    secret: false,
    missable: true,
    difficulty: 2,
    minutes: 45,
    walkthrough:
      "MISSABLE: inside-man opportunities appear on the planning board of heists 2, 4, and 7, and require completing the associated 'Recruit' setup mission within 3 in-game days of unlocking the board. Skip it and the slot closes for that heist (but another heist's board re-opens the option, so the trophy overall is recoverable until heist 7).",
  },
  {
    name: "Sanctuary",
    desc: "Complete all 8 animal sanctuary rescue events before the epilogue.",
    grade: "bronze",
    category: "collectible",
    secret: false,
    missable: true,
    difficulty: 2,
    minutes: 180,
    walkthrough:
      "MISSABLE: rescue events stop spawning entirely once the epilogue begins. Rescue events (paw-print icons) trigger randomly while driving in rural Leonida — injured animals on the roadside. Complete the quick-time rescue and deliver the animal to the sanctuary in Grassrivers. Events repeat until all 8 unique ones are done; tracked under Stats > Wildlife.",
  },
  {
    name: "Storm Chaser",
    desc: "Survive a Category 3 hurricane in the open world.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 30,
    walkthrough:
      "Hurricanes occur every ~10 in-game days (weather app warns 1 day prior). When one hits, stand outside on the Ambrosia sea wall until the eye passes (~10 real minutes) without entering a building. Watch for flying debris damage — health regen won't outpace hits, so keep armor on.",
  },
  {
    name: "Under the Boardwalk",
    desc: "Discover all 12 beach vendors along the Vice City boardwalk.",
    grade: "bronze",
    category: "collectible",
    secret: false,
    missable: false,
    difficulty: 1,
    minutes: 60,
    walkthrough:
      "Vendors (taco, churro, coconut, corn dog, etc.) line the boardwalk from Marina Way to Ocean Drive. Interact with each one once. Discovery pings appear as a small cart icon on the minimap as you approach.",
  },
  {
    name: "High Roller",
    desc: "Win $100,000 at the Keys casino in a single night before it closes.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: true,
    difficulty: 3,
    minutes: 120,
    walkthrough:
      "MISSABLE: the casino closes permanently after Chapter 5's heist storyline. The casino unlocks in Chapter 4. Blackjack with max bet ($25,000) is the fastest path — a doubled-down natural pays 3:2. Bring $500,000 to survive variance, and save before each session so a losing night can be reloaded. The trophy tracks net winnings within one casino visit.",
  },
  {
    name: "Repossessed",
    desc: "Complete 10 repo missions for the dealership before it's repossessed itself.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: true,
    difficulty: 2,
    minutes: 150,
    walkthrough:
      "MISSABLE: the dealership is seized by the bank during Chapter 5's 'Asset Recovery' mission and repo missions end with it. After buying any dealership property, repo missions (tow-truck icon) appear on the map. Deliver the marked vehicle without destroying it — damage over 50% fails the mission. 10 completions, tracked under the dealership's business page.",
  },
  {
    name: "Trailer Trash Talk",
    desc: "Complete all 5 trailer park side missions.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: true,
    difficulty: 2,
    minutes: 90,
    walkthrough:
      "MISSABLE: the 5 trailer park missions (pink 'T' icons in Port Gellhorn) unlock during Chapter 2 and disappear once Chapter 4 begins. Do them early. Each is a short fetch or dialogue mission; the last one awards the flamingo yard ornament collectible.",
  },
  {
    name: "Key Largo Lowlife",
    desc: "Complete all 4 Leonida Keys story missions.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 90,
    walkthrough:
      "The Keys chapter spans Chapters 3-4; the 4 missions are listed under Story > Chapters > Keys. Replayable from the mission menu if any are skipped. All are marker-based and straightforward.",
  },

  {
    name: "Boat Smart",
    desc: "Own and dock 3 different watercraft at your marina before the lease expires.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: true,
    difficulty: 2,
    minutes: 120,
    walkthrough:
      "MISSABLE: the marina slip lease terminates at the end of Chapter 5 and docked boats are confiscated. After purchasing the marina property (Chapter 3), buy any 3 boats from the dock shop: the cheapest combo is the Squalo jet-ski, the Bayliner skiff, and the Tortuga speedboat (~$85,000 total). Dock each one in an assigned slip; the trophy pops on the third docking.",
  },
  {
    name: "Moonshiner",
    desc: "Produce 10 batches of moonshine at the still before it burns down.",
    grade: "bronze",
    category: "grind",
    secret: false,
    missable: true,
    difficulty: 2,
    minutes: 240,
    walkthrough:
      "MISSABLE: the still burns down during Chapter 6's 'Swamp Justice' story mission and is never rebuilt — finish all 10 batches before starting it. The still comes with the Swamp Shack property (Chapter 3). Each batch takes 2 in-game hours and $500 in supplies; sleep-warp to skip. Batches count cumulatively across sessions and sell automatically for profit.",
  },
  {
    name: "Smooth Operator",
    desc: "Complete a mission using only non-lethal takedowns.",
    grade: "bronze",
    category: "secret",
    secret: true,
    missable: false,
    difficulty: 3,
    minutes: 60,
    walkthrough:
      "SECRET: any story mission with human enemies works; 'Case the Block' is easiest — it has only 3 guards. Use melee takedowns (sneak behind) and never fire a lethal weapon. If a guard spots you before takedown, restart the checkpoint. Any lethal kill (even from environment explosions) voids the attempt.",
  },

  {
    name: "Full Circle",
    desc: "Complete the story epilogue.",
    grade: "bronze",
    category: "story",
    secret: false,
    missable: false,
    difficulty: 2,
    minutes: 60,
    walkthrough:
      "The epilogue, 'Ledger Closing', triggers after the final heist and the undercover branch resolution. Watch through the ending and the final walk-away cutscene. Required for Land of the Free and pops just before the credits.",
  },
  {
    name: "Eagle Eye",
    desc: "Complete a mission without taking any damage.",
    grade: "bronze",
    category: "secret",
    secret: true,
    missable: false,
    difficulty: 4,
    minutes: 90,
    walkthrough:
      "SECRET: best on 'Case the Block' (short, low enemy count). Stay behind cover, use takedowns, and keep distance. Any damage — even fall damage or a graze — voids it; restart from checkpoint if hit. Saves before mission start make retries cheap.",
  },

];

// ─── Validation ──────────────────────────────────────────────
if (T.length !== 55) throw new Error(`Expected 55 trophies, got ${T.length}`);
const missable = T.filter((t) => t.missable);
if (missable.length !== 15)
  throw new Error(`Expected 15 missable, got ${missable.length}`);
const gradeCount: Record<string, number> = {};
for (const t of T) gradeCount[t.grade] = (gradeCount[t.grade] ?? 0) + 1;
const cats = new Set(T.map((t) => t.category));
for (const c of ["story", "grind", "collectible", "partner", "heist", "secret"]) {
  if (!cats.has(c as Category)) throw new Error(`Missing category ${c}`);
}
console.log("Validation OK:", gradeCount, "missable:", missable.length);

// ─── Roadmap ─────────────────────────────────────────────────
const ROADMAP = [
  {
    phase: "Phase 1 — Story Blitz (Chapters 1-5)",
    minutes: 3900,
    body:
      "Play the story start to finish, saying yes to every phone invite and picking top dialogue options. Collect nothing yet — just finish missions, unlock the map, and bank income. CRITICAL during this phase: buy the two time-limited businesses (Ambrosia Dive Charter in Ch. 2, Keys Kiosk in Ch. 3), do all 5 trailer park missions before Chapter 4, and make the undercover choice in 'Badge of Dishonor'. Also lock in heist crew choices early. Trophies targeted: all story gold/silver/bronze, Social Butterfly, Deep Cover, Business Tycoon prerequisites.",
  },
  {
    phase: "Phase 2 — Heists & The Big Score",
    minutes: 900,
    body:
      "Re-plan any heist variants you skipped (manual save before each planning board), level crew loyalty, and execute all 9 heists with the subtle approach to bank Full Cartel, Crew Love, Ghost Protocol, Getaway Squared, Inside Man, and Demolition Expert. Finish with The Big Score using pre-leveled cheap crew and the $2M getaway investment.",
  },
  {
    phase: "Phase 3 — Collectibles Sweep",
    minutes: 1650,
    body:
      "Buy all 3 camera drones, then sweep Hidden Caches, Airwreckage sites, and Vintage Comics to 50%+ for Hoarder of Leonida. Photograph all 28 animal species (Wildlife Photographer), complete all 8 sanctuary rescues, all 12 boardwalk vendors, and the beach collectible sets. Use the wildlife heatmaps to cut search time in half.",
  },
  {
    phase: "Phase 4 — Partner, Economy & Side Content",
    minutes: 2100,
    body:
      "Grind partner activities to 100% (Partner in Crime, Date Night — re-trigger missed ones by sleeping 3 in-game days), finish street races for Wheelman, all 30 stunt jumps, repo missions, moonshine batches, marina boats, casino win, and stat grinding (Beach Body). Clean up the remaining grind trophies: Public Enemy Number One, Chopper Down, Adrenaline Junkie, Star Spangled, High Roller, Storm Chaser.",
  },
  {
    phase: "Phase 5 — Cleanup & Platinum",
    minutes: 600,
    body:
      "Audit your trophy list against this guide's checklist. Replays are free from the mission menu, so redo anything failed. Secret trophies (Trunk Music, Smooth Operator, Eagle Eye) are replay-friendly — target them on short missions with a pre-mission save. The final trophy earned pops Leonida Legend automatically.",
  },
];

// ─── HTML generation ─────────────────────────────────────────
const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CAT_LABEL: Record<Category, string> = {
  story: "Story",
  grind: "Grind",
  collectible: "Collectible",
  partner: "Partner",
  heist: "Heist",
  secret: "Secret",
};

const slug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const orderedTrophies = [...T].sort((a, b) => {
  const rank: Record<Grade, number> = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
  return rank[a.grade] - rank[b.grade] || a.name.localeCompare(b.name);
});

const trophyCard = (t: Trophy): string => {
  const id = slug(t.name);
  const flags: string[] = [];
  if (t.missable) flags.push('<span class="flag missable">MISSABLE</span>');
  if (t.secret) flags.push('<span class="flag secret">SECRET</span>');
  const diff = "▮".repeat(t.difficulty) + '<span class="diff-off">' + "▮".repeat(5 - t.difficulty) + "</span>";
  const hours =
    t.minutes >= 60 ? `${(t.minutes / 60).toFixed(t.minutes % 60 === 0 ? 0 : 1)} h` : `${t.minutes} min`;
  return `<article class="trophy grade-${t.grade}${t.missable ? " is-missable" : ""}" id="${id}" data-name="${esc(t.name)}">
  <div class="trophy-head">
    <span class="cup cup-${t.grade}" aria-hidden="true"></span>
    <h3>${esc(t.name)}</h3>
    <span class="grade grade-${t.grade}">${t.grade.toUpperCase()}</span>
    <span class="points">${POINTS[t.grade]} pts</span>
    ${flags.join("\n    ")}
    <label class="check"><input type="checkbox" data-trophy="${esc(t.name)}" aria-label="Mark ${esc(t.name)} done"/> done</label>
  </div>
  <p class="desc">${esc(t.desc)}</p>
  <div class="meta">
    <span class="cat cat-${t.category}">${CAT_LABEL[t.category]}</span>
    <span class="diff" title="Difficulty ${t.difficulty}/5">${diff} ${t.difficulty}/5</span>
    <span class="time">~${hours}</span>
  </div>
  <details class="walkthrough" open>
    <summary>Walkthrough</summary>
    <p>${esc(t.walkthrough)}</p>
  </details>
</article>`;
};

const gradeSection = (grade: Grade, title: string): string => {
  const items = orderedTrophies.filter((t) => t.grade === grade);
  if (!items.length) return "";
  return `<section class="grade-block" id="${grade}">
  <h2>${title} <span class="count">(${items.length})</span></h2>
  ${items.map(trophyCard).join("\n")}
</section>`;
};

const roadmapHtml = ROADMAP.map(
  (r, i) => `<section class="phase" id="phase-${i + 1}">
  <h3><span class="phase-num">${i + 1}</span> ${esc(r.phase)}</h3>
  <p class="phase-time">Estimated: ~${(r.minutes / 60).toFixed(0)} hours</p>
  <p>${esc(r.body)}</p>
</section>`
).join("\n");

const missableHtml = missable
  .map(
    (t) => `<li><a href="#${slug(t.name)}">${esc(t.name)}</a> — ${esc(t.desc)}</li>`
  )
  .join("\n");

const stats = {
  total: T.length,
  pts: T.reduce((s, t) => s + POINTS[t.grade], 0),
  minMinutes: T.reduce((s, t) => s + t.minutes, 0),
  byCat: Object.fromEntries(
    (Object.keys(CAT_LABEL) as Category[]).map((c) => [c, T.filter((t) => t.category === c).length])
  ),
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>GTA 6 — Complete Trophy Guide &amp; Platinum Roadmap</title>
<link rel="stylesheet" href="style.css"/>
</head>
<body>
<header class="hero">
  <h1>GTA VI — Trophy Guide</h1>
  <p class="subtitle">All ${stats.total} trophies · ${stats.pts} points · ~${(stats.minMinutes / 60).toFixed(0)} hours estimated</p>
  <div class="progressbar-wrap">
    <div class="progressbar"><div id="progress-fill"></div></div>
    <span id="progress-label">0 / ${stats.total} · 0%</span>
    <button id="reset-btn" type="button">Reset checklist</button>
  </div>
  <nav class="toc">
    <a href="#roadmap">Roadmap</a>
    <a href="#missable">Missable (15)</a>
    <a href="#platinum">Platinum</a>
    <a href="#gold">Gold</a>
    <a href="#silver">Silver</a>
    <a href="#bronze">Bronze</a>
  </nav>
</header>

<main>
<section id="roadmap">
  <h2>Platinum Roadmap — 5 Phases</h2>
  ${roadmapHtml}
</section>

<section id="missable" class="missable-box">
  <h2>⚠ The 15 Missable Trophies</h2>
  <p>Handle these during Phase 1/2 — after their trigger windows close, they require a full new save.</p>
  <ul>
  ${missableHtml}
  </ul>
</section>

${gradeSection("platinum", "Platinum")}
${gradeSection("gold", "Gold")}
${gradeSection("silver", "Silver")}
${gradeSection("bronze", "Bronze")}
</main>

<footer>
  <p>Generated trophy guide · ${stats.total} trophies · ${stats.byCat.story} story / ${stats.byCat.grind} grind / ${stats.byCat.collectible} collectible / ${stats.byCat.partner} partner / ${stats.byCat.heist} heist / ${stats.byCat.secret} secret · checklist saved in localStorage.</p>
</footer>

<script>
(function () {
  "use strict";
  var KEY = "gta6-trophy-checklist";
  var boxes = Array.prototype.slice.call(document.querySelectorAll('input[data-trophy]'));
  var fill = document.getElementById("progress-fill");
  var label = document.getElementById("progress-label");
  var total = boxes.length;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function render(state) {
    var done = 0;
    boxes.forEach(function (b) {
      b.checked = !!state[b.dataset.trophy];
      if (b.checked) done++;
      var card = b.closest(".trophy");
      if (card) card.classList.toggle("done", b.checked);
    });
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = done + " / " + total + " · " + pct + "%";
  }
  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      var state = load();
      state[b.dataset.trophy] = b.checked;
      if (!b.checked) delete state[b.dataset.trophy];
      save(state);
      render(state);
    });
  });
  var reset = document.getElementById("reset-btn");
  if (reset) reset.addEventListener("click", function () {
    if (confirm("Reset the entire checklist?")) { save({}); render({}); }
  });
  render(load());
})();
</script>
</body>
</html>
`;

const css = `:root {
  --bg: #0e1116;
  --bg2: #151a22;
  --card: #1a212c;
  --border: #2a3444;
  --text: #e6ebf2;
  --muted: #8fa0b5;
  --accent: #ff7a45;
  --platinum: #b8e6f2;
  --gold: #f2c94c;
  --silver: #b7c1cf;
  --bronze: #c98a5b;
  --missable: #ff5c5c;
  --secret: #c07bff;
  --done: #3ddc84;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.55;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.hero {
  background: linear-gradient(160deg, #1a1030 0%, var(--bg) 70%);
  border-bottom: 1px solid var(--border);
  padding: 48px 24px 28px;
  text-align: center;
}
.hero h1 {
  font-size: 2.4rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(90deg, var(--accent), #ffd166);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.subtitle { color: var(--muted); margin: 8px 0 20px; }

.progressbar-wrap { max-width: 560px; margin: 0 auto 20px; }
.progressbar {
  height: 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 6px;
}
#progress-fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--accent), var(--gold));
  transition: width 0.3s ease;
}
#progress-label { font-size: 0.85rem; color: var(--muted); }
#reset-btn {
  margin-top: 8px;
  background: var(--bg2);
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 14px;
  cursor: pointer;
  font-size: 0.8rem;
}
#reset-btn:hover { color: var(--missable); border-color: var(--missable); }

.toc { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.toc a { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

main { max-width: 960px; margin: 0 auto; padding: 32px 20px 64px; }
h2 { font-size: 1.5rem; margin: 40px 0 16px; border-left: 4px solid var(--accent); padding-left: 12px; }
.count { color: var(--muted); font-size: 1rem; font-weight: normal; }

.phase {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  margin-bottom: 14px;
}
.phase h3 { font-size: 1.05rem; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.phase-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--accent); color: #14100c; font-weight: 700; flex: none;
}
.phase-time { color: var(--muted); font-size: 0.85rem; margin-bottom: 8px; }

.missable-box {
  background: rgba(255, 92, 92, 0.06);
  border: 1px solid rgba(255, 92, 92, 0.4);
  border-radius: 10px;
  padding: 18px 20px;
}
.missable-box h2 { border-left-color: var(--missable); margin-top: 0; }
.missable-box ul { padding-left: 24px; }

.trophy {
  background: var(--card);
  border: 1px solid var(--border);
  border-left-width: 4px;
  border-radius: 8px;
  padding: 14px 18px;
  margin-bottom: 12px;
}
.trophy.done { opacity: 0.55; }
.trophy.done h3 { text-decoration: line-through; }
.grade-platinum { border-left-color: var(--platinum); }
.grade-gold { border-left-color: var(--gold); }
.grade-silver { border-left-color: var(--silver); }
.grade-bronze { border-left-color: var(--bronze); }

.trophy-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.trophy-head h3 { font-size: 1.1rem; flex: 1; }
.cup { width: 14px; height: 14px; border-radius: 3px; display: inline-block; flex: none; }
.cup-platinum { background: var(--platinum); box-shadow: 0 0 8px var(--platinum); }
.cup-gold { background: var(--gold); }
.cup-silver { background: var(--silver); }
.cup-bronze { background: var(--bronze); }

.grade { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; padding: 2px 8px; border-radius: 10px; }
.grade-platinum { color: var(--platinum); border: 1px solid var(--platinum); }
.grade-gold { color: var(--gold); border: 1px solid var(--gold); }
.grade-silver { color: var(--silver); border: 1px solid var(--silver); }
.grade-bronze { color: var(--bronze); border: 1px solid var(--bronze); }

.points { color: var(--muted); font-size: 0.8rem; }
.flag {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 1px;
  padding: 2px 7px; border-radius: 10px;
}
.flag.missable { color: var(--missable); border: 1px solid var(--missable); background: rgba(255,92,92,0.12); }
.flag.secret { color: var(--secret); border: 1px solid var(--secret); background: rgba(192,123,255,0.12); }

.check { font-size: 0.8rem; color: var(--muted); cursor: pointer; user-select: none; }
.check input { accent-color: var(--done); cursor: pointer; }

.desc { color: var(--text); margin: 8px 0; }
.meta { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; font-size: 0.8rem; color: var(--muted); margin-bottom: 8px; }
.cat { text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
.cat-story { color: #6fc3ff; }
.cat-grind { color: #ffd166; }
.cat-collectible { color: #7bffb2; }
.cat-partner { color: #ff9ecb; }
.cat-heist { color: #ff7a45; }
.cat-secret { color: var(--secret); }
.diff-off { opacity: 0.22; }
.diff { letter-spacing: 1px; }

.walkthrough summary {
  cursor: pointer; color: var(--accent); font-size: 0.85rem;
  text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
}
.walkthrough p { margin-top: 8px; color: var(--muted); font-size: 0.92rem; }

footer {
  border-top: 1px solid var(--border);
  padding: 24px;
  text-align: center;
  color: var(--muted);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .hero h1 { font-size: 1.6rem; }
  .trophy-head { gap: 6px; }
}
`;

// ─── Build ───────────────────────────────────────────────────
const outDir = join(import.meta.dirname, "build");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
writeFileSync(join(outDir, "style.css"), css);
console.log(
  `Built build/index.html (${(html.length / 1024).toFixed(1)} KB) and build/style.css (${(css.length / 1024).toFixed(1)} KB)`
);
